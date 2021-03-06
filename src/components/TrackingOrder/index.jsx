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
      title="L???ch s??? ????n h??ng"
      visible={isModalVisible}
      onCancel={handleCancel}
      width={1200}
      footer={null}
    >
      <div className="site-card-wrapper">
        <Row gutter={16}>
          <Col span={8}>
            <Card title="TH??NG TIN ????N H??NG" bordered={false} type="inner">
              <div className="text-common">
                <div className="text-left">
                  <p>M?? ????n h??ng: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.order_code}</strong>
                </div>
              </div>
              <div className="text-common">
                <div className="text-left">
                  <p>Ng??y l???y d??? ki???n: </p>
                </div>
                <div className="text-right">
                  <strong> {getDateTime(dataOrderInfo?.picktime)}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>Ng??y giao d??? ki???n: </p>
                </div>
                <div className="text-right">
                  {/* <strong>{dataOrderInfo?.picktime}</strong> */}
                  <strong>{getDateTime(dataOrderInfo?.leadtime)}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>Tr???ng th??i hi???n t???i</p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.status_name}</strong>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="NG?????I G???I" bordered={false} type="inner">
              <div className="text-common">
                <div className="text-left">
                  <p>H??? v?? t??n: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.from_name}</strong>
                </div>
              </div>
              <div className="text-common">
                <div className="text-left">
                  <p>??i???n tho???i: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.from_phone}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>?????a ch???: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.from_address}</strong>
                </div>
              </div>
            </Card>
          </Col>
          <Col span={8}>
            <Card title="NG?????I NH???N" bordered={false} type="inner">
              <div className="text-common">
                <div className="text-left">
                  <p>H??? v?? t??n: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.to_name}</strong>
                </div>
              </div>
              <div className="text-common">
                <div className="text-left">
                  <p>??i???n tho???i: </p>
                </div>
                <div className="text-right">
                  <strong>{dataOrderInfo?.to_phone}</strong>
                </div>
              </div>

              <div className="text-common">
                <div className="text-left">
                  <p>?????a ch???: </p>
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
        <Card title="L???CH S??? ????N H??NG">
          <Table dataSource={dataTrackingLog}>
            <Column
              title="Tr???ng th??i"
              dataIndex="status_name"
              key="status_name"
            />
            <Column title="Chi ti???t" dataIndex="address" key="address" />
            <Column title="Th???i gian" dataIndex="action_at" key="action_at" />
          </Table>
        </Card>
      </div>
    </Modal>
  );
}

export default TrackingOrder;
