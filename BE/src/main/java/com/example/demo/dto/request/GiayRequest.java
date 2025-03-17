package com.example.demo.dto.request;

import com.example.demo.entity.*;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder(toBuilder = true)
@Getter
@Setter
public class GiayRequest {

  private UUID giayId;

  private List<UUID> mauSacIds;

  private List<UUID> kichCoIds;

  private BigDecimal giaBan;

  private Integer soLuongTon;

  private Integer trangThai;
}
