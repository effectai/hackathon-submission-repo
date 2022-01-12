package com.evan.effectwallet.domain;

import com.evan.effectwallet.util.SharedPrefManager;

import javax.inject.Inject;

public class LocalRepository {

    private final SharedPrefManager sharedPrefManager;

    @Inject
    public LocalRepository(SharedPrefManager sharedPrefManager) {
        this.sharedPrefManager = sharedPrefManager;
    }

    public boolean getIsPrivateKeyWalletAdded() {
        return sharedPrefManager.getIsPrivateKeyWalletAdded();
    }

    public void setIsPrivateKeyWalletAdded(boolean b) {
        sharedPrefManager.setIsPrivateKeyWalletAdded(b);
    }

    public void setPublicAddress(String publicAddress) {
        sharedPrefManager.setPublicAddress(publicAddress);
    }

    public String getPublicAddress() {
        return sharedPrefManager.getPublicAddress();
    }

    public void setAccountName(String accountName) {
        sharedPrefManager.setAccountName(accountName);
    }

    public String getAccountName() {
        return sharedPrefManager.getAccountName();
    }

    public int getAccountId() {
        return sharedPrefManager.getAccountId();
    }

    public void setAccountId(int accountId) {
        sharedPrefManager.setAccountId(accountId);
    }

    public String getPrivateKey() {
        return sharedPrefManager.getPrivateKey();
    }

    public void setPrivateKey(String privateKey) {
        sharedPrefManager.setPrivateKey(privateKey);
    }

    public void resetWalletSharedPreferences() {
        sharedPrefManager.resetWalletSharedPreferences();
    }
}
