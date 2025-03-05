package com.example.demo.dto.response;

import com.example.demo.entity.GioHangEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GioHangResponse {
    private UUID idGioHang;
    private List<GioHangChiTietResponse> gioHangChiTietResponses;
}
