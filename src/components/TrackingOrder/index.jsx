import { Card, Col, Modal, Row, Table } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ORDER_API from "../../api/order";
import "./style.scss";

TrackingOrder.propTypes = {};

function getDateTime(dateTime) {
  const newDateTime = new Date(dateTime);
  const date = newDateTime.toLocaleDateString("en-GB");
  const house = newDateTime.getHours();
  const minutes = `00${newDateTime.getMinutes()}`.slice(-2);

  return ` ${house}:${minutes} - ${date}`;
}

function TrackingOrder({ _id, isOpenModal, onCloseModal }) {
  const { Column } = Table;
  // const param = useParams();
  const [isModalVisible, setIsModalVisible] = useState(() => isOpenModal);
  const [orderData, setOrderData] = useState(undefined);

  const handleCancel = () => {
    if (onCloseModal) onCloseModal(true);
  };

  // const order_code = "123";

  // const headers = {
  //   "Content-Type": "application/json",
  //   Token: "f47eaf64-d85c-11ec-ac32-0e0f5adc015a",
  //   shop_id: 2921833,
  //   shopid: 2921833,
  //   ShopId: "2921833",
  // };

  // Get one order by id
  useEffect(() => {
    (async () => {
      const responveOrderData = await ORDER_API.getOneOrder(_id);
      if (responveOrderData.status === "FAIL") return;
      const { data } = responveOrderData;
      console.log("responveOrderData", data[0]?.order_code);
      setOrderData(data[0]?.order_code);
    })();
  }, [_id]);

  // Tracking order log
  const urlTrackingLogs =
    "https://fe-online-gateway.ghn.vn/order-tracking/public-api/client/tracking-logs";

  const [dataTrackingLog, setDataTrackingLog] = useState([]);
  const [dataOrderInfo, setDataOrderInfo] = useState([]);

  useEffect(() => {
    if (!orderData) return;

    (async () => {
      const responseDataOrderLog = await axios.post(
        urlTrackingLogs,
        {
          order_code: orderData,
        },
        {}
      );

      const {
        data: {
          data: { order_info, tracking_logs },
        },
      } = responseDataOrderLog;

      const rendererDataTrackingLogs = tracking_logs?.map((log) => ({
        status_name: log?.status_name,
        address: log?.location?.address,
        action_at: getDateTime(log?.action_at),
      }));

      console.log("data order_info- --", order_info);
      setDataOrderInfo(order_info);
      setDataTrackingLog(rendererDataTrackingLogs);
      try {
      } catch (error) {
        console.log("Failed to fetch tracking logs ", error);
      }
    })();
  }, [orderData]);

  return (
    <Modal
      title="Lịch sử đơn hàng"
      visible={isModalVisible}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="THÔNG TIN ĐƠN HÀNG" bordered={false} type="inner">
              <div className="text-common">
                <div className="text-left">
                  <p>Mã đơn hàng: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.order_code}</strong>
                </div>
              </div>
              <div className="text-common">
                <div className="text-left">
                  <p>Ngày lấy dự kiến: </p>
                </div>
                <div className="text-right">
                  <strong> {getDateTime(dataOrderInfo?.picktime)}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>Ngày giao dự kiến: </p>
                </div>
                <div className="text-right">
                  {/* <strong>{dataOrderInfo?.picktime}</strong> */}
                  <strong>{getDateTime(dataOrderInfo?.leadtime)}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>Trạng thái hiện tại</p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.status_name}</strong>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="NGƯỜI GỬI" bordered={false} type="inner">
              <div className="text-common">
                <div className="text-left">
                  <p>Họ và tên: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.from_name}</strong>
                </div>
              </div>
              <div className="text-common">
                <div className="text-left">
                  <p>Điện thoại: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.from_phone}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>Địa chỉ: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.from_address}</strong>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="NGƯỜI NHẬN" bordered={false} type="inner">
              <div className="text-common">
                <div className="text-left">
                  <p>Họ và tên: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.to_name}</strong>
                </div>
              </div>
              <div className="text-common">
                <div className="text-left">
                  <p>Điện thoại: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.to_phone}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>Địa chỉ: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.to_address}</strong>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
      <div className="history-tracking-order" style={{ marginTop: 16 }}>
        <Card title="LỊCH SỬ ĐƠN HÀNG">
          <Table dataSource={dataTrackingLog}>
            <Column
              title="Trạng thái"
              dataIndex="status_name"
              key="status_name"
            />
            <Column title="Chi tiết" dataIndex="address" key="address" />
            <Column title="Thời gian" dataIndex="action_at" key="action_at" />
          </Table>
        </Card>
      </div>
    </Modal>
  );
}

export default TrackingOrder;
