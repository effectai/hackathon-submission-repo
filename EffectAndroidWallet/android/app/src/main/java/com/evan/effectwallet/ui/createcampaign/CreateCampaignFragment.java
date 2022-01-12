package com.evan.effectwallet.ui.createcampaign;

import android.app.Dialog;
import android.content.Context;
import android.os.Bundle;
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
import com.evan.effectwallet.domain.model.Campaign;
import com.evan.effectwallet.domain.model.CreateCampaignRequest;
import com.evan.effectwallet.ui.MainActivity;

import org.jetbrains.annotations.NotNull;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import dagger.hilt.android.AndroidEntryPoint;

@AndroidEntryPoint
public class CreateCampaignFragment extends DialogFragment {

    private static final String TAG = "SingleCardActivity";

    @BindView(R.id.et_title)
    EditText etTitle;

    @BindView(R.id.et_description)
    EditText etDescription;

    @BindView(R.id.et_instructions)
    EditText etInstructions;

    @BindView(R.id.et_campaign_image)
    EditText etCampaignImage;

    @BindView(R.id.et_amount_efx)
    EditText etAmountEfx;

    @BindView(R.id.et_question_one)
    EditText etQuestionOne;

    @BindView(R.id.et_question_two)
    EditText etQuestionTwo;

    @BindView(R.id.et_question_three)
    EditText etQuestionThree;

    @BindView(R.id.et_question_four)
    EditText etQuestionFour;

    @BindView(R.id.et_question_five)
    EditText etQuestionFive;

    private Context     context;
    private AlertDialog createProgressDialog;
    private CreateCampaignRequest request;

    private CreateCampaignViewModel viewModel;


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
        View view = inflater.inflate(R.layout.fragment_create_campaign, container, false);
        ButterKnife.bind(this, view);

        return view;
    }

    @Override
    public void onViewCreated(@NonNull @NotNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        viewModel = new ViewModelProvider(this).get(CreateCampaignViewModel.class);
        viewModel.getProgressLiveData().observe(this, b -> {
            if(b){
                showProgressDialog();
            }else{
                createProgressDialog.dismiss();
            }
        });

        viewModel.getSuccessCreateLiveData().observe(this, campaignId -> {
            //add to mainactivity
            MainActivity mainActivity = (MainActivity) context;
            Campaign campaign = new Campaign();
            campaign.setCampaignId(campaignId);
            campaign.setKey(request.getKey());
            campaign.setTitle(request.getTitle());
            campaign.setDescription(request.getDescription());
            campaign.setInstructions(request.getInstructions());
            campaign.setCampaignUrl(request.getCampaignUrl());
            campaign.setAmountEfxToAward(request.getAmountEfxToAward());
            campaign.setQuestionOne(request.getQuestionOne());
            campaign.setQuestionTwo(request.getQuestionTwo());
            campaign.setQuestionThree(request.getQuestionThree());
            campaign.setQuestionFour(request.getQuestionFour());
            campaign.setQuestionFive(request.getQuestionFive());
            mainActivity.addItemToCampaign(campaign);
            this.dismiss();
        });

        viewModel.getErrorLiveData().observe(this, errMsg -> {
            Toast.makeText(context, errMsg, Toast.LENGTH_SHORT).show();
        });

    }

    private void showProgressDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(context, R.style.alertDialogTheme);
        builder.setView(R.layout.progress_dialog_create_campaign);
        createProgressDialog = builder.create();
        createProgressDialog.setCancelable(false);
        createProgressDialog.setCanceledOnTouchOutside(false);
        createProgressDialog.show();
    }

    @OnClick(R.id.btn_back)
    void onCloseBtnClick() {
        this.dismiss();
    }

    @OnClick(R.id.btn_create_campaign)
    void onCreateCampaignBtnClick() {

        String key = viewModel.getPrivateKey();
        String title = etTitle.getText().toString().trim();
        String description = etDescription.getText().toString().trim();
        String instructions = etInstructions.getText().toString().trim();
        String campaignImage = etCampaignImage.getText().toString().trim();
        int amountEfx = Integer.parseInt(etAmountEfx.getText().toString());
        String q1 = etQuestionOne.getText().toString().trim();
        String q2 = etQuestionTwo.getText().toString().trim();
        String q3 = etQuestionThree.getText().toString().trim();
        String q4 = etQuestionFour.getText().toString().trim();
        String q5 = etQuestionFive.getText().toString().trim();

        request = new CreateCampaignRequest();
        request.setKey(key);
        request.setTitle(title);
        request.setDescription(description);
        request.setInstructions(instructions);
        request.setCampaignUrl(campaignImage);
        request.setAmountEfxToAward(amountEfx);
        request.setQuestionOne(q1);
        request.setQuestionTwo(q2);
        request.setQuestionThree(q3);
        request.setQuestionFour(q4);
        request.setQuestionFive(q5);

        viewModel.createCampaign(request);

    }


}
