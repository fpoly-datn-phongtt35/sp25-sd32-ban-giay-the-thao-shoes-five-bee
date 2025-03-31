import React, { useState } from 'react'

const GiamGiaSanPhamChiTiet = () => {
    const [ma, setMa] = useState("");
    const [ten, setTen] = useState("");
    const [phanTramGiam, setPhamTramGiam] = useState("");
    const [ngayBatDau, setNgayBatDau] = useState("");
    const [ngayKetThuc, setNgayKetThuc] = useState("");
    const [editingDotGiamGia, setEditingDotGiamGia] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);


    return (
        <div>GiamGiaSanPhamChiTiet</div>
    )
}

export default GiamGiaSanPhamChiTiet