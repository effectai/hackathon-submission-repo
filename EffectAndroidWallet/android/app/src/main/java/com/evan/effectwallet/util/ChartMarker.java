package com.evan.effectwallet.util;

import android.annotation.SuppressLint;
import android.content.Context;

import com.github.mikephil.charting.components.MarkerView;
import com.github.mikephil.charting.utils.MPPointF;

@SuppressLint("ViewConstructor")
public class ChartMarker extends MarkerView {

    /**
     * Constructor. Sets up the MarkerView with a custom layout resource.
     *
     * @param context
     * @param layoutResource the layout resource to use for the MarkerView
     */
    public ChartMarker(Context context, int layoutResource) {
        super(context, layoutResource);
    }

    @Override
    public MPPointF getOffset() {
        return new MPPointF(-(getWidth() / 2f), -getHeight() / 2f);
    }
}

