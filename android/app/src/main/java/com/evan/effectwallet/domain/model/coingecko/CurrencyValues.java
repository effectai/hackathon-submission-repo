package com.evan.effectwallet.domain.model.coingecko;

import com.google.gson.annotations.SerializedName;

import java.math.BigDecimal;

public class CurrencyValues {
    @SerializedName("btc")
    private BigDecimal btc;

    @SerializedName("eth")
    private BigDecimal eth;

    @SerializedName("usd")
    private BigDecimal usd;

    public BigDecimal getBtc() {
        return btc;
    }

    public BigDecimal getEth() {
        return eth;
    }

    public BigDecimal getUsd() {
        return usd;
    }
}
