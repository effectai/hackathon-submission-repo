package com.evan.effectwallet.domain.model;

public class GetAccountRequest {
    private String key;

    public GetAccountRequest(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }


}
