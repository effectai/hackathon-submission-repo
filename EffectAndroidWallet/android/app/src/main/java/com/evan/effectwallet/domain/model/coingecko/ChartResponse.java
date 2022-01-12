package com.evan.effectwallet.domain.model.coingecko;

import com.google.gson.annotations.SerializedName;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ChartResponse {

    @SerializedName("prices")
    private List<List<BigDecimal>> prices;

    @SerializedName("market_caps")
    private List<List<BigDecimal>> marketCaps;

    @SerializedName("total_volumes")
    private List<List<BigDecimal>> totalVolumes;

    public List<List<BigDecimal>> getPrices() {
        return prices;
    }

    public List<List<BigDecimal>> getMarketCaps() {
        return marketCaps;
    }

    public List<List<BigDecimal>> getTotalVolumes() {
        return totalVolumes;
    }
}
