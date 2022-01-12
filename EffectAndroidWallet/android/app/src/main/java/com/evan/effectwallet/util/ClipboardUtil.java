package com.evan.effectwallet.util;

import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;

public class ClipboardUtil {
    public static void copyText(Context context, String text){
        ClipboardManager clipboard = (ClipboardManager)
                context.getSystemService(Context.CLIPBOARD_SERVICE);
        ClipData clip = ClipData.newPlainText("Text label", text);
        clipboard.setPrimaryClip(clip);
    }
}
