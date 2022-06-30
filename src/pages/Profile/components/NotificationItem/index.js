import { NotificationOutlined } from "@ant-design/icons";
import "./style.scss";
import moment from "moment";

const NotificationItem = ({ data }) => {
  return (
    <div className="notification-item">
      <div className="notification-item__icon">
        <NotificationOutlined style={{ color: "var(--my-primary-color)" }} />
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: data.content }}
        className="notification-item__content"
      ></div>
      <div className="notification-item__timestamp">
        {moment(data.createdAt).format("YYYY-MM-DD HH:mm:ss")}
      </div>
    </div>
  );
};

export default NotificationItem;
