import React, { useEffect, useState } from "react";
import {
  addAnhGiay,
  deleteAnhGiay,
  getAnhGiay,
  updateAnhGiay,
} from "../service/AnhGiayService";
import {
  Button,
  Form,
  Modal,
  Radio,
  Space,
  Table,
  Upload,
  message,
  Row, Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const AnhSanPham = () => {
  const [anhGiay, setAnhGiay] = useState([]);
  const [value, setValue] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(null);
  const [editAnhGiay, setEditingAnhGiay] = useState(null);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [file, setFile] = useState(null);
  const [activeChatLieu, setActiveChatLieu] = useState([]);
  const getActiveChatLieu = () => {
    return anhGiay.filter((item) => item.TRANG_THAI === 0);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const onChange = (e) => {
    console.log("radio checked", e.target.value);
    setValue(e.target.value);
  };

  const trangThai = (status) => {
    return status === 0 ? "Không sử dụng" : "Đang sử dụng";
  };

  // hàm này được gọi khi file thay đổi để cập nhật trong state 'file'
  const handleUploadChange = (info) => {
    if (info.fileList.length > 0) {
      setFile(info.fileList[info.fileList.length - 1].originFileObj);
    }
  };

  useEffect(() => {
    getAllAnhGiay();
  }, []);

  const getAllAnhGiay = async () => {
    const result = await getAnhGiay();
    const anhGiayData = result.data.map((item, index) => ({
      key: index,
      ID: item.id,
      TENURL: item.tenUrl,
      TRANG_THAI: item.trangThai,
    }));
    const activeChatLieuData = anhGiayData.filter(
      (item) => item.TRANG_THAI === 0
    );
    setActiveChatLieu(activeChatLieuData);
    setAnhGiay(anhGiayData);
  };

  const creatAnhGiay = async () => {
    if (!file) {
        message.error("Lỗi chưa chọn file ảnh");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("data", new Blob([JSON.stringify({ trangThai: value })], { type: "application/json" }));

    console.log("FormData contents:", [...formData.entries()]); // Kiểm tra dữ liệu

    try {
        const result = await addAnhGiay(formData);
        console.log("API response:", result);
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
      console.log("Removing AnhGiay with ID:", record.ID);

      await deleteAnhGiay(record.ID);
      message.success("Xóa thành công !");
      getAllAnhGiay();
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      message.error("Có lỗi xảy ra!");
    }
  };

  const detailAnhGiay = (record) => {
    setEditingAnhGiay(record);
    setFile(record.file);
    setValue(record.TRANG_THAI === 0 ? 1 : 2);
    setIsModalVisible(true);
  };
  const updateAnhGiayButton = async () => {
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    formData.append("trangThai", value === 1 ? 0 : 1); // Điều chỉnh trạng thái

    try {
      // Xác thực dữ liệu trước khi gọi API
      console.log("Updating AnhGiay with ID:", editAnhGiay.ID);
      console.log("FormData:", formData);

      await updateAnhGiay(editAnhGiay.ID, formData);
      message.success("Update ảnh giày thành công!");
      getAllAnhGiay();
      setFile(null);
      setIsModalVisible(false);
      setEditingAnhGiay(null);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      message.error("Có lỗi xảy ra!");
    }
  };
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", marginLeft: "150px" }}>
        <Upload onChange={handleUploadChange}>
          <Button icon={<UploadOutlined />}>Click to Upload TENURL</Button>
        </Upload>
        <br />
        <br />
        <Radio.Group onChange={onChange} value={value}>
          <Radio value={1}>Hoạt Động</Radio>
          <Radio value={2}>Không Hoạt Động</Radio>
        </Radio.Group>
        <br />
        <br />
        <Button type="primary" onClick={creatAnhGiay}>
          Add
        </Button>
        <br />
        <br />
        <Row gutter={[16, 16]}>
          {anhGiay.map((item, index) => (
            <Col span={4} key={index}>
              <div style={{ textAlign: "center" }}>
                {item.TENURL ? (
                  <img
                    src={item.TENURL}
                    alt="Ảnh giày"
                    style={{ width: "100%", borderRadius: "5px" }}
                  />
                ) : (
                  "Không có ảnh"
                )}
                {/* <div>{trangThai(item.TRANG_THAI)}</div> */}
                <Button onClick={() => removeAnhGiay(item)}>Delete</Button>
              </div>
            </Col>
          ))}
        </Row>
      </div>
      <Modal
        title="Update Ảnh Giày"
        open={isModalVisible}
        onOk={updateAnhGiayButton}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form>
          <Form.Item label="TênURL Giày">
            <Upload onChange={handleUploadChange}>
              <Button icon={<UploadOutlined />}>Click to Upload TENURL</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="Trạng Thái">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Đang sử dụng</Radio>
              <Radio value={2}>Không sử dụng</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default AnhSanPham;
