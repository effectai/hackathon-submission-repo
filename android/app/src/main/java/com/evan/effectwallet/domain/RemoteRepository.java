package com.evan.effectwallet.domain;

import com.evan.effectwallet.Constants;
import com.evan.effectwallet.domain.model.AccountInfo;
import com.evan.effectwallet.domain.model.CreateCampaignRequest;
import com.evan.effectwallet.domain.model.CreateCampaignResponse;
import com.evan.effectwallet.domain.model.SendRequest;
import com.evan.effectwallet.domain.model.SendResponse;
import com.evan.effectwallet.domain.model.coingecko.ChartResponse;
import com.evan.effectwallet.domain.model.coingecko.CoinGeckoResponse;
import com.evan.effectwallet.domain.model.GetAccountRequest;
import com.evan.effectwallet.domain.model.GetWalletResponse;

import javax.inject.Inject;

import io.reactivex.rxjava3.core.Single;

public class RemoteRepository {

    private final MainService service;

    @Inject
    public RemoteRepository(MainService service) {
        this.service = service;
    }

    public Single<GetWalletResponse> getWalletBalance(String accountName) {
        return service.getWallet(accountName);
    }

    public Single<AccountInfo> createWallet() {
        return service.createWallet();
    }

    public Single<AccountInfo> getAccount(String privateKey){
        return service.getAccount(new GetAccountRequest(privateKey));
    }

    public Single<SendResponse> sendEfx(SendRequest sendRequest){
        return service.sendEfx(sendRequest);
    }

    public Single<CoinGeckoResponse> getCoinGeckoData(){
        return service.getEffectData(Constants.COIN_GECKO_ENDPOINT);
    }

    public Single<ChartResponse> getCoinPrices(String url){
        return service.getCoinPrices(url);
    }

    public Single<CreateCampaignResponse> createCampaign(CreateCampaignRequest request){
        return service.createCampaign(request);
    }
}
