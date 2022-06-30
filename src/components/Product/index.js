import "./style.scss";
import { Link } from "react-router-dom";
import { formatNumber, getSalePrice } from "../../utils";
import { Rate } from "antd";

const Product = ({ data }) => {
  return (
    <div id="product_component">
      <Link to={`/products/${data.slug}`} className="product_component__wrap">
        <div className="product_component__header">
          <div className="thumbnail">
            <img src={data.thumbnail_url} alt="product" />
          </div>
          <div className="extra">
            {/* <img src="/images/extra-product.png" alt="extra" /> */}
            <img src="https://indochinapost.vn/wp-content/uploads/2017/07/free-ship.png" alt="extra" />
          </div>
        </div>
        <div className="product_component__info">
          <div className="name">{data.name}</div>
          <div className="rating">
            <div className="quality">
              <Rate
                value={data.rate}
                allowHalf
                disabled
                style={{ fontSize: 14 }}
              />
            </div>
            <div className="quantity">
              <div className="effect"></div>
              <div className="quantity_sold">Đã bán {data.sold}</div>
            </div>
          </div>
          {data.sale_percent ? (
            <div className="price price_discount">
              <div className="value">
                {formatNumber(getSalePrice(data.price, data.sale_percent))}₫
              </div>
              <div className="discount">-{data.sale_percent}%</div>
            </div>
          ) : (
            <div className="price">
              <div className="value">{formatNumber(data.price)}₫</div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Product;
