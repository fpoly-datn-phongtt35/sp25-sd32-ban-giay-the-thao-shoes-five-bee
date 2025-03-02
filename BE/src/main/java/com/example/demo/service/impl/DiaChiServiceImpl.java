package com.example.demo.service.impl;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.entity.DiaChiEntity;
import com.example.demo.repository.DiaChiRepository;
import com.example.demo.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DiaChiServiceImpl implements DiaChiService {

  @Autowired private DiaChiRepository diaChiRepository;

  @Override
  public List<DiaChiEntity> getListDiaChiByUser(UUID idUser) {
    return diaChiRepository.getListDiaChiByUser(idUser);
  }

  @Override
  public List<DiaChiDto> getAll() {
    List<DiaChiEntity> diaChiEntities = diaChiRepository.findAll();
    return diaChiEntities.stream()
        .map(
            diaChi -> {
              DiaChiDto diaChiDto = new DiaChiDto();
              diaChiDto.setId(diaChi.getId());
              diaChiDto.setTenDiaChi(diaChi.getTenDiaChi());
              diaChiDto.setTenNguoiNhan(diaChi.getTenNguoiNhan());
              diaChiDto.setSdtNguoiNhan(diaChi.getSdtNguoiNhan());
              diaChiDto.setXa(diaChi.getXa());
              diaChiDto.setHuyen(diaChi.getHuyen());
              diaChiDto.setThanhPho(diaChi.getThanhPho());
              diaChiDto.setTrangThai(diaChi.getTrangThai());
              diaChiDto.setUserEntity(diaChi.getUserEntity());
              return diaChiDto;
            })
        .collect(Collectors.toList());
  }

  @Override
  public DiaChiEntity add(DiaChiDto diaChiDto) {
    DiaChiEntity diaChiEntity = new DiaChiEntity();
    diaChiEntity.setXa(diaChiDto.getXa());
    diaChiEntity.setHuyen(diaChiDto.getHuyen());
    diaChiEntity.setThanhPho(diaChiDto.getThanhPho());
    diaChiEntity.setTenDiaChi(diaChiDto.getTenDiaChi());
    diaChiEntity.setSdtNguoiNhan(diaChiDto.getSdtNguoiNhan());
    diaChiEntity.setTenNguoiNhan(diaChiDto.getTenNguoiNhan());
    diaChiEntity.setTrangThai(diaChiDto.getTrangThai());
    diaChiEntity.setUserEntity(diaChiDto.getUserEntity());
    return diaChiRepository.save(diaChiEntity);
  }

  @Override
  public DiaChiEntity update(DiaChiDto diaChiDto) {
    Optional<DiaChiEntity> optional = diaChiRepository.findById(diaChiDto.getId());
    return optional
        .map(
            o -> {
              o.setXa(diaChiDto.getXa());
              o.setHuyen(diaChiDto.getHuyen());
              o.setThanhPho(diaChiDto.getThanhPho());
              o.setTenDiaChi(diaChiDto.getTenDiaChi());
              o.setTenNguoiNhan(diaChiDto.getTenNguoiNhan());
              o.setSdtNguoiNhan(diaChiDto.getSdtNguoiNhan());
              o.setTrangThai(diaChiDto.getTrangThai());
              o.setUserEntity(diaChiDto.getUserEntity());
              return diaChiRepository.save(o);
            })
        .orElse(null);
  }

  @Override
  public DiaChiEntity detail(DiaChiDto diaChiDto) {
    Optional<DiaChiEntity> optional = diaChiRepository.findById(diaChiDto.getId());
    return optional.orElse(null);
  }

  @Override
  public DiaChiEntity delete(DiaChiDto diaChiDto) {
    Optional<DiaChiEntity> optional = diaChiRepository.findById(diaChiDto.getId());
    return optional
        .map(
            o -> {
              diaChiRepository.delete(o);
              return o;
            })
        .orElse(null);
  }
}
