package com.evan.effectwallet.di;

import com.evan.effectwallet.domain.MainService;

import javax.inject.Singleton;

import dagger.Module;
import dagger.Provides;
import dagger.hilt.InstallIn;
import dagger.hilt.components.SingletonComponent;
import retrofit2.Retrofit;

@Module
@InstallIn(SingletonComponent.class)
public class MainRepositoryModule {

    @Provides
    @Singleton
    public MainService provideMainService(Retrofit retrofit){
        return retrofit.create(MainService.class);
    }
}
