import React, { Suspense } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import { Login } from './Login';
import { Home } from './Home';
import { LanguageSelector } from './LanguageSelector';
import { CampaignBase } from './Campaign/CampaignBase';
import { Create } from './Create';
import { CampaignList } from './CampaignList';
import { DisplayCampaign } from './DisplayCampaign';

function Body({ page, client }) {
  switch (page) {
    case 'campaign':
      return <CampaignBase />;
    case 'create':
      return <Create client={client} />;
    case 'result':
      return <CampaignList client={client} owned />;
    case 'campaigncreatordetail':
      return <DisplayCampaign client={client} />;
    case 'campaignworker':
      return <DisplayCampaign client={client} hideaddbatch />;
    case 'currentcampaign':
      return <CampaignList client={client} worker />;
    case 'participate':
      return <CampaignBase client={client} />;
    case 'home':
    default:
      return <Home />;
  }
}

const renderLoader = () => <CircularProgress color="secondary" />;

export function Base({ page }) {
  const [provider, setProvider] = React.useState();
  const [address, setAddress] = React.useState();
  const [effect, setEffect] = React.useState();
  const [client, setClient] = React.useState();

  return (
    <Suspense fallback={renderLoader()}>
      <AppBar position="static">
        <Toolbar style={{ backgroundColor: '#ffff' }}>
          <IconButton
            component={Link}
            to="/"
            color="secondary"
          >
            <HomeIcon />
          </IconButton>
          <Login
            setProvider={setProvider}
            address={address}
            setAddress={setAddress}
            provider={provider}
            effect={effect}
            setEffect={setEffect}
            setClient={setClient}
          />
          <LanguageSelector />
        </Toolbar>
      </AppBar>
      <Body page={page} client={effect ? client : undefined} />
    </Suspense>
  );
}

export default Base;
