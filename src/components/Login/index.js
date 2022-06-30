import { Button, Checkbox, Divider, Form, Input, notification } from "antd";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { useDispatch } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import AUTH_API from "../../api/auth";
import { STATUS_FAIL, STATUS_OK } from "../../constants/api";
import firebase from "../../services/firebase";
import { commonActions, initState } from "../../store/common";
import { splitFullName } from "../../utils";

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
        placement: "topRight",
        message: "Đăng nhập thất bại!",
        description: userInfoResponse.message,
        duration: 3,
      });

    // notification.success({
    //   placement: "topRight",
    //   message: "Đăng nhập thành công!",
    //   description: userInfoResponse.message,
    //   duration: 3,
    // });

    dispatch(commonActions.setUserInfo(userInfoResponse.data));
    dispatch(commonActions.toggleLogged(true));
    dispatch(commonActions.toggleLoginForm(false));
    localStorage.setItem("access_token", data.token);
  };

  const onFinish = async (values) => {
    const response = await AUTH_API.login(values);

    if (response.status === STATUS_OK) return handleSuccessLogin(response.data);

    notification.error({
      placement: "topRight",
      message: "Đăng nhập thất bại!",
      description: response.message,
      duration: 3,
    });
  };

  const handleSuccessLoginWithGoogle = async (data) => {
    const userInfoResponse = await AUTH_API.verify(data.token);
    if (userInfoResponse.status === STATUS_FAIL)
      return notification.error({
        placement: "topRight",
        message: "Đăng nhập thất bại!",
        description: userInfoResponse.message,
        duration: 3,
      });
    // notification.success({
    //   placement: "topRight",
    //   message: "Đăng nhập thành công!",
    //   description: userInfoResponse.message,
    //   duration: 3,
    //   maxCount: 1,
    // });

    // Handle add chat messenger

    dispatch(commonActions.setUserInfo(userInfoResponse.data));
    dispatch(commonActions.toggleLogged(true));
    dispatch(commonActions.toggleLoginForm(false));
    localStorage.setItem("access_token", data.token);
  };

  const handleLoginWithGoogle = () => {
    const googleProvider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(googleProvider);

    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged(async (user) => {
        if (!user) {
          return console.log("User not logged in");
        }

        // const token = await user.getIdToken();
        const fullName = splitFullName(user.displayName);

        const data = {
          email: user.email,
          first_name: fullName.first_name,
          last_name: fullName.last_name,
          avt_url: user.photoURL,
        };

        const response = await AUTH_API.loginWithGoogle(data);
        if (response.status === STATUS_OK)
          return handleSuccessLoginWithGoogle(response.data);

        notification.error({
          placement: "topRight",
          message: "Đăng nhập thất bại!",
          description: response.message,
          duration: 3,
        });
      });

    return () => unregisterAuthObserver();
  };

  const handleCloseLoginForm = () => {
    dispatch(commonActions.toggleLoginForm(false));
  };

  useEffect(() => {
    localStorage.removeItem("access_token");
    dispatch(commonActions.toggleLogged(false));
    dispatch(commonActions.setUserInfo(initState.userInfo));

    // const body = document.querySelector('body');
    // body.style.overflow = 'hidden';
    // return () => body.style.overflow = 'auto'
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
        {/* <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        /> */}
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
            onClick={handleLoginWithGoogle}
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
            <Link onClick={handleCloseLoginForm} to="/auth/register">

              Tạo tài khoản            </Link>
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
