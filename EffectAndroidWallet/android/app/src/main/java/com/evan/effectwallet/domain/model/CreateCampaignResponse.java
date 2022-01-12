package com.evan.effectwallet.domain.model;

import com.google.gson.annotations.SerializedName;

public class CreateCampaignResponse {
    @SerializedName("id")
    private int campaignId;

    public int getCampaignId() {
        return campaignId;
    }
}
