package com.evan.effectwallet.ui.send;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.EditText;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.DialogFragment;
import androidx.lifecycle.ViewModelProvider;

import com.evan.effectwallet.R;
import com.evan.effectwallet.domain.model.SendRequest;
import com.evan.effectwallet.ui.SharedViewModel;
import com.evan.effectwallet.util.KeyboardUtils;
import com.google.zxing.integration.android.IntentIntegrator;

import org.jetbrains.annotations.NotNull;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class SendFragment extends DialogFragment {

    private static final String TAG = "SingleCardActivity";

    @BindView(R.id.et_send_to)
    EditText etAccountIdToSendTo;

    @BindView(R.id.et_amount)
    EditText etAmount;

    @BindView(R.id.et_balance)
    EditText etBalance;

    private Context context;

    private final SendRequest     sendRequest;
    private       SendViewModel   sendViewModel;
    private       SharedViewModel sharedViewModel;
    private       AlertDialog     sendProgressDialog;

    public SendFragment(SendRequest sendRequest) {
        this.sendRequest = sendRequest;
    }

    @NonNull
    @Override
    public Dialog onCreateDialog(@Nullable Bundle savedInstanceState) {
        setStyle(DialogFragment.STYLE_NORMAL, R.style.Theme_EffectWallet);
        final Dialog dialog = super.onCreateDialog(savedInstanceState);
        dialog.getWindow().getAttributes().windowAnimations = R.style.FragmentDialogAnim;
        return dialog;
    }

    @Override
    public void onAttach(@NonNull Context context) {
        super.onAttach(context);
        this.context = context;
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container,
                             @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_send, container, false);
        ButterKnife.bind(this, view);
        Log.d(TAG, "onCreateView: " + sendRequest.getAmountEfx());
        etBalance.setHint(sendRequest.getAmountEfx());
        return view;
    }

    @Override
    public void onViewCreated(@NonNull @NotNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        sendViewModel = new ViewModelProvider(this).get(SendViewModel.class);
        sharedViewModel = new ViewModelProvider(getActivity()).get(SharedViewModel.class);
        sendViewModel.getSuccessLiveData().observe(getViewLifecycleOwner(), successMsg -> {
            sharedViewModel.setActivityMsg(successMsg);
            this.dismiss();
        });

        sendViewModel.getErrorLiveData().observe(this, errMsg -> {
            Toast.makeText(context, errMsg, Toast.LENGTH_SHORT).show();
        });

        sendViewModel.getSendProgressLiveData().observe(getViewLifecycleOwner(), b -> {
            if (b) {
                showProgressDialog();
            } else {
                sendProgressDialog.dismiss();
            }
        });
    }

    private void showProgressDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(context, R.style.alertDialogTheme);
        builder.setView(R.layout.progress_dialog_send);
        sendProgressDialog = builder.create();
        sendProgressDialog.setCancelable(false);
        sendProgressDialog.setCanceledOnTouchOutside(false);
        sendProgressDialog.show();
    }

    @OnClick(R.id.btn_back)
    void onCloseBtnClick() {
        this.dismiss();
    }

    @OnClick(R.id.btn_scan_send_to)
    void onScanBtnClick() {
        initScanner();
    }

    private void initScanner() {
        IntentIntegrator integrator = IntentIntegrator.forSupportFragment(this);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE);
        integrator.setPrompt("Scan send to account name");
        integrator.setBeepEnabled(false);
        integrator.setOrientationLocked(true);
        integrator.initiateScan();
    }

    @OnClick(R.id.btn_send)
    void onSendBtnClick() {
        etAmount.clearFocus();
        String amountToSend = etAmount.getText().toString().trim();
        String accountIdToSendTo = etAccountIdToSendTo.getText().toString().trim();
        sendRequest.setAmountEfx(amountToSend);
        sendRequest.setSendToAccountId(Integer.parseInt(accountIdToSendTo));
        sendViewModel.sendEfxRequest(sendRequest);

    }

    @OnClick(R.id.tv_static_efx)
    void onStaticEfxClick() {
        Log.d(TAG, "onStaticEfxClick: Clicked");
        KeyboardUtils.showKeyboard(etAmount, context);
    }

}
