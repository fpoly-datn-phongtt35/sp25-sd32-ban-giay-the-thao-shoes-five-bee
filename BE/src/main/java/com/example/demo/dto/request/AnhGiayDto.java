package com.example.demo.dto.request;

import com.example.demo.entity.GiayEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class AnhGiayDto {
    private Integer trangThai;
    private String tenUrl;
    private UUID id;
    private GiayEntity giayEntity;
}
