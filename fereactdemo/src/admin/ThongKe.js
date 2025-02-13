import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import "./thongke.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement, ChartDataLabels);

const Statistics = () => {
  const [yearlyChartData, setYearlyChartData] = useState({});
  const [monthlyChartData, setMonthlyChartData] = useState({});
  const [dailyChartData, setDailyChartData] = useState({});
  const [invoiceData, setInvoiceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hoadon");
        const data = await response.json();
        processData(data);
        setFilteredData(data); // Initialize filtered data
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  const generateColors = (count) => {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
    ];
    return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
  };

  const processData = (data) => {
    const yearlyRevenue = {};
    const monthlyRevenue = {};
    const dailyRevenue = {};

    data.forEach((invoice) => {
      const date = new Date(invoice.ngayTao);
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      if (!yearlyRevenue[year]) yearlyRevenue[year] = 0;
      yearlyRevenue[year] += invoice.tongTien;

      if (!monthlyRevenue[year]) monthlyRevenue[year] = {};
      if (!monthlyRevenue[year][month]) monthlyRevenue[year][month] = 0;
      monthlyRevenue[year][month] += invoice.tongTien;

      const dayKey = `${year}-${month}-${day}`;
      if (!dailyRevenue[dayKey]) dailyRevenue[dayKey] = 0;
      dailyRevenue[dayKey] += invoice.tongTien;
    });

    const labelsYear = Object.keys(yearlyRevenue);
    const labelsMonth = Object.keys(monthlyRevenue).flatMap((year) =>
      Object.keys(monthlyRevenue[year]).map((month) => `${month}/${year}`)
    );
    const labelsDay = Object.keys(dailyRevenue);

    const colorsYear = generateColors(labelsYear.length);
    const colorsMonth = generateColors(labelsMonth.length);
    const colorsDay = generateColors(labelsDay.length);

    const datasetsYear = [
      {
        data: Object.values(yearlyRevenue),
        backgroundColor: colorsYear,
        borderColor: colorsYear.map((color) => color.replace("0.2", "1")),
        borderWidth: 1,
        hoverOffset: 4,
      },
    ];

    const datasetsMonth = [
      {
        data: Object.keys(monthlyRevenue).flatMap((year) =>
          Object.keys(monthlyRevenue[year]).map(
            (month) => monthlyRevenue[year][month]
          )
        ),
        backgroundColor: colorsMonth,
        borderColor: colorsMonth.map((color) => color.replace("0.2", "1")),
        borderWidth: 1,
      },
    ];

    const datasetsDay = [
      {
        data: Object.values(dailyRevenue),
        backgroundColor: colorsDay,
        borderColor: colorsDay.map((color) => color.replace("0.2", "1")),
        borderWidth: 1,
      },
    ];

    setYearlyChartData({
      labels: labelsYear,
      datasets: datasetsYear,
    });

    setMonthlyChartData({
      labels: labelsMonth,
      datasets: datasetsMonth,
    });

    setDailyChartData({
      labels: labelsDay,
      datasets: datasetsDay,
    });

    setInvoiceData(data); // Update invoice data for the table
    setLoading(false);
  };

  const filterData = () => {
    const filtered = invoiceData.filter((invoice) => {
      const date = new Date(invoice.ngayTao);
      const formattedDate = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return filterText ? formattedDate === filterText : true;
    });
    setFilteredData(filtered);
  };

  const calculateTotalRevenueByDate = (data) => {
    return data.reduce((acc, invoice) => {
      const date = new Date(invoice.ngayTao);
      const dayKey = date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      if (!acc[dayKey]) acc[dayKey] = 0;
      acc[dayKey] += invoice.tongTien;
      return acc;
    }, {});
  };

  useEffect(() => {
    filterData();
  }, [filterText]);

  const totalRevenueByDate = calculateTotalRevenueByDate(filteredData);

  return (
    <div className="statistics-container">
      <h1>Thống Kê Doanh Thu</h1>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div>
          <div className="filters-container">
            <input
              type="text"
              placeholder="Nhập ngày (dd/mm/yyyy)"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <button onClick={filterData}>Lọc</button>
          </div>
          <div className="charts-container">
            <div className="chart-card">
              <h2>Doanh Thu Theo Năm</h2>
              <Doughnut
                data={yearlyChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "#000",
                        font: { size: 14 },
                        generateLabels: (chart) => {
                          const dataset = chart.data.datasets[0];
                          return chart.data.labels.map((label, i) => ({
                            text: `${label}: ${dataset.data[i].toLocaleString(
                              "vi-VN",
                              { style: "currency", currency: "VND" }
                            )}`,
                            fillStyle: dataset.backgroundColor[i],
                          }));
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${
                            context.label
                          }: ${context.raw.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="chart-card">
              <h2>Doanh Thu Theo Tháng</h2>
              <Doughnut
                data={monthlyChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "#000",
                        font: { size: 14 },
                        generateLabels: (chart) => {
                          const dataset = chart.data.datasets[0];
                          return chart.data.labels.map((label, i) => ({
                            text: `${label}: ${dataset.data[i].toLocaleString(
                              "vi-VN",
                              { style: "currency", currency: "VND" }
                            )}`,
                            fillStyle: dataset.backgroundColor[i],
                          }));
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${
                            context.label
                          }: ${context.raw.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
            <div className="chart-card">
              <h2>Doanh Thu Theo Ngày</h2>
              <Doughnut
                data={dailyChartData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: "top",
                      labels: {
                        color: "#000",
                        font: { size: 14 },
                        generateLabels: (chart) => {
                          const dataset = chart.data.datasets[0];
                          return chart.data.labels.map((label, i) => ({
                            text: `${label}: ${dataset.data[i].toLocaleString(
                              "vi-VN",
                              { style: "currency", currency: "VND" }
                            )}`,
                            fillStyle: dataset.backgroundColor[i],
                          }));
                        },
                      },
                    },
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${
                            context.label
                          }: ${context.raw.toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })}`;
                        },
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
          <div className="data-table-container">
            <h2>Danh Sách Hóa Đơn</h2>
            <table>
              <thead>
                <tr>
                  <th>Ngày</th>
                  <th>Tổng Tiền</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(totalRevenueByDate).map(([date, revenue]) => (
                  <tr key={date}>
                    <td>{date}</td>
                    <td>
                      {revenue.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </td>
                  </tr>
                ))}
                {Object.keys(totalRevenueByDate).length === 0 && (
                  <tr>
                    <td colSpan="2">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics;
