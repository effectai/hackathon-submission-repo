package com.evan.effectwallet.ui.qrdialog;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.DialogFragment;

import com.bumptech.glide.Glide;
import com.bumptech.glide.request.RequestOptions;
import com.evan.effectwallet.R;
import com.evan.effectwallet.util.ClipboardUtil;
import com.evan.effectwallet.util.SpacingUtils;

import net.glxn.qrgen.android.QRCode;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;


public class CreateWalletQrDialog extends DialogFragment {

    private static final String TAG = "SendDialog";

    @BindView(R.id.iv_wallet_qr)
    ImageView ivWalletQr;

    @BindView(R.id.tv_account_name)
    TextView tvAccountName;

    @BindView(R.id.tv_account_id)
    TextView tvAccountId;

    private static final int     QR_SIZE = 150;
    private final        String  walletAddress;
    private final        int     accountId;
    private              Context context;


    public CreateWalletQrDialog(String walletAddress, int accountId) {
        this.walletAddress = walletAddress;
        this.accountId = accountId;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        this.context = context;
    }

    @Override
    public void onStart() {
        super.onStart();
        Dialog dialog = getDialog();
        if (dialog != null) {
            int width = ViewGroup.LayoutParams.MATCH_PARENT;
            int height = ViewGroup.LayoutParams.WRAP_CONTENT;
            dialog.getWindow().setLayout(width, height);
            dialog.setCanceledOnTouchOutside(false);
        }
    }


    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_create_wallet_qr, container, false);
        ButterKnife.bind(this, view);

        createQrCode(walletAddress);
        tvAccountName.setText(walletAddress);
        tvAccountId.setText("Account id: " + accountId);

        return view;
    }

    private void createQrCode(String walletPublicKey) {
        int qrSize = SpacingUtils.convertIntToDP(context, QR_SIZE);
        Bitmap qrBitmap = QRCode.from(walletPublicKey).withSize(qrSize, qrSize).bitmap();

        Glide.with(this)
                .load(qrBitmap)
                .apply(RequestOptions.centerInsideTransform())
                .into(ivWalletQr);
    }

    @OnClick(R.id.btn_close)
    void onCloseBtnClick() {
        this.dismiss();
    }

    @OnClick(R.id.tv_account_name)
    void onCopyAddressBtnClick() {
        Toast.makeText(context, "Address copied", Toast.LENGTH_SHORT).show();
        ClipboardUtil.copyText(context, walletAddress);
    }

    @OnClick(R.id.tv_account_id)
    void onCopyAccountIdBtnClick(){
        Toast.makeText(context, "Account id copied", Toast.LENGTH_SHORT).show();
        ClipboardUtil.copyText(context, String.valueOf(accountId));
    }
}
