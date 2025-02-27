import React, { useEffect, useState } from "react";
import {
  addGiayChiTiet,
  detailGiayChiTiet,
  getAllGiayChiTiet,
  removeGiayChiTiet,
  updateGiayChiTiet,
} from "../service/GiayChiTietService";
import { getGiay, updateGiay } from "../service/GiayService";
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

import { getMauSac } from "../service/MauSacService";
import { getSizes } from "../service/KichCoService";

import "./sanphamchitiet.css";
const SanPhamChiTiet = () => {
  const [giayChiTiet, setGiayChiTiet] = useState([]);


  const [giayList, setGiayList] = useState([]);
  const [value, setValue] = useState(1);
  const [ten, setTen] = useState(null);

  const [soLuongTon1, setSoLuongTon1] = useState(null);

  const [giaBan1, setGiaBan1] = useState(null);

  const [selectedGiay1, setSelectedGiay1] = useState(null);

  const [selectedMauSac1, setSelectedMauSac1] = useState(null);

  const [selectedKichCo1, setSelectedKichCo1] = useState(null);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGiayChiTiet, setEditingGiayChiTiet] = useState(null);
  const [activeChatLieu, setActiveChatLieu] = useState([]);
  const [mauSacList, setMauSacList] = useState([]);
  const [kichCoList, setKichCoList] = useState([]);
  const { Option } = Select;
  const [isModalVisible1, setIsModalVisible1] = useState(false);

  useEffect(() => {
    getGiayData();
    getDataGiayChiTiet();
    getMauSacList();
    getKichCoList();
    getTenGiay();
  }, []);

  const getGiayData = async () => {
    const result = await getGiay();
    const activeGiay = result.data.filter((item) => item.trangThai === 1);
    setGiayList(activeGiay);
  };

  const getMauSacList = async () => {
    const result = await getMauSac();
    const activeMauSac =
      result.data.filter((item) => item.trangThai === 0) || [];
    setMauSacList(activeMauSac);
  };

  const getKichCoList = async () => {
    const result = await getSizes();
    const activeKichCo = result.data.filter((item) => item.trangThai === 0);
    setKichCoList(activeKichCo);
  };
  const getTenGiay = async () => {
    const result = await getGiay();
    const ten = result.data.map((item) => item.ten); // Lấy tất cả tên giày
    setTen(ten);
  };

  const getDataGiayChiTiet = async () => {
    const result = await getAllGiayChiTiet();

    const dataGiayChiTiet = result.data.map((item, index) => ({
      key: index,
      ID: item.id,
      TEN: item.giayEntity ? item.giayEntity.ten : null,
      GIABAN: item.giaBan,
      SOLUONGTON: item.soLuongTon,
      GIAY: item.selectedGiay1 ? item.selectedGiay1.ten : null,
      TRANG_THAI: item.trangThai,
      MAUSAC: item.mauSacEntity ? item.mauSacEntity.ten : null,
      KICHCO: item.kichCoEntity ? item.kichCoEntity.ten : null,
    }));
    console.log("data giay chi tiet", dataGiayChiTiet);

    const activeChatLieuData = dataGiayChiTiet.filter(
      (item) => item.TRANG_THAI === 0
    );
    setActiveChatLieu(activeChatLieuData);
    setGiayChiTiet(dataGiayChiTiet);
  };

  const updateGiayTotalQuantity = async (giayId) => {
    try {
      const allGiayChiTiet = await getAllGiayChiTiet();
      const relatedItems = allGiayChiTiet.data.filter(
        (item) => item.giay && item.giay.id === giayId
      );
      const totalSoLuongTon = relatedItems.reduce(
        (sum, item) => sum + (item.soLuongTon || 0),
        0
      );

      const giayInfo = await getGiay();
      const currentGiay = giayInfo.data.find((g) => g.id === giayId);

      if (currentGiay) {
        await updateGiay(giayId, {
          ...currentGiay,
          soLuongTon: totalSoLuongTon,
        });
        console.log(
          `Updated Giay ${giayId} with new total quantity: ${totalSoLuongTon}`
        );
      } else {
        console.error(`Giay with id ${giayId} not found`);
      }
    } catch (error) {
      console.error("Error updating Giay total quantity:", error);
    }
  };

  const creatGiayChiTiet = async () => {
    const newTrangThai1 = value === 1 ? 0 : 1;
  
    const checkGiayChiTiet = async (data) => {
      try {
        // 🛠 Kiểm tra dữ liệu đầu vào
        if (!data?.giayDto?.id || !data?.mauSacDto?.id || !data?.kichCoDto?.id) {
          throw new Error("Dữ liệu không hợp lệ: Một số thuộc tính bị thiếu.");
        }
  
        const giayInfo = await getGiay();
        const currentGiay = giayInfo?.data?.find((g) => g.id === data.giayDto.id);
  
        if (!currentGiay) {
          throw new Error("Không tìm thấy thông tin giày.");
        }
  
        console.log("🔹 currentGiay:", currentGiay);
  
        // 🏀 Kiểm tra giá bán
        const giaBanSP = parseFloat(currentGiay?.giaBan || 0);
        if (parseFloat(data.giaBan) < giaBanSP) {
          throw new Error(
            `Giá bán (${data.giaBan}) phải >= giá sản phẩm (${giaBanSP})`
          );
        }
  
        // 🏀 Kiểm tra giày chi tiết đã tồn tại chưa
        const latestData = await getAllGiayChiTiet();
        const existingGiay = latestData?.data?.find(
          (item) =>
            item.giay?.id === data.giayDto.id &&
            item.mauSacDto?.id === data.mauSacDto.id &&
            item.kichCoDto?.id === data.kichCoDto.id
        );
  
        if (existingGiay) {
          // ✅ Cập nhật số lượng tồn nếu đã có
          const updateData = {
            ...existingGiay,
            soLuongTon: parseInt(existingGiay.soLuongTon) + parseInt(data.soLuongTon),
            giaBan: data.giaBan,
            trangThai: data.trangThai,
          };
  
          await updateGiayChiTiet(existingGiay.id, updateData);
          message.success("Cập nhật số lượng thành công.");
        } else {
          // ✅ Thêm mới nếu chưa có
          await addGiayChiTiet({
            ...data,
            giayDto: {
              id: currentGiay.id,
              ten: currentGiay.ten, // 🏀 Thêm tên giày
            },
          });
          message.success("Thêm sản phẩm chi tiết mới thành công!");
        }
  
        console.log("🚀 Dữ liệu gửi lên updateGiay:", {
          id: currentGiay.id,
          ten: currentGiay.ten,
          soLuongTon: parseInt(data.soLuongTon),
          giaBan: giaBanSP,
          trangThai: currentGiay.trangThai ?? 1,
        });
  
      } catch (error) {
        console.error("❌ Lỗi trong checkGiayChiTiet:", error);
        throw error;
      }
    };
  
    try {
      // 🏀 Kiểm tra dữ liệu đầu vào trước khi gửi
      if (!soLuongTon1 || !selectedGiay1 || !selectedMauSac1 || !selectedKichCo1) {
        message.error("Vui lòng nhập đầy đủ thông tin trước khi thêm!");
        return;
      }
  
      console.log("📤 Dữ liệu gửi lên BE:", {
        ten,
        soLuongTon1,
        giaBan1,
        selectedGiay1,
        selectedMauSac1,
        selectedKichCo1,
      });
  
      // 🏀 Gọi `checkGiayChiTiet` với dữ liệu đầy đủ
      await checkGiayChiTiet({
        soLuongTon: parseInt(soLuongTon1), // Ép kiểu số nguyên
        giaBan: parseFloat(giaBan1), // Ép kiểu số
        giayDto: { id: selectedGiay1 },
        mauSacDto: { id: selectedMauSac1 },
        kichCoDto: { id: selectedKichCo1 },
        trangThai: newTrangThai1,
      });
  
      // Cập nhật lại danh sách giày chi tiết
      await getDataGiayChiTiet();
  
      message.success("Thao tác thành công!");
  
      // Reset form
      setSoLuongTon1("");
      setGiaBan1("");
      setSelectedMauSac1(null);
      setSelectedKichCo1(null);
      setSelectedGiay1(null);
      setValue(1);
    } catch (error) {
      console.error("❌ Lỗi khi thêm giày chi tiết:", error);
      message.error("Lỗi khi thực hiện thao tác: " + error.message);
    }
  
    setIsModalVisible1(false);
  };
  

  const deleteGiayChiTiet = async (record) => {
    try {
      await removeGiayChiTiet(record.ID);
      message.success("Xóa sản phẩm chi tiết thành công ");
      await updateGiayTotalQuantity(record.GIAY_ID);
      getDataGiayChiTiet();
    } catch (error) {
      message.error("Xóa sản phẩm chi tiết thất bại");
    }
  };

  const detail = async (record) => {
    try {
      const response = await detailGiayChiTiet(record.ID);
      const giayChiTiet = response.data;
      setEditingGiayChiTiet(giayChiTiet);
      setGiaBan1(giayChiTiet.giaBan);
      setSoLuongTon1(giayChiTiet.soLuongTon); // Cập nhật số lượng tồn cho sản phẩm 1
      setValue(giayChiTiet.trangThai === 0 ? 1 : 2);
      setSelectedMauSac1(
        giayChiTiet.mauSacDto ? giayChiTiet.mauSacDto.id : null
      );
      setSelectedKichCo1(
        giayChiTiet.kichCoDto ? giayChiTiet.kichCoDto.id : null
      );
      setSelectedGiay1(giayChiTiet.giay ? giayChiTiet.giay.id : null);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi detail giày chi tiết");
    }
  };

  const editGiayChiTietButton = async () => {
    const newTrangThai = value === 1 ? 0 : 1;
    const newDataGiayChiTiet = {
      soLuongTon: soLuongTon1,
      giaBan: giaBan1,
      giay: selectedGiay1 ? { id: selectedGiay1 } : null,
      trangThai: newTrangThai,
      mauSac: selectedMauSac1 ? { id: selectedMauSac1 } : null,
      kichCo: selectedKichCo1 ? { id: selectedKichCo1 } : null,
    };
    try {
      const latestData = await getAllGiayChiTiet();
      const existingItems = latestData.data.filter(
        (item) =>
          item.giay.id === newDataGiayChiTiet.giay.id &&
          item.mauSac.id === newDataGiayChiTiet.mauSac.id &&
          item.kichCo.id === newDataGiayChiTiet.kichCo.id &&
          item.id !== editingGiayChiTiet.id
      );
      if (existingItems.length > 0) {
        const priceMatches = existingItems.every(
          (item) =>
            parseFloat(item.giaBan) === parseFloat(newDataGiayChiTiet.giaBan)
        );

        if (!priceMatches) {
          message.error(
            "Giá bán phải bằng nhau cho các giày chi tiết có cùng giày, màu sắc và kích cỡ."
          );
          return;
        }
        const existingItem = existingItems[0];
        const updatedExistingItem = {
          ...existingItem,
          soLuongTon:
            existingItem.soLuongTon + parseInt(newDataGiayChiTiet.soLuongTon),
          giaBan: newDataGiayChiTiet.giaBan,
          trangThai: newTrangThai,
        };
        await updateGiayChiTiet(existingItem.id, updatedExistingItem);
        await removeGiayChiTiet(editingGiayChiTiet.id);
        message.success("Cập nhật và gộp số lượng thành công");
      } else {
        await updateGiayChiTiet(editingGiayChiTiet.id, newDataGiayChiTiet);
        message.success("Cập nhật thành công sản phẩm chi tiết");
      }
      await updateGiayTotalQuantity(newDataGiayChiTiet.giay.id);
      getDataGiayChiTiet();
      setIsModalVisible(false);
      setSoLuongTon1("");
      setGiaBan1("");
      setSelectedMauSac1(null);
      setSelectedKichCo1(null);
      setValue(1);
      setSelectedGiay1(null);
      setEditingGiayChiTiet(null);
    } catch (error) {
      message.error(
        "Lỗi cập nhật sản phẩm chi tiết: "(
          error.response?.data?.message || error.message
        )
      );
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", marginLeft: "200px" }}>
        <Button type="primary" onClick={() => setIsModalVisible1(true)}>
          Thêm Giày Chi Tiết
        </Button>

        <Modal
          title="Thêm Giày Chi Tiết"
          visible={isModalVisible1}
          onOk={creatGiayChiTiet}
          onCancel={() => setIsModalVisible1(false)}
          okText="Thêm"
          cancelText="Hủy"
          className="customModal"
        >
          <div className="modalContent">
            <div className="hi">
              <div className="modalContent_product">
                <h6>Chọn sản phẩm 1</h6>
                <Select
                  placeholder="Chọn Tên Giày"
                  value={selectedGiay1}
                  onChange={setSelectedGiay1}
                >
                  {Array.isArray(giayList) &&
                    giayList.map((ag) => (
                      <Option key={ag.id} value={ag.id}>
                        {ag.ten}
                      </Option>
                    ))}
                </Select>
                <br />
                <br />
                <Select
                  placeholder="Chọn Màu Sắc"
                  value={selectedMauSac1}
                  onChange={setSelectedMauSac1}
                >
                  {Array.isArray(mauSacList) &&
                    mauSacList.map((ms) => (
                      <Option key={ms.id} value={ms.id}>
                        {ms.ten}
                      </Option>
                    ))}
                </Select>
                <br />
                <br />
                <Select
                  placeholder="Chọn Kích Cỡ"
                  value={selectedKichCo1}
                  onChange={setSelectedKichCo1}
                >
                  {Array.isArray(kichCoList) &&
                    kichCoList.map((kc) => (
                      <Option key={kc.id} value={kc.id}>
                        {kc.ten}
                      </Option>
                    ))}
                </Select>
                <br />
                <br />
                <Input
                  placeholder="Số Lượng Tồn"
                  value={soLuongTon1}
                  onChange={(e) => setSoLuongTon1(e.target.value)}
                />
                <br />
                <br />
                <Input
                  placeholder="Giá Bán"
                  value={giaBan1}
                  onChange={(e) => setGiaBan1(e.target.value)}
                />
                <br />
                <br />
              </div>
            </div>
            <Radio.Group
              onChange={(e) => setValue(e.target.value)}
              value={value}
            >
              <Radio value={1}>Còn</Radio>
              <Radio value={2}>Hết</Radio>
            </Radio.Group>
          </div>
        </Modal>
        <Table
          dataSource={giayChiTiet}
          pagination={{ pageSize: 5, defaultPageSize: 5 }}
          columns={[
            {
              title: "Số Lượng Tồn",
              dataIndex: "SOLUONGTON",
              key: "SOLUONGTON",
            },
            {
              title: "Giá Bán",
              dataIndex: "GIABAN",
              key: "GIABAN",
              render: (text) =>
                text ? `${text.toLocaleString()} VND` : "Chưa có giá",
            },
            {
              title: "Tên Giày",
              dataIndex: "TEN",
              key: "GIAY",
            },
            {
              title: "Màu Sắc",
              dataIndex: "MAUSAC",
              key: "MAUSAC",
            },
            {
              title: "Kích Cỡ",
              dataIndex: "KICHCO",
              key: "KICHCO",
            },
            {
              title: "Trạng Thái",
              dataIndex: "TRANG_THAI",
              key: "TRANG_THAI",
              render: (text) => (text === 0 ? "Còn" : "Hết"),
            },
            {
              title: "Action",
              key: "action",
              render: (_, record) => (
                <Space size="middle">
                  <Button onClick={() => detail(record)}>Sửa</Button>
                  <Button onClick={() => deleteGiayChiTiet(record)} danger>
                    Xóa
                  </Button>
                </Space>
              ),
            },
          ]}
        />

        <Modal
          title="Update"
          onOk={editGiayChiTietButton}
          onCancel={() => setIsModalVisible(false)}
          visible={isModalVisible}
        >
          <Form>
            <Form.Item label="Giày">
              <Select
                placeholder="Chọn Tên Giày"
                value={selectedGiay1}
                onChange={setSelectedGiay1}
              >
                {Array.isArray(giayList) &&
                  giayList.map((ag) => (
                    <Option key={ag.id} value={ag.id}>
                      {ag.ten}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Màu Sắc">
              <Select value={selectedMauSac1} onChange={setSelectedMauSac1}>
                {Array.isArray(mauSacList) &&
                  mauSacList.map((ms) => (
                    <Option key={ms.id} value={ms.id}>
                      {ms.ten}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Kích Cỡ">
              <Select value={selectedKichCo1} onChange={setSelectedKichCo1}>
                {Array.isArray(kichCoList) &&
                  kichCoList.map((kc) => (
                    <Option key={kc.id} value={kc.id}>
                      {kc.ten}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item label="Số Lượng Tồn">
              <Input
                value={soLuongTon1}
                onChange={(e) => setSoLuongTon1(e.target.value)}
              />
            </Form.Item>
            <Form.Item label="Giá Bán">
              <Input
                value={giaBan1 || ""}
                onChange={(e) =>
                  setGiaBan1(e.target.value ? parseFloat(e.target.value) : null)
                }
              />
            </Form.Item>
            <Form.Item label="Trạng Thái">
              <Radio.Group
                onChange={(e) => setValue(e.target.value)}
                value={value}
              >
                <Radio value={1}>Còn</Radio>
                <Radio value={2}>Hết</Radio>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default SanPhamChiTiet;
