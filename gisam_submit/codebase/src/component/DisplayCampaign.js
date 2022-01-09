import React from 'react';
import {
  CircularProgress, Grid, Typography, Button,
  TextField,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CampaignBase } from './Campaign/CampaignBase';

const formatData = (type, data) => {
  switch (type) {
    case 'twitter':
      return { tasks: data.split('\n').filter((e) => e.length).map((e) => ({ tweet_id: e })) };
    case 'picture':
    default:
      return { tasks: data.split('\n').filter((e) => e.length).map((e) => ({ url: e })) };
  }
};

export function DisplayCampaign({ client, hideaddbatch }) {
  const { t } = useTranslation();
  const { id } = useParams();
  const [campaign, setCampaign] = React.useState();
  const [campaignBatch, setCampaignBatch] = React.useState();
  const [openbatch, setOpenbatch] = React.useState(false);
  const [contentBatch, setContentBatch] = React.useState('');
  const [disableSubmit, setDisableSubmit] = React.useState(false);
  const [selected, setSelected] = React.useState();
  const [selectedTask, setSelectedTask] = React.useState(0);
  const [repetitions, setRepetition] = React.useState(1);
  const x = async () => {
    const campaignl = await client.force.getCampaign(Number(id));

    setCampaign(campaignl);
    const campaignbatchl = await client.force.getCampaignBatches(Number(id));

    setCampaignBatch(await Promise.all(campaignbatchl.map(async (e) => {
      const data = await client.force.getIpfsContent(e.content.field_1);
      console.log({ data });
      return { ...e, data };
    })));
    console.log({ campaignl }, {
      campaignbatchl,
    });
  };
  React.useEffect(() => {
    if (client && id) {
      x();
    }
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
        {campaign ? (
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

            <Grid item>
              <Typography variant="h5" color="initial">{campaign?.info?.title}</Typography>
              <Typography variant="h6" color="initial">{campaign?.info?.description}</Typography>
              <Typography variant="h6" color="initial">
                {campaign?.info?.reward}
                {' '}
                efx
              </Typography>

            </Grid>
            {campaignBatch === undefined ? (
              <Grid item>
                <Typography variant="h5" color="initial">{t('display.loadingbatch')}</Typography>
                <CircularProgress color="secondary" />
              </Grid>
            ) : ''}

            {campaign.owner[1] === client?.effectAccount?.accountName && !hideaddbatch
              ? (
                <>
                  <Grid item>
                    {openbatch
                      ? (
                        <>
                          <TextField
                            value={contentBatch}
                            onChange={(e) => {
                              let tmp = e.target.value;
                              console.log({ tmp }, campaign);
                              if (campaign.info.type === 'twitter') {
                                tmp = tmp.split('\n').map((f) => f.replace(/\D/g, '')).join('\n');
                              }
                              setContentBatch(tmp);
                            }}
                            label={t('display.enteryourdata')}
                            multiline
                            rows={5}
                          />
                          <TextField
                            value={repetitions}
                            type="number"
                            onChange={(e) => setRepetition(String(Number(e.target.value)))}
                            label={t('display.repetition')}
                          />
                        </>
                      )
                      : ''}
                  </Grid>
                  <Grid item>
                    <Button
                      variant="outlined"
                      color="secondary"
                      disabled={disableSubmit || (openbatch && (!contentBatch || !repetitions))}
                      onClick={async () => {
                        if (openbatch) {
                          try {
                            setDisableSubmit(true);
                            const content = formatData(campaign.info.type, contentBatch);
                            const batch = await client.force.createBatch(
                              Number(id),
                              content,
                              repetitions,
                            );
                            await client.force.waitTransaction(batch);
                          } catch (error) {
                            console.log({ error });
                          } finally {
                            setDisableSubmit(false);
                          }
                        } else {
                          setContentBatch('');
                        }
                        setOpenbatch(!openbatch);
                      }}
                    >
                      {t('display.addbatch')}
                    </Button>
                  </Grid>
                  <Grid item>
                    {disableSubmit ? <CircularProgress /> : ''}
                  </Grid>
                </>
              ) : ''}
            {campaignBatch?.map((e, i) => (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography>
                  {'id '}
                  {e.id}
                  {' reservation '}
                  {e.reservation}
                  {' num_tasks '}
                  {e.num_tasks}
                  {' tasks_done '}
                  {e.tasks_done}
                  {' batch_id '}
                  {e.batch_id}
                </Typography>
                <Button
                  color="secondary"
                  onClick={async () => {
                    try {
                      // if (!await client.force.getCampaignJoins(Number(id))) {
                      //   console.log(await client.force.joinCampaign(Number(id)));
                      // }
                      console.log(e);
                      setSelectedTask(0);
                      setSelected(i);
                      // return;
                      // console.log(await client.force.getSubmissionsOfBatch(403726925824));
                      // const tasks = await client.force.getIpfsContent(e.content.field_1);
                      // console.log(await
                      // client.force.reserveTask(e.batch_id, 0, e.campaign_id, tasks.tasks));
                      // await client.force.submitTask(403726925824, 159, 'test');
                    } catch (error) {
                      console.log({ error });
                    }
                  }}
                >
                  {t('display.reserve')}
                </Button>

              </Grid>
            ))}
            {campaignBatch && selected !== undefined ? (
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Button
                    color="secondary"
                    variant="outlined"
                    disabled={selectedTask === 0}
                    onClick={async () => {
                      setSelectedTask(selectedTask - 1);
                    }}
                  >
                    {t('display.prev')}
                  </Button>
                  <Button
                    variant="outlined"
                    disabled={selectedTask + 1 >= campaignBatch[selected].data.tasks.length}
                    color="secondary"
                    onClick={async () => {
                      console.log(selectedTask, campaignBatch[selected].data.tasks.length);
                      setSelectedTask(selectedTask + 1);
                    }}
                  >
                    {t('display.next')}
                  </Button>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <CampaignBase
                    campaign={campaign}
                    data={campaignBatch[selected].data.tasks[selectedTask]}
                  />
                </Grid>
              </Grid>
            )

              : ''}
          </Grid>
        ) : <CircularProgress color="secondary" />}
      </Grid>
    </Grid>
  );
}

export default DisplayCampaign;
