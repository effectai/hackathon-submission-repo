package com.evan.effectwallet.util;

import com.evan.effectwallet.Constants;

public class UrlUtil {
    public static String createGetPricesUrl(SortBy sortBy) {
        long currentTime = System.currentTimeMillis() / 1000;
        long howManyDaysAgoInMS = 0;
        switch (sortBy) {
            case DAY:
                howManyDaysAgoInMS = currentTime - 86400;
                break;

            case WEEK:
                howManyDaysAgoInMS = currentTime - 604800;
                break;

            case MONTH:
                howManyDaysAgoInMS = currentTime - 2592000;
                break;

            case QUARTER_YEAR:
                howManyDaysAgoInMS = currentTime - 7776000;
                break;

            case HALF_YEAR:
                howManyDaysAgoInMS = currentTime - 15552000;
                break;

            case YEAR:
                howManyDaysAgoInMS = currentTime - 31536000;
                break;
        }
        StringBuilder stringBuilder = new StringBuilder(Constants.MARKET_CHART_BASE_URL);
        stringBuilder.append("from=")
                .append(howManyDaysAgoInMS)
                .append("&to=")
                .append(currentTime);
        return stringBuilder.toString();
    }

}
