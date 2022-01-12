package com.evan.effectwallet.domain;

import com.evan.effectwallet.domain.model.AccountInfo;
import com.evan.effectwallet.domain.model.CreateCampaignRequest;
import com.evan.effectwallet.domain.model.CreateCampaignResponse;
import com.evan.effectwallet.domain.model.SendRequest;
import com.evan.effectwallet.domain.model.SendResponse;
import com.evan.effectwallet.domain.model.coingecko.ChartResponse;
import com.evan.effectwallet.domain.model.coingecko.CoinGeckoResponse;
import com.evan.effectwallet.domain.model.GetAccountRequest;
import com.evan.effectwallet.domain.model.GetWalletResponse;

import io.reactivex.rxjava3.core.Single;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Query;
import retrofit2.http.Url;

public interface MainService {

    @GET("create-wallet")
    Single<AccountInfo> createWallet();

    @GET("get-balance")
    Single<GetWalletResponse> getWallet(@Query("account_name") String accountName);

    @POST("get-account")
    Single<AccountInfo> getAccount(@Body GetAccountRequest getAccountRequest);

    @POST("send")
    Single<SendResponse> sendEfx(@Body SendRequest sendRequest);

    @GET
    Single<CoinGeckoResponse> getEffectData(@Url String url);

    @GET
    Single<ChartResponse> getCoinPrices(@Url String url);

    @POST("create-campaign")
    Single<CreateCampaignResponse> createCampaign(@Body CreateCampaignRequest createCampaignRequest);
}
