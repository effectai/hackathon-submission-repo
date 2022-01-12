import React from 'react';
import { Tweet } from 'react-twitter-widgets';
import {
  TextField, Grid, Typography, Button, FormGroup,
  FormControlLabel, Checkbox,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function Field({
  field, i, values, setValues,
}) {
  // console.log({ field }, { i }, { values });
  const { t } = useTranslation();
  switch (field.type) {
    case 'text':
      return (
        <Grid item>
          <Typography>{t('campaignfields.textexplain', { ...field })}</Typography>
          <TextField
            label={field.description}
            onChange={(e) => {
              setValues({ ...values, [i]: e.target.value.slice(0, Number(field.max)) });
            }}
            value={values[i] || ''}
          />
        </Grid>
      );

    case 'option':
      return (
        <Grid item>
          <Typography gutterBottom>{t('campaignfields.optionexplain', { ...field })}</Typography>
          <FormGroup>

            {field.options.map((e, j) => (
              <FormControlLabel
                color="secondary"
                onChange={() => {
                  const v = values[i] || [...(Array(field.options.length))].map(() => false);
                  v[j] = !v[j];
                  setValues({ ...values, [i]: [...v] });
                }}
                control={(
                  <Checkbox
                    disabled={
                      values[i]
                   && !values[i][j]
                   && values[i].reduce((acc, f) => (acc + (f ? 1 : 0)), 0) === field.max
}
                    checked={!values[i] ? false : values[i][j]}
                  />
)}
                label={e}
              />
            ))}
          </FormGroup>

        </Grid>
      );
    case 'number':
    default:
      return (
        <Grid item>
          <Typography>{t('campaignfields.numberexplain', { ...field })}</Typography>
          <TextField
            type="number"
            label={field.description}
            onChange={(e) => {
              if (Number(e.target.value) <= field.max && Number(e.target.value) >= field.min) {
                setValues({ ...values, [i]: e.target.value });
              }
            }}
            value={values[i] || ''}
          />
        </Grid>
      );
  }
}
export function CampaignTweet({ tweetid }) {
  return <Tweet tweetId={tweetid} />;
}
export function CampaignPicture({ url }) {
  return <img alt="task" src={url} />;
}

export function CampaignBase({ campaign, data }) {
  const { t } = useTranslation();
  // const [batchInfo, setBatchInfo] = React.useState();
  // const [batchInfo, setBatchInfo] = React.useState();
  // React.useEffect(() => {
  //   const x = async () => {
  //     getCampaign
  //   };
  //   if (!campaign) {
  //     x()
  //   }
  // }, [client]);
  const [values, setValues] = React.useState({});
  // const fakeBatchInfo = { tweet_id: '20', url: 'https://pbs.twimg.com/profile_images/1115644092329758721/AFjOr-K8_400x400.jpg' };

  function CampaignSwitch() {
    switch (campaign.info.type) {
      case 'twitter':
        return <CampaignTweet tweetid={data.tweet_id} />;
      default:
        return <CampaignPicture url={data.tweet_id} />;
    }
  }
  return (
    <>
      {campaign.info.fields.map(
        (e, i) => <Field field={e} i={i} values={values} setValues={setValues} />,
      )}
      <CampaignSwitch />

      <Button variant="contained" onClick={() => console.log(JSON.stringify(values))}>{t('campaignbase.submit')}</Button>

    </>
  );
}

export default CampaignBase;
