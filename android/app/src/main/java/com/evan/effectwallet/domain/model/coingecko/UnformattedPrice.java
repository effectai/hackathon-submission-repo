package com.evan.effectwallet.domain.model.coingecko;

import java.math.BigDecimal;

public class UnformattedPrice {
    private int   unformattedTime;
    private float unformattedPrice;
    private BigDecimal maxValue;
    private BigDecimal minValue;

    public UnformattedPrice(int unformattedTime, float unformattedPrice) {
        this.unformattedTime = unformattedTime;
        this.unformattedPrice = unformattedPrice;
    }

    public int getUnformattedTime() {
        return unformattedTime;
    }

    public float getUnformattedPrice() {
        return unformattedPrice;
    }

    public BigDecimal getMaxValue() {
        return maxValue;
    }

    public BigDecimal getMinValue() {
        return minValue;
    }

    public void setMaxValue(BigDecimal maxValue) {
        this.maxValue = maxValue;
    }

    public void setMinValue(BigDecimal minValue) {
        this.minValue = minValue;
    }
}
