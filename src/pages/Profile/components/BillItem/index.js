import { Button } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import TrackingOrder from '../../../../components/TrackingOrder';
import { CANCELED, CONFIRMED, DONE, PENDING } from '../../../../constants/bill';
import { formatNumber } from '../../../../utils';
import OrderItem from '../OrderItem';
import './style.scss';

const BillItem = ({ data, onCancel }) => {
  console.log('data', data);
  const { order_items, _id } = data;
  // const history = useHistory();

  const totalAmount = useMemo(() => {
    const total = order_items?.reduce((prev, cur) => {
      return prev + cur.quantity * cur.item_price;
    }, 0);

    return total;
  }, [data]);

  const [isShowModal, setIsShowModal] = useState(() => false)

  const showModal = () => {
    setIsShowModal(true);
  };

  const handleOnCloseModal = (flag) => {
    if (flag) setIsShowModal(false);
  }

  return (
    <div className="bill-item">
      <div className="bill-item__status">
        <span>
          {data.order_status === DONE
            ? 'Đã giao'
            : data.order_status === PENDING
              ? 'Đang xử lý'
              : data.order_status === CANCELED
                ? 'Đã hủy'
                : 'Đang giao hàng'}
        </span>

        {data.order_status === PENDING && (
          <div className="bill-item__canceled">
            <Button type="primary" danger ghost onClick={onCancel}>
              Hủy đơn
            </Button>
          </div>
        )}

        {(data.order_status === DONE || data.order_status === CONFIRMED) && data?.order_code && (
          <Button type="primary" onClick={showModal} ghost>
            Xem tình trạng đơn hàng
          </Button>
        )}
        {isShowModal && (<>
          <TrackingOrder _id={_id} isOpenModal={isShowModal} onCloseModal={handleOnCloseModal} />
        </>)}

      </div>
      <div className="bill-item__order-list">
        {data.order_items?.map((item) => (
          <OrderItem key={item._id} data={item} />
        ))}
      </div>
      <div className="bill-item__footer">
        <div className="footer__total-price">
          Tổng tiền:{' '}
          <span className="total-price">{formatNumber(totalAmount)}</span>
        </div>
      </div>
    </div>
  );
};

export default BillItem;
