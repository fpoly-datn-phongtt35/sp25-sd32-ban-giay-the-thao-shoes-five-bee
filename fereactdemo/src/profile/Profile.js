import React, { useEffect, useState } from 'react';
import './Profile.css';
import {updateKhachHang } from '../service/KhachHangService.js';
import { getDiaChiByKhachHangId } from '../service/DiaChiService.js';
import AddressModal from '../address/AddressModal.js';

export const Profile = ({khachHangId,data,onUpdateProfile}) => {
//   const [gender, setGender] = useState('male');
  const [customerData, setCustomerData] = useState({
    anh:'',
    email: '',
    hoTen: '',
    soDienThoai: '',
    ngaySinh:''
  });

  const [addressData, setAddressData] = useState([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [diaChiCuThe, setDiaChiCuThe] = useState("");
  const [xa, setXa] = useState("");
  const [huyen, setHuyen] = useState("");
  const [tinh, setTinh] = useState("");
  const [diaChiList, setDiaChiList] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

//   const handleGenderChange = (event) => {
//     setGender(event.target.value);
//   };

//DateOfBirth
  const [isEditing, setIsEditing] = useState(false);
  const [newDob, setNewDob] = useState(customerData.ngaySinh ? customerData.ngaySinh.split('T')[0] : '');

  // Hàm chuyển đổi từ chuỗi ngày 'Tue Jun 06 00:00:00 ICT 2000' thành 'YYYY-MM-DD'
    const formatDateFromString = (dateString) => {
    const date = new Date(dateString);
    
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Đảm bảo luôn có 2 chữ số cho tháng
    const day = ('0' + date.getDate()).slice(-2); // Đảm bảo luôn có 2 chữ số cho ngày
  
    return `${year}-${month}-${day}`; // Trả về định dạng 'YYYY-MM-DD'
  };
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleChangeDate = (e) => {
    const selectedDate = e.target.value;
    console.log("Ngày đã chọn:", selectedDate);
    setNewDob(selectedDate);
  };
  
  // Hàm xử lý thay đổi giá trị của input
  const handleChange = (event) => {
    setCustomerData(prevState => ({
      ...prevState,
      hoTen: event.target.value
    }));
  };

  const handleAddAddress = (newAddress) => {
    setDiaChiList([...diaChiList, newAddress]);
  };
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const response = await getDiaChiByKhachHangId(khachHangId);
        const data = Array.isArray(response.data) ? response.data : [response.data];
       // Chỉ lọc các địa chỉ có trangThai = 1
       const filteredData = data.filter(item => item.trangThai === 1);
       setAddressData(filteredData);
       if (filteredData.length > 0) {
         setTinh(filteredData[0].thanhPho);
         setHuyen(filteredData[0].huyen);
         setXa(filteredData[0].xa);
         setDiaChiCuThe(filteredData[0].tenDiaChi);
       }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    
    if (khachHangId) {
        fetchCustomerData();
      }
  }, [khachHangId,diaChiList]);

  useEffect(() => {
    // Kiểm tra nếu data đã thay đổi, cập nhật customerData
    if (data) {
        setCustomerData(data); // Cập nhật lại customerData
      }
  }, [data]);

  useEffect(() => {
    // Kiểm tra nếu newDob (ngày sinh) đã thay đổi, cập nhật nó vào customerData
    if (newDob) {
        const formattedDate = formatDateFromString(newDob); // Chuyển đổi định dạng ngày
        setCustomerData(prevState => ({
          ...prevState,
          ngaySinh: formattedDate // Cập nhật ngày sinh đã định dạng lại
        }));
      }
  }, [newDob]);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
  
    if (file) {
      // Kiểm tra kích thước file (1MB = 1024 * 1024 bytes)
      if (file.size > 1024 * 1024) {
        alert("Dung lượng file vượt quá 1 MB");
        return;
      }
  
      // Tạo URL cho file đã chọn để hiển thị
      const fileURL = URL.createObjectURL(file);
      console.log(fileURL);
  
      // Cập nhật ảnh hiển thị
      setCustomerData(prevState => ({
        ...prevState,
        anh: fileURL
      }));
  
      // Bạn có thể thêm đoạn mã để tải lên ảnh nếu cần:
      // uploadImageToServer(file); // Hàm upload ảnh lên server
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!khachHangId) {
      console.error('Khách hàng ID không tồn tại');
      return;
    }
  
    try {
      // Gọi API để cập nhật thông tin khách hàng
      const response = await updateKhachHang(khachHangId, customerData);
      onUpdateProfile(response.data); // Gọi hàm callback để cập nhật khách hàng
      console.log("Thông tin khách hàng đã được cập nhật:", response.data);
      setIsEditing(false);
      // Nếu thành công, hiển thị thông báo
      setUpdateSuccess(true);
      
      // Reset thông báo sau 3 giây
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin khách hàng:", error);
    }
  };
  
  

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>Error: {error}</p>;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Hồ Sơ Của Tôi</h2>
      <p className="profile-description">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
       {/* Thông báo cập nhật thành công */}
    {updateSuccess && <div className="alert alert-success">Cập nhật thành công!</div>}
      <div className="profile-content">
        <div className="profile-left">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Email</label>
              <input
                type="text"
                id="email"
                value={customerData.email}
                readOnly
              />
              <small>Email không thể thay đổi.</small>
            </div>

            <div className="form-group">
              <label htmlFor="hoTen">Tên</label>
              <input
                type="text"
                id="hoTen"
                value={customerData.hoTen || ""}
                onChange={handleChange} // Xử lý thay đổi dữ liệu
              />
            </div>

            <div className="form-group">
              <label>Địa Chỉ: {addressData.length > 0 ?(
                    <div>
                        <span>{diaChiCuThe},{xa},{huyen},{tinh} </span>
                       
                    </div>):(
                 <div>
                    <small>địa chỉ chưa được thiết lập.</small>
                    {/* Nút mở modal ở đây */}
                    <AddressModal onAddAddress={handleAddAddress} />
                </div>
                )}
               </label>
              
            </div>

            <div className="form-group">
              <label>Số điện thoại:</label>
              <span> {customerData.soDienThoai} <a href="/profile">Thay Đổi</a></span>     
            </div>

            {/* <div className="form-group">
              <label>Giới tính</label>
              <div className="gender-options">
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={gender === 'male'}
                    onChange={handleGenderChange}
                  />
                  Nam
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={gender === 'female'}
                    onChange={handleGenderChange}
                  />
                  Nữ
                </label>
                <label>
                  <input
                    type="radio"
                    name="gender"
                    value="other"
                    checked={gender === 'other'}
                    onChange={handleGenderChange}
                  />
                  Khác
                </label>
              </div>
            </div> */}

