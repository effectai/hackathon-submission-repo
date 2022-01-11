package com.evan.effectwallet.domain.model;

public class GetWalletResponse {
    private String quantity;
    private String contract;

    public String getQuantity() {
        return quantity;
    }

    public String getContract() {
        return contract;
    }

    @Override
    public String toString() {
        return "GetWalletResponse{" +
                "quantity='" + quantity + '\'' +
                ", contract='" + contract + '\'' +
                '}';
    }
}
