import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./thongke.css";
import {
  getAllGiayChiTiet,
} from "../service/GiayChiTietService";
ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const Statistics = () => {
  const [doanhThuNam, setDoanhThuNam] = useState({});
  const [doanhThuThang, setDoanhThuThang] = useState({});
  const [doanhThuNgay, setDoanhThuNgay] = useState({});
  const [loading, setLoading] = useState(true);

  // State cho bộ lọc
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [giayChiTietList, setGiayChiTietList] = useState([]);

  // Format date chuẩn YYYY-MM-DD
  const formatDate = (date) => new Date(date).toISOString().split("T")[0];

  // Hàm tạo dữ liệu cho biểu đồ
  const createChartData = (label, data, color) => ({
    labels: [data.message || label],
    datasets: [
      {
        data: [data.doanhThu || 0],
        backgroundColor: [color],
        borderColor: [color],
        borderWidth: 1,
        // Định dạng số hiển thị trên biểu đồ
        datalabels: {
          formatter: (value) => value.toLocaleString("vi-VN"),
        },
      },
    ],
  });

  // Gọi API tất cả doanh thu khi load trang
  const fetchAllRevenueData = async () => {
    setLoading(true);
    try {
      const today = formatDate(new Date());

      const endpoints = [
        `http://localhost:5000/doanh-thu/nam-hien-tai`,
        `http://localhost:5000/doanh-thu/thang-hien-tai`,
        `http://localhost:5000/doanh-thu/ngay-hien-tai`,
        `http://localhost:5000/doanh-thu/ngay-cu-the?ngay=${today}`,
      ];

      const responses = await Promise.all(
        endpoints.map((url) => fetch(url).then((res) => res.json()))
      );

      setDoanhThuNam(createChartData("Doanh Thu Năm", responses[0], "#FF6384"));
      setDoanhThuThang(createChartData("Doanh Thu Tháng", responses[1], "#36A2EB"));
      setDoanhThuNgay(createChartData("Doanh Thu Ngày", responses[2], "#FFCE56"));

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      setLoading(false);
    }
  };

  // Lọc theo năm
  const fetchByYear = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doanh-thu/nam-cu-the?year=${selectedYear}`
      );
      const data = await response.json();
      setDoanhThuNam(createChartData("Doanh Thu Năm", data, "#FF6384"));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu năm:", error);
    }
  };

  // Lọc theo tháng
  const fetchByMonth = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/doanh-thu/thang-cu-the?year=${selectedYear}&month=${selectedMonth}`
      );
      const data = await response.json();
      setDoanhThuThang(createChartData("Doanh Thu Tháng", data, "#36A2EB"));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu tháng:", error);
    }
  };

  // Lọc theo ngày cụ thể
  const fetchByDate = async () => {
    if (!selectedDate) return;
    try {
      const response = await fetch(
        `http://localhost:5000/doanh-thu/ngay-cu-the?ngay=${formatDate(selectedDate)}`
      );
      const data = await response.json();
      setDoanhThuNgay(createChartData("Doanh Thu Ngày", data, "#FFCE56"));
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu ngày:", error);
    }
  };

  // Lọc theo khoảng ngày
  const fetchByRange = async () => {
    if (!startDate || !endDate) return;
    try {
      const response = await fetch(
        `http://localhost:5000/doanh-thu/khoang-ngay?start=${formatDate(startDate)}&end=${formatDate(endDate)}`
      );
      const data = await response.json();
      setDoanhThuNgay(createChartData("Doanh Thu Khoảng Ngày", data, "#FFA500")); // Cam
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khoảng ngày:", error);
    }
  };

  const fetchAllGiayChiTiet = async () => {
    try {
      const response = await getAllGiayChiTiet();
      setGiayChiTietList(response.data); // Giả sử API trả về dữ liệu trong `response.data`
    } catch (error) {
      console.error("Lỗi khi lấy giày chi tiết:", error);
    }
  };
  const filteredGiayChiTietList = giayChiTietList.filter(
    (item) => item.soLuongTon <= 50
  );

  useEffect(() => {
    fetchAllGiayChiTiet();
    fetchAllRevenueData();
  }, []);

  return (
    <div className="statistics-container">
      <h1>Thống Kê Doanh Thu</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div>
          <div className="filters-container">
            <div>
              <label>Năm:</label>
              <input
                type="number"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              />
              <button onClick={fetchByYear}>Lọc theo năm</button>
            </div>

            <div>
              <label>Tháng:</label>
              <input
                type="number"
                min="1"
                max="12"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              />
              <button onClick={fetchByMonth}>Lọc theo tháng</button>
            </div>

            <div>
              <label>Ngày cụ thể:</label>
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
              <button onClick={fetchByDate}>Lọc theo ngày</button>
            </div>

            <div>
              <label>Khoảng ngày:</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              <button onClick={fetchByRange}>Lọc theo khoảng ngày</button>
            </div>
          </div>

          <div className="charts-container">
            <div className="chart-card">
              <h2 style={{ color: "#FF6384" }}>Doanh Thu Theo Năm</h2>
              <Doughnut data={doanhThuNam} />
            </div>
            <div className="chart-card">
              <h2 style={{ color: "#36A2EB" }}>Doanh Thu Theo Tháng</h2>
              <Doughnut data={doanhThuThang} />
            </div>
            <div className="chart-card">
              <h2 style={{ color: "#FFCE56" }}>Doanh Thu Theo Ngày</h2>
              <Doughnut data={doanhThuNgay} />
            </div>


          </div>
          <div className="product-table-container">
            <h2>Danh sách sản phẩm sắp hết</h2>
            <table>
              <thead>
                <tr>
                  <th>Ảnh giày</th>
                  <th>Tên Giày</th>
                  <th>Màu Sắc</th>
                  <th>Thương hiệu</th>
                  <th>Danh mục</th>
                  <th>Kích Cỡ</th>
                  <th>Giá Bán</th>
                  <th>Số Lượng Tồn</th>
                </tr>
              </thead>
              <tbody>
                {filteredGiayChiTietList.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {/* Hiển thị ảnh giày */}
                      {item.giayEntity.anhGiayEntities.length > 0 ? (
                        <img
                          src={item.giayEntity.anhGiayEntities[0].tenUrl}
                          alt="Giày"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        <p>Không có ảnh</p>
                      )}
                    </td>
                    <td>{item.giayEntity.ten}</td>
                    <td>{item.mauSacEntity.ten}</td>
                    <td>{item.giayEntity.thuongHieu.ten}</td>
                    <td>{item.giayEntity.danhMuc.ten}</td>
                    <td>{item.kichCoEntity.ten}</td>
                    <td>{item.giaBan.toLocaleString("vi-VN")} VND</td>
                    <td>{item.soLuongTon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
