package com.evan.effectwallet.ui.send;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.evan.effectwallet.domain.RemoteRepository;
import com.evan.effectwallet.domain.model.SendRequest;

import java.math.BigDecimal;

import javax.inject.Inject;

import dagger.hilt.android.lifecycle.HiltViewModel;
import io.reactivex.rxjava3.android.schedulers.AndroidSchedulers;
import io.reactivex.rxjava3.schedulers.Schedulers;

@HiltViewModel
public class SendViewModel extends ViewModel {

    private static final String TAG = "SendViewModel";

    private final RemoteRepository         remoteRepository;
    private final MutableLiveData<Boolean> sendProgressLiveData = new MutableLiveData<>();
    private final MutableLiveData<String>  errorLiveData        = new MutableLiveData<>();
    private final MutableLiveData<String>  successLiveData      = new MutableLiveData<>();

    @Inject
    public SendViewModel(RemoteRepository remoteRepository) {
        this.remoteRepository = remoteRepository;
    }

    public void sendEfxRequest(SendRequest sendRequest) {
        if (sendRequest.getSendToAccountId() < 1) {
            errorLiveData.setValue("Enter number greater than 0");
            return;
        }

        BigDecimal bigDecimal = new BigDecimal(sendRequest.getAmountEfx());
        if (bigDecimal.compareTo(BigDecimal.ZERO) <= 0) {
            errorLiveData.setValue("Amount to send must be greater than 0");
            return;
        }

        sendEfx(sendRequest);
    }

    private void sendEfx(SendRequest sendRequest) {
        sendProgressLiveData.setValue(true);
        remoteRepository.sendEfx(sendRequest)
                .subscribeOn(Schedulers.io())
                .observeOn(AndroidSchedulers.mainThread())
                .subscribe(response -> {
                    Log.d(TAG, "sendEfx: " + response.toString());
                    sendProgressLiveData.setValue(false);
                    successLiveData.setValue("Success sending " + sendRequest.getAmountEfx() + " EFX");

                }, exception -> {
                    Log.e(TAG, "sendEfx: Failed: ", exception);
                    sendProgressLiveData.setValue(false);
                    errorLiveData.setValue("Failed to send");
                });
    }

    public MutableLiveData<Boolean> getSendProgressLiveData() {
        return sendProgressLiveData;
    }

    public MutableLiveData<String> getErrorLiveData() {
        return errorLiveData;
    }

    public MutableLiveData<String> getSuccessLiveData() {
        return successLiveData;
    }
}
