package com.evan.effectwallet.ui;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.evan.effectwallet.BaseApplication;
import com.evan.effectwallet.Constants;
import com.evan.effectwallet.R;
import com.evan.effectwallet.domain.LocalRepository;
import com.evan.effectwallet.domain.RemoteRepository;
import com.evan.effectwallet.domain.model.Campaign;
import com.evan.effectwallet.domain.model.WalletResponse;
import com.evan.effectwallet.domain.model.coingecko.FormattedPrice;
import com.evan.effectwallet.domain.model.coingecko.UnformattedPrice;
import com.evan.effectwallet.util.Change;
import com.evan.effectwallet.util.SortBy;
import com.evan.effectwallet.util.SortByUtil;
import com.evan.effectwallet.util.StreamUtil;
import com.evan.effectwallet.util.UrlUtil;
import com.evan.effectwallet.util.WalletStatus;
import com.google.gson.Gson;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class MainViewModel extends ViewModel {

    private static final String TAG = "MainViewModel";

    private final MutableLiveData<WalletResponse> walletStatusLiveData = new MutableLiveData<>();
    private final RemoteRepository                remoteRepository;
    private final LocalRepository                 localRepository;
    private final List<Campaign>                  listCampaigns        = new ArrayList<>();
    private final BaseApplication                 baseApplication;
    private       SortBy                          sortBy               = SortBy.DAY;
    private       BigDecimal                      usdPerEfx;
    private       BigDecimal                      priceChangePercent;
    private       BigDecimal                      walletBalance;
    private       SimpleDateFormat                dateFormat;

    @Inject
    public MainViewModel(BaseApplication baseApplication,
                         RemoteRepository remoteRepository,
                         LocalRepository localRepository
    ) {
        this.baseApplication = baseApplication;
        this.remoteRepository = remoteRepository;
        this.localRepository = localRepository;

        if (localRepository.getIsPrivateKeyWalletAdded()) {
            getWalletBalance(localRepository.getAccountName());
        } else {
            walletStatusLiveData.setValue(WalletResponse.set(WalletStatus.DEFAULT));
        }
        dateFormat = new SimpleDateFormat(Constants.DATE_PATTERN_HOUR, Locale.US);


        sortChart(sortBy);

    }

    public void createWallet() {
        walletStatusLiveData.setValue(WalletResponse.set(
                WalletStatus.CREATE_WALLET_LOADING
        ));

        remoteRepository.createWallet()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(createWalletResponse -> {
                    Log.d(TAG, "createWallet: " + createWalletResponse.toString());
                    walletStatusLiveData.setValue(WalletResponse.createWallet(
                            WalletStatus.CREATE_WALLET_SUCCESS,
                            createWalletResponse
                    ));
                    getWalletBalance(createWalletResponse.getAccountName());
                    localRepository.setIsPrivateKeyWalletAdded(true);
                    localRepository.setPublicAddress(createWalletResponse.getAddress());
                    localRepository.setPrivateKey(createWalletResponse.getPrivateKey());
                    localRepository.setAccountName(createWalletResponse.getAccountName());
                    localRepository.setAccountId(createWalletResponse.getAccountId());
                }, exception -> {
                    Log.e(TAG, "createWallet: Failed: ", exception);
                    walletStatusLiveData.setValue(WalletResponse.error(
                            WalletStatus.CREATE_WALLET_ERROR,
                            "Failed to create wallet"
                    ));
                });
    }

    public void getWalletBalance(String accountName) {
        walletStatusLiveData.setValue(WalletResponse.set(
                WalletStatus.GET_WALLET_BALANCE_LOADING
        ));

        remoteRepository.getWalletBalance(accountName)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(getWalletResponse -> {
                    Log.d(TAG, "getWalletBalance: " + getWalletResponse.toString());
                    walletStatusLiveData.postValue(WalletResponse.getWallet(
                            WalletStatus.GET_WALLET_BALANCE_SUCCESS,
                            getWalletResponse
                    ));

                    String[] efx = getWalletResponse.getQuantity().split(" ");
                    walletBalance = new BigDecimal(efx[0]);
                    getBalanceUsd(walletBalance);
                }, exception -> {
                    Log.e(TAG, "getWalletBalance: Failed: ", exception);
                    walletStatusLiveData.postValue(WalletResponse.error(
                            WalletStatus.GET_WALLET_BALANCE_ERROR,
                            "Failed to get wallet balance"
                    ));
                });
    }

    public void getBalanceUsd(BigDecimal walletBalance) {
        remoteRepository.getCoinGeckoData()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    Log.d(TAG, "getCoinGeckoData: Price change percent: " + priceChangePercent);
                    BigDecimal usdPerEfx = response.getTickers().get(0).getCurrencyValues().getUsd();

                    BigDecimal totalAmountInUsd = walletBalance.multiply(usdPerEfx)
                            .setScale(2, RoundingMode.CEILING);
                    String result = "(".concat(totalAmountInUsd.toString())
                            .concat(" USD")
                            .concat(")");

                    Log.d(TAG, "getWalletBalanceUsd: Result: " + result);

                    getWalletStatusLiveData().postValue(WalletResponse.getUsdAmount(
                            WalletStatus.GET_WALLET_BALANCE_USD,
                            result
                    ));
                }, exception -> {
                    Log.e(TAG, "getWalletBalanceUsd: Failed: ", exception);
                });
    }

    public void addWalletWithPrivateKey(String privateKey) {
        if (privateKey.equals("")) {
            walletStatusLiveData.setValue(WalletResponse.error(
                    WalletStatus.INPUT_ERROR,
                    "Enter private key"
            ));
            return;
        }
        getAccountInfo(privateKey);
    }

    public void getAccountInfo(String privateKey) {
        walletStatusLiveData.setValue(WalletResponse.set(WalletStatus.WALLET_ADD_LOADING));

        remoteRepository.getAccount(privateKey)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(accountInfo -> {
                    Log.d(TAG, "accountInfo: " + accountInfo.toString());
                    localRepository.setIsPrivateKeyWalletAdded(true);
                    localRepository.setPublicAddress(accountInfo.getAddress());
                    localRepository.setPrivateKey(accountInfo.getPrivateKey());
                    localRepository.setAccountName(accountInfo.getAccountName());
                    localRepository.setAccountId(accountInfo.getAccountId());

                    walletStatusLiveData.setValue(WalletResponse.set(
                            WalletStatus.WALLET_ADD_SUCCESS
                    ));

                    getWalletBalance(accountInfo.getAccountName());
                }, exception -> {
                    Log.e(TAG, "accountInfo: Failed: ", exception);
                    walletStatusLiveData.setValue(WalletResponse.error(
                            WalletStatus.WALLET_ADD_ERROR, "Failed to add wallet"
                    ));
                });
    }

    public void getMarketData() {
        remoteRepository.getCoinGeckoData()
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    priceChangePercent = SortByUtil.getChange(sortBy, response.getMarketData())
                            .setScale(2, RoundingMode.CEILING);

                    Log.d(TAG, "getCoinGeckoData: Price change percent: " + priceChangePercent);
                    usdPerEfx = response.getTickers().get(0).getCurrencyValues().getUsd();

                    Change change;
                    if (priceChangePercent.compareTo(BigDecimal.ZERO) > 0) {
                        change = Change.POSITIVE;
                    } else {
                        change = Change.NEGATIVE;
                    }

                    StringBuilder currencyValues = new StringBuilder()
                            .append("$")
                            .append(response.getTickers().get(0).getCurrencyValues().getBtc().toPlainString())
                            .append(" BTC\n")
                            .append("$")
                            .append(response.getTickers().get(0).getCurrencyValues().getEth().toPlainString())
                            .append(" ETH");
                    getWalletStatusLiveData().postValue(WalletResponse.getMarketData(
                            WalletStatus.GET_MARKET_DATA,
                            currencyValues.toString(),
                            change,
                            SortByUtil.getPercentChangePeriod(sortBy)
                    ));
                }, exception -> {
                    Log.e(TAG, "getCoinGeckoData: Failed: ", exception);
                });
    }


    public String getPriceChangePercent() {
        return String.valueOf(priceChangePercent).concat("%");
    }

    public String getUsdPerEfx() {
        return "$" + usdPerEfx;
    }

    public void getCoinPrices(String url) {
        getWalletStatusLiveData().postValue(
                WalletResponse.set(WalletStatus.GET_CHART_DATA_LOADING)
        );
        remoteRepository.getCoinPrices(url)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    Log.d(TAG, "getCoinPrices: " + response);
                    List<FormattedPrice> listFormattedPrices = new ArrayList<>();
                    List<UnformattedPrice> listUnformattedPrices = new ArrayList<>();

                    for (int i = 0; i < response.getPrices().size(); i++) {
                        dateFormat = new SimpleDateFormat(getDateFormat(sortBy), Locale.US);
                        String formattedTime = dateFormat.format(response.getPrices().get(i).get(0));
                        Log.d(TAG, "getCoinPrices: Formatted time: " + formattedTime);
                        String formattedPrice = "$" + response.getPrices().get(i).get(1);
                        listFormattedPrices.add(new FormattedPrice(formattedTime, formattedPrice));

                        BigDecimal bigDecimalPrice = response.getPrices().get(i).get(1);
                        listUnformattedPrices.add(new UnformattedPrice(i, bigDecimalPrice.floatValue()));
                    }
                    getWalletStatusLiveData().setValue(WalletResponse.getPrices(
                            WalletStatus.GET_CHART_DATA_SUCCESS,
                            listFormattedPrices,
                            listUnformattedPrices
                    ));
                }, exception -> {
                    Log.e(TAG, "getCoinPrices: Failed: ", exception);
                    getWalletStatusLiveData().postValue(WalletResponse.set(WalletStatus.GET_CHART_DATA_FAILED));
                });
    }

    public MutableLiveData<WalletResponse> getWalletStatusLiveData() {
        return walletStatusLiveData;
    }

    private String getDateFormat(SortBy sortBy) {
        switch (sortBy) {
            case DAY:
                return Constants.DATE_PATTERN_HOUR;
            case WEEK:
            case MONTH:
            case QUARTER_YEAR:
            case HALF_YEAR:
            case YEAR:
                return Constants.DATE_PATTERN_DAY;
            default:
                throw new IllegalArgumentException();
        }
    }

    public void clearWallet() {
        localRepository.resetWalletSharedPreferences();
        walletStatusLiveData.postValue(
                WalletResponse.set(WalletStatus.CLEAR_WALLET)
        );
    }

    public void reloadWallet() {
        getWalletBalance(localRepository.getAccountName());
    }

    public String getPrivateKey() {
        return localRepository.getPrivateKey();
    }

    public String getWalletPublicKey() {
        return localRepository.getAccountName();
    }

    public int getAccountId() {
        return localRepository.getAccountId();
    }

    public List<Campaign> getListCampaigns() {
        return listCampaigns;
    }

    public BigDecimal getWalletBalance() {
        return walletBalance;
    }

    public void sortChart(SortBy sortBy) {
        this.sortBy = sortBy;
        getCoinPrices(UrlUtil.createGetPricesUrl(sortBy));
        getMarketData();
    }
}
