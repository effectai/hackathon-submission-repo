package com.evan.effectwallet.domain.model;

import com.google.gson.annotations.SerializedName;

public class Campaign {

    @SerializedName("campaign_id")
    private int campaignId;

    @SerializedName("key")
    private String key;

    @SerializedName("title")
    private String title;

    @SerializedName("description")
    private String description;

    @SerializedName("instructions")
    private String instructions;

    @SerializedName("campaign_url")
    private String campaignUrl;

    @SerializedName("amount_efx_to_award")
    private int amountEfxToAward;

    @SerializedName("question_one")
    private String questionOne;

    @SerializedName("question_two")
    private String questionTwo;

    @SerializedName("question_three")
    private String questionThree;

    @SerializedName("question_four")
    private String questionFour;

    @SerializedName("question_five")
    private String questionFive;

    public int getCampaignId() {
        return campaignId;
    }

    public void setCampaignId(int campaignId) {
        this.campaignId = campaignId;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public String getCampaignUrl() {
        return campaignUrl;
    }

    public void setCampaignUrl(String campaignUrl) {
        this.campaignUrl = campaignUrl;
    }

    public int getAmountEfxToAward() {
        return amountEfxToAward;
    }

    public void setAmountEfxToAward(int amountEfxToAward) {
        this.amountEfxToAward = amountEfxToAward;
    }

    public String getQuestionOne() {
        return questionOne;
    }

    public void setQuestionOne(String questionOne) {
        this.questionOne = questionOne;
    }

    public String getQuestionTwo() {
        return questionTwo;
    }

    public void setQuestionTwo(String questionTwo) {
        this.questionTwo = questionTwo;
    }

    public String getQuestionThree() {
        return questionThree;
    }

    public void setQuestionThree(String questionThree) {
        this.questionThree = questionThree;
    }

    public String getQuestionFour() {
        return questionFour;
    }

    public void setQuestionFour(String questionFour) {
        this.questionFour = questionFour;
    }

    public String getQuestionFive() {
        return questionFive;
    }

    public void setQuestionFive(String questionFive) {
        this.questionFive = questionFive;
    }
}
