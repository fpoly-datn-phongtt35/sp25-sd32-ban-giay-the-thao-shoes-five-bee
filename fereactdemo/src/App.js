import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLayout from "./components/AdminLayout";
import Login from "./signln/Login";
import Dashbord from "./admin/Dashbord";
import BanHangTaiQuay from "./admin/BanHangTaiQuay";
import QuanLyHoaDon from "./admin/QuanLyHoaDon";
import TraHang from "./admin/TraHang";
import SanPham from "./admin/SanPham";
import ThuongHieu from "./admin/ThuongHieu";
import SanPhamChiTiet from "./admin/SanPhamChiTiet";
import MauSac from "./admin/MauSac";
import XuatXu from "./admin/XuatXu";
import AnhSanPham from "./admin/AnhSanPham";
import KieuDang from "./admin/KieuDang";
import DeGiay from "./admin/DeGiay";
import ChatLieu from "./admin/ChatLieu";
import NhanVien from "./admin/NhanVien";
import KhachHang from "./admin/KhachHang";
import PhieuGiamGia from "./admin/PhieuGiamGia";
import KichCo from "./admin/KichCo";
import ChucVu from "./admin/ChucVu";
import HangKhachHang from "./admin/HangKhachHang";
import Register from "./signup/Register";
import Home from "./home/Home";

import { Cart } from "./cart/Cart";
import { Bill } from "./bill/Bill";
import { OrderStatusPage } from "./orderstatus/OrderStatusPage";
import { ReturnOrderStatusPage } from "./returnoders/ReturnOrderStatusPage";
import { AddressList } from "./address/AddressList";
import { ProductAll } from "./productAll/ProductAll";
import ProductDetail from "./sanphamchitiet/ProductDetail";
import Statistics from "./admin/ThongKe";
import { ProfileUser } from "./profile/ProfileUser";
import ProtectedRoute from "./components/ProtectedRoute";
import { CartProvider } from "./cart/CartContext";
import HoaDonChiTiet from "./admin/HoaDonChiTiet";
import ThongKe from "./admin/ThongKe";
import ThongKeSanPham from "./admin/ThongKeSanPham";
function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/OrderStatusPage" element={<OrderStatusPage />} />
          <Route path="/profile" element={<ProfileUser />} />
          <Route path="/addresslist" element={<AddressList />} />
          <Route path="/productAll" element={<ProductAll />} />
          <Route path="/product-detail/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="/admin/statistics" element={<Statistics />} />
            <Route
              index
              element={
               
                  <Dashbord />
                
              }
            />
            <Route
              path="/admin/ban-hang-tai-quay"
              element={
               
                  <BanHangTaiQuay />
                
              }
            />
            <Route
              path="/admin/Thong-Ke"
              element={
               
                  <ThongKe />
                
              }
            />

            <Route
              path="/admin/Thong-Ke-San-Pham"
              element={
               
                  <ThongKeSanPham />
                
              }
            />

            <Route
              path="/admin/hoa-don-chi-tiet"
              element={
               
                  <HoaDonChiTiet />
                
              }
            />
            <Route
              path="/admin/quan-ly-hoa-don"
              element={
               
                  <QuanLyHoaDon />
                
              }
            />
            <Route path="/admin/tra-hang" element={<ReturnOrderStatusPage />} />
            <Route
              path="/admin/san-pham"
              element={
               
                  <SanPham />
                
              }
            />
            <Route
              path="/admin/thuong-hieu"
              element={
               
                  <ThuongHieu />
                
              }
            />
            <Route
              path="/admin/san-pham-chi-tiet"
              element={
               
                  <SanPhamChiTiet />
                
              }
            />
            <Route
              path="/admin/mau-sac"
              element={
               
                  <MauSac />
                
              }
            />
            <Route
              path="/admin/xuat-xu"
              element={
               
                  <XuatXu />
                
              }
            />
            <Route
              path="/admin/upload-file"
              element={
               
                  <AnhSanPham />
                
              }
            />
            <Route
              path="/admin/kieu-dang"
              element={
               
                  <KieuDang />
                
              }
            />
            <Route
              path="/admin/de-giay"
              element={
               
                  <DeGiay />
                
              }
            />
            <Route
              path="/admin/chat-lieu"
              element={
               
                  <ChatLieu />
                
              }
            />
            <Route
              path="/admin/nhan-vien"
              element={
               
                  <NhanVien />
                
              }
            />
            <Route
              path="/admin/khach-hang"
              element={
               
                  <KhachHang />
                
              }
            />
            <Route
              path="/admin/chuc-vu"
              element={
               
                  <ChucVu />
                
              }
            />
            <Route
              path="/admin/hang-khachHang"
              element={
               
                  <HangKhachHang />
                
              }
            />
            <Route
              path="/admin/phieu-giam-gia"
              element={
               
                  <PhieuGiamGia />
                
              }
            />
            <Route
              path="/admin/kich-co"
              element={
               
                  <KichCo />
                
              }
            />
          </Route>
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
