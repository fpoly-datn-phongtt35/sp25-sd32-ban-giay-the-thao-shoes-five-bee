import React, { useEffect, useState } from "react";
import "./header.css";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, Dropdown, Menu, Space } from "antd";
import { BellOutlined, ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { jwtDecode } from "jwt-decode";

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
      const token = localStorage.getItem("token");
      if(token){
        try{
            const tokenData = jwtDecode(token);
            setUser({
              email: tokenData.sub,
              hoTen : tokenData.hoTen,
              roles: [tokenData.role]
          });
          setIsLoggedIn(true);
        }catch(error){
          console.error("Error decoding token:", error);
        }
      }
    };

    checkLoginStatus();

    const handleLoginChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("loginChange", handleLoginChange);

    return () => {
      window.removeEventListener("loginChange", handleLoginChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setUser(null);
    window.dispatchEvent(new Event("loginChange"));
    navigate("/");
  };

  const renderUserName = () => {
    if (user && user.roles.includes("ROLE_USER")) {
      return `${user.hoTen}`;
    } else {
      return user?.hoTen || "Guest";
    }
  };

  const menuItems = (
    <Menu>
      <Menu.Item key="profile" onClick={handleProfile}>
        <UserOutlined />
        <span>Profile</span>
      </Menu.Item>
      <Menu.Item key="donMua" onClick={handleOrderStatusPage}>
        <UserOutlined />
        <span>Đơn Mua</span>
      </Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>
        <UserOutlined />
        <span>Logout</span>
      </Menu.Item>
      
    </Menu>
  );

  return (
    <div className="container">
      <div className="row top-header">
        {/* Left Header */}
        <div className="col-md-4 col-sm-12 col-xs-12 left-header hidden-sm hidden-xs">
          <div className="text">
            <span>Hotline: </span>
            <a
              href="tel:0898515689"
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "bold",
              }}
            >
              0898 515 689
            </a>
          </div>
        </div>
          
        {/* Mobile Header */}
        <div className="col-md-4 col-sm-12 col-xs-12 evo-header-mobile">


          <div className="logo evo-flexitem evo-flexitem-fill">
            <a
              href="/home"
              className="logo-wrapper"
              title="Be Classy - Giày Da Nam, Giày Tây Nam Sang Trọng"
            >
              <img
                src="//bizweb.dktcdn.net/100/292/624/themes/758446/assets/logo.png?1739925266177"
                data-lazyload="//bizweb.dktcdn.net/100/292/624/themes/758446/assets/logo.png?1739925266177"
                alt="Be Classy - Giày Da Nam, Giày Tây Nam Sang Trọng"
                className="img-responsive center-block"
              />
            </a>
          </div>

          <div className="evo-flexitem evo-flexitem-fill visible-sm visible-xs">
            {/* <a href="/cart" title="Giỏ hàng" rel="nofollow">
              <i className="fa fa-cart-arrow-down"></i>
              <span className="count_item_pr">0</span>
            </a> */}
            <a
              href="javascript:void(0);"
              className="site-header-search"
              rel="nofollow"
              title="Tìm kiếm"
            >
              <i className="fa fa-search" aria-hidden="true"></i>
            </a>
          </div>
        </div>

        {/* Right Header */}
        <div className="col-md-4 col-sm-12 col-xs-12 right-header hidden-sm hidden-xs">
          <ul className="justify-end">
          {isLoggedIn ? (
              <Dropdown overlay={menuItems} trigger={["hover"]}>
                <Space className="user-dropdown">
                  <Avatar style={{ backgroundColor: "#87d068" }} icon={<UserOutlined />} />
                  <span>{renderUserName()}</span>
                </Space>
              </Dropdown>
            ) : (
            <li className="site-nav-item site-nav-account">
              <a href="/account" title="Tài khoản" rel="nofollow">
                Tài khoản
              </a>
              <ul>
                <li>
                  <a rel="nofollow" href="/login" title="Đăng nhập">
                    Đăng nhập
                  </a>
                </li>
                <li>
                  <a rel="nofollow" href="/register" title="Đăng ký">
                    Đăng ký
                  </a>
                </li>
              </ul>
            </li>
            )}
            <li className="site-nav-item site-nav-cart mini-cart">
              <a href="/cart" title="Giỏ hàng" rel="nofollow">
              <ShoppingCartOutlined style={{ fontSize: '20px' }} /> 
                <span className="count_item_pr">0</span>
              </a>
              <div className="top-cart-content">
                <ul id="cart-sidebar" className="mini-products-list count_li">
                  <div className="no-item">
                    <p>Không có sản phẩm nào trong giỏ hàng.</p>
                  </div>
                </ul>
              </div>
            </li>

          </ul>
        </div>
      </div>

      <div class="container nav-evo-watch">
        <div class="row">
          <div class="col-md-12 col-lg-12 last-header">
            <ul id="nav" class="nav">
              <li class=" nav-item has-childs ">
                <a
                  href="/productAll"
                  class="nav-link"
                  title="DRESS SHOES"
                >
                  DRESS SHOES{" "}
                  <i class="fa fa-angle-down" data-toggle="dropdown"></i>
                </a>

                <ul class="dropdown-menu">
                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/oxfords" title="OXFORD">
                      OXFORD
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/loafers" title="LOAFER">
                      LOAFER
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/derby" title="DERBY">
                      DERBY
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/chelsea-boots" title="BOOTS">
                      BOOTS
                    </a>
                  </li>
                </ul>
              </li>

              <li class=" nav-item has-childs ">
                <a href="/phukien" class="nav-link" title="ACCESSORIES">
                  ACCESSORIES{" "}
                  <i class="fa fa-angle-down" data-toggle="dropdown"></i>
                </a>

                <ul class="dropdown-menu">
                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/bags" title="BAGS">
                      BAGS
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/belt-1" title="BELTS">
                      BELTS
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/wallet" title="WALLET">
                      WALLET
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/dresssocks" title="DRESS SOCKS">
                      DRESS SOCKS
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/gift-card" title="GIFT CARD">
                      GIFT CARD
                    </a>
                  </li>
                </ul>
              </li>

              <li class=" nav-item has-childs ">
                <a href="/new-arrivals" class="nav-link" title="COLLECTION">
                  COLLECTION{" "}
                  <i class="fa fa-angle-down" data-toggle="dropdown"></i>
                </a>

                <ul class="dropdown-menu">
                  <li class="nav-item-lv2">
                    <a
                      class="nav-link"
                      href="/clubmanxnewgen"
                      title="CLUBMAN x NEWGEN"
                    >
                      CLUBMAN x NEWGEN
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a
                      class="nav-link"
                      href="/premium-line"
                      title="PREMIUM LINE"
                    >
                      PREMIUM LINE
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/giaycuoi" title="WEDDING SHOES">
                      WEDDING SHOES
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/timeless" title="TIMELESS">
                      TIMELESS
                    </a>
                  </li>

                  <li class="nav-item-lv2">
                    <a class="nav-link" href="/thedon" title="THE DON">
                      THE DON
                    </a>
                  </li>
                </ul>
              </li>

              <li class="nav-item ">
                <a class="nav-link" href="/he-thong-cua-hang" title="STORES">
                  STORES
                </a>
              </li>

              <li class="nav-item ">
                <a class="nav-link" href="/services" title="SERVICES">
                  SERVICES
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
