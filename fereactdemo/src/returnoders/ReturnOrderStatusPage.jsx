// OrderStatusPage.js
import React, { useState } from "react";
import OrderList from "./ReturnOrderList";
import './ReturnOrderStyle.css';

export const ReturnOrderStatusPage = () => {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "5", label: "Đang xem xét" },
    { id: "6", label: "Đang trả hàng" },
    { id: "7", label: "Đã hoàn tiền" },
    { id: "8", label: "Yêu cầu THHT bị hủy/không hợp lệ" },

  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  return (
<div className="return-order-status-page">
      
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
        <OrderList status1={activeTab} />
      </div>
    </div>


  );
};
