import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Tạo file CSS nếu bạn muốn thêm kiểu

const Sidebar = ({data, setCurrentPage}) => {

    const [customerData, setCustomerData] = useState({
        anh:'',
        hoTen: ''
    });

    useEffect(() => {
        if (data) {
            setCustomerData(data);
        }
    }, [data]);

    return (
        <div className="sidebar">
            <div className="profile-section">
                <div className="avatar">
                    <img src={customerData.anh} alt="Avatar" />
                </div>
                <p>{customerData.hoTen}</p>
            </div>
            <h5>Tài Khoản Của Tôi:</h5>
            <div className="menu">
                <ul>
                    <li><Link onClick={() => setCurrentPage('profile')}>Hồ Sơ</Link></li>
                    <li><Link onClick={() => setCurrentPage('addresslist')}>Địa Chỉ</Link></li>
                    <li><Link onClick={() => setCurrentPage('changepassword')}>Đổi Mật Khẩu</Link></li>
                </ul>
            </div>

            <div className="footer">
                <ul>
                  <li ><Link to="/OrderStatusPage">Đơn Mua</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
