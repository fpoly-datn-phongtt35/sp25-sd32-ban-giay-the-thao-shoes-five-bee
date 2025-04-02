import React, { useEffect, useState } from "react";
import {
  addAnhGiay,
  deleteAnhGiay,
  getAnhGiay,
} from "../service/AnhGiayService";
import {
  Button,
  Upload,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const PopupThemaAnh = ({ selectedGiayIds = [], setSelectedGiayIds }) => {
  const [anhGiay, setAnhGiay] = useState([]);
  const [value, setValue] = useState(1);
  const [file, setFile] = useState(null);

  useEffect(() => {
    getAllAnhGiay();
  }, []);

  const getAllAnhGiay = async () => {
    try {
      const result = await getAnhGiay();
      const anhGiayData = result.data.map((item, index) => ({
        key: index,
        ID: item.id,
        TENURL: item.tenUrl,
        TRANG_THAI: item.trangThai,
      }));
      setAnhGiay(anhGiayData);
    } catch (error) {
      console.error("Lỗi khi tải ảnh giày:", error);
    }
  };

  const creatAnhGiay = async () => {
    if (!file) {
      message.error("Lỗi chưa chọn file ảnh");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "data",
      new Blob([JSON.stringify({ trangThai: value })], {
        type: "application/json",
      })
    );

    try {
      await addAnhGiay(formData);
      message.success("Thêm ảnh giày thành công!");
      getAllAnhGiay();
      setFile(null);
      setValue(1);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      message.error("Có lỗi xảy ra!");
    }
  };

  const removeAnhGiay = async (record) => {
    try {
      await deleteAnhGiay(record.ID);
      message.success("Xóa thành công !");
      getAllAnhGiay();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      message.error("Có lỗi xảy ra!");
    }
  };

  const handleSelectGiay = (id) => {
    setSelectedGiayIds((prevSelectedGiayIds) => {
      const selectedImage = anhGiay.find(item => item.ID === id); // Tìm ảnh theo ID
      if (!selectedImage) return prevSelectedGiayIds; // Nếu không tìm thấy ảnh, không thay đổi
  
      const imageInfo = { id: selectedImage.ID, tenUrl: selectedImage.TENURL };
  
      // Kiểm tra xem ảnh này đã được chọn chưa
      const imageExists = prevSelectedGiayIds.some(item => item.id === imageInfo.id);
  
      if (imageExists) {
        // Nếu ảnh đã được chọn rồi, bỏ chọn
        const updatedList = prevSelectedGiayIds.filter(item => item.id !== imageInfo.id);
        console.log("Ảnh đã bỏ chọn: ", updatedList); // Log ra mảng sau khi bỏ chọn
        return updatedList;
      } else {
        // Nếu ảnh chưa có, thêm vào mảng selectedGiayIds
        const updatedList = [...prevSelectedGiayIds, imageInfo];
        console.log("Ảnh đã được chọn: ", updatedList); // Log ra mảng sau khi chọn
        return updatedList;
      }
    });
  };
  
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", marginLeft: "10px" }}>
        <Upload onChange={(info) => setFile(info.fileList[0]?.originFileObj || null)}>
          <Button icon={<UploadOutlined />}>Ấn vào để thêm ảnh</Button>
        </Upload>
        <br />
        <br />
        <Button type="primary" onClick={creatAnhGiay}>Thêm</Button>
        <br />
        <br />
        <Row gutter={[16, 16]}>
          {anhGiay.map((item, index) => (
            <Col span={4} key={index}>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelectGiay(item.ID)}
                >
                  {item.TENURL ? (
                    <img
                      src={item.TENURL}
                      alt="Ảnh giày"
                      style={{
                        width: "100%",
                        borderRadius: "5px",
                        border: selectedGiayIds?.some(selected => selected.id === item.ID) ? "2px solid blue" : "none",
                      }}
                    />
                  ) : (
                    "Không có ảnh"
                  )}
                </div>
                <Button onClick={() => removeAnhGiay(item)}>Delete</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default PopupThemaAnh;
