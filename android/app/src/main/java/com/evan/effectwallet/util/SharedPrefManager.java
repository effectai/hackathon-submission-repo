package com.evan.effectwallet.util;

import android.content.SharedPreferences;

import javax.inject.Inject;

public class SharedPrefManager {

    private final SharedPreferences sharedPreferences;

    private static final String KEY_PRIVATE_KEY                 = "KEY_PRIVATE_KEY";
    private static final String KEY_PUBLIC_ADDRESS              = "KEY_PUBLIC_ADDRESS";
    private static final String KEY_ACCOUNT_NAME                = "KEY_ACCOUNT_NAME";
    private static final String KEY_IS_PRIVATE_KEY_WALLET_ADDED = "KEY_IS_PRIVATE_KEY_WALLET_ADDED";
    private static final String KEY_ACCOUNT_ID                  = "KEY_ACCOUNT_ID";

    private static final String  DEFAULT_PRIVATE_KEY                 = null;
    private static final String  DEFAULT_PUBLIC_ADDRESS              = null;
    private static final String  DEFAULT_ACCOUNT_NAME                = null;
    private static final boolean DEFAULT_IS_PRIVATE_KEY_WALLET_ADDED = false;
    private static final int     DEFAULT_ACCOUNT_ID                  = -1;

    @Inject
    public SharedPrefManager(SharedPreferences sharedPreferences) {
        this.sharedPreferences = sharedPreferences;
    }

    public String getPrivateKey() {
        return sharedPreferences.getString(KEY_PRIVATE_KEY, DEFAULT_PRIVATE_KEY);
    }

    public void setPrivateKey(String privateKey) {
        sharedPreferences.edit().putString(KEY_PRIVATE_KEY, privateKey).apply();
    }

    public String getPublicAddress() {
        return sharedPreferences.getString(KEY_PUBLIC_ADDRESS, DEFAULT_PUBLIC_ADDRESS);
    }

    public void setPublicAddress(String publicAddress) {
        sharedPreferences.edit().putString(KEY_PUBLIC_ADDRESS, publicAddress).apply();
    }

    public String getAccountName() {
        return sharedPreferences.getString(KEY_ACCOUNT_NAME, DEFAULT_ACCOUNT_NAME);
    }

    public void setAccountName(String accountName) {
        sharedPreferences.edit().putString(KEY_ACCOUNT_NAME, accountName).apply();
    }

    public boolean getIsPrivateKeyWalletAdded() {
        return sharedPreferences.getBoolean(KEY_IS_PRIVATE_KEY_WALLET_ADDED, DEFAULT_IS_PRIVATE_KEY_WALLET_ADDED);
    }

    public void setIsPrivateKeyWalletAdded(boolean isPrivateKeyWalletAdded) {
        sharedPreferences.edit().putBoolean(KEY_IS_PRIVATE_KEY_WALLET_ADDED, isPrivateKeyWalletAdded).apply();
    }

    public Integer getAccountId() {
        return sharedPreferences.getInt(KEY_ACCOUNT_ID, DEFAULT_ACCOUNT_ID);
    }

    public void setAccountId(int accountId){
        sharedPreferences.edit().putInt(KEY_ACCOUNT_ID, accountId).apply();
    }


    public void resetWalletSharedPreferences() {
        sharedPreferences.edit()
                .putString(KEY_PRIVATE_KEY, DEFAULT_PRIVATE_KEY)
                .putString(KEY_PUBLIC_ADDRESS, DEFAULT_PUBLIC_ADDRESS)
                .putString(KEY_ACCOUNT_NAME, DEFAULT_ACCOUNT_NAME)
                .putBoolean(KEY_IS_PRIVATE_KEY_WALLET_ADDED, DEFAULT_IS_PRIVATE_KEY_WALLET_ADDED)
                .putInt(KEY_ACCOUNT_ID, DEFAULT_ACCOUNT_ID)
                .apply();
    }


}