<div className="form-group">
  {customerData.ngaySinh ? (
    <label>Ngày sinh: {customerData.ngaySinh.split('T')[0]}</label>
  ) : (
    <label>Ngày sinh chưa thiết lập</label>
  )}

  {isEditing ? (
    <form>
      <input
        type="date"
        value={newDob}
        onChange={handleChangeDate}
      />
      <div className="button-group">
        <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Hủy</button>
      </div>
    </form>
  ) : (
    <button type="button" className="change-button" onClick={handleEditClick}>Thay Đổi</button>
  )}
</div>


            <button type="submit" className="save-button">Lưu</button>
          </form>
        </div>

        <div className="profile-right">
  <div className="avatar">
    {/* Hiển thị ảnh */}
    <img
      src={customerData.anh}
      alt="Avatar"
      id="preview-avatar"
    />

    {/* Nút chọn ảnh */}
    <input
      type="file"
      id="file-input"
      accept="image/*"
      onChange={handleImageChange}
      style={{ display: 'none' }} // Ẩn input để chỉ hiển thị nút
    />
    <button 
      className="upload-button"
      onClick={() => document.getElementById('file-input').click()}
    >
      Chọn Ảnh
    </button>
    
    <p>Dung lượng file tối đa 1 MB</p>
    <p>Định dạng: JPEG, PNG</p>
  </div>
</div>

      </div>
    </div>
  );
};
