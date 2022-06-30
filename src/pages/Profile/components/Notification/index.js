import { Alert } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import NOTIFICATION_API from "../../../../api/notification";
import { STATUS_FAIL } from "../../../../constants/api";
import NotificationItem from "../NotificationItem";

// const notifications = [
// 	{
// 		content:
// 			"Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin risus. Praesent lectus.\n\nVestibulum quam sapien, varius ut, blandit non, interdum in, ante. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Duis faucibus accumsan odio. Curabitur convallis.",
// 		timestamp: "27/11/2021",
// 	},
// 	{
// 		content:
// 			"Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.",
// 		timestamp: "10/02/2022",
// 	},
// 	{
// 		content:
// 			"Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
// 		timestamp: "23/02/2021",
// 	},
// 	{
// 		content:
// 			"Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus.\n\nIn sagittis dui vel nisl. Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus.",
// 		timestamp: "20/03/2021",
// 	},
// 	{
// 		content:
// 			"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.",
// 		timestamp: "26/02/2021",
// 	},
// 	{
// 		content:
// 			"Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.\n\nMaecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti.",
// 		timestamp: "14/10/2021",
// 	},
// 	{
// 		content:
// 			"Praesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem.",
// 		timestamp: "28/10/2021",
// 	},
// 	{
// 		content:
// 			"In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo.\n\nAliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros. Suspendisse accumsan tortor quis turpis.",
// 		timestamp: "09/03/2021",
// 	},
// 	{
// 		content:
// 			"Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.\n\nNullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh.",
// 		timestamp: "19/07/2021",
// 	},
// 	{
// 		content:
// 			"Quisque id justo sit amet sapien dignissim vestibulum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros.\n\nVestibulum ac est lacinia nisi venenatis tristique. Fusce congue, diam id ornare imperdiet, sapien urna pretium nisl, ut volutpat sapien arcu sed augue. Aliquam erat volutpat.",
// 		timestamp: "15/01/2022",
// 	},
// ]

const Notification = () => {
  const { userInfo } = useSelector((state) => state.common);
  const [notifications, setNotifications] = useState([]);

  useEffect(async () => {
    try {
      if (!userInfo._id || userInfo._id === "") return;

      const response = await NOTIFICATION_API.queryNotifications(userInfo._id);

      if (response.status === STATUS_FAIL) return console.log(response.message);

      setNotifications(response.data);
    } catch (error) {}
  }, [userInfo._id]);

  return (
    <div className="notification">
      {!notifications.length ? (
        <Alert message="Chưa có thông báo nào!" />
      ) : (
        notifications.map((item) => (
          <NotificationItem key={item._id} data={item} />
        ))
      )}
    </div>
  );
};

export default Notification;
