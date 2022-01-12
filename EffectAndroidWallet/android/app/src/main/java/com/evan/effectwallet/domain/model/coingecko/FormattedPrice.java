package com.evan.effectwallet.domain.model.coingecko;

import java.math.BigDecimal;

public class FormattedPrice {
    private String formattedTime;
    private String formattedPrice;
    private BigDecimal maxValue;
    private BigDecimal minValue;

    public FormattedPrice(String formattedTime, String formattedPrice) {
        this.formattedTime = formattedTime;
        this.formattedPrice = formattedPrice;
    }

    public BigDecimal getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(BigDecimal maxValue) {
        this.maxValue = maxValue;
    }

    public BigDecimal getMinValue() {
        return minValue;
    }

    public void setMinValue(BigDecimal minValue) {
        this.minValue = minValue;
    }


    public String getFormattedTime() {
        return formattedTime;
    }

    public String getFormattedPrice() {
        return formattedPrice;
    }

    @Override
    public String toString() {
        return "Price{" +
                "formattedPrice='" + formattedPrice + '\'' +
                ", formattedTime='" + formattedTime + '\'' +
                '}';
    }
}
