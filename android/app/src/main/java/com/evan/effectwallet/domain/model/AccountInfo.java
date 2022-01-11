package com.evan.effectwallet.domain.model;

public class AccountInfo {
    private String address;
    private String privateKey;
    private String provider;
    private String accountName;
    private int    accountId;

    public int getAccountId() {
        return accountId;
    }

    public String getAddress() {
        return address;
    }

    public String getPrivateKey() {
        return privateKey;
    }

    public String getProvider() {
        return provider;
    }

    public String getAccountName() {
        return accountName;
    }

    @Override
    public String toString() {
        return "AccountInfo{" +
                "address='" + address + '\'' +
                ", privateKey='" + privateKey + '\'' +
                ", provider='" + provider + '\'' +
                ", accountName='" + accountName + '\'' +
                ", accountId=" + accountId +
                '}';
    }
}
