import { Button, Checkbox, Divider, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import AUTH_API from "../../../api/auth";
import { STATUS_OK, STATUS_FAIL } from "../../../constants/api";
import { commonActions, initState } from "../../../store/common";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 24,
      offset: 0,
    },
  },
};

const LoginForm = ({ isHome }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const redirect = (path) => {
    history.push(path);
  };

  const handleSuccessLogin = async (data) => {
    const userInfoResponse = await AUTH_API.verify(data.token);
    if (userInfoResponse.status === STATUS_FAIL)
      return notification.error({
        placement: "bottomLeft",
        message: "Đăng nhập thất bại!",
        description: userInfoResponse.message,
        duration: 3,
      });

    dispatch(commonActions.setUserInfo(userInfoResponse.data));
    dispatch(commonActions.toggleLogged(true));
    localStorage.setItem("access_token", data.token);
    redirect("/");
  };

  const onFinish = async (values) => {
    const response = await AUTH_API.login(values);

    if (response.status === STATUS_OK) return handleSuccessLogin(response.data);

    notification.error({
      placement: "bottomLeft",
      message: "Đăng nhập thất bại!",
      description: response.message,
      duration: 3,
    });
  };

  useEffect(() => {
    localStorage.removeItem("access_token");
    dispatch(commonActions.toggleLogged(false));
    dispatch(commonActions.setUserInfo(initState.userInfo));
  }, []);

  return (
    <div className="my-form">
      <div className="form-container hidden-scroll">
        {!isHome && (
          <div className="form-header">
            <h1>Đăng nhập</h1>
            <p>Đăng nhập tài khoản để quản lý doanh nghiệp của bạn</p>
          </div>
        )}
        <div className="google-auth">
          <Button
            type="primary"
            ghost
            block
            size="large"
            style={{
              borderRadius: 9999,
              borderColor: "rgb(228, 228, 228)",
              boxShadow: "none",
              fontSize: 14,
              color: "rgba(36, 36, 36, 0.826)",
              fontWeight: "bold",
            }}
          >
            <img src="/svg/google.svg" alt="Login with Google" />
            Đăng nhập với Google
          </Button>
        </div>
        <Divider style={{ fontSize: 13 }} className="form-divider">
          Hoặc đăng nhập với email
        </Divider>
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          colon={false}
          onFinish={onFinish}
          initialValues={{
            residence: ["zhejiang", "hangzhou", "xihu"],
            prefix: "86",
          }}
          requiredMark={false}
          scrollToFirstError
        >
          {/* mail */}
          <Form.Item
            name="email"
            colon={false}
            label="E-mail"
            labelAlign="left"
            rules={[
              {
                type: "email",
                message: "Email không hợp lệ!",
              },
              {
                required: true,
                message: "Vui lòng nhập email của bạn!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* password */}
          <Form.Item
            name="password"
            colon={false}
            label="Mật khẩu"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu!",
              },
              {
                min: 6,
                message: "Mật khẩu ít nhất là 6 ký tự!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* check */}
          <Form.Item
            name="saveAccount"
            colon={false}
            valuePropName="checked"
            labelAlign="left"
            {...tailFormItemLayout}
          >
            <Checkbox
              style={{
                fontWeight: "bold",
              }}
            >
              Nhớ tài khoản
            </Checkbox>
            <Link className="forget-password" to="/password-reset">
              Quên mật khẩu?
            </Link>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: "var(--my-primary-color)",
                borderRadius: 99999,
                border: "none",
                marginTop: 22,
                marginBottom: 12,
                fontWeight: "bold",
                fontSize: 14,
              }}
              block
              size="large"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
        {!isHome && (
          <div className="form-redirect">
            <span>Bạn chưa đăng ký?</span>
            <Link to="/auth/register"> Tạo tài khoản</Link>
          </div>
        )}
        {/* <div className='form-trademark'>
          <span>@mb1o4er 2021</span>
        </div> */}
      </div>
    </div>
  );
};

export default LoginForm;
