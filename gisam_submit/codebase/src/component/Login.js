import React from 'react';
import { Button, Grid, Typography } from '@mui/material';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import Web3 from 'web3';
import { useTranslation } from 'react-i18next';
import BinanceIcon from '@iconify-icons/simple-icons/binance';
import { Icon } from '@iconify/react';
import effectico from '../assets/favicon.ico';

const effectsdk = require('@effectai/effect-js');

export const dataNetwork = [
  {
    chainId: '0x38',
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    blockExplorerUrls: ['https://bscscan.com/'],
  },
];

export const trySwitchNetwork = (provider) => {
  try {
    provider?.request({
      method: 'wallet_addEthereumChain',
      params: dataNetwork,
    });
  } catch (err) {
    // eslint-disable-next-line
  }
};
export function Login({
  setProvider,
  address,
  setAddress,
  effect,
  setEffect,
  setClient,
}) {
  const { t } = useTranslation();
  // const comute = async () => {
  //   const client = new effectsdk.EffectClient('jungle'); // kylin
  //   const balanceReponse = await client.force.getPendingBalance();

  //   const randomNumber = Math.floor(Math.random() * 10) + 1;
  //   const campaignResponse = await client.force.getCampaign(randomNumber);
  //   console.log(JSON.stringify(campaignResponse), JSON.stringify(balanceReponse));
  // };

  const connect = async () => {
    // comute();

    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          rpc: {
            97: dataNetwork.rpcUrls,
            56: dataNetwork.rpcUrls,
          },
        },
      },
    };

    const web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      cacheProvider: false, // optional
      providerOptions, // required
    });

    web3Modal.clearCachedProvider();
    const localprovider = await web3Modal.connect();
    const web3 = new Web3(localprovider);
    setProvider(web3);
    setAddress((await web3.eth.getAccounts())[0]);
    await trySwitchNetwork(web3);
    const client = new effectsdk.EffectClient('jungle'); // kylin
    setClient(client);
    const connectReponse = await client.connectAccount(web3, address);
    setEffect(connectReponse.accountName);
  };
  return (
    <Grid
      container
      spacing={1}
      direction="row"
      justify="center"
      alignItems="center"
      alignContent="center"
      wrap="nowrap"
    >
      <Grid item align="center">
        <Grid container spacing={2}>
          <Grid item>
            { !address || !effect ? (
              <Button
                endIcon={!address || !effect ? <Icon icon={BinanceIcon} style={{ fontSize: '1.5em' }} /> : undefined}
                color="secondary"
                variant="outlined"
                align="center"
                onClick={() => {
                  connect();
                }}
              >

                <Typography
                  fontSize="1em"
                  color="secondary"
                >
                  {t('login.login')}
                </Typography>
              </Button>
            )
              : (
                <>
                  <Grid item>
                    <Icon icon={BinanceIcon} color="secondary" style={{ fontSize: '1.5em', color: '#0a7cff' }} />
                    <Typography
                      fontSize="1em"
                      color="secondary"
                      variant="p"
                    >
                      {`${address.slice(0, 4).toUpperCase()}...${String(address).toUpperCase().slice(-8)}`}
                    </Typography>
                  </Grid>
                  <Grid item>

                    <Typography
                      fontSize="1em"
                      color="secondary"
                    >
                      <img alt="effect logo" src={effectico} style={{ height: '1.5em' }} />
                      {`${effect.slice(0, 4).toUpperCase()}...${String(effect).toUpperCase().slice(-8)}`}
                    </Typography>
                  </Grid>
                </>
              )}
          </Grid>
        </Grid>

      </Grid>
    </Grid>
  );
}

export default Login;
