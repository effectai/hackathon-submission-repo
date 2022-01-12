package com.evan.effectwallet.ui;

import android.content.Intent;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.RadioGroup;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.Nullable;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.content.ContextCompat;
import androidx.core.widget.NestedScrollView;
import androidx.fragment.app.DialogFragment;
import androidx.lifecycle.ViewModelProvider;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.evan.effectwallet.Constants;
import com.evan.effectwallet.R;
import com.evan.effectwallet.domain.model.Campaign;
import com.evan.effectwallet.domain.model.CreateCampaignRequest;
import com.evan.effectwallet.domain.model.SendRequest;
import com.evan.effectwallet.domain.model.coingecko.FormattedPrice;
import com.evan.effectwallet.domain.model.coingecko.UnformattedPrice;
import com.evan.effectwallet.ui.createcampaign.CreateCampaignFragment;
import com.evan.effectwallet.ui.qrdialog.CreateWalletQrDialog;
import com.evan.effectwallet.ui.send.SendFragment;
import com.evan.effectwallet.util.Change;
import com.evan.effectwallet.util.ChartMarker;
import com.evan.effectwallet.util.SortBy;
import com.github.mikephil.charting.charts.LineChart;
import com.github.mikephil.charting.components.LimitLine;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.data.LineData;
import com.github.mikephil.charting.data.LineDataSet;
import com.github.mikephil.charting.highlight.Highlight;
import com.github.mikephil.charting.interfaces.datasets.ILineDataSet;
import com.github.mikephil.charting.listener.OnChartValueSelectedListener;
import com.google.android.material.button.MaterialButtonToggleGroup;
import com.google.android.material.textfield.TextInputEditText;
import com.google.android.material.textfield.TextInputLayout;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;

import java.util.ArrayList;
import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;
import butterknife.OnClick;
import dagger.hilt.android.AndroidEntryPoint;


