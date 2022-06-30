import { DeleteOutlined } from "@ant-design/icons";
import { message, Popconfirm, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import API_FAVORITE_LIST from "../../api/favorite_product";
import { commonActions } from "../../store/common";
import { formatPrice } from "../../utils/index";
ProductFavorite.propTypes = {};

function ProductFavorite() {
  const { userInfo, numberFavoriteList } = useSelector((state) => state.common);
  const [favoriteList, setFavoriteList] = useState([]);
  const { Column, ColumnGroup } = Table;
  const dispatch = useDispatch();

  console.log(userInfo);

  // const isMounted = useRef(true)

  const data = favoriteList?.map((product) => ({
    _id: product._id,
    name: product.name,
    thumbnail_url: product.thumbnail_url,
    price: product.price,
    stock: product?.stock,
    sold: product.sold,
  }));

  useEffect(() => {
    if (!userInfo?._id) return;

    (async () => {
      try {
        const { data } = await API_FAVORITE_LIST.getToFavoriteList(
          userInfo?._id
        );
        setFavoriteList(data);
        dispatch(commonActions.updateNumberFavoriteList(favoriteList?.length));
      } catch (error) {
        console.log("Failed to fetch product favorite list", error);
      }
    })();
  }, [userInfo, dispatch, favoriteList.length]);

  const handleDeleteProduct = async (text) => {
    try {
      await API_FAVORITE_LIST.deleteToFavoriteList(text?._id);
      const newData = favoriteList?.filter((x) => x?._id !== text?._id);
      setFavoriteList(newData);
      dispatch(commonActions.updateNumberFavoriteList(numberFavoriteList - 1));
      message.success("Xóa thành công!");
    } catch (error) {
      message.error("Xóa thất bại!");
    }
  };

  function confirm(e, test) {
    handleDeleteProduct(test);
  }

  function cancel(e) {
    return;
  }

  return (
    <div className="container">
      <Table dataSource={data}>
        <Column title="Tên sản phẩm" dataIndex="name" key="name" />
        <Column
          title="Hình ảnh"
          dataIndex="thumbnail_url"
          key="thumbnail_url"
          render={(text, record) => (
            <img
              src={record.thumbnail_url}
              alt={`${record.thumbnail_url}`}
              style={{ width: "100px", height: "100px" }}
            />
          )}
        />
        <Column
          title="Giá"
          dataIndex="price"
          key="price"
          render={(value, record) => (
            <>
              <p>{formatPrice(value)}</p>
            </>
          )}
        />
        <Column title="Số lượng còn lại" dataIndex="stock" key="stock" />
        <Column title="Đã bán" dataIndex="sold" key="sold" />
        <Column
          title="Hành động"
          key="action"
          render={(text, record) => (
            <Popconfirm
              title="Xóa khỏi danh sách yêu thích?"
              onConfirm={(e) => confirm(e, text)}
              onCancel={cancel}
              okText="Xóa"
              cancelText="Không"
            >
              <Space size="middle">
                <Tooltip title="Xóa">
                  <DeleteOutlined
                    style={{
                      color: "red",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                </Tooltip>
              </Space>
            </Popconfirm>
          )}
        />
      </Table>
    </div>
  );
}

export default ProductFavorite;
