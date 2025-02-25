import React, { useState } from 'react';
import CustomerInput from '../signln/CustomerInput';
import { Link, useNavigate } from 'react-router-dom';
import { signupCustomer, verifyOtp,resendOtp } from '../service/RegisterService';
import { message, Modal, Button } from 'antd';

const Register = () => {
    const [formData, setFormData] = useState({
        hoTen: '',
        email: '',
        soDienThoai: '',
        matKhau: '',
        confirmPassword: ''
    });
    const [showOtpPopup, setShowOtpPopup] = useState(false);
    const [otp, setOtp] = useState('');
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.hoTen || !formData.email) {
            message.error("Mật khẩu và email không được để trống.");
            return;
        }
        if (!formData.soDienThoai) {
            message.error("Số điện thoại không được để trống.");
            return;
        }
        if (!formData.matKhau || !formData.confirmPassword) {
            message.error("Mật khẩu và xác nhận mật khẩu không được để trống.");
            return;
        }
        if (formData.matKhau !== formData.confirmPassword) {
            message.error("Mật khẩu không trùng. Vui lòng kiểm tra lại.");
            return;
        }

        try {
            const response = await signupCustomer({
                hoTen: formData.hoTen,
                email: formData.email,
                soDienThoai: formData.soDienThoai,
                matKhau: formData.matKhau,
            });
            setUserEmail(formData.email); // Lưu email để gửi OTP
            setShowOtpPopup(true); // Hiển thị popup nhập OTP
        } catch (error) {
            if (error.response && error.response.status === 400) {
                message.error('Email đã được sử dụng. Vui lòng thử lại với email khác.');
            } else {
                message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        }
    };

    const handleVerifyOtp = async () => {
        try {
            await verifyOtp(userEmail, otp); // Gửi OTP lên server để xác thực
            message.success("Xác minh OTP thành công!");
            setShowOtpPopup(false);
            navigate('/login');
        } catch (error) {
            message.error("OTP không hợp lệ, vui lòng thử lại.");
        }
    };
    const handleResendOtp = async () => {
        try {
            await resendOtp(userEmail); // Gửi lại OTP
            message.success("OTP đã được gửi lại!");
        } catch (error) {
            message.error("Không thể gửi lại OTP, vui lòng thử lại sau.");
        }
    };

    return (
        <div className="py-5" style={{ background: "#ffd333", minHeight: "100vh" }}>
            <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
                <h3 className="text-center">Register</h3>
                <p className="text-center">Create an account to continue.</p>
                <form onSubmit={handleSubmit}>
                    <CustomerInput type="text" label="Full Name" i_id="hoTen" value={formData.hoTen} onChange={handleInputChange} />
                    <CustomerInput type="email" label="Email Address" i_id="email" value={formData.email} onChange={handleInputChange} />
                    <CustomerInput type="tel" label="Phone Number" i_id="soDienThoai" value={formData.soDienThoai} onChange={handleInputChange} />
                    <CustomerInput type="password" label="Password" i_id="matKhau" value={formData.matKhau} onChange={handleInputChange} />
                    <CustomerInput type="password" label="Confirm Password" i_id="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} />
                    <button className="border-0 px-3 py-2 text-white fw-bold w-100 mt-3" style={{ background: "#ffd333" }} type="submit">
                        Register
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <span>Already have an account? </span>
                    <Link to="/login" style={{ color: "#ffd333", textDecoration: "none" }}>Login</Link>
                </div>
            </div>
            {/* Modal OTP */}
            <Modal title="Nhập mã OTP" visible={showOtpPopup} onOk={handleVerifyOtp} onCancel={() => setShowOtpPopup(false)}>
                <CustomerInput type="text" label="OTP" i_id="otp" value={otp} onChange={(e) => setOtp(e.target.value)} />
                <Button type="link" onClick={handleResendOtp} style={{ marginTop: 10 }}>
                    Gửi lại OTP
                </Button>
            </Modal>
        </div>
    );
};

export default Register;
