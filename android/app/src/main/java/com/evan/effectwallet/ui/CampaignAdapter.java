package com.evan.effectwallet.ui;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.resource.bitmap.CenterCrop;
import com.bumptech.glide.load.resource.bitmap.GranularRoundedCorners;
import com.evan.effectwallet.R;
import com.evan.effectwallet.domain.model.Campaign;

import java.util.List;

import butterknife.BindView;
import butterknife.ButterKnife;

public class CampaignAdapter extends RecyclerView.Adapter<CampaignAdapter.ViewHolder> {

    private final CampaignAdapterCallback callback;
    private final List<Campaign>          list;

    public interface CampaignAdapterCallback {
        void onCampaignClicked(Campaign campaign);
    }

    public CampaignAdapter(List<Campaign> list, CampaignAdapterCallback campaignAdapterCallback) {
        this.list = list;
        this.callback = campaignAdapterCallback;
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.viewholder_campaign, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int i) {

        Glide.with(holder.itemView.getContext())
                .load(list.get(i).getCampaignUrl())
                .transform(
                        new CenterCrop(),
                        new GranularRoundedCorners(24, 24, 24, 24)
                )
                .into(holder.ivPreview);

        holder.itemName.setText(list.get(i).getTitle());
        holder.tvCampaignId.setText("Campaign id: " + list.get(i).getCampaignId());
    }


    @Override
    public int getItemCount() {
        return list.size();
    }

    public class ViewHolder extends RecyclerView.ViewHolder implements View.OnClickListener {

        @BindView(R.id.tv_campaign_preview)
        ImageView ivPreview;

        @BindView(R.id.parent_layout)
        ViewGroup parentLayout;

        @BindView(R.id.tv_item_name)
        TextView itemName;

        @BindView(R.id.tv_campaign_id)
        TextView tvCampaignId;

        int position;

        ViewHolder(@NonNull View itemView) {
            super(itemView);
            ButterKnife.bind(this, itemView);
            itemView.setOnClickListener(this);
        }

        @Override
        public void onClick(View v) {
            position = getAdapterPosition();
            callback.onCampaignClicked(list.get(position));
        }
    }
}
