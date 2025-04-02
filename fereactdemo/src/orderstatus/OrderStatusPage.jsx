// OrderStatusPage.js
import React, { useState } from "react";
import OrderList from "./OrderList";
import "./OrderStyle.css";

export const OrderStatusPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "Tất cả Hóa đơn" },
    { id: "0", label: "Chờ Xác Nhận" },
    // { id: "1", label: "Hóa Đơn Chờ Thanh Toán" },
    { id: "3", label: "Đã Xác Nhận" },
    { id: "4", label: "Chờ Vận Chuyển" },
    { id: "5", label: "Đang Vận Chuyển" },
    { id: "6", label: "Đã Giao Hàng" },
    { id: "2", label: "Hoàn Thành" },
    { id: "7", label: "Trả Hàng"},
    { id: "8", label: "Đã Hủy" },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div>
    <div className="order-status-page">
      
      <div className="tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="orders-container">
        <OrderList status={activeTab} />
      </div>
    </div>
    </div>

  );
};
