package com.example.demo.service;

import com.example.demo.dto.request.DiaChiDto;
import com.example.demo.entity.DiaChiEntity;

import java.util.List;
import java.util.UUID;

public interface DiaChiService {
    List<DiaChiDto> getAll();
    DiaChiEntity add(UUID idUser,DiaChiDto diaChiDto);
    DiaChiEntity update(UUID id,DiaChiDto diaChiDto);
    DiaChiEntity detail(DiaChiDto diaChiDto);
    boolean delete(UUID id);
    List<DiaChiEntity> getDiaChiByIdUser(UUID idUser);

}
