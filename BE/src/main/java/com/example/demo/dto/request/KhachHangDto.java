package com.example.demo.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;
@Getter
@Setter
@SuperBuilder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangDto extends PageDto {
    private UUID id;
    private String ma;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private Integer trangThai;
    private List<DiaChiDto> diaChiEntities;


}
