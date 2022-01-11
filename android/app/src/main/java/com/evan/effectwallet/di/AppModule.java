package com.evan.effectwallet.di;

import android.app.Application;

import com.evan.effectwallet.BaseApplication;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;

@Module
@InstallIn(SingletonComponent.class)
public class AppModule {

    @Provides
    BaseApplication provideBaseApplication(Application application){
        return (BaseApplication) application;
    }
}