@AndroidEntryPoint
public class MainActivity extends AppCompatActivity implements
        PopupWindowWallet.ClearWalletCallback,
        CampaignAdapter.CampaignAdapterCallback {

    private static final String TAG = "MainActivity";

    @BindView(R.id.btn_wallet_more_options)
    ImageView btnMoreOptions;

    @BindView(R.id.spinner_network)
    Spinner spinnerNetwork;

    @BindView(R.id.toggle_group)
    MaterialButtonToggleGroup toggleGroup;

    @BindView(R.id.btn_generate_wallet)
    Button btnGenerateWallet;

    @BindView(R.id.btn_save_wallet)
    Button btnSaveWallet;

    @BindView(R.id.et_private_key)
    TextInputEditText etPrivateKey;

    @BindView(R.id.layout_private_key)
    TextInputLayout layoutPrivateKey;

    @BindView(R.id.layout_wallet_balance)
    ConstraintLayout layoutWalletBalance;

    @BindView(R.id.tv_wallet_balance)
    TextView tvWalletBalance;

    @BindView(R.id.progress_wallet_balance)
    ProgressBar progressWalletBalance;

    @BindView(R.id.tv_static_fetching_wallet)
    TextView tvStaticFetchingWallet;

    @BindView(R.id.btn_receive)
    TextView btnReceive;

    @BindView(R.id.btn_send)
    TextView btnSend;

    @BindView(R.id.tv_amount_usd)
    TextView tvAmountUsd;

    @BindView(R.id.progress_save_wallet)
    ProgressBar progressSaveWallet;

    @BindView(R.id.chart)
    LineChart chart;

    @BindView(R.id.campaign_recycler)
    RecyclerView collectionRecycler;

    @BindView(R.id.layout_sort_chart)
    RadioGroup groupSortBtns;

    @BindView(R.id.progress_chart)
    ProgressBar progressChart;

    @BindView(R.id.tv_efx_price)
    TextView tvEfxPrice;

    @BindView(R.id.tv_static_change)
    TextView tvStaticChange;

    @BindView(R.id.tv_change_percent)
    TextView tvChangePercent;

    @BindView(R.id.nested_scrollview)
    NestedScrollView nestedScrollView;

    @BindView(R.id.tv_date_change)
    TextView tvPercentPeriodChange;

    private MainViewModel   mainViewModel;
    private SharedViewModel sharedViewModel;
    private AlertDialog     createWalletProgress;
    private CampaignAdapter campaignAdapter;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        ButterKnife.bind(this);

        mainViewModel = new ViewModelProvider(this).get(MainViewModel.class);
        mainViewModel.getWalletStatusLiveData().observe(this, walletResponse -> {
            switch (walletResponse.getWalletStatus()) {
                case DEFAULT:
                    Log.d(TAG, "onCreate: Called default");
                    toggleGroup.setVisibility(View.VISIBLE);
                    layoutPrivateKey.setVisibility(View.VISIBLE);
                    btnSaveWallet.setVisibility(View.VISIBLE);
                    break;

                case CREATE_WALLET_SUCCESS:
                    createWalletProgress.dismiss();
                    //Show wallet balance layout
                    toggleGroup.setVisibility(View.GONE);
                    btnGenerateWallet.setVisibility(View.GONE);
                    layoutWalletBalance.setVisibility(View.VISIBLE);

                    break;

                case CREATE_WALLET_LOADING:
                    showProgressDialog();

                    break;

                case CREATE_WALLET_ERROR:

                case GET_WALLET_BALANCE_ERROR:
                    tvStaticFetchingWallet.setVisibility(View.GONE);
                    progressWalletBalance.setVisibility(View.GONE);

                    tvWalletBalance.setTextColor(ContextCompat.getColor(this, R.color.triRedColor));
                    tvWalletBalance.setText(walletResponse.getMsg());
                    tvWalletBalance.setVisibility(View.VISIBLE);

                    btnSend.setVisibility(View.VISIBLE);
                    btnReceive.setVisibility(View.VISIBLE);
                    break;

                case GET_WALLET_BALANCE_SUCCESS:
                    tvAmountUsd.setVisibility(View.VISIBLE);
                    tvWalletBalance.setVisibility(View.VISIBLE);

                    tvWalletBalance.setTextColor(ContextCompat.getColor(this, R.color.white));
                    tvWalletBalance.setText(walletResponse.getGetWalletResponse().getQuantity());
                    tvStaticFetchingWallet.setVisibility(View.GONE);
                    progressWalletBalance.setVisibility(View.GONE);

                    break;

                case GET_WALLET_BALANCE_LOADING:
                    Log.d(TAG, "onCreate: Get wallet balance loading called");
                    layoutWalletBalance.setVisibility(View.VISIBLE);
                    btnSend.setVisibility(View.VISIBLE);
                    btnReceive.setVisibility(View.VISIBLE);
                    break;

                case WALLET_ADD_SUCCESS:
                    etPrivateKey.setEnabled(true);
                    btnSaveWallet.setText("Save Wallet");
                    progressSaveWallet.setVisibility(View.GONE);
                    etPrivateKey.getText().clear();
                    layoutPrivateKey.setVisibility(View.GONE);
                    btnSaveWallet.setVisibility(View.GONE);
                    btnSaveWallet.setEnabled(true);
                    break;

                case WALLET_ADD_LOADING:
                    etPrivateKey.setEnabled(false);
                    btnSaveWallet.setText("");
                    progressSaveWallet.setVisibility(View.VISIBLE);
                    btnSaveWallet.setEnabled(false);
                    break;

                case WALLET_ADD_ERROR:
                    etPrivateKey.setEnabled(true);
                    Toast.makeText(this, walletResponse.getMsg(), Toast.LENGTH_SHORT).show();
                    btnSaveWallet.setText("Save Wallet");
                    progressSaveWallet.setVisibility(View.GONE);
                    btnSaveWallet.setEnabled(true);
                    break;

                case INPUT_ERROR:
                    Toast.makeText(this, walletResponse.getMsg(), Toast.LENGTH_SHORT).show();
                    break;

                case CLEAR_WALLET:
                    toggleGroup.check(R.id.toggle_btn_add_wallet);
                    layoutWalletBalance.setVisibility(View.GONE);
                    layoutPrivateKey.setVisibility(View.VISIBLE);
                    toggleGroup.setVisibility(View.VISIBLE);
                    btnSaveWallet.setVisibility(View.VISIBLE);

                    btnSend.setVisibility(View.GONE);
                    btnReceive.setVisibility(View.GONE);
                    break;

                case GET_WALLET_BALANCE_USD:
                    tvAmountUsd.setText(walletResponse.getMsg());
                    break;

                case GET_MARKET_DATA:
                    if (walletResponse.getChange() == Change.POSITIVE) {
                        tvChangePercent.setTextColor(
                                ContextCompat.getColor(this, R.color.triGreenColor)
                        );
                    } else {
                        tvChangePercent.setTextColor(
                                ContextCompat.getColor(this, R.color.triRedColor)
                        );
                    }
                    tvChangePercent.setText(mainViewModel.getPriceChangePercent());
                    tvEfxPrice.setText(mainViewModel.getUsdPerEfx());

                    tvStaticChange.setText(walletResponse.getCurrencyValues());
                    tvPercentPeriodChange.setText(walletResponse.getPercentChangePeriod());
                    break;

                case GET_CHART_DATA_LOADING:
                    progressChart.setVisibility(View.VISIBLE);
                    tvEfxPrice.setVisibility(View.INVISIBLE);
                    tvChangePercent.setVisibility(View.INVISIBLE);
                    tvStaticChange.setVisibility(View.INVISIBLE);
                    tvPercentPeriodChange.setVisibility(View.INVISIBLE);
                    break;

                case GET_CHART_DATA_SUCCESS:
                    //Notify chart
                    progressChart.setVisibility(View.GONE);
                    tvEfxPrice.setVisibility(View.VISIBLE);
                    tvChangePercent.setVisibility(View.VISIBLE);
                    tvStaticChange.setVisibility(View.VISIBLE);
                    tvPercentPeriodChange.setVisibility(View.VISIBLE);
                    setChartData(walletResponse.getListFormattedPrices(), walletResponse.getListUnformattedPrices());
                    break;

                case GET_CHART_DATA_FAILED:
                    progressChart.setVisibility(View.GONE);
                    chart.setNoDataText("No chart data available.");
                    break;
            }
        });

        sharedViewModel = new ViewModelProvider(this).get(SharedViewModel.class);
        sharedViewModel.getActivityMsgLiveData().observe(this, msg -> {
            mainViewModel.reloadWallet();
            Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
        });

        toggleGroup.addOnButtonCheckedListener((group, checkedId, isChecked) -> {
            if (isChecked) {
                switch (checkedId) {
                    case R.id.toggle_btn_add_wallet:
                        btnSaveWallet.setVisibility(View.VISIBLE);
                        layoutPrivateKey.setVisibility(View.VISIBLE);
                        btnGenerateWallet.setVisibility(View.GONE);

                        break;

                    case R.id.toggle_btn_create_wallet:
                        clearPrivateKey();
                        btnSaveWallet.setVisibility(View.GONE);
                        layoutPrivateKey.setVisibility(View.GONE);
                        btnGenerateWallet.setVisibility(View.VISIBLE);
                        break;
                }
            }
        });

        layoutPrivateKey.setEndIconOnClickListener(icon -> {
            initScanner();
        });

        initNetworkSpinner();
        initPriceChart();

        campaignAdapter = new CampaignAdapter(mainViewModel.getListCampaigns(), this);
        collectionRecycler.setLayoutManager(new LinearLayoutManager(
                this, RecyclerView.HORIZONTAL, false)
        );
        collectionRecycler.setAdapter(campaignAdapter);

        groupSortBtns.setOnCheckedChangeListener((radioGroup, checkedId) -> {
            tvStaticChange.setText("Change");
            chart.clear();
            chart.getAxisLeft().removeAllLimitLines();
            switch (checkedId) {
                case R.id.btn_day:
                    mainViewModel.sortChart(SortBy.DAY);
                    break;

                case R.id.btn_week:
                    mainViewModel.sortChart(SortBy.WEEK);
                    break;

                case R.id.btn_month:
                    mainViewModel.sortChart(SortBy.MONTH);
                    break;

                case R.id.btn_quarter_year:
                    mainViewModel.sortChart(SortBy.QUARTER_YEAR);
                    break;

                case R.id.btn_half_year:
                    mainViewModel.sortChart(SortBy.HALF_YEAR);
                    break;

                case R.id.btn_year:
                    mainViewModel.sortChart(SortBy.YEAR);
                    break;
            }
        });
    }

    private void initPriceChart() {
        chart.setNoDataText("");
        chart.setTouchEnabled(true);
        chart.setPinchZoom(true);

        chart.setDescription(null);
        chart.getAxisLeft().setDrawLabels(false);
        chart.getAxisRight().setDrawLabels(false);

        chart.getLegend().setEnabled(false);
        chart.getXAxis().setEnabled(false);

        chart.getXAxis().setDrawGridLines(false);
        chart.getAxisLeft().setDrawGridLines(false);
        chart.getAxisRight().setDrawGridLines(false);

        chart.getXAxis().setDrawAxisLine(false);
        chart.getAxisLeft().setDrawAxisLine(false);
        chart.getAxisRight().setDrawAxisLine(false);

        ChartMarker pointMarker = new ChartMarker(this, R.layout.layout_chart_marker);
        chart.setMarker(pointMarker);

        chart.setDoubleTapToZoomEnabled(false);

        //addMockChartData();
    }

    private void setChartData(List<FormattedPrice> formattedPriceList,
                              List<UnformattedPrice> unformattedPriceList
    ) {
        Log.d(TAG, "setChartData: Called..: " + formattedPriceList.size() + " + " + unformattedPriceList.size());
        chart.setOnChartValueSelectedListener(new OnChartValueSelectedListener() {
            @Override
            public void onValueSelected(Entry e, Highlight h) {
                //Log.d(TAG, "onValueSelected: " + e.getY());
                tvEfxPrice.setText("$" + e.getY());
                int position = (int) e.getX();
                tvStaticChange.setText(formattedPriceList.get(position).getFormattedTime());
            }

            @Override
            public void onNothingSelected() {
                Log.d(TAG, "onNothingSelected: Called");
            }
        });
        ArrayList<Entry> values = new ArrayList<>();
        for (int i = 0; i < formattedPriceList.size(); i++) {
            values.add(new Entry(i, unformattedPriceList.get(i).getUnformattedPrice()));
        }

        LineDataSet set;

        set = new LineDataSet(values, "");
        set.setLineWidth(2.5f);
        set.setDrawCircles(false);
        set.setHighLightColor(Color.WHITE);
        set.setHighlightLineWidth(1.5f);
        set.setDrawHorizontalHighlightIndicator(false);
        set.setDrawFilled(true);
        set.setDrawCircleHole(true);
        set.setColor(ContextCompat.getColor(this, R.color.purple_200));

        Drawable drawable = ContextCompat.getDrawable(this, R.drawable.fade_purple);
        set.setFillDrawable(drawable);

        ArrayList<ILineDataSet> dataSets = new ArrayList<>();
        dataSets.add(set);
        LineData data = new LineData(dataSets);
        set.setDrawValues(false);

        chart.getAxisLeft().setAxisMaximum(set.getYMax());
        Log.d(TAG, "setChartData: YMax: " + set.getYMax());
        chart.getAxisLeft().setAxisMinimum(set.getYMin());
        Log.d(TAG, "setChartData: YMin: " + set.getYMin());
        chart.setData(data);

        YAxis leftAxis = chart.getAxisLeft();

        LimitLine maxLine = new LimitLine(set.getYMax(), "$" + set.getYMax());
        maxLine.setLineWidth(0.5f);
        maxLine.setTextColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        maxLine.setLineColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        maxLine.setLabelPosition(LimitLine.LimitLabelPosition.LEFT_BOTTOM);
        maxLine.setYOffset(3f);
        leftAxis.addLimitLine(maxLine);


        LimitLine minLine = new LimitLine(set.getYMin(), "$" + set.getYMin());
        minLine.setLineWidth(0.5f);
        minLine.setTextColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        minLine.setLineColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        minLine.setLabelPosition(LimitLine.LimitLabelPosition.LEFT_TOP);
        minLine.setYOffset(6f);
        leftAxis.addLimitLine(minLine);

        chart.fitScreen();
    }

    public void addMockChartData() {
        YAxis leftAxis = chart.getAxisLeft();

        //Min line add and subtract -10
        LimitLine minLine = new LimitLine(50f - 15f, "$0.01557736");
        minLine.setLineWidth(0.5f);
        minLine.setTextColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        minLine.setLineColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        minLine.setLabelPosition(LimitLine.LimitLabelPosition.LEFT_TOP);
        minLine.setYOffset(6f);
        leftAxis.addLimitLine(minLine);

        //Min line
        LimitLine maxLine = new LimitLine(250f + 15f, "$0.02506557");
        maxLine.setLineWidth(0.5f);
        maxLine.setTextColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        maxLine.setLineColor(ContextCompat.getColor(this, R.color.white_30_opacity));
        maxLine.setLabelPosition(LimitLine.LimitLabelPosition.LEFT_BOTTOM);
        maxLine.setYOffset(3f);
        leftAxis.addLimitLine(maxLine);

        chart.setOnChartValueSelectedListener(new OnChartValueSelectedListener() {
            @Override
            public void onValueSelected(Entry e, Highlight h) {
                Log.d(TAG, "onValueSelected: " + e.getY());
            }

            @Override
            public void onNothingSelected() {
                Log.d(TAG, "onNothingSelected: Called");
            }
        });

        ArrayList<Entry> values = new ArrayList<>();
        values.add(new Entry(1, 200));
        values.add(new Entry(2, 100));
        values.add(new Entry(3, 80));
        values.add(new Entry(4, 120));
        values.add(new Entry(5, 110));
        values.add(new Entry(7, 150));
        values.add(new Entry(8, 250));
        values.add(new Entry(9, 190));

        LineDataSet set1;
        if (chart.getData() != null &&
                chart.getData().getDataSetCount() > 0) {
            set1 = (LineDataSet) chart.getData().getDataSetByIndex(0);
            set1.setValues(values);
            chart.getData().notifyDataChanged();
            chart.notifyDataSetChanged();
        } else {
            set1 = new LineDataSet(values, "");
            set1.setLineWidth(2.5f);
            set1.setDrawCircles(false);
            set1.setHighLightColor(Color.WHITE);
            set1.setHighlightLineWidth(1.5f);
            set1.setDrawHorizontalHighlightIndicator(false);
            set1.setDrawFilled(true);
            set1.setDrawCircleHole(true);
            set1.setColor(ContextCompat.getColor(this, R.color.purple_200));

            Drawable drawable = ContextCompat.getDrawable(this, R.drawable.fade_purple);
            set1.setFillDrawable(drawable);

            ArrayList<ILineDataSet> dataSets = new ArrayList<>();
            dataSets.add(set1);
            LineData data = new LineData(dataSets);
            set1.setDrawValues(false);
            chart.setData(data);
        }
    }

    @OnClick(R.id.btn_save_wallet)
    void onSaveWalletBtnClick() {
        String privateKey = etPrivateKey.getText().toString();
        mainViewModel.addWalletWithPrivateKey(privateKey);
    }

    @Override
    public void onClearWallet() {
        mainViewModel.clearWallet();
    }

    @Override
    public void onWalletQr() {
        DialogFragment walletQrDialog = new CreateWalletQrDialog(
                mainViewModel.getWalletPublicKey(), mainViewModel.getAccountId()
        );
        walletQrDialog.show(getSupportFragmentManager(), Constants.DIALOG_WALLET_QR);
    }

    private void clearPrivateKey() {
        etPrivateKey.getText().clear();
    }

    private void showProgressDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this, R.style.alertDialogTheme);
        builder.setView(R.layout.progress_dialog_create_wallet);
        createWalletProgress = builder.create();
        createWalletProgress.setCancelable(false);
        createWalletProgress.setCanceledOnTouchOutside(false);
        createWalletProgress.show();
    }

    private void initNetworkSpinner() {
        List<String> spinnerItems = new ArrayList<>();
        spinnerItems.add("Jungle Testnet");

        ArrayAdapter<String> spinnerAdapter = new ArrayAdapter<>(
                this, R.layout.spinner_network_text_layout, spinnerItems
        );
        spinnerAdapter.setDropDownViewResource(R.layout.spinner_network_drop_down);
        spinnerNetwork.setAdapter(spinnerAdapter);
    }

    private void initScanner() {
        IntentIntegrator integrator = new IntentIntegrator(this);
        integrator.setDesiredBarcodeFormats(IntentIntegrator.QR_CODE);
        integrator.setPrompt("Private key");
        integrator.setBeepEnabled(false);
        integrator.setOrientationLocked(true);
        integrator.initiateScan();
    }

    @Override
    public void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);

        if (result != null && result.getContents() != null) {
            try {
                String scannedQrString = result.getContents();
                etPrivateKey.setText(scannedQrString);
            } catch (Exception e) {
                Log.e(TAG, "onActivityResult: Failed to parse qr", e);
            }
        }
    }

    @OnClick(R.id.btn_generate_wallet)
    void onGenerateWalletBtnClick() {
        mainViewModel.createWallet();
    }

    @OnClick(R.id.btn_wallet_more_options)
    void onMoreOptionsBtnClick() {
        PopupWindow popupWindow = new PopupWindowWallet(this, this);
        popupWindow.showAsDropDown(btnMoreOptions, -100, 0);
    }

    @OnClick(R.id.btn_send)
    void onSendBtnClick() {
        SendRequest sendRequest = new SendRequest();
        sendRequest.setKey(mainViewModel.getPrivateKey());
        sendRequest.setAmountEfx(mainViewModel.getWalletBalance() + " EFX");
        DialogFragment sendFragment = new SendFragment(sendRequest);
        sendFragment.show(getSupportFragmentManager(), Constants.FRAGMENT_SEND);
    }

    @OnClick(R.id.btn_receive)
    void onReceiveBtnClick() {
        DialogFragment walletQrDialog = new CreateWalletQrDialog(
                mainViewModel.getWalletPublicKey(), mainViewModel.getAccountId()
        );
        walletQrDialog.show(getSupportFragmentManager(), Constants.DIALOG_WALLET_QR);
    }

    @Override
    public void onCampaignClicked(Campaign campaign) {
        Log.d(TAG, "onCampaignClicked: " + campaign.toString());
    }

    @OnClick(R.id.btn_search)
    void onSearchBtnClick(){
        Toast.makeText(this, "Search functionality coming soon!", Toast.LENGTH_SHORT).show();
    }

    @OnClick(R.id.btn_create_campaign)
    void onCreateCampaignBtnClick(){
        DialogFragment sendFragment = new CreateCampaignFragment();
        sendFragment.show(getSupportFragmentManager(), Constants.FRAGMENT_CREATE_CAMPAIGN);
    }

    public void addItemToCampaign(Campaign campaign){
        mainViewModel.getListCampaigns().add(campaign);
        campaignAdapter.notifyDataSetChanged();
    }
}