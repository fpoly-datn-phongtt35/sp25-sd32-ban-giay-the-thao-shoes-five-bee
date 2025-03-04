// OrderStatusPage.js
import React, { useState } from "react";
import OrderList from "./OrderList";
import "./OrderStyle.css";

export const OrderStatusPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "Tất cả Hóa đơn" },
    { id: "0", label: "Chờ Xác Nhận" },
    { id: "1", label: "Vận Chuyển" },
    { id: "2", label: "Chờ Giao Hàng" },
    { id: "3", label: "Hoàn Thành" },
    { id: "4", label: "Đã Hủy" },
    { id: "5", label: "Trả Hàng/Hoàn Tiền"},
  
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
