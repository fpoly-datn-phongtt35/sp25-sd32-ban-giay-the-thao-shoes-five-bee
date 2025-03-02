package com.example.demo.service;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.entity.DiaChiEntity;

import java.util.List;
import java.util.UUID;

public interface DiaChiService {
  List<DiaChiEntity> getListDiaChiByUser(UUID idUser);

  List<DiaChiDto> getAll();

  DiaChiEntity add(DiaChiDto diaChiDto);

  DiaChiEntity update(DiaChiDto diaChiDto);

  DiaChiEntity detail(DiaChiDto diaChiDto);

  DiaChiEntity delete(DiaChiDto diaChiDto);
}
