package com.evan.effectwallet.domain.model;

import com.google.gson.annotations.SerializedName;

public class SendRequest {
    @SerializedName("key")
    private String key;

    @SerializedName("send_to_account_id")
    private int sendToAccountId;

    @SerializedName("amount_efx")
    private String amountEfx;

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public int getSendToAccountId() {
        return sendToAccountId;
    }

    public void setSendToAccountId(int sendToAccountId) {
        this.sendToAccountId = sendToAccountId;
    }

    public String getAmountEfx() {
        return amountEfx;
    }

    public void setAmountEfx(String amountEfx) {
        this.amountEfx = amountEfx;
    }

    @Override
    public String toString() {
        return "SendRequest{" +
                "key='" + key + '\'' +
                ", sendToAccountId=" + sendToAccountId +
                ", amountEfx=" + amountEfx +
                '}';
    }
}
