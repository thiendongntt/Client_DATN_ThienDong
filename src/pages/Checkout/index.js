import {
  DollarOutlined,
  HomeOutlined, LoadingOutlined, RollbackOutlined
} from '@ant-design/icons';
import {
  Alert,
  Breadcrumb,
  Button,
  Checkbox,
  Col,
  notification,
  Row, Spin
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import CART_API from '../../api/cart';
import SEND_EMAIL from '../../api/mailer';
import ORDER_API from '../../api/order';
import PaypalPayment from '../../components/PaypalPayment';
import { COD, PAYPAL, STATUS_FAIL } from '../../constants/api';
import { cartActions } from '../../store/cart';
import { formatNumber, getSalePrice } from '../../utils';
import OrderItem from './components/OrderItem';
import './style.scss';



const CheckoutPage = () => {
  const tempOrderItems = localStorage.getItem('temp_order');
  const tempAddress = localStorage.getItem('temp_address');

  const { userInfo, sale } = useSelector((state) => state.common);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const history = useHistory();

  const [orderItems, setOrderItems] = useState([]);
  const [address, setAddress] = useState();
  const [paymentType, setPaymentType] = useState(COD);
  const [useScore, setUseScore] = useState(false);
  // const [payUrl, setPayUrl] = useState('')

  const [loading, setLoading] = useState(false);
  const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;


  useEffect(() => {
    try {
      const parsedData = JSON.parse(tempOrderItems);
      setOrderItems(parsedData);
    } catch (error) {
      console.log(error);
    }
  }, [tempOrderItems]);

  useEffect(() => {
    try {
      const parsedData = JSON.parse(tempAddress);
      setAddress(parsedData);
    } catch (error) {
      console.log(error);
    }
  }, [tempAddress]);

  // useEffect(() => {
  //   (async () => {
  //     const { payUrl } = await ORDER_API.getPayUrlCheckoutMomo();
  //     setPayUrl(payUrl);
  //   })();
  // }, [])

  const totalAmount = useMemo(() => {
    try {
      let total = orderItems.reduce((prev, cur) => {
        return (
          prev +
          cur.quantity *
          getSalePrice(cur.product.price, cur.product.sale_percent)
        );
      }, 0);

      if (sale?.value) total = total - (total / 100) * sale?.value;
      if (useScore) total = total - userInfo.score;
      return total;
    } catch (error) {
      return 0;
    }
  }, [orderItems, useScore]);


  const totalOriginAmount = useMemo(() => {
    try {
      const total = orderItems.reduce((prev, cur) => {
        return prev + cur.quantity * cur.product.price;
      }, 0);

      return total;
    } catch (error) {
      return 0;
    }
  }, [orderItems]);

  const addressPayload = {
    province: address?.province,
    district: address?.district,
    ward: address?.ward,
    street: address?.street,
  };

  // const data = {
  //   payment_type: paymentType,
  //   user: userInfo?._id,
  //   address: addressPayload,
  // };

  // console.log('orderItems: ----', orderItems)
  // console.log('payUrl: ----', payUrl)

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = {
        payment_type: paymentType,
        user: userInfo._id,
        address: addressPayload,
        score: useScore ? userInfo.score : 0,
        sale: sale?.value ? (totalOriginAmount / 100) * sale?.value : 0,
      };
      const response = await ORDER_API.createOrder(data);
      const { _id: order_id } = response?.data;
      // console.log('reponse: ---', order_id)

      if (response.status === STATUS_FAIL)
        return notification.error({
          placement: 'topRight',
          message: 'Error!',
          description: response.message,
          duration: 3,
        });

      const orderItemsPayload = orderItems.map((item) => ({
        order_id: response.data._id,
        product: item.product._id,
        item_price: getSalePrice(item.product.price, item.product.sale_percent),
        quantity: item.quantity,
      }));

      const revovedCartItemIds = orderItems.map((item) => item._id);

      const orderItemsResponse = await ORDER_API.createOrderItems({
        order_items: orderItemsPayload,
      });

      const cartRemoveResponse = await CART_API.removeCartItems({
        _ids: revovedCartItemIds,
      });

      // const dataSendEmail = { orderItems, order_id }
      // await SEND_EMAIL.sendEmail(dataSendEmail)

      if (
        orderItemsResponse.status === STATUS_FAIL ||
        cartRemoveResponse.status === STATUS_FAIL
      ) {
        localStorage.removeItem('temp_order');
        localStorage.removeItem('temp_address');
      }

      const newCartItems = cartItems.filter((item) => {
        let index = revovedCartItemIds.findIndex((id) => id === item._id);
        return index === -1;
      });

      dispatch(cartActions.loadCart(newCartItems));
      setLoading(false);
      notification.success({
        placement: 'topRight',
        message: 'Successfully',
        description: response.message,
        duration: 3,
      });

      history.push('/success');
    } catch (error) {
      console.log(error);
    }
  };

  const handleUseScoreChange = (event) => {
    setUseScore(event.target.checked);
  };

  // const handleClickCheckoutMomo = () => {
  //   console.log(payUrl)
  // }

  return (
    <div id="checkout">
      <div className="container">
        <div className="checkout__wrap">
          <div className="checkout__header">
            <div className="checkout__header__wrap">
              <Link to="/" className="checkout__header__navigation">
                <img src="/svg/arrow-prev-cart.svg" alt="navigation" />
              </Link>
              <div className="checkout__header__title">e
                Thanh Toán <span>({orderItems?.length})</span>
              </div>
            </div>
          </div>
          <div className="bread__crumb-container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">
                  <HomeOutlined />
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Thanh Toán ({' ' + orderItems?.length})</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="checkout__body checkout__body__response">
            <h3>
              <strong>Chi tiết đơn hàng</strong>
            </h3>
            <Row
              gutter={[
                { xl: 16, lg: 16, md: 16, sm: 16, xs: 16 },
                { xl: 12, lg: 12, md: 12, sm: 12, xs: 12 },
              ]}
              className="body_response__row"
            >
              <Col xl={16} lg={24} md={24} sm={24} xs={24}>
                <div className="order__items-container">
                  <ul className="order__items-list">
                    {orderItems?.map((item) => (
                      <li key={item._id} className="order__items-item">
                        <OrderItem data={item} />
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="payment__methods-wrapper">
                  <h3>
                    <strong>Phương thức thanh toán</strong>
                  </h3>
                  <div className="method-container">
                    <div
                      className={`method method--paypal ${paymentType === PAYPAL && 'selected'
                        }`}
                    >
                      <PaypalPayment onSuccess={() => setPaymentType(PAYPAL)} />
                    </div>
                    <div
                      className={`method method--cod ${paymentType === COD && 'selected'
                        }`}
                      onClick={() => setPaymentType(COD)}
                    >
                      <button className="cod__btn">
                        <img src="/images/cod.png" alt='COD' />
                      </button>
                      <span
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          display: 'inline-block',
                          fontSize: 16,
                        }}
                      >
                        Thanh toán khi nhận hàng
                      </span>
                    </div>
                    {/* <div
                      className={`method method--momo ${paymentType === 'MOMO' && 'selected'
                        }`}
                      style={{ backgroundImage: 'url("https://images.careerbuilder.vn/employer_folders/lot9/221789/103316momopink-logo.png")', backgroundSize: '50px', backgroundRepeat: 'no-repeat' }}
                    >
                      <a href={`${payUrl}` || `#`} onClick={handleClickCheckoutMomo}>Thanh toán bằng Momo</a>
                    </div> */}
                  </div>
                </div>
              </Col>
              <Col xl={8} lg={24} md={24} sm={24} xs={24}>
                <div className="cart_total__prices">
                  <div
                    className="cart_total__prices__wrap"
                    style={{
                      border: '1px solid var(--my-border-color)',
                    }}
                  >
                    <Row
                      gutter={[0, { xl: 16, lg: 16, md: 16, sm: 16, xs: 16 }]}
                    >
                      <Col xl={24} lg={24} md={24} sm={24} xs={24}>
                        <div className="ship_address">
                          <div className="ship_address__wrap">
                            <div className="heading">
                              <div className="text">
                                <strong>Thông tin đặt hàng</strong>
                              </div>
                              {/* <Link className="change_address" to="#">
                                Thay đổi
                              </Link> */}
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
                            {address && (
                              <div className="address">{`${address.street}, P.${address.ward.name}, Q.${address.district.name}, ${address.province.name}`}</div>
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
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}></Col>
                      <Col xl={24} lg={0} md={0} sm={0} xs={0}>
                        <div className="cart_prices">
                          <div className="cart_prices__wrap">
                            <ul
                              style={{ padding: '0px 20px', margin: 0 }}
                              className="price_list"
                            >
                              <li className="price_item">
                                <span className="price_item__text">
                                  Tạm tính
                                </span>
                                <span
                                  style={{ color: 'var(--my-red)' }}
                                  className="price_item__value"
                                >
                                  {formatNumber(totalOriginAmount)}₫
                                </span>
                              </li>
                              {sale?.value && (
                                <li className="price_item">
                                  <span className="price_item__text">
                                    Khuyến mãi
                                  </span>
                                  <span
                                    style={{ color: 'var(--my-red)' }}
                                    className="price_item__value"
                                  >
                                    {formatNumber(
                                      (totalOriginAmount / 100) *
                                      sale?.value *
                                      -1
                                    )}
                                    ₫ {`(-${sale?.value}%)`}
                                  </span>
                                </li>
                              )}
                            </ul>
                            <div
                              className={
                                'user__score' +
                                (userInfo.score > 0 ? '' : ' disable')
                              }
                            >
                              {!userInfo.score > 0 && (
                                <Alert
                                  type="warning"
                                  message="Tham gia mua hàng và đánh giá để tích điểm thưởng! "
                                />
                              )}
                              <Checkbox
                                onChange={handleUseScoreChange}
                                disabled={!userInfo.score}
                              >
                                <span className="user__score-text">
                                  Sử dụng điểm thưởng
                                  <DollarOutlined
                                    style={{
                                      marginLeft: 8,
                                      transform: 'translateY(3px)',
                                      color: 'orange',
                                      fontSize: 21,
                                    }}
                                  />
                                  <span
                                    style={{
                                      color: 'orange',
                                      fontSize: 18,
                                      transform: 'translateY(1px)',
                                      display: 'inline-block',
                                      marginLeft: 2,
                                    }}
                                  >
                                    {formatNumber(userInfo.score)}
                                  </span>
                                </span>
                              </Checkbox>
                            </div>
                            <div className="prices_total">
                              <div className="prices_total__text">
                                Tổng cộng
                              </div>
                              <div className="prices_total__content">
                                {useScore && (
                                  <div
                                    style={{ fontSize: 16 }}
                                    className="final"
                                  >
                                    -{formatNumber(userInfo.score)}₫
                                  </div>
                                )}
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
                            disabled={loading}
                          >
                            {loading && (<Spin indicator={antIcon} style={{ marginRight: '8px' }} />)} Đặt Hàng ({orderItems.length})
                          </button>
                        </div>
                        <Button
                          icon={<RollbackOutlined />}
                          type="primary"
                          block
                          href="/cart"
                          size="large"
                        >
                          Quay lại
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
          <div className="checkout__footer">
            <div className="checkout__footer__wrap">
              <div className="footer_prices">
                <div className="footer_prices__wrap ">
                  <div className="footer_prices__left">
                    <div className="left_title">Tổng cộng</div>
                    <div className="left_text">Vui lòng chọn sản phẩm</div>
                  </div>
                  <div className="footer_prices__right">
                    <div onClick={handleSubmit} className="right_button" disabled={loading}
                    >
                      {loading && (<Spin style={{ marginRight: '8px' }} indicator={antIcon} />)} Đặt hàng ({orderItems.length})
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default CheckoutPage;
