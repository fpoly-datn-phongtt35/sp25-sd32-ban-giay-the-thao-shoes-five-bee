import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
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
import DanhMuc from "./admin/DanhMuc";
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
import ThongKe from "./admin/ThongKe";
import ThongKeSanPham from "./admin/ThongKeSanPham";
import GiamGiaHoaDon from "./admin/GiamGiaHoaDon";
import { Header } from "./header/Header";
import { Footer } from "./footer/Footer";
import DanhGiaComponent from "./components/DanhGiaComponent";
const Layout = () => {
  return (
    <div className="app_container">
      <Header />

      <main>
        <Outlet /> {/* Render các route con */}
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app_container">
          <Routes>
            {/* Group các route cần Layout */}
            <Route element={<Layout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/check-out" element={<Bill />} />
              <Route path="/orderStatusPage" element={<OrderStatusPage />} />
              <Route path="/profile" element={<ProfileUser />} />
              <Route path="/addresslist" element={<AddressList />} />
              <Route path="/productAll" element={<ProductAll />} />
              <Route path="/product-detail/:id" element={<ProductDetail />} />
              <Route path="/danh-gia" element={<DanhGiaComponent />} />
            </Route>

            {/* Các route không có Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Login />} />

            {/* Routes dành cho Admin */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="statistics" element={<Statistics />} />
              <Route index element={<Dashbord />} />
              <Route path="ban-hang-tai-quay" element={<BanHangTaiQuay />} />
              <Route path="Thong-Ke" element={<ThongKe />} />
              <Route path="Thong-Ke-San-Pham" element={<ThongKeSanPham />} />
              <Route path="quan-ly-hoa-don" element={<QuanLyHoaDon />} />
              <Route path="tra-hang" element={<ReturnOrderStatusPage />} />
              <Route path="san-pham" element={<SanPham />} />
              <Route path="thuong-hieu" element={<ThuongHieu />} />
              <Route path="danh-muc" element={<DanhMuc />} />
              <Route path="san-pham-chi-tiet" element={<SanPhamChiTiet />} />
              <Route path="mau-sac" element={<MauSac />} />
              <Route path="xuat-xu" element={<XuatXu />} />
              <Route path="upload-file" element={<AnhSanPham />} />
              <Route path="kieu-dang" element={<KieuDang />} />
              <Route path="de-giay" element={<DeGiay />} />
              <Route path="chat-lieu" element={<ChatLieu />} />
              <Route path="nhan-vien" element={<NhanVien />} />
              <Route path="khach-hang" element={<KhachHang />} />
              <Route path="chuc-vu" element={<ChucVu />} />
              <Route path="hang-khachHang" element={<HangKhachHang />} />
              <Route path="phieu-giam-gia" element={<PhieuGiamGia />} />
              <Route path="giam-gia-hoa-don" element={<GiamGiaHoaDon />} />
              <Route path="kich-co" element={<KichCo />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}
export default App;
