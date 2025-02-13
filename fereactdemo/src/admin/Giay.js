import React, { useEffect, useState } from 'react';
import { addGiayChiTiet, detailGiayChiTiet, getAllGiayChiTiet, removeGiayChiTiet, updateGiayChiTiet } from '../service/GiayChiTietService';
import { getGiay } from '../service/GiayService';
import { Button, Form, Input, Modal, Radio, Select, Space, Table, message } from 'antd';
import { Option } from 'antd/es/mentions';
import { getMauSac } from '../service/MauSacService';
import { getSizes } from '../service/KichCoService';
import e from 'cors';

const SanPhamChiTiet = () => {
    const [giayChiTiet, setGiayChiTiet] = useState([]);
    const [giayList, setGiayList] = useState([]);
    const [value, setValue] = useState(1);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [soLuongTon1, setSoLuongTon1] = useState(null);
    const [soLuongTon2, setSoLuongTon2] = useState(null);
    const [giaBan1, setGiaBan1] = useState(null);
    const [giaBan2, setGiaBan2] = useState(null);
    const [selectedGiay1, setSelectedGiay1] = useState(null);
    const [selectedGiay2, setSelectedGiay2] = useState(null);
    const [selectedMauSac1, setSelectedMauSac1] = useState(null);
    const [selectedMauSac2, setSelectedMauSac2] = useState(null);
    const [selectdKichCo1, setSelectedKichCo1] = useState(null);
    const [selectdKichCo2, setSelectedKichCo2] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingGiayChiTiet, setEditingGiayChiTiet] = useState(null);
    const [activeChatLieu, setActiveChatLieu] = useState([]);
    const [mauSacList, setMauSacList] = useState([]);
    const [kichCoList, setKichCoList] = useState([]);

    useEffect(() => {
        getGiayData();
        getDataGiayChiTiet();
        getMauSacList();
        getKichCoList();
    }, []);

    const getGiayData = async () => {
        const result = await getGiay();
        const activeGiay = result.data.filter(item => item.trangThai === 1);
        setGiayList(activeGiay);
    };

    const getMauSacList = async () => {
        const result = await getMauSac();
        const activeMauSac = result.data.filter(item => item.trangThai === 0);
        setMauSacList(activeMauSac);
    };

    const getKichCoList = async () => {
        const result = await getSizes();
        const activeKichCo = result.data.filter(item => item.trangThai === 0);
        setKichCoList(activeKichCo);
    };

    const getDataGiayChiTiet = async () => {
        const result = await getAllGiayChiTiet();
        const dataGiayChiTiet = result.data.map((item, index) => ({
            key: index,
            ID: item.id,
            GIABAN: item.giaBan,
            SOLUONGTON: item.soLuongTon,
            GIAY: item.giay ? item.giay.ten : null,
            TRANG_THAI: item.trangThai,
            MAUSAC: item.mauSac ? item.mauSac.ten : null,
            KICHCO: item.kichCo ? item.kichCo.ten : null,
        }));
        const activeChatLieuData = dataGiayChiTiet.filter(item => item.TRANG_THAI === 0);
        setActiveChatLieu(activeChatLieuData);
        setGiayChiTiet(dataGiayChiTiet);
    };

    const creatGiayChiTiet = async () => {
        const newTrangThai1 = value === 1 ? 0 : 1;
        const newTrangThai2 = value === 1 ? 0 : 1;

        const checkGiayChiTiet = async (data) => {
            const latestData = await getAllGiayChiTiet();
            const existingGiay = latestData.data.find(item =>
                item.giay.id === data.giay.id &&
                item.mauSac.id === data.mauSac.id &&
                item.kichCo.id === data.kichCo.id
            );

            if (existingGiay) {
                const updateData = {
                    ...existingGiay,
                    soLuongTon: existingGiay.soLuongTon + parseInt(data.soLuongTon),
                    giaBan: data.giaBan,
                    trangThai: data.trangThai
                };
                await updateGiayChiTiet(existingGiay.id, updateData);
                message.success("Cập nhật số lượng thành công");
            } else {
                await addGiayChiTiet(data);
                message.success("Thêm sản phẩm chi tiết mới thành công!");
            }
        };

        try {
            if (soLuongTon1 && selectedGiay1 && selectedMauSac1 && selectdKichCo1) {
                await checkGiayChiTiet({
                    soLuongTon: soLuongTon1,
                    giaBan: giaBan1,
                    giay: { id: selectedGiay1 },
                    mauSac: { id: selectedMauSac1 },
                    kichCo: { id: selectdKichCo1 },
                    trangThai: newTrangThai1,
                });
            }
            if (soLuongTon2 && selectedGiay2 && selectedMauSac2 && selectdKichCo2) {
                await checkGiayChiTiet({
                    soLuongTon: soLuongTon2,
                    giaBan: giaBan2,
                    giay: { id: selectedGiay2 },
                    mauSac: { id: selectedMauSac2 },
                    kichCo: { id: selectdKichCo2 },
                    trangThai: newTrangThai2,
                });
            }
            await getDataGiayChiTiet();
            message.success("Thao tác thành công!");
            setSoLuongTon1("");
            setSoLuongTon2("");
            setGiaBan1("");
            setGiaBan2("");
            setSelectedMauSac1(null);
            setSelectedMauSac2(null);
            setSelectedKichCo1(null);
            setSelectedKichCo2(null);
            setSelectedGiay1(null);
            setSelectedGiay2(null);
            setValue(1);
        } catch (error) {
            message.error("Lỗi khi thực hiện thao tác: " + error.message);
        }
    };
    const deleteGiayChiTiet = async (record) => {
        try {
            await removeGiayChiTiet(record.ID);
            message.success("Xóa sản phẩm chi tiết thành công ");
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
            setSelectedMauSac1(giayChiTiet.mauSac ? giayChiTiet.mauSac.id : null);
            setSelectedKichCo1(giayChiTiet.kichCo ? giayChiTiet.kichCo.id : null);
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
            kichCo: selectdKichCo1 ? { id: selectdKichCo1 } : null,
        };

        try {
            const latestData = await getAllGiayChiTiet();
            const existingItem = latestData.data.find(item =>
                item.giay.id === newDataGiayChiTiet.giay.id &&
                item.mauSac.id === newDataGiayChiTiet.mauSac.id &&
                item.kichCo.id === newDataGiayChiTiet.kichCo.id &&
                item.id !== editingGiayChiTiet.id
            );

            if (existingItem) {
                const updatedExistingItem = {
                    ...existingItem,
                    soLuongTon: existingItem.soLuongTon + parseInt(newDataGiayChiTiet.soLuongTon),
                    giaBan: newDataGiayChiTiet.giaBan,
                    trangThai: newTrangThai
                };
                await updateGiayChiTiet(existingItem.id, updatedExistingItem);
                await removeGiayChiTiet(editingGiayChiTiet.id);

                message.success("Cập nhật và gộp số lượng thành công");
            } else {
                await updateGiayChiTiet(editingGiayChiTiet.id, newDataGiayChiTiet);
                message.success("Cập nhật thành công sản phẩm chi tiết");
            }

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
            message.error("Lỗi cập nhật sản phẩm chi tiết: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', marginLeft: '200px' }}>
                <Select placeholder='Chọn Tên Giày 1' value={selectedGiay1} onChange={setSelectedGiay1}>
                    {Array.isArray(giayList) && giayList.map(ag => (
                        <Option key={ag.id} value={ag.id}>
                            {ag.ten}
                        </Option>
                    ))}
                </Select>
                <Select placeholder='Chọn Màu Sắc 1' value={selectedMauSac1} onChange={setSelectedMauSac1}>
                    {Array.isArray(mauSacList) && mauSacList.map(ms => (
                        <Option key={ms.id} value={ms.id}>
                            {ms.ten}
                        </Option>
                    ))}
                </Select>
                <Select placeholder='Chọn Kích Cỡ 1' value={selectdKichCo1} onChange={setSelectedKichCo1}>
                    {Array.isArray(kichCoList) && kichCoList.map(kc => (
                        <Option key={kc.id} value={kc.id}>
                            {kc.ten}
                        </Option>
                    ))}
                </Select>
                <br />
                <br />
                <Input placeholder="Số Lượng Tồn 1" value={soLuongTon1} onChange={(e) => setSoLuongTon1(e.target.value)} />
                <br />
                <br />
                <Input placeholder="Giá Bán 1" value={giaBan1} onChange={(e) => setGiaBan1(e.target.value)} />
                <br />
                <br />
                <Select placeholder='Chọn Tên Giày 2' value={selectedGiay2} onChange={setSelectedGiay2}>
                    {Array.isArray(giayList) && giayList.map(ag => (
                        <Option key={ag.id} value={ag.id}>
                            {ag.ten}
                        </Option>
                    ))}
                </Select>
                <Select placeholder='Chọn Màu Sắc 2' value={selectedMauSac2} onChange={setSelectedMauSac2}>
                    {Array.isArray(mauSacList) && mauSacList.map(ms => (
                        <Option key={ms.id} value={ms.id}>
                            {ms.ten}
                        </Option>
                    ))}
                </Select>
                <Select placeholder='Chọn Kích Cỡ 2' value={selectdKichCo2} onChange={setSelectedKichCo2}>
                    {Array.isArray(kichCoList) && kichCoList.map(kc => (
                        <Option key={kc.id} value={kc.id}>
                            {kc.ten}
                        </Option>
                    ))}
                </Select>
                <br />
                <br />
                <Input placeholder="Số Lượng Tồn 2" value={soLuongTon2} onChange={(e) => setSoLuongTon2(e.target.value)} />
                <br />
                <br />
                <Input placeholder="Giá Bán 2" value={giaBan2} onChange={(e) => setGiaBan2(e.target.value)} />
                <br />
                <br />
                <Radio.Group onChange={e => setValue(e.target.value)} value={value}>
                    <Radio value={1}>Còn</Radio>
                    <Radio value={2}>Hết</Radio>
                </Radio.Group>
                <br />
                <br />
                <Button type="primary" onClick={() => creatGiayChiTiet()}>Thêm</Button>

                <Table
                    dataSource={giayChiTiet}
                    pagination={{ pageSize: 5, defaultPageSize: 5 }}
                    columns={[
                        {
                            title: 'Số Lượng Tồn',
                            dataIndex: 'SOLUONGTON',
                            key: 'SOLUONGTON',
                        },
                        {
                            title: 'Giá Bán',
                            dataIndex: 'GIABAN',
                            key: 'GIABAN',
                            render: (text) => text ? `${text.toLocaleString()} VND` : 'Chưa có giá',
                        },
                        {
                            title: 'Tên Giày',
                            dataIndex: 'GIAY',
                            key: 'GIAY',
                        },
                        {
                            title: 'Màu Sắc',
                            dataIndex: 'MAUSAC',
                            key: 'MAUSAC',
                        },
                        {
                            title: 'Kích Cỡ',
                            dataIndex: 'KICHCO',
                            key: 'KICHCO',
                        },
                        {
                            title: 'Trạng Thái',
                            dataIndex: 'TRANG_THAI',
                            key: 'TRANG_THAI',
                            render: (text) => (text === 0 ? 'Còn' : 'Hết'),
                        },
                        {
                            title: 'Action',
                            key: 'action',
                            render: (_, record) => (
                                <Space size="middle">
                                    <Button onClick={() => detail(record)}>Sửa</Button>
                                    <Button onClick={() => deleteGiayChiTiet(record)} danger>Xóa</Button>
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
                        <Form.Item label="Giày 1">
                            <Select placeholder='Chọn Tên Giày 1' value={selectedGiay1} onChange={setSelectedGiay1}>
                                {Array.isArray(giayList) && giayList.map(ag => (
                                    <Option key={ag.id} value={ag.id}>
                                        {ag.ten}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Màu Sắc 1">
                            <Select value={selectedMauSac1} onChange={setSelectedMauSac1}>
                                {Array.isArray(mauSacList) && mauSacList.map(ms => (
                                    <Option key={ms.id} value={ms.id}>
                                        {ms.ten}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Kích Cỡ 1">
                            <Select value={selectdKichCo1} onChange={setSelectedKichCo1}>
                                {Array.isArray(kichCoList) && kichCoList.map(kc => (
                                    <Option key={kc.id} value={kc.id}>
                                        {kc.ten}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Số Lượng Tồn 1">
                            <Input value={soLuongTon1} onChange={(e) => setSoLuongTon1(e.target.value)} />
                        </Form.Item>
                        <Form.Item label="Giá Bán">
                            <Input
                                value={giaBan1 || ''}
                                onChange={(e) => setGiaBan1(e.target.value ? parseFloat(e.target.value) : null)}
                            />
                        </Form.Item>
                        <Form.Item label="Trạng Thái">
                            <Radio.Group onChange={e => setValue(e.target.value)} value={value}>
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