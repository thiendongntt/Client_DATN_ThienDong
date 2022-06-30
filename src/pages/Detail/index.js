import { HeartOutlined, HomeOutlined } from "@ant-design/icons";
import { Breadcrumb, Button, notification, Tooltip } from "antd";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import API_FAVORITE_LIST from "../../api/favorite_product";
import PRODUCT_API from "../../api/product";
import LoadingSection from "../../components/LoadingSection";
import ProductsList from "../../components/ProductsList";
import { STATUS_FAIL, STATUS_OK } from "../../constants/api";
import { commonActions } from "../../store/common";
import DetailInfo from "./components/DetailInfo";
import MainInfo from "./components/MainInfo";
import "./style.scss";

const DetailProductPage = () => {
  const { userInfo, numberFavoriteList } = useSelector((state) => state.common);
  const [productInfo, setProductInfo] = useState(null);
  const [relavantProducts, setRelavantProducts] = useState([]);
  const [lengthFavoriteList, setlengthFavoriteList] = useState(0)
  const { slug } = useParams();
  const [ratesList, setRatesList] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    PRODUCT_API.getOneProduct(slug)
      .then(async (response) => {
        if (response.status === STATUS_OK) {
          setProductInfo(response.data);
        } else {
          console.log(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [slug]);

  const avgStar = useMemo(() => {
    if (!ratesList.length) return 0;

    const hasStarsList = ratesList.filter((item) => item.stars);
    const totalStars = hasStarsList.reduce((prev, cur) => {
      return cur.stars + prev;
    }, 0);

    return totalStars > 0
      ? Number(totalStars / hasStarsList.length).toFixed(1)
      : 0;
  }, [ratesList]);

  useEffect(() => {
    (async function () {
      try {
        if (!productInfo?._id) return;

        const ratesResponse = await PRODUCT_API.queryRates(
          `?product_id=${productInfo._id}`
        );

        if (ratesResponse.status === STATUS_FAIL)
          return console.log(ratesResponse.message);

        setRatesList(ratesResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [productInfo]);

  useEffect(() => {
    (async function () {
      if (!productInfo) return;

      try {
        const relateResponse = await PRODUCT_API.queryProducts(
          `?categories=${productInfo.categories[0]._id}`
        );

        if (relateResponse.status === STATUS_FAIL)
          return console.log(relateResponse.message);

        setRelavantProducts(relateResponse.data);
      } catch (error) {
        console.log(error.message);
      }
    })();
  }, [productInfo]);

  const handleRateSuccess = (newItem) => {
    setRatesList((prev) => [{ ...newItem, user: userInfo }, ...prev]);
  };

  useEffect(() => {
    if (!userInfo?._id) return;

    (async () => {
      try {
        const { data } = await API_FAVORITE_LIST.getToFavoriteList(userInfo?._id);
        setlengthFavoriteList(data.length)
      } catch (error) {
        console.log('Failed to fetch product favorite list', error)
      }
    })();
  }, [userInfo?._id])

  const handleClickAddToList = async () => {

    const data = [productInfo]?.map((product) => ({
      product_id: product?._id,
      name: product?.name,
      thumbnail_url: product?.thumbnail_url,
      price: product?.price,
      stock: product?.stock,
      sold: product?.sold,
    }));

    const saveFavoriteList = { ...data[0], user_id: userInfo?._id }

    try {
      const response = await API_FAVORITE_LIST.addToFavoriteList(saveFavoriteList);
      if (response?.status === 'FAIL') return notification.error({
        placement: 'topRight',
        message: 'Thêm thất bại!',
        description: 'Sản phẩm đã có trong danh sách yêu thích!',
        duration: 3,
      });

      console.log('lengthFavoriteList', lengthFavoriteList)

      dispatch(commonActions.updateNumberFavoriteList(lengthFavoriteList + 1))

      notification.success({
        placement: 'topRight',
        message: 'Thêm thành công!',
        description: 'Sản phẩm đã thêm vào danh sách yêu thích!',
        duration: 3,
      });

    } catch (error) {

      notification.error({
        placement: 'topRight',
        message: 'Thêm thất bại!',
        description: 'Sản phẩm đã có trong danh sách yêu thích!',
        duration: 3,
      });

    }
  }

  return (
    <div id="detail__product">
      {!productInfo ? (
        <LoadingSection />
      ) : (
        <div className="container">
          <div className="detail__product-container">
            <div className="bread__crumb-container">
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link to="/">
                    <HomeOutlined />
                  </Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>
                  <Link to="/products">Products</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item>{productInfo.name}</Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <div className="main__info-wrapper">
              <MainInfo avgStar={avgStar} data={productInfo} />


            </div>
            <div className="product-favorite" style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px ' }}>
              <Button
                onClick={handleClickAddToList}
                disabled={!Boolean(userInfo._id)}
                style={{ height: '44px', background: 'transparent linear-gradient(72deg, #1283AC 0%, #5BB495 100%) 0% 0% no-repeat padding-box', borderRadius: '22px', width: '20%', color: 'white' }}>
                <HeartOutlined /> Thêm vào danh sách yêu thích
              </Button>
            </div >
            <div className="relavant__products-wrapper">
              <ProductsList
                title="Sản phẩm liên quan"
                data={relavantProducts}
              />
            </div>
            <div className="detail__info-wrapper">
              <DetailInfo
                ratesList={ratesList}
                avgStar={avgStar}
                data={productInfo}
                onRateSuccess={handleRateSuccess}
              />
            </div>
          </div >
        </div >
      )
      }
    </div >
  );
};

export default DetailProductPage;
