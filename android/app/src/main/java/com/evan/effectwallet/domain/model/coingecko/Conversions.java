package com.evan.effectwallet.domain.model.coingecko;

import com.google.gson.annotations.SerializedName;

public class Conversions {

    @SerializedName("base")
    private String base;

    @SerializedName("target")
    private String target;

    @SerializedName("converted_last")
    private CurrencyValues currencyValues;


    public String getBase() {
        return base;
    }

    public String getTarget() {
        return target;
    }

    public CurrencyValues getCurrencyValues() {
        return currencyValues;
    }
}
