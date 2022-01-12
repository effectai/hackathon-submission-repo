package com.evan.effectwallet.domain.model.coingecko;

import com.google.gson.annotations.SerializedName;

import java.math.BigDecimal;
import java.util.List;

public class CoinGeckoResponse {

    @SerializedName("name")
    private String networkName;

    @SerializedName("tickers")
    List<Conversions> tickers;

    @SerializedName("market_data")
    MarketData marketData;

    public MarketData getMarketData() {
        return marketData;
    }

    public String getNetworkName() {
        return networkName;
    }

    public List<Conversions> getTickers() {
        return tickers;
    }
}
