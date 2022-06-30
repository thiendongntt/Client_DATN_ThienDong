import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Col, Modal, notification, Row } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import CART_API from '../../api/cart';
import LoadingSection from '../../components/LoadingSection';
import UpdateAddressForm from '../../components/UpdateAddressForm';
import { STATUS_FAIL } from '../../constants/api';
import { cartActions } from '../../store/cart';
import { formatNumber, getSalePrice } from '../../utils';
import ProductCart from './ProductCart';
import './style.scss';

const CartPage = () => {
  const { userInfo, addresses } = useSelector((state) => state.common);
  console.log(addresses);
  const [address, setAddress] = useState();
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();

  const [checkedAll, setCheckedAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addressModalVisibled, setAddressModalVisibled] = useState(false);

  useEffect(() => {
    const defaultAddr = addresses?.length > 0 ? addresses[0] : null;
    setAddress(defaultAddr);
  }, [addresses]);

  useEffect(() => {
    if (!userInfo._id || userInfo._id === '') return;

    CART_API.queryCart(userInfo._id)
      .then((response) => {
        if (response.status === STATUS_FAIL)
          return console.log(response.message);

        dispatch(cartActions.loadCart(response.data));
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [userInfo]);

  const cartQty = useMemo(() => {
    const qty = cartItems.reduce((prev, cur) => {
      return prev + cur.quantity;
    }, 0);

    return qty;
  }, [cartItems]);

  const checkedProducts = useMemo(() => {
    return cartItems.filter((item) => item.selected);
  }, [cartItems]);

  const checkedQty = useMemo(() => {
    const qty = checkedProducts.reduce((prev, cur) => {
      return prev + cur.quantity;
    }, 0);

    return qty;
  }, [checkedProducts]);

  const totalAmount = useMemo(() => {
    const total = checkedProducts.reduce((prev, cur) => {
      return (
        prev +
        cur.quantity * getSalePrice(cur.product.price, cur.product.sale_percent)
      );
    }, 0);

    return total;
  }, [checkedProducts]);

  const handleChecking = (checked, _id) => {
    const selectedItem = cartItems.find((item) => item._id === _id);
    const newData = { ...selectedItem, selected: !checked };

    dispatch(cartActions.updateCart(newData));
  };

  const switchAddressModal = (status) => {
    setAddressModalVisibled(status);
  };

  const handleSelectAll = ({ target: { checked } }) => {
    let newItems = [];
    newItems = cartItems.map((item) => ({
      ...item,
      selected: checked,
    }));

    dispatch(cartActions.loadCart(newItems));
    setCheckedAll(checked);
  };

  const handleSubmit = () => {
    if (!checkedProducts?.length)
      return notification.error({
        placement: 'topRight',
        message: 'Error!',
        description: 'Bạn chưa chọn sản phẩm nào!',
        duration: 3,
      });

    if (!address)
      return notification.error({
        placement: 'topRight',
        message: 'Error!',
        description: 'Vui lòng chọn địa chỉ nhận hàng!',
        duration: 3,
      });

    localStorage.setItem('temp_order', JSON.stringify(checkedProducts));
    localStorage.setItem('temp_address', JSON.stringify(address));

    history.push('/checkout');
  };

  const handleSelectAddress = (data) => {
    setAddress(data);
    switchAddressModal(false);
  };

  return (
    <div id="cart_page">
      <Modal
        visible={addressModalVisibled}
        title={<strong>Chọn địa chỉ giao hàng</strong>}
        footer={null}
        onCancel={() => switchAddressModal(false)}
        destroyOnClose
      >
        <UpdateAddressForm onSelectAddress={handleSelectAddress} />
      </Modal>
      <div className="container">
        <div className="cart_page__wrap">
          <div className="cart_page__header">
            <div className="cart_page__header__wrap">
              <Link to="/" className="cart_page__header__navigation">
                <img src="/svg/arrow-prev-cart.svg" alt="navigation" />
              </Link>
              <div className="cart_page__header__title">
                Giỏ hàng <span>({cartQty})</span>
              </div>
            </div>
          </div>
          <h4 className="cart_page__title">GIỎ HÀNG</h4>
          <div className="cart_page__body cart_page__body__response">
            <Row
              gutter={[
                { xl: 16, lg: 16, md: 16, sm: 16, xs: 16 },
                { xl: 12, lg: 12, md: 12, sm: 12, xs: 12 },
              ]}
              className="body_response__row"
            >
              <Col xl={18} lg={24} md={24} sm={24} xs={24}>
                <div className="cart_products">
                  <div className="cart_products__wrap">
                    <Row gutter={[0, { xl: 16, lg: 0, md: 0, sm: 0, xs: 0 }]}>
                      <Col
                        xl={24}
                        lg={24}
                        md={24}
                        sm={24}
                        xs={24}
                        className="col_header"
                      >
                        <div className="cart_products__header">
                          {!loading && !cartItems?.length ? (
                            <h2>
                              Chưa có sản phẩm trong giỏ hàng!
                              <Link style={{ marginLeft: 4 }} to="/">
                                Tiếp tục mua sắm
                              </Link>
                            </h2>
                          ) : (
                            <Row
                              gutter={[
                                { xl: 0, lg: 0, md: 0, sm: 0, xs: 0 },
                                0,
                              ]}
                            >
                              <Col xl={11} lg={20} md={20} sm={20} xs={20}>
                                <label
                                  htmlFor="checkboxAll"
                                  className="checkbox_all checkbox_product"
                                >
                                  <input
                                    defaultValue={false}
                                    type="checkbox"
                                    id="checkboxAll"
                                    onChange={handleSelectAll}
                                  />
                                  <span className="checkbox_fake"></span>
                                  <span className="label">
                                    Tất cả ({cartQty} sản phẩm)
                                  </span>
                                </label>
                              </Col>
                              <Col xl={5} lg={0} md={0} sm={0} xs={0}>
                                <div className="title__field price_one">
                                  Đơn giá
                                </div>
                              </Col>
                              <Col xl={4} lg={0} md={0} sm={0} xs={0}>
                                <div className="title__field quantity">
                                  Số lượng
                                </div>
                              </Col>
                              <Col xl={3} lg={0} md={0} sm={0} xs={0}>
                                <div className="title__field total_price">
                                  Thành tiền
                                </div>
                              </Col>
                              <Col xl={1} lg={4} md={4} sm={4} xs={4}>
                                <div className="delete_product">
                                  <img src="/svg/trash.svg" alt="delete" />
                                </div>
                              </Col>
                            </Row>
                          )}
                        </div>
                      </Col>
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        {loading && <LoadingSection />}
                        {!loading && cartItems.length > 0 && (
                          <div className="products_cart__list">
                            {cartItems.map((item) => {
                              return (
                                <div
                                  className="product_cart__item"
                                  key={item._id}
                                >
                                  <ProductCart
                                    handleChecking={handleChecking}
                                    checkedAll={checkedAll}
                                    data={item}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
              <Col xl={6} lg={24} md={24} sm={24} xs={24}>
                <div className="cart_total__prices">
                  <div className="cart_total__prices__wrap">
                    <Row
                      gutter={[0, { xl: 16, lg: 16, md: 16, sm: 16, xs: 16 }]}
                    >
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className="ship_address">
                          <div className="ship_address__wrap">
                            <div className="heading">
                              <div className="text">Giao tới</div>
                              <span
                                onClick={() => switchAddressModal(true)}
                                className="change_address"
                              >
                                Thay đổi
                              </span>
                            </div>
                            <div className="title">
                              <div className="icon">
                                <img
                                  src="/svg/address-cart.svg"
                                  alt="address"
                                />
                              </div>
                              <div className="name">{`${userInfo.last_name} ${userInfo.first_name}`}</div>
                              <div className="phone">{userInfo.phone}</div>
                            </div>
                            {address ? (
                              <div className="address">{`${address.street}, P.${address.ward.name}, Q.${address.district.name}, ${address.province.name}`}</div>
                            ) : (
                              <>
                                <Alert
                                  onClick={() => switchAddressModal(true)}
                                  type="warning"
                                  description="Vui lòng thêm địa chỉ giao hàng"
                                />
                                <Button
                                  type="text"
                                  onClick={() => switchAddressModal(true)}
                                >
                                  <strong>
                                    <PlusOutlined style={{ marginRight: 4 }} />
                                    Thêm địa chỉ
                                  </strong>
                                </Button>
                              </>
                            )}
                          </div>
                          <Link to="#" className="ship_address__navigation">
                            <img
                              src="/svg/arrow-next-cart.svg"
                              alt="navigation"
                            />
                          </Link>
                        </div>
                      </Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}>
                        {/* <div className="coupons">
                          <div className="coupons_wrap">
                            <div className="coupons_usage">
                              <div className="title_usage">Tiki khuyến mãi</div>
                              <div className="max_usage">
                                Có thể chọn 2
                                <Tooltip
                                  title="Áp dụng tối đa 1 Mã giảm giá Sản Phẩm và 1 Mã Vận Chuyển"
                                  placement="bottom"
                                >
                                  <img
                                    src="/svg/icons-info-gray.svg"
                                    alt="info"
                                  />
                                </Tooltip>
                              </div>
                            </div>
                            <div className="eligible_list">
                              <div className="eligible_item">
                                <img
                                  className="eligible_bg"
                                  src="/svg/eligible-coupon.svg"
                                  alt="eligible-coupon"
                                />
                                <div className="eligible_content">
                                  <div className="left">
                                    <img
                                      src="https://salt.tikicdn.com/cache/128x128/ts/upload/46/4f/35/992923e613f0fc8434a0d12423d2f947.png"
                                      alt="label"
                                    />
                                  </div>
                                  <div className="right">
                                    <h4 className="title">Giảm 20K</h4>
                                    <div className="apply">
                                      <img
                                        src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%3E%20%20%20%20%3Cdefs%3E%20%20%20%20%20%20%20%20%3Cpath%20id%3D%224gg7gqe5ua%22%20d%3D%22M8.333%200C3.738%200%200%203.738%200%208.333c0%204.595%203.738%208.334%208.333%208.334%204.595%200%208.334-3.739%208.334-8.334S12.928%200%208.333%200zm0%201.026c4.03%200%207.308%203.278%207.308%207.307%200%204.03-3.278%207.308-7.308%207.308-4.03%200-7.307-3.278-7.307-7.308%200-4.03%203.278-7.307%207.307-7.307zm.096%206.241c-.283%200-.512.23-.512.513v4.359c0%20.283.23.513.512.513.284%200%20.513-.23.513-.513V7.78c0-.283-.23-.513-.513-.513zm.037-3.114c-.474%200-.858.384-.858.858%200%20.473.384.857.858.857s.858-.384.858-.857c0-.474-.384-.858-.858-.858z%22%2F%3E%20%20%20%20%3C%2Fdefs%3E%20%20%20%20%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cg%20transform%3D%22translate%28-2808%20-4528%29%20translate%282708%2080%29%20translate%2852%204304%29%20translate%2848%20144%29%20translate%281.667%201.667%29%22%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3Cuse%20fill%3D%22%23017FFF%22%20xlink%3Ahref%3D%22%234gg7gqe5ua%22%2F%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%20%20%20%20%3C%2Fg%3E%20%20%20%20%3C%2Fg%3E%3C%2Fsvg%3E"
                                        alt="apply"
                                      />
                                      <button>Áp Dụng</button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="platform_coupon">
                              <img
                                src="https://frontend.tikicdn.com/_desktop-next/static/img/mycoupon/coupon_icon.svg"
                                alt="platform"
                              />
                              <span>Chọn hoặc nhập Khuyến mãi khác</span>
                            </div>
                          </div>
                        </div> */}
                      </Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}>
                        <div className="cart_prices">
                          <div className="cart_prices__wrap">
                            <ul className="price_list">
                              <li className="price_item">
                                <span className="price_item__text">
                                  Tạm tính
                                </span>
                                <span className="price_item__value">
                                  {formatNumber(totalAmount)}₫
                                </span>
                              </li>
                              <li className="price_item">
                                <span className="price_item__text">
                                  Giảm giá
                                </span>
                                <span className="price_item__value">0đ</span>
                              </li>
                            </ul>
                            <div className="prices_total">
                              <div className="prices_total__text">
                                Tổng cộng
                              </div>
                              <div className="prices_total__content">
                                <div className="final">
                                  {formatNumber(totalAmount)}₫
                                </div>
                                <div className="note">
                                  (Đã bao gồm VAT nếu có)
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}>
                        <div className="cart_submit">
                          <button
                            onClick={handleSubmit}
                            className="cart_submit__btn"
                          >
                            Mua Hàng ({checkedQty})
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="cart_page__footer">
            <div className="cart_page__footer__wrap">
              <div className="footer_prices">
                <div className="footer_prices__wrap ">
                  <div className="footer_prices__left">
                    <div className="left_title">Tổng cộng</div>
                    {checkedQty > 0 && (
                      <div className="left_text">Vui lòng chọn sản phẩm</div>
                    )}
                  </div>
                  <div className="footer_prices__right">
                    <div onClick={handleSubmit} className="right_button">
                      Mua hàng ({checkedQty})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
