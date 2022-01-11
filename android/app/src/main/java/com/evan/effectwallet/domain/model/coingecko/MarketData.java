package com.evan.effectwallet.domain.model.coingecko;

import com.google.gson.annotations.SerializedName;

import java.math.BigDecimal;

public class MarketData {
    @SerializedName("price_change_percentage_24h")
    private BigDecimal changeDay;

    @SerializedName("price_change_percentage_7d")
    private BigDecimal changeWeek;

    @SerializedName("price_change_percentage_30d")
    private BigDecimal changeMonth;

    @SerializedName("price_change_percentage_60d")
    private BigDecimal changeTwoMonth;

    @SerializedName("price_change_percentage_200d")
    private BigDecimal changeSixMonth;

    @SerializedName("price_change_percentage_1y")
    private BigDecimal changeOneYear;

    public BigDecimal getChangeWeek() {
        return changeWeek;
    }

    public BigDecimal getChangeMonth() {
        return changeMonth;
    }

    public BigDecimal getChangeTwoMonth() {
        return changeTwoMonth;
    }

    public BigDecimal getChangeSixMonth() {
        return changeSixMonth;
    }

    public BigDecimal getChangeOneYear() {
        return changeOneYear;
    }

    public BigDecimal getChangeDay() {
        return changeDay;
    }
}
