package com.evan.effectwallet.util;

import com.evan.effectwallet.domain.model.coingecko.MarketData;

import java.math.BigDecimal;

public class SortByUtil {
    public static String getPercentChangePeriod(SortBy sortBy) {
        switch (sortBy) {
            case DAY:
                return "Past day";
            case WEEK:
                return "Past week";
            case MONTH:
                return "Past month";
            case QUARTER_YEAR:
                return "Past 60d";
            case HALF_YEAR:
                return "Past 200d";
            case YEAR:
                return "Past year";
            default:
                throw new IllegalArgumentException();
        }
    }

    public static BigDecimal getChange(SortBy sortBy, MarketData marketData) {
        switch (sortBy) {
            case DAY:
                return marketData.getChangeDay();
            case WEEK:
                return marketData.getChangeWeek();
            case MONTH:
                return marketData.getChangeMonth();
            case QUARTER_YEAR:
                return marketData.getChangeTwoMonth();
            case HALF_YEAR:
                return marketData.getChangeSixMonth();
            case YEAR:
                return marketData.getChangeOneYear();
            default:
                throw new IllegalArgumentException();
        }
    }
}
