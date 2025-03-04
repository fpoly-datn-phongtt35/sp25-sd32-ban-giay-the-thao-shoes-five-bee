import React, { useEffect, useState } from 'react';
import {
    BellOutlined,
    CarOutlined,
    DashboardOutlined,
    FolderOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    ProductOutlined,
    ShopOutlined,
    TagOutlined,
    TeamOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Layout, Menu, Button, Row, theme, Dropdown, Space, Avatar, Col } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';
import { jwtDecode } from "jwt-decode";

const { Header, Sider, Content } = Layout;
const AdminLayout = () => {

    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleMenuItemClick = (key) => {
        navigate(key);
    };
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('cart');
        localStorage.removeItem('idGioHang');
        setIsLoggedIn(false);
        setUser(null);
        window.dispatchEvent(new Event('loginChange'));
        navigate('/');
    };
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const tokenData = jwtDecode(token);
                setUser({
                    email: tokenData.sub,
                    roles: [tokenData.role]
                });
                setIsLoggedIn(true);
            } catch (error) {
                console.error("Error decoding token:", error);
            }
        }
    }, []);

    const renderUserName = () => {
        if (user && user.roles.includes('ROLE_ADMIN')) {
            return `Quản lý: ${user.email}`;
        } else if (user && user.roles.includes('ROLE_STAFF')) {
            return `Nhân viên: ${user.email}`;
        } else {
            return user?.email || 'Guest';
        }
    };
    const navigate = useNavigate();
    const menuItems = (
        <Menu>
            <Menu.Item key="logout">
                <UserOutlined />
                <span onClick={handleLogout}>Logout</span>
            </Menu.Item>
        </Menu>
    );
    return (
        <Layout>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '16px' }}>
                    <img src={logo} alt="Logo" style={{ maxWidth: '150px', height: 'auto' }} />
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['']}
                    onClick={({ key }) => handleMenuItemClick(key)}
                    items={[
                        {
                            key: '/admin/thong-ke',
                            icon: <DashboardOutlined />,
                            label: 'Thống Kê',
                        },
                        {
                            key: '/admin/ban-hang-tai-quay',
                            icon: <ShopOutlined />,
                            label: 'Bán Hàng Tại Quầy',
                        }, {
                            key: '/admin/quan-ly-hoa-don',
                            icon: <FolderOutlined />,
                            label: 'Quản Lý Hóa Đơn',
                        },
                        {
                            key: '/admin/tra-hang',
                            icon: <CarOutlined />,
                            label: 'Trả Hàng',
                        },
                        {
                            key: '3',
                            icon: <ProductOutlined />,
                            label: 'Quản Lý Sản Phẩm',
                            children: [
                                {
                                    key: '/admin/san-pham',

                                    label: 'Sản Phẩm',
                                },
                                {
                                    key: '/admin/thuong-hieu',

                                    label: 'Thương Hiệu',
                                },
                                {
                                    key: '/admin/san-pham-chi-tiet',

                                    label: 'Sản Phẩm Chi Tiết',
                                },
                                {
                                    key: '/admin/mau-sac',

                                    label: 'Màu Sắc',
                                },
                                {
                                    key: '/admin/xuat-xu',

                                    label: 'Xuất Xứ',
                                },
                                {
                                    key: '/admin/upload-file',

                                    label: 'Ảnh Sản Phẩm',
                                },
                                {
                                    key: '/admin/kieu-dang',

                                    label: 'Kiểu Dáng',
                                },
                                {
                                    key: '/admin/de-giay',

                                    label: 'Đế Giày',
                                },
                                {
                                    key: '/admin/chat-lieu',

                                    label: 'Chất Liệu',
                                },
                                {
                                    key: '/admin/kich-co',

                                    label: 'Kích Cỡ',
                                },
                            ]
                        },
                        {
                            key: '2',
                            icon: <TeamOutlined />,
                            label: 'Quản Lý Tài Khoản',
                            children: [
                                {
                                    key: '/admin/nhan-vien',
                                    label: 'Nhân Viên',
                                },
                                {
                                    key: '/admin/khach-hang',
                                    label: 'Khách Hàng'
                                },
                                {
                                    key: '/admin/chuc-vu',
                                    label: 'Chức Vụ',
                                },
                                // {
                                //     key: '/admin/hang-khachHang',
                                //     label: 'Hạng Khách Hàng',
                                // }
                            ]
                        },
                        {
                            key: '1',
                            icon: <TagOutlined />,
                            label: 'Giảm Giá',
                            children: [
                                {
                                    key: '/admin/phieu-giam-gia',
                                    label: 'Giảm Giá Sản Phẩm',

                                },
                                {
                                    key: '/admin/giam-gia-hoa-don',
                                    label: 'Giảm Giá Hóa Đơn',

                                }
                            ]
                        },

                    ]}
                />
            </Sider>
            <Layout>
                <Header style={{ padding: 0, background: colorBgContainer }}>
                    <Row justify="space-between">
                        <Col>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Col>
                        <Col>
                            <Space size="large">
                                <BellOutlined style={{ fontSize: '24px' }} />
                                <Dropdown overlay={menuItems}>
                                    <Space>
                                        <Avatar icon={<UserOutlined />} />
                                        <span> Hello ! {renderUserName()}</span>
                                    </Space>
                                </Dropdown>
                            </Space>
                        </Col>
                    </Row>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: "",
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
}
export default AdminLayout