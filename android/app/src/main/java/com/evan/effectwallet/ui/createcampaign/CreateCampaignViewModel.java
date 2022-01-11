package com.evan.effectwallet.ui.createcampaign;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.evan.effectwallet.domain.LocalRepository;
import com.evan.effectwallet.domain.RemoteRepository;
import com.evan.effectwallet.domain.model.CreateCampaignRequest;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class CreateCampaignViewModel extends ViewModel {
    private static final String TAG = "CreateCampaignViewModel";

    private final RemoteRepository remoteRepository;
    private final LocalRepository localRepository;

    private final MutableLiveData<Integer> successCreateLiveData = new MutableLiveData<>();
    private final MutableLiveData<String> errorLiveData = new MutableLiveData<>();
    private final MutableLiveData<Boolean> progressLiveData = new MutableLiveData<>();

    @Inject
    public CreateCampaignViewModel(RemoteRepository remoteRepository, LocalRepository localRepository) {
        this.remoteRepository = remoteRepository;
        this.localRepository = localRepository;
    }

    public void createCampaign(CreateCampaignRequest request){
        progressLiveData.setValue(true);
        remoteRepository.createCampaign(request)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    Log.d(TAG, "createCampaign: " + response.toString());
                    progressLiveData.setValue(false);
                    successCreateLiveData.setValue(response.getCampaignId());
                }, exception -> {
                    Log.e(TAG, "createCampaign: Failed: ", exception);
                    progressLiveData.setValue(false);
                    errorLiveData.setValue("Failed to create campaign");

                });
    }

    public String getPrivateKey(){
        return localRepository.getPrivateKey();
    }

    public MutableLiveData<Integer> getSuccessCreateLiveData() {
        return successCreateLiveData;
    }

    public MutableLiveData<String> getErrorLiveData() {
        return errorLiveData;
    }

    public MutableLiveData<Boolean> getProgressLiveData() {
        return progressLiveData;
    }
}
