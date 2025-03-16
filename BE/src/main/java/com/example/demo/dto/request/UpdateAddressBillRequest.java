package com.example.demo.dto.request;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UpdateAddressBillRequest {
    private String diaChi;
    private String xa;
    private String huyen;
    private String tinh;
}
