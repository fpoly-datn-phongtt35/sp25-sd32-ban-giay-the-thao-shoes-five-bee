package com.example.demo.dto.request;

import lombok.*;

import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class KichCoUpdateDto {
    private UUID id;
    private String ma;
    private String ten;
    private Integer trangThai;
}
