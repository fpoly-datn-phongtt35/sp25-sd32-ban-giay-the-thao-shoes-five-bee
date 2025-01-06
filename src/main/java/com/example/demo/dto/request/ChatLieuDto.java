package com.example.demo.dto.request;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ChatLieuDto extends PageDto{
    private String ma;
    private String ten;
    private Integer trangThai;
}
