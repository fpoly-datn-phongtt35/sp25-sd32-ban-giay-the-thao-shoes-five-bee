import React, { useEffect, useState } from "react";
import {
  addGiay,
  deleteGiay,
  getGiay,
  getGiayDetail,
  updateGiay,
} from "../service/GiayService";
import {
  Button,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  Space,
  Table,
  message,
} from "antd";
import "./Sanpham.css";
import { getThuongHieu } from "../service/ThuongHieuService";
import { getChatLieu } from "../service/ChatLieuService";
import { getDeGiay } from "../service/DeGiayService";
import { getKieuDang } from "../service/KieuDangService";
import { getXuatXu } from "../service/XuatXuService";
import TextArea from "antd/es/input/TextArea";
import { Option } from "antd/es/mentions";
import { getSizes } from "../service/KichCoService";
import { getAnhGiay } from "../service/AnhGiayService";
import { getAllGiayChiTiet } from "../service/GiayChiTietService";

const SanPham = () => {
  const [giay, setGiay] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [value, setValue] = useState(1);
  const [ten, setTen] = useState("");
  const [moTa, setMoTa] = useState("");
  const [giaNhap, setGiaNhap] = useState("");
  const [giaBan, setGiaBan] = useState("");
  const [soLuongTon, setSoLuongTon] = useState("");
  const [giaSauKhuyenMai, setGiaSauKhuyenMai] = useState("");
  const [doHot, setDoHot] = useState("");
  const [thuongHieuList, setThuongHieuList] = useState([]);
  const [chatLieuList, setChatLieuList] = useState([]);
  const [deGiayList, setDeGiayList] = useState([]);
  const [xuatXuList, setXuatXuList] = useState([]);
  const [kieuDangList, setKieuDangList] = useState([]);
  const [anhGiayList, setAnhGiayList] = useState([]);
  const [selectedThuongHieu, setSelectedThuongHieu] = useState(null);
  const [selectedChatLieu, setSelectedChatLieu] = useState(null);
  const [selectedDeGiay, setSelectedDeGiay] = useState(null);
  const [selectedXuatXu, setSelectedXuatXu] = useState(null);
  const [selectedKieuDang, setSelectedKieuDang] = useState(null);
  const [selectedMauSac, setSelectedMauSac] = useState(null);
  const [selectdKichCo, setSelectedKichCo] = useState(null);
  const [selectedAnhGiay, setSelectedAnhGiay] = useState(null);
  const [editingGiay, setEditingGiay] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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

  useEffect(() => {
    getAllGiay();
    getThuongHieuList();
    getChatLieuList();
    getDeGiayList();
    getKieuDangList();
    getXuatXuList();
    getAnhGiayList();
  }, []);

  const getAllGiay = async () => {
    const result = await getGiay();
    const dataGiay = await Promise.all(
      result.data.map(async (item) => {
        const giayChiTietResult = await getAllGiayChiTiet();
        const relatedItems = giayChiTietResult.data.filter(
          (gct) => gct.giay && gct.giay.id === item.id
        );
        const totalSoLuongTon = relatedItems.reduce(
          (sum, gct) => sum + (gct.soLuongTon || 0),
          0
        );
        return {
          ID: item.id,
          MA: item.ma,
          TEN: item.ten,
          MOTA: item.moTa,
          GIABAN: item.giaBan,
          SOLUONGTON: totalSoLuongTon,
          TRANG_THAI: item.trangThai,
          THUONG_HIEU: item.thuongHieu ? item.thuongHieu.ten : null,
          CHAT_LIEU: item.chatLieu ? item.chatLieu.ten : null,
          DE_GIAY: item.deGiay ? item.deGiay.ten : null,
          XUAT_XU: item.xuatXu ? item.xuatXu.ten : null,
          KIEU_DANG: item.kieuDang ? item.kieuDang.ten : null,
          MAU_SAC: item.mauSac ? item.mauSac.ten : null,
          ANH_GIAY: item.anhGiay ? item.anhGiay.tenUrl : null,
          KICH_CO: item.kichCo ? item.kichCo.ten : null,
        };
      })
    );
    setGiay(dataGiay);
  };
  //viết hàm get để map lên select
  const getThuongHieuList = async () => {
    const result = await getThuongHieu();
    setThuongHieuList(result.data);
  };

  const getChatLieuList = async () => {
    const result = await getChatLieu();
    setChatLieuList(result.data);
  };

  const getDeGiayList = async () => {
    const result = await getDeGiay();
    setDeGiayList(result.data);
  };

  const getXuatXuList = async () => {
    const result = await getXuatXu();
    setXuatXuList(result.data);
  };

  const getKieuDangList = async () => {
    const result = await getKieuDang();
    setKieuDangList(result.data);
  };

  const getAnhGiayList = async () => {
    const result = await getAnhGiay();
    setAnhGiayList(result.data);
  };
  //viết handle để chạy vào state khi thay đổi trong select
  const handleThuongHieuChange = (value) => {
    console.log(value);
    setSelectedThuongHieu(value);
  };

  const handleChatLieuChange = (value) => {
    console.log(value);
    setSelectedChatLieu(value);
  };

  const handleDeGiayChange = (value) => {
    console.log(value);
    setSelectedDeGiay(value);
  };

  const handleXuatXuChange = (value) => {
    console.log(value);
    setSelectedXuatXu(value);
  };

  const handleKieuDangChange = (value) => {
    console.log(value);
    setSelectedKieuDang(value);
  };

  const handleAnhGiayChange = (value) => {
    console.log(value);
    setSelectedAnhGiay(value);
  };

  const creatGiay = async () => {
    if (!ten || !moTa || !giaBan) {
      message.error("Không được để trống ! ");
      return;
    }

    const newTrangThai = value === 1 ? 1 : 0;

    const newDataGiay = {
      ten: ten,
      moTa: moTa,
      giaBan: parseFloat(giaBan),
      soLuongTon: parseFloat(soLuongTon),
      trangThai: newTrangThai,
      //id được chọn từ danh sách nếu không có giá trị sẽ là null
      thuongHieu: selectedThuongHieu ? { id: selectedThuongHieu } : null,
      chatLieu: selectedChatLieu ? { id: selectedChatLieu } : null,
      deGiay: selectedDeGiay ? { id: selectedDeGiay } : null,
      xuatXu: selectedXuatXu ? { id: selectedXuatXu } : null,
      kieuDang: selectedKieuDang ? { id: selectedKieuDang } : null,
      mauSac: selectedMauSac ? { id: selectedMauSac } : null,
      kichCo: selectdKichCo ? { id: selectdKichCo } : null,
      anhGiay: selectedAnhGiay ? { id: selectedAnhGiay } : null,
    };
    try {
      await addGiay(newDataGiay);
      message.success("Thêm sản phẩm thành công !");
      getAllGiay();
      setTen("");
      setMoTa("");
      setGiaBan("");
      setSoLuongTon("");
      setGiaNhap("");
      setGiaSauKhuyenMai("");
      setDoHot("");
      setValue(null);
      setSelectedChatLieu(null);
      setSelectedThuongHieu(null);
      setSelectedDeGiay(null);
      setSelectedKieuDang(null);
      setSelectedXuatXu(null);
      setSelectedMauSac(null);
      setSelectedKichCo(null);
      setSelectedAnhGiay(null);
    } catch (error) {
      message.error("Lỗi thêm sản phẩm " + error.message);
    }

    setIsModalVisible1(false);
  };
  const removeGiay = async (record) => {
    try {
      await deleteGiay(record.ID);
      message.success("Xóa sản phẩm thành công");
      getAllGiay();
    } catch (error) {
      message.error("Lỗi xóa sản phẩm " + error.message);
    }
  };

  const detailGiay = async (record) => {
    console.log("ID giày là :", record.ID);
    try {
      const response = await getGiayDetail(record.ID);
      const giay = response.data;
      setEditingGiay(giay);
      setTen(giay.ten);
      setMoTa(giay.moTa);
      setGiaBan(giay.giaBan);
      setSoLuongTon(giay.soLuongTon);
      setValue(giay.trangThai === 0 ? 2 : 1);
      setSelectedThuongHieu(giay.thuongHieu ? giay.thuongHieu.id : null);
      setSelectedChatLieu(giay.chatLieu ? giay.chatLieu.id : null);
      setSelectedDeGiay(giay.deGiay ? giay.deGiay.id : null);
      setSelectedKieuDang(giay.kieuDang ? giay.kieuDang.id : null);
      setSelectedXuatXu(giay.xuatXu ? giay.xuatXu.id : null);
      setSelectedMauSac(giay.mauSac ? giay.mauSac.id : null);
      setSelectedKichCo(giay.kichCo ? giay.kichCo.id : null);
      setSelectedAnhGiay(giay.anhGiay ? giay.anhGiay.id : null);
      setIsModalVisible(true);

      console.log(giay);
    } catch (error) {
      message.error("Lỗi khi lấy chi tiết giày: " + error.message);
    }
  };

  const editGiayButton = async () => {
    console.log("ID của editingGiay:", editingGiay.id);

    const newTrangThai = value === 1 ? 1 : 0;
    const newDataGiay = {
      ten: ten,
      moTa: moTa,
      giaBan: parseFloat(giaBan),
      soLuongTon: parseFloat(soLuongTon),
      trangThai: newTrangThai,
      thuongHieu: selectedThuongHieu ? { id: selectedThuongHieu } : null,
      chatLieu: selectedChatLieu ? { id: selectedChatLieu } : null,
      deGiay: selectedDeGiay ? { id: selectedDeGiay } : null,
      xuatXu: selectedXuatXu ? { id: selectedXuatXu } : null,
      kieuDang: selectedKieuDang ? { id: selectedKieuDang } : null,
      mauSac: selectedMauSac ? { id: selectedMauSac } : null,
      kichCo: selectdKichCo ? { id: selectdKichCo } : null,
      anhGiay: selectedAnhGiay ? { id: selectedAnhGiay } : null,
    };
    try {
      await updateGiay(editingGiay.id, newDataGiay);
      message.success("Cập nhật sản phẩm thành công!");
      getAllGiay();
      resetForm();
      setIsModalVisible(false);
    } catch (error) {
      message.error(
        "Lỗi cập nhật sản phẩm: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const resetForm = () => {
    setTen("");
    setMoTa("");
    setGiaBan("");
    setSoLuongTon("");
    setValue(null);
    setSelectedChatLieu(null);
    setSelectedThuongHieu(null);
    setSelectedDeGiay(null);
    setSelectedKieuDang(null);
    setSelectedXuatXu(null);
    setSelectedMauSac(null);
    setSelectedKichCo(null);
    setSelectedAnhGiay(null);
    setEditingGiay(null);
  };

  const [isModalVisible1, setIsModalVisible1] = useState(false);
  return (
    <div className="sanpham-container" scroll={{ x: 5000 }}>
      <Button type="primary" onClick={() => setIsModalVisible1(true)}>
        Thêm Giày
      </Button>

      <Modal
        title="Thêm Giày"
        visible={isModalVisible1}
        onOk={creatGiay}
        onCancel={() => setIsModalVisible1(false)}
        okText="Thêm"
        cancelText="Hủy"
      
      >
        <div style={{float:"left",width:"45%"}}>
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn Thương Hiệu"
            value={selectedThuongHieu}
            onChange={handleThuongHieuChange}
          >
            {Array.isArray(thuongHieuList) &&
              thuongHieuList.map((th) => (
                <Option key={th.id} value={th.id}>
                  {th.ten}
                </Option>
              ))}
          </Select>
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn Chất Liệu"
            value={selectedChatLieu}
            onChange={handleChatLieuChange}
          >
            {Array.isArray(chatLieuList) &&
              chatLieuList.map((cl) => (
                <Option key={cl.id} value={cl.id}>
                  {cl.ten}
                </Option>
              ))}
          </Select>
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn Đế Giày"
            value={selectedDeGiay}
            onChange={handleDeGiayChange}
          >
            {Array.isArray(deGiayList) &&
              deGiayList.map((deg) => (
                <Option key={deg.id} value={deg.id}>
                  {deg.ten}
                </Option>
              ))}
          </Select>
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn Xuất Xứ"
            value={selectedXuatXu}
            onChange={handleXuatXuChange}
          >
            {Array.isArray(xuatXuList) &&
              xuatXuList.map((xx) => (
                <Option key={xx.id} value={xx.id}>
                  {xx.ten}
                </Option>
              ))}
          </Select>
          <br />
          <br />
          <Select
            style={{ width: "100%" }}
            placeholder="Chọn Kiểu Dáng"
            value={selectedKieuDang}
            onChange={handleKieuDangChange}
          >
            {Array.isArray(kieuDangList) &&
              kieuDangList.map((kd) => (
                <Option key={kd.id} value={kd.id}>
                  {kd.ten}
                </Option>
              ))}
          </Select>
          <br />
          <br />
        </div>
        <div style={{float:"right",width:"45%"}}>
          <Select
           style={{ width: "100%" }}
            placeholder="Chọn Ảnh Giày"
            value={selectedAnhGiay}
            onChange={handleAnhGiayChange}
          >
            {Array.isArray(anhGiayList) &&
              anhGiayList.map((ag) => (
                <Option key={ag.id} value={ag.id}>
                  {ag.tenUrl}
                </Option>
              ))}
          </Select>
          <br />
          <br />
          <Input
            style={{ width: "100%" }}
            placeholder="Tên Giày"
            value={ten}
            onChange={(e) => setTen(e.target.value)}
          />
          <br />
          <br />

          <Input
            style={{ width: "100%" }}
            placeholder="Giá Bán ($)"
            value={giaBan}
            onChange={(e) => setGiaBan(e.target.value)}
          />
          <br />
          <br />
          <Input
            style={{ width: "100%" }}
            placeholder="Số Lượng Tồn"
            value={soLuongTon}
            onChange={(e) => setSoLuongTon(e.target.value)}
          />
          <br />
          <br />
          <Radio.Group onChange={onChange} value={value}>
            <Radio value={1}>Còn</Radio>
            <Radio value={2}>Hết</Radio>
          </Radio.Group>
        </div>

        <br />

        <TextArea
          rows={4}
          placeholder="Mô Tả"
          value={moTa}
          onChange={(e) => setMoTa(e.target.value)}
        />
        <br />
        <br />
      </Modal>

      <Table
        style={{ marginLeft: "150px" }}
        pagination={{ pageSize: 5, defaultPageSize: 5 }}
        rowSelection={{ selectedRowKeys, onChange: onSelectChange }}
        columns={[
          {
            title: "Tên",
            dataIndex: "TEN",
            width: 150,
          },
          {
            title: "Giá Bán",
            dataIndex: "GIABAN",
            width: 100,
            render: (text) => {
              // Kiểm tra nếu giá trị là số, rồi định dạng với toLocaleString
              return Number(text).toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              });
            },
          },
          {
            title: "Số Lượng",
            dataIndex: "SOLUONGTON",
            width: 100,
          },
          {
            title: "Trạng Thái",
            dataIndex: "trang_thai",
            width: 150,
            render: (text, record) => trangThai(record.TRANG_THAI),
          },
          // {
          //     title: 'THUONG_HIEU', dataIndex: 'THUONG_HIEU',
          //     width: 150,
          // },
          // {
          //     title: 'CHAT_LIEU',
          //     dataIndex: 'CHAT_LIEU',
          //     width: 150,
          // },
          // {
          //     title: 'DE_GIAY',
          //     dataIndex: 'DE_GIAY',
          //     width: 150,
          // },
          // {
          //     title: 'XUAT_XU',
          //     dataIndex: 'XUAT_XU',
          //     width: 150,
          // },
          // {
          //     title: 'KIEU_DANG',
          //     dataIndex: 'KIEU_DANG',
          //     width: 150,
          // },

          {
            title: "Ảnh",
            dataIndex: "ANH_GIAY",
            width: 150,
            render: (tenUrl) => (
              <img
                src={`http://localhost:5000/upload/${tenUrl}`}
                alt={tenUrl}
                style={{ maxWidth: "100px" }}
              />
            ),
          },

          {
            title: "",
            key: "action",
            width: 150,
            render: (text, record) => (
              <Space size="middle">
                <Button onClick={() => detailGiay(record)}>Detail</Button>
                <Button onClick={() => removeGiay(record)}>Delete</Button>
              </Space>
            ),
          },
        ]}
        dataSource={giay}
      />
      <Modal
        title="Update Sản Phẩm"
        onOk={editGiayButton}
        onCancel={() => setIsModalVisible(false)}
        visible={isModalVisible}
      >
        <Form>
          <Form.Item label="Tên Giày">
            <Input value={ten} onChange={(e) => setTen(e.target.value)} />
          </Form.Item>
          <Form.Item label="Mô Tả">
            <TextArea
              rows={4}
              value={moTa}
              onChange={(e) => setMoTa(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Giá Bán">
            <Input value={giaBan} onChange={(e) => setGiaBan(e.target.value)} />
          </Form.Item>
          <Form.Item label="Số Lượng Tồn">
            <Input
              value={soLuongTon}
              onChange={(e) => setSoLuongTon(e.target.value)}
            />
          </Form.Item>

          <Form.Item label="Trạng Thái">
            <Radio.Group onChange={onChange} value={value}>
              <Radio value={1}>Còn</Radio>
              <Radio value={2}>Hết</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Thương Hiệu">
            <Select
              value={selectedThuongHieu}
              onChange={handleThuongHieuChange}
            >
              {Array.isArray(thuongHieuList) &&
                thuongHieuList.map((th) => (
                  <Option key={th.id} value={th.id}>
                    {th.ten}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Chất Liệu">
            <Select value={selectedChatLieu} onChange={handleChatLieuChange}>
              {Array.isArray(chatLieuList) &&
                chatLieuList.map((cl) => (
                  <Option key={cl.id} value={cl.id}>
                    {cl.ten}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Đế Giày">
            <Select value={selectedDeGiay} onChange={handleDeGiayChange}>
              {Array.isArray(deGiayList) &&
                deGiayList.map((deg) => (
                  <Option key={deg.id} value={deg.id}>
                    {deg.ten}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Xuất Xứ">
            <Select value={selectedXuatXu} onChange={handleXuatXuChange}>
              {Array.isArray(xuatXuList) &&
                xuatXuList.map((xx) => (
                  <Option key={xx.id} value={xx.id}>
                    {xx.ten}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Kiểu Dáng">
            <Select value={selectedKieuDang} onChange={handleKieuDangChange}>
              {Array.isArray(kieuDangList) &&
                kieuDangList.map((kd) => (
                  <Option key={kd.id} value={kd.id}>
                    {kd.ten}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Ảnh Giày">
            <Select value={selectedAnhGiay} onChange={handleAnhGiayChange}>
              {Array.isArray(anhGiayList) &&
                anhGiayList.map((ag) => (
                  <Option key={ag.id} value={ag.id}>
                    {ag.tenUrl}
                  </Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SanPham;
