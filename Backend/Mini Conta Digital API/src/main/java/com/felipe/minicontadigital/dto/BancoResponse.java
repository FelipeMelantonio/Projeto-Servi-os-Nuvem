package com.felipe.minicontadigital.dto;

import lombok.Data;

@Data
public class BancoResponse {
    private Integer code;
    private String name;
    private String ispb;
    private String fullName;
}
