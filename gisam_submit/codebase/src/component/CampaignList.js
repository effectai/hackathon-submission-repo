import React from 'react';
import { Typography, Grid, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const effectsdk = require('@effectai/effect-js');

export function CampaignList({ client, owned, worker }) {
  const { t } = useTranslation();
  const [campaigns, setCampaigns] = React.useState();
  const getCampaign = async (c) => {
    const retrieve = await c.force.getCampaigns(undefined, 500, false);
    const result = (await Promise.all(
      retrieve.rows.map((e) => c.force.getIpfsContent(e.content.field_1)),
    ))
      .map((e, i) => ({ ...e, id: retrieve.rows[i].id, owner: retrieve.rows[i].owner }))
      .filter((e) => e.category === 'simpleuidemo')
      .filter((e) => {
        if (owned) {
          return e.owner[1] === client?.effectAccount?.accountName;
        }
        return true;
      });
    setCampaigns(result.reverse());
  };
  React.useEffect(() => {
    const c = new effectsdk.EffectClient('jungle');
    getCampaign(c);
  }, [client]);
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
      <Grid item style={{ paddingTop: '5vh' }}>
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
          {owned && !client?.effectAccount?.accountName ? <Typography>{t('campaignlist.connect')}</Typography>
            : campaigns?.map((e) => {
              const to = worker ? '/campaignworker/' : '/campaigncreatordetail/';
              return (
                <Grid item>
                  <Button variant="outlined" color="secondary" component={Link} to={to + e.id}>
                    {e.title}
                    {' '}
                    {e.id}
                  </Button>
                </Grid>
              );
            })}

        </Grid>
      </Grid>
    </Grid>
  );
}

export default CampaignList;
