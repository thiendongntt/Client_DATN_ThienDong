import { Result } from "antd";
import { Link } from "react-router-dom";

const ResultPage = ({ status, title, subTitle }) => {
  localStorage.removeItem('temp_order');
  localStorage.removeItem('temp_address');
  return (
    <div id="result">
      <Result
        status={status}
        title={title}
        subTitle={subTitle}
        extra={<Link to="/">Tiếp tục mua sắm</Link>}
      />
    </div>
  );
};

export default ResultPage;
