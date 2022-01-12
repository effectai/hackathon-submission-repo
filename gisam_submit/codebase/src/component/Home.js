import React from 'react';
import { Button, Grid } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Steps({ state, setState, t }) {
  switch (state) {
    case 'creator':
      return (
        <>
          <Grid item>
            <Button variant="contained" color="secondary" component={Link} to="/create">{t('login.createcampaign')}</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" component={Link} to="/result">{t('login.checkcampaign')}</Button>
          </Grid>
        </>
      );
    case 'worker':
      return (
        <Grid item>
          <Button variant="contained" color="secondary" component={Link} to="/currentcampaign">{t('login.currentcamaign')}</Button>
        </Grid>
      );
    default:
      return (
        <>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => setState('creator')}>{t('login.campaigncreator')}</Button>
          </Grid>
          <Grid item>
            <Button variant="contained" color="secondary" onClick={() => setState('worker')}>{t('login.worker')}</Button>
          </Grid>
        </>
      );
  }
}
export function Home() {
  const { t } = useTranslation();
  const [state, setState] = React.useState();

  return (
    <Grid
      container
      spacing={1}
      direction="column"
      justify="center"
      alignItems="center"
      alignContent="center"
      align="center"
      wrap="nowrap"
    >
      <Grid item style={{ paddingTop: '40vh', height: '100vh' }}>
        <Grid
          container
          spacing={1}
          direction="column"
          justify="center"
          alignItems="center"
          alignContent="center"
          align="center"
          wrap="nowrap"
        >
          <Steps state={state} setState={setState} t={t} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default Home;
