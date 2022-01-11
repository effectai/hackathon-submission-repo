package com.evan.effectwallet.domain.model;

import com.google.gson.annotations.SerializedName;

public class SendResponse {
    @SerializedName("success")
    private boolean success;

    public boolean isSuccess() {
        return success;
    }
}
