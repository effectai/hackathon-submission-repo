package com.evan.effectwallet.ui;

import android.util.Log;

import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

public class SharedViewModel extends ViewModel {

    private static final String TAG = "SharedViewModel";

    private final MutableLiveData<String> activityMsgLiveData = new MutableLiveData<>();

    public void setActivityMsg(String activityMsg) {
        activityMsgLiveData.setValue(activityMsg);
    }

    public MutableLiveData<String> getActivityMsgLiveData() {
        return activityMsgLiveData;
    }
}
