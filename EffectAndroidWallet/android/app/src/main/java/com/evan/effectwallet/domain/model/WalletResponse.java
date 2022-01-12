package com.evan.effectwallet.domain.model;

import androidx.annotation.NonNull;

import com.evan.effectwallet.domain.model.coingecko.FormattedPrice;
import com.evan.effectwallet.domain.model.coingecko.UnformattedPrice;
import com.evan.effectwallet.util.Change;
import com.evan.effectwallet.util.WalletStatus;

import java.util.List;

public class WalletResponse {
    private final WalletStatus           walletStatus;
    private       GetWalletResponse      getWalletResponse;
    private       AccountInfo            accountInfo;
    private       String                 msg;
    private       List<FormattedPrice>   listFormattedPrices;
    private       List<UnformattedPrice> listUnformattedPrices;
    private       Change                 change;
    private       String                 currencyValues;
    private       String                 percentChangePeriod;


    public static WalletResponse createWallet(@NonNull WalletStatus walletStatus,
                                              @NonNull AccountInfo accountInfo
    ) {
        return new WalletResponse(walletStatus, accountInfo);
    }

    public static WalletResponse getWallet(@NonNull WalletStatus walletStatus,
                                           @NonNull GetWalletResponse getWalletResponse
    ) {
        return new WalletResponse(walletStatus, getWalletResponse);
    }

    public static WalletResponse getMarketData(@NonNull WalletStatus walletStatus,
                                               @NonNull String currencyValues,
                                               @NonNull Change change,
                                               @NonNull String percentChangePeriod
    ) {
        return new WalletResponse(walletStatus, currencyValues, change, percentChangePeriod);
    }

    public static WalletResponse getUsdAmount(@NonNull WalletStatus walletStatus,
                                              @NonNull String usdAmount
    ) {
        return new WalletResponse(walletStatus, usdAmount);
    }

    public static WalletResponse getPrices(@NonNull WalletStatus walletStatus,
                                           @NonNull List<FormattedPrice> listFormattedPrices,
                                           @NonNull List<UnformattedPrice> listUnformattedPrices
    ) {
        return new WalletResponse(walletStatus, listFormattedPrices, listUnformattedPrices);
    }

    public static WalletResponse error(@NonNull WalletStatus walletStatus,
                                       @NonNull String errorMsg) {
        return new WalletResponse(walletStatus, errorMsg);
    }

    public static WalletResponse set(@NonNull WalletStatus walletStatus) {
        return new WalletResponse(walletStatus);
    }

    private WalletResponse(WalletStatus walletStatus, AccountInfo accountInfo) {
        this.walletStatus = walletStatus;
        this.accountInfo = accountInfo;
    }

    private WalletResponse(WalletStatus walletStatus, GetWalletResponse getWalletResponse) {
        this.walletStatus = walletStatus;
        this.getWalletResponse = getWalletResponse;
    }

    private WalletResponse(WalletStatus walletStatus,
                           List<FormattedPrice> listFormattedPrices,
                           List<UnformattedPrice> listUnformattedPrices
    ) {
        this.walletStatus = walletStatus;
        this.listFormattedPrices = listFormattedPrices;
        this.listUnformattedPrices = listUnformattedPrices;
    }

    private WalletResponse(WalletStatus walletStatus, String msg) {
        this.walletStatus = walletStatus;
        this.msg = msg;
    }

    private WalletResponse(WalletStatus walletStatus, String currencyValues, Change change, String percentChangePeriod) {
        this.walletStatus = walletStatus;
        this.currencyValues = currencyValues;
        this.change = change;
        this.percentChangePeriod = percentChangePeriod;
    }

    public String getCurrencyValues() {
        return currencyValues;
    }

    public String getPercentChangePeriod() {
        return percentChangePeriod;
    }

    public Change getChange() {
        return change;
    }

    private WalletResponse(WalletStatus walletStatus) {
        this.walletStatus = walletStatus;
    }

    public List<FormattedPrice> getListFormattedPrices() {
        return listFormattedPrices;
    }

    public List<UnformattedPrice> getListUnformattedPrices() {
        return listUnformattedPrices;
    }

    public WalletStatus getWalletStatus() {
        return walletStatus;
    }

    public GetWalletResponse getGetWalletResponse() {
        return getWalletResponse;
    }

    public AccountInfo getCreateWalletResponse() {
        return accountInfo;
    }

    public String getMsg() {
        return msg;
    }
}
