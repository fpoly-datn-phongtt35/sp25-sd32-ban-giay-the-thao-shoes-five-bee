import React, { useEffect, useState } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Menu, Space } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleOrderStatusPage = () => {
    navigate("/OrderStatusPage");
  };
  const handleProfile = () => {
    navigate("/profile");
  };
  useEffect(() => {
    const checkLoginStatus = () => {
      console.log("Checking login status...");
      const token = sessionStorage.getItem('token');
      const userInfo = sessionStorage.getItem('user');
      console.log("Token:", token);
      console.log("User info:", userInfo);

      if (token && userInfo) {
        const parsedUserInfo = JSON.parse(userInfo);
        console.log("Parsed User Info:", parsedUserInfo);
        setIsLoggedIn(true);
        setUser(parsedUserInfo);
        console.log("User is logged in:", parsedUserInfo);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        console.log("User is not logged in");
      }
    };

    checkLoginStatus();

    const handleLoginChange = () => {
      checkLoginStatus();
    };

    window.addEventListener('loginChange', handleLoginChange);

    return () => {
      window.removeEventListener('loginChange', handleLoginChange);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event('loginChange'));
    navigate('/'); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  const renderUserName = () => {
    if (user && user.roles.includes('ROLE_KHACH_HANG')) {
        return `Khách hàng: ${user.hoTen}`;
    } else {
        return user?.hoTen || 'Guest';
    }
  };

  const menuItems = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfile}>
        <UserOutlined />
        <span>Profile</span>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <UserOutlined />
        <span>Logout</span>
      </Menu.Item>
      <Menu.Item key="donMua" onClick={handleOrderStatusPage}>
        <UserOutlined />
        <span>Đơn Mua</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <div className="header">
      <div className="header_content background">
        <div className="header_content_left">
          <p>Rất nhiều ưu đãi đang chờ bạn</p>
        </div>
        {!isLoggedIn ? (
          <div className="header_content_right">
            <Link to="/login" className="item">Đăng nhập</Link>
            <div className="separator">|</div>
            <Link to="/register" className="item">Đăng ký</Link>
            <div className="separator">|</div>
            <div className="item">Hotline : 19001010</div>
          </div>
        ) : (
          <div className="header_content_right">
            <div className="user-profile">
              <Space size="large">
                <BellOutlined style={{ fontSize: '24px' }} />
                <Dropdown overlay={menuItems}>
                  <Space>
                    <Avatar icon={<UserOutlined />} />
                    <span>Hello ! {renderUserName()}</span>
                  </Space>
                </Dropdown>
              </Space>
            </div>
          </div>
        )}
      </div>
      <div className="header_header">
        <div className="header_header_left">
          <img src="/home/fivestar.png" alt="Five Star" />
          <input type="text" placeholder="Tìm kiếm..." />
        </div>
        <div className="header_header_right">
          <div className="header_header_right_content">
            <img src="/home/images.png" alt="So sánh" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>
                <Link>So sánh</Link>
              </p>
              <p></p>
            </div>
          </div>
          <div className="header_header_right_content">
            <img src="/home/images.png" alt="Yêu thích" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>
                <Link>Yêu thích</Link>
              </p>
             
            </div>
          </div>
          <div className="header_header_right_content">
            <img src="/home/images.png" alt="Giỏ hàng" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <p>
                <Link to={"/cart"}>Giỏ Hàng</Link>
              </p>
   
            </div>
          </div>
        </div>
      </div>
      {/* danh mục sản phẩm */}
      <div className="header_menu background">
        <div className="header_menu_left">
          <p>Danh Mục Sản Phẩm</p>
        </div>
        <div className="header_menu_right">
          <p>
            {" "}
            <Link to={"/home"}>Trang chủ</Link>
          </p>
          <p>
            <Link to={"/productAll"}>Sản phẩm</Link>
          </p>
          <p>Giới Thiệu</p>
          <p>Sản phẩm khuyến mãi</p>
          <p>Tin tức</p>
          <p>Liên Hệ</p>
          <p>Hệ Thống Cửa Hàng</p>
          <p>Câu Hỏi Thường Gặp</p>
        </div>
      </div>
    </div>
  );
};