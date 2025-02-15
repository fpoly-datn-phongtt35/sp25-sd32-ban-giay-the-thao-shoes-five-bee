import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from "chart.js";
import "./thongke.css";

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const ThongKe = () => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [yearlyData, setYearlyData] = useState({});
  const [monthlyData, setMonthlyData] = useState({});
  const [dailyData, setDailyData] = useState({});
  const [filterDate, setFilterDate] = useState("");

  const generateColors = (length) => {
    const colors = [];
    for (let i = 0; i < length; i++) {
      const color = `hsl(${(i * 360) / length}, 70%, 50%)`;
      colors.push(color);
    }
    return colors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hoadonResponse = await fetch("http://localhost:5000/api/hoadon");
        const hoadonData = await hoadonResponse.json();

        const stats = {};
        const yearlySales = {};
        const monthlySales = {};
        const dailySalesData = {};

        hoadonData.forEach((hoadon) => {
          const date = new Date(hoadon.ngayThanhToan || hoadon.ngayTao);
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();

          if (!stats[year]) {
            stats[year] = { totalQuantity: 0, months: {} };
          }
          if (!stats[year].months[month]) {
            stats[year].months[month] = { totalQuantity: 0, days: {} };
          }
          if (!stats[year].months[month].days[day]) {
            stats[year].months[month].days[day] = 0;
          }

          hoadon.items.forEach((item) => {
            const quantity = item.soLuong;
            stats[year].totalQuantity += quantity;
            stats[year].months[month].totalQuantity += quantity;
            stats[year].months[month].days[day] += quantity;

            if (!yearlySales[year]) yearlySales[year] = 0;
            yearlySales[year] += quantity;

            const monthKey = `${month}/${year}`;
            if (!monthlySales[monthKey]) monthlySales[monthKey] = 0;
            monthlySales[monthKey] += quantity;

            const dayKey = `${day}/${month}/${year}`;
            if (!dailySalesData[dayKey]) dailySalesData[dayKey] = 0;
            dailySalesData[dayKey] += quantity;
          });
        });

        setStatistics(stats);

        const yearColors = generateColors(Object.keys(yearlySales).length);
        const monthColors = generateColors(Object.keys(monthlySales).length);
        const dayColors = generateColors(Object.keys(dailySalesData).length);

        setYearlyData({
          labels: Object.keys(yearlySales),
          datasets: [
            {
              label: "Số Lượng Bán Theo Năm",
              data: Object.values(yearlySales),
              backgroundColor: yearColors,
              borderColor: yearColors,
              borderWidth: 1,
            },
          ],
        });

        setMonthlyData({
          labels: Object.keys(monthlySales),
          datasets: [
            {
              label: "Số Lượng Bán Theo Tháng",
              data: Object.values(monthlySales),
              backgroundColor: monthColors,
              borderColor: monthColors,
              borderWidth: 1,
            },
          ],
        });

        setDailyData({
          labels: Object.keys(dailySalesData),
          datasets: [
            {
              label: "Số Lượng Bán Theo Ngày",
              data: Object.values(dailySalesData),
              backgroundColor: dayColors,
              borderColor: dayColors,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const parseDate = (dateString) => {
    const [day, month, year] = dateString
      .split("/")
      .map((num) => parseInt(num, 10));
    return new Date(year, month - 1, day);
  };

  const handleFilterChange = (e) => {
    setFilterDate(e.target.value);
  };

  const filteredStatistics = () => {
    if (!filterDate) return statistics;

    const filterDateObj = parseDate(filterDate);
    const year = filterDateObj.getFullYear();
    const month = filterDateObj.getMonth() + 1;
    const day = filterDateObj.getDate();

    let filteredStats = { ...statistics };

    if (year) {
      filteredStats = { [year]: filteredStats[year] };
    }

    if (year && month) {
      filteredStats[year] = {
        ...filteredStats[year],
        months: { [month]: filteredStats[year].months[month] },
      };
    }

    if (year && month && day) {
      filteredStats[year].months[month] = {
        ...filteredStats[year].months[month],
        days: { [day]: filteredStats[year].months[month].days[day] },
      };
    }

    return filteredStats;
  };

  const applyFilter = () => {
    const filteredStats = filteredStatistics();

    const yearlySales = {};
    const monthlySales = {};
    const dailySalesData = {};

    Object.keys(filteredStats).forEach((year) => {
      Object.keys(filteredStats[year].months).forEach((month) => {
        Object.keys(filteredStats[year].months[month].days).forEach((day) => {
          const quantity = filteredStats[year].months[month].days[day];

          if (!yearlySales[year]) yearlySales[year] = 0;
          yearlySales[year] += quantity;

          const monthKey = `${month}/${year}`;
          if (!monthlySales[monthKey]) monthlySales[monthKey] = 0;
          monthlySales[monthKey] += quantity;

          const dayKey = `${day}/${month}/${year}`;
          if (!dailySalesData[dayKey]) dailySalesData[dayKey] = 0;
          dailySalesData[dayKey] += quantity;
        });
      });
    });

    const yearColors = generateColors(Object.keys(yearlySales).length);
    const monthColors = generateColors(Object.keys(monthlySales).length);
    const dayColors = generateColors(Object.keys(dailySalesData).length);

    setYearlyData({
      labels: Object.keys(yearlySales),
      datasets: [
        {
          label: "Số Lượng Bán Theo Năm",
          data: Object.values(yearlySales),
          backgroundColor: yearColors,
          borderColor: yearColors,
          borderWidth: 1,
        },
      ],
    });

    setMonthlyData({
      labels: Object.keys(monthlySales),
      datasets: [
        {
          label: "Số Lượng Bán Theo Tháng",
          data: Object.values(monthlySales),
          backgroundColor: monthColors,
          borderColor: monthColors,
          borderWidth: 1,
        },
      ],
    });

    setDailyData({
      labels: Object.keys(dailySalesData),
      datasets: [
        {
          label: "Số Lượng Bán Theo Ngày",
          data: Object.values(dailySalesData),
          backgroundColor: dayColors,
          borderColor: dayColors,
          borderWidth: 1,
        },
      ],
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="statistics-container">
      <h1>Thống Kê Doanh Thu</h1>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Nhập ngày (DD/MM/YYYY)"
          value={filterDate}
          onChange={handleFilterChange}
        />
        <button onClick={applyFilter}>Lọc</button>
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h2>Số Lượng Bán Theo Năm</h2>
          <Doughnut
            data={yearlyData}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.label}: ${context.raw} sản phẩm`;
                    },
                  },
                },
              },
            }}
          />
        </div>

        <div className="chart-card">
          <h2>Số Lượng Bán Theo Tháng</h2>
          <Doughnut
            data={monthlyData}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.label}: ${context.raw} sản phẩm`;
                    },
                  },
                },
              },
            }}
          />
        </div>

        <div className="chart-card">
          <h2>Số Lượng Bán Theo Ngày</h2>
          <Doughnut
            data={dailyData}
            options={{
              plugins: {
                legend: {
                  display: true,
                  position: "bottom",
                },
                tooltip: {
                  callbacks: {
                    label: function (context) {
                      return `${context.label}: ${context.raw} sản phẩm`;
                    },
                  },
                },
              },
            }}
          />
        </div>
      </div>

      <div className="table-container">
        <h2>Danh Sách Số Lượng Bán</h2>
        <table>
          <thead>
            <tr>
              <th>Năm</th>
              <th>Tháng</th>
              <th>Ngày</th>
              <th>Tổng Số Lượng Bán</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(statistics).map((year) =>
              Object.keys(statistics[year].months).map((month) =>
                Object.keys(statistics[year].months[month].days).map((day) => (
                  <tr key={`${year}-${month}-${day}`}>
                    <td>{year}</td>
                    <td>{month}</td>
                    <td>{day}</td>
                    <td>{statistics[year].months[month].days[day]}</td>
                  </tr>
                ))
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ThongKe;
