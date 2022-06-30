import { Button, Checkbox, Form, Input, notification } from 'antd';
import { Link, useHistory } from 'react-router-dom';
import AUTH_API from '../../../api/auth';
import { STATUS_OK } from '../../../constants/api';
import { fullnameReg, phoneReg } from '../../../utils/validations';

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
const RegisterForm = () => {
  const history = useHistory();
  const [form] = Form.useForm();

  const redirect = (path) => {
    history.push(path);
  };

  const handleSuccessLogin = () => {
    //toast
    notification.success({
      placement: 'bottomLeft',
      message: 'Create account successfully',
      description: `Please login to Tiki`,
      duration: 3,
    });
    redirect('/auth/login');
  };

  const onFinish = async (values) => {
    const response = await AUTH_API.register(values);
    if (response.status === STATUS_OK) return handleSuccessLogin();

    notification.error({
      placement: 'bottomLeft',
      message: 'Create account failed!',
      description: response.message,
      duration: 3,
    });
  };

  return (
    <div className="my-form">
      <div className="form-container hidden-scroll">
        <div className="form-header">
          <h1>Đăng ký</h1>
          <p>Đăng nhập tài khoản để quản lý doanh nghiệp của bạn</p>
        </div>
        <div className="google-auth">
          <Button
            type="primary"
            ghost
            block
            size="large"
            style={{
              borderRadius: 9999,
              borderColor: 'rgb(228, 228, 228)',
              boxShadow: 'none',
              fontSize: 14,
              color: 'rgba(36, 36, 36, 0.826)',
              fontWeight: 'bold',
            }}
          >
            <img src="/svg/google.svg" alt="Login with Google" />
            Đăng nhập với google
          </Button>
        </div>
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
            label="E-mail*"
            labelAlign="left"
            rules={[
              {
                type: 'email',
                message: 'Email của bạn không hợp lệ!',
              },
              {
                required: true,
                message: 'Vui lòng nhập email của bạn!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          {/* username */}
          <Form.Item
            name="first_name"
            colon={false}
            label="Tên*"
            labelAlign="left"
            rules={[
              {
                pattern: fullnameReg,
                message: 'Đầu vào không phải là tên hợp lệ!',
                whitespace: true,
              },
              { required: true, message: 'Vui lòng nhập tên của bạn!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="last_name"
            colon={false}
            label="Họ*"
            labelAlign="left"
            rules={[
              {
                pattern: fullnameReg,
                message: 'Đầu vào không phải là họ hợp lệ!',
                whitespace: true,
              },
              { required: true, message: 'Vui lòng nhập họ của bạn!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            colon={false}
            label="Số điện thoại*"
            labelAlign="left"
            rules={[
              {
                pattern: phoneReg,
                message: 'Số điện thoại không hợp lệ!',
                whitespace: true,
              },
              { required: true, message: 'Xin vui lòng điền số điện thoại của bạn!' },
            ]}
          >
            <Input />
          </Form.Item>
          {/* password */}
          <Form.Item
            name="password"
            colon={false}
            label="Mật khẩu*"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
              {
                min: 6,
                message: 'Please enter your password more than 6 characters!!',
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          {/* confirm password */}
          <Form.Item
            name="confirm"
            colon={false}
            label="Nhập lại mật khẩu*"
            labelAlign="left"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu của bạn!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      'Hai mật khẩu bạn đã nhập không khớp!'
                    )
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          {/* check */}
          <Form.Item
            name="agreement"
            colon={false}
            valuePropName="checked"
            labelAlign="left"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(new Error('Bạn chưa đồng ý với các điều khoản và điền kiện')),
              },
            ]}
            {...tailFormItemLayout}
          >
            <Checkbox
              style={{
                fontWeight: 'bold',
              }}
            >
              Tôi đồng ý với các <Link to="">{'điều khoản & điều kiện'}</Link>
            </Checkbox>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: 'var(--my-primary-color)',
                borderRadius: 99999,
                border: 'none',
                marginTop: 22,
                marginBottom: 12,
                fontWeight: 'bold',
                fontSize: 14,
              }}
              block
              size="large"
            >
              Sign Up
            </Button>
          </Form.Item>
        </Form>
        <div className="form-redirect">
          <span>Bạn đã có tài khoản?</span>
          <Link to="/auth/login"> Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
