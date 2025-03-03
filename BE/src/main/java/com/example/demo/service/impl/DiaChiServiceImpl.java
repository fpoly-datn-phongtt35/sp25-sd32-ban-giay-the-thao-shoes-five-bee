package com.example.demo.service.impl;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.entity.UserEntity;
import com.example.demo.repository.DiaChiRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.DiaChiService;
import com.example.demo.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DiaChiServiceImpl implements DiaChiService {

    @Autowired
    private DiaChiRepository diaChiRepository;

    @Autowired
    private UsersService usersService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public List<DiaChiDto> getAll() {
        List<DiaChiEntity> diaChiEntities = diaChiRepository.findAll();
        return diaChiEntities.stream().map(diaChi ->{
            DiaChiDto diaChiDto = new DiaChiDto();
            diaChiDto.setId(diaChi.getId());
            diaChiDto.setTenDiaChi(diaChi.getTenDiaChi());
            diaChiDto.setTenNguoiNhan(diaChi.getTenNguoiNhan());
            diaChiDto.setSdtNguoiNhan(diaChi.getSdtNguoiNhan());
            diaChiDto.setXa(diaChi.getXa());
            diaChiDto.setHuyen(diaChi.getHuyen());
            diaChiDto.setThanhPho(diaChi.getThanhPho());
            diaChiDto.setTrangThai(diaChi.getTrangThai());
            diaChiDto.setIdUser(diaChi.getUserEntity().getId());
            return diaChiDto;
        }).collect(Collectors.toList());
    }

    @Override
    public DiaChiEntity add(UUID idUser,DiaChiDto diaChiDto) {
        UserEntity userEntity = usersService.details(idUser);
        if(diaChiDto.getTrangThai() == 1){
            diaChiRepository.updateTrangThaiToZero(idUser);
        }
        DiaChiEntity diaChiEntity = new DiaChiEntity();
        diaChiEntity.setXa(diaChiDto.getXa());
        diaChiEntity.setHuyen(diaChiDto.getHuyen());
        diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
        diaChiEntity.setTenDiaChi(diaChiDto.getTenDiaChi());
        diaChiEntity.setDiaChiCuThe(diaChiDto.getDiaChiCuThe());
        diaChiEntity.setSdtNguoiNhan(diaChiDto.getSdtNguoiNhan());
        diaChiEntity.setTenNguoiNhan(diaChiDto.getTenNguoiNhan());
        diaChiEntity.setTrangThai(diaChiDto.getTrangThai());
        diaChiEntity.setUserEntity(userEntity);
        return diaChiRepository.save(diaChiEntity);
    }

    @Override
    public DiaChiEntity update(UUID id,DiaChiDto diaChiDto) {
        Optional<DiaChiEntity> optional = diaChiRepository.findById(id);
        return optional.map(o->{
            o.setXa(diaChiDto.getXa());
            o.setHuyen(diaChiDto.getHuyen());
            o.setThanhPho(diaChiDto.getThanhPho());
            o.setTenDiaChi(diaChiDto.getTenDiaChi());
            o.setDiaChiCuThe(diaChiDto.getDiaChiCuThe());
            o.setTenNguoiNhan(diaChiDto.getTenNguoiNhan());
            o.setSdtNguoiNhan(diaChiDto.getSdtNguoiNhan());
            o.setTrangThai(diaChiDto.getTrangThai());
            if (diaChiDto.getIdUser() != null) {
                UserEntity user = userRepository.findById(diaChiDto.getIdUser()).orElse(null);
                if (user != null) {
                    o.setUserEntity(user);
                } else {
                    System.out.println("Không tìm thấy User với ID: " + diaChiDto.getIdUser());
                }
            }            return diaChiRepository.save(o);
        }).orElse(null);
    }

    @Override
    public DiaChiEntity detail(DiaChiDto diaChiDto) {
        Optional<DiaChiEntity> optional = diaChiRepository.findById(diaChiDto.getId());
        return optional.orElse(null);
    }

    @Override
    public boolean delete(UUID id) {
        Optional<DiaChiEntity> optionalDiaChi = diaChiRepository.findById(id);
        if (optionalDiaChi.isPresent()) {
            diaChiRepository.delete(optionalDiaChi.get());
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<DiaChiEntity> getDiaChiByIdUser(UUID idUser) {
        return diaChiRepository.findByIdUser(idUser);
    }
}
