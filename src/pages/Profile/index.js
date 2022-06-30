import {
  BellOutlined,
  DollarOutlined,
  HomeOutlined,
  UserOutlined,
  WalletOutlined
} from '@ant-design/icons';
import { Breadcrumb, Col, Menu, Row } from 'antd';
import { useSelector } from 'react-redux';
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import { formatNumber } from '../../utils';
import Account from './components/Account';
import Bill from './components/Bill';
import Notification from './components/Notification';
import './style.scss';

const ProfilePage = () => {
  const { url } = useRouteMatch();
  console.log('url', url)
  const { userInfo } = useSelector((state) => state.common);
  const { pathname } = useLocation();
  console.log('useLocation', pathname)

  const currentKeys = pathname.split('/').at(-1);

  return (
    <div id="profile">
      <div className="container">
        <div className="profile-container">
          <div className="bread__crumb-container">
            <Breadcrumb>
              <Breadcrumb.Item>
                <Link to="/">
                  <HomeOutlined />
                </Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Profile</span>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>Account</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <div className="profile-content">
            <Row>
              <Col xxl={4} xl={4} lg={4} md={0} sm={0} xs={0}>
                <div className="sidebar__menu-wrapper">
                  <div className="sidebar__heading">
                    <div className="sidebar__heading-avatar">
                      <img src="https://i.pravatar.cc/45" alt="avatar" />
                    </div>
                    <div className="sidebar__heading-info">
                      <p>Tài khoản của</p>
                      <p className="username">{`${userInfo.last_name} ${userInfo.first_name}`}</p>
                    </div>
                  </div>
                  {userInfo.score > 0 && (
                    <div style={{ marginBottom: 8, display: 'flex' }} className="user__score">
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
                    </div>
                  )}
                  <Menu
                    defaultSelectedKeys={[currentKeys]}
                    selectedKeys={[currentKeys]}
                  >
                    <Menu.Item key="edit" icon={<UserOutlined />}>
                      <Link to={`${url}/edit`}>Thông tin tài khoản</Link>
                    </Menu.Item>
                    <Menu.Item key="notification" icon={<BellOutlined />}>
                      <Link to={`${url}/notification`}>Thông báo của tôi</Link>
                    </Menu.Item>
                    <Menu.Item key="bill" icon={<WalletOutlined />}>
                      <Link to={`${url}/bill`}>Quản lý đơn hàng</Link>
                    </Menu.Item>
                  </Menu>
                </div>
              </Col>
              <Col xxl={20} xl={20} lg={20} md={24} sm={24} xs={24}>
                <div className="content-wrapper">
                  <div className="content__heading">
                    <p>Thông tin tài khoản</p>
                  </div>
                  <Switch>
                    <div className="main-content-wrapper">
                      <Route exact path={`${url}/edit`}>
                        <Account />
                      </Route>
                      <Route exact path={`${url}/bill`}>
                        <Bill />
                      </Route>
                      <Route exact path={`${url}/notification`}>
                        <Notification />
                      </Route>
                    </div>
                  </Switch>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
