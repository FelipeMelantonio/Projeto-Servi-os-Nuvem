package com.felipe.minicontadigital.service;

import com.felipe.minicontadigital.dto.BancoResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@Service
public class BancoService {

    private static final String BANKS_URL = "https://brasilapi.com.br/api/banks/v1";

    private final RestTemplate restTemplate;

    public BancoService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public List<BancoResponse> listarBancos() {
        BancoResponse[] resposta = restTemplate.getForObject(BANKS_URL, BancoResponse[].class);
        if (resposta == null) {
            return List.of();
        }
        return Arrays.asList(resposta);
    }

    public Optional<BancoResponse> buscarPorCodigo(Integer codigo) {
        String url = BANKS_URL + "/" + codigo;
        BancoResponse banco = restTemplate.getForObject(url, BancoResponse.class);
        return Optional.ofNullable(banco);
    }
}
