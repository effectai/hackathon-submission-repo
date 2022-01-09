import React from 'react';
import {
  Button, Grid, Select, MenuItem, Typography,
  TextField, CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const AddingField = React.memo(({
  type,
  t,
  fields,
  setFields,
  setAdding,
}) => {
  const [minValue, setMinValue] = React.useState(0);
  const [maxValue, setMaxValue] = React.useState(10);
  const [maxSelectField, setMaxSelectField] = React.useState(1);
  const [maxLen, setMaxLen] = React.useState(50);
  const [optionNumber, setOptionNumber] = React.useState(2);
  const [options, setOptions] = React.useState(['', '']);
  // React.useEffect(() => {
  //   setOptions([...Array(optionNumber).map(() => '')]);
  // }, optionNumber);
  const [description, setDescription] = React.useState('');
  switch (type) {
    case 'number':
      return (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>{t('create.questiondescribe')}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth value={description} label={t('create.question')} multiline rows={4} onChange={(e) => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth value={minValue} label={t('create.minimumvalue')} type="number" onChange={(e) => setMinValue(String(Number(e.target.value)))} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth value={maxValue} label={t('create.maximumvalue')} type="number" onChange={(e) => setMaxValue(String(Number(e.target.value)))} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button
              fullWidth
              disabled={Number(minValue) >= Number(maxValue) || !description}
              variant="contained"
              color="primary"
              onClick={() => {
                setFields([...fields, {
                  type, min: minValue, max: maxValue, description,
                }]);
                setAdding(false);
              }}
            >
              {t('create.addingthisfield')}

            </Button>
          </Grid>
        </>
      );
    case 'text':
      return (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>{t('create.questiondescribe')}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth value={description} label={t('create.question')} multiline rows={4} onChange={(e) => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth value={maxLen} label={t('create.maxlen')} type="number" onChange={(e) => setMaxLen(String(Number(e.target.value)))} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button
              fullWidth
              disabled={maxLen < 1 || !description}
              variant="contained"
              color="primary"
              onClick={() => {
                setFields([...fields, {
                  type, max: maxLen, description,
                }]);
                setAdding(false);
              }}
            >
              {t('create.addingthisfield')}

            </Button>
          </Grid>
        </>
      );
    case 'option':
      return (
        <>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>{t('create.questiondescribe')}</Typography>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField fullWidth value={description} label={t('create.question')} multiline rows={4} onChange={(e) => setDescription(e.target.value)} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              fullWidth
              value={optionNumber}
              label={t('create.numberoption')}
              type="number"
              onChange={(e) => {
                setOptionNumber(String(Number(e.target.value)));
                setOptions([...Array(Number(e.target.value))].map(() => ''));
              }}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              value={maxSelectField}
              label={t('create.maximumselectable')}
              type="number"
              onChange={(e) => setMaxSelectField(String(Math.max(
                0,
                Math.min(Number(e.target.value), Number(optionNumber)),
              )))}
              fullWidth

            />
          </Grid>

          {options.map((e, i) => (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <TextField
                fullWidth
                value={e}
                label={t('create.optionnumber', { i })}
                onChange={(f) => {
                  const old = [...options];
                  old[i] = f.target.value;
                  setOptions(old);
                }}
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button
              fullWidth
              disabled={!description || !options.every((e) => e)}
              variant="contained"
              color="primary"
              onClick={() => {
                setFields([...fields, {
                  type, max: maxSelectField, description, options,
                }]);
                setAdding(false);
              }}
            >
              {t('create.addingthisfield')}

            </Button>
          </Grid>
        </>
      );
    default:
      return '';
  }
});
function FormatCampaignOption({ value, t }) {
  switch (value.type) {
    case 'text':
      return <Typography gutterBottom>{t('create.textexplain', value)}</Typography>;
    case 'option':
      return <Typography gutterBottom>{t('create.optionexplain', { ...value, option: value.options.join(', ') })}</Typography>;
    case 'number':
    default:
      return <Typography gutterBottom>{t('create.numberexplain', value)}</Typography>;
  }
}
const exampleTask = (type) => {
  switch (type) {
    case 'twitter':
      return { tweet_id: '12' };
    case 'picture':
    default:
      return { url: 'https://example.com/t.gif' };
  }
};
export function Create({ client }) {
  const { t } = useTranslation();
  const [campaignType, setCampaignType] = React.useState(t('twitter'));
  const [fieldType, setFieldType] = React.useState(t('option'));
  const [adding, setAdding] = React.useState(true);
  const [fields, setFields] = React.useState([]);
  const [reward, setReward] = React.useState();
  const [title, setTitle] = React.useState();
  const [description, setDescription] = React.useState();
  const [waiting, setWaiting] = React.useState(false);
  const navigate = useNavigate();

  const submitCampaign = async () => {
    setWaiting(true);
    const data = {
      title,
      description,
      reward,
      fields,
      type: campaignType,
      example_task: exampleTask(campaignType),
    };
    const campaignToIpfs = {
      ...data,
      instructions: 'Follow the instructions below',
      category: 'simpleuidemo',
      version: 1,
    };

    console.log({ data });
    const quantity = 1; // How much EFX is rewarded for each task.
    try {
      const makeCampaingResponse = await client.force.makeCampaign(campaignToIpfs, quantity);
      await client.force.waitTransaction(makeCampaingResponse);
      navigate('/result');
    } catch (error) {
      console.log({ error });
    }
  };

  if (waiting) {
    return <CircularProgress />;
  }
  return (
    <Grid
      container
      spacing={2}
      direction="row"
      justify="center"
      alignItems="center"
      alignContent="center"
      align="center"
    >
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
        <Grid
          maxWidth="md"
          container
          spacing={1}
          direction="row"
          justify="center"
          alignItems="center"
          alignContent="center"
          align="center"
          style={{ paddingTop: '5vh' }}
        >
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              fullWidth
              label={t('create.title')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              fullWidth
              label={t('create.description')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <TextField
              type="number"
              fullWidth
              label={t('create.reward')}
              value={reward}
              onChange={(e) => setReward(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>{t('create.campaigntype')}</Typography>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Select
              fullWidth
              value={campaignType}
              onChange={(e) => setCampaignType(e.target.value)}
            >
              <MenuItem value="twitter">{t('create.twitter')}</MenuItem>
              <MenuItem value="picture">{t('create.picture')}</MenuItem>
            </Select>
          </Grid>
          {fields.map((e) => <FormatCampaignOption value={e} t={t} />)}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button fullWidth disabled={adding} variant="contained" color="secondary" onClick={() => setAdding(true)}>{t('create.addingfield')}</Button>
          </Grid>
          {adding
            ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="h5" color="initial">{t('create.selecttypeoffield')}</Typography>
                <Select fullWidth value={fieldType} onChange={(e) => setFieldType(e.target.value)}>
                  <MenuItem value="option">{t('create.option')}</MenuItem>
                  <MenuItem value="text">{t('create.textfield')}</MenuItem>
                  <MenuItem value="number">{t('create.numberfield')}</MenuItem>
                </Select>
              </Grid>
            ) : ''}
          {adding
            ? (
              <AddingField
                type={fieldType}
                t={t}
                setAdding={setAdding}
                fields={fields}
                setFields={setFields}
              />
            )
            : ''}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Button
              fullWidth
              disabled={fields.length === 0 || !title || !reward || !description || !client}
              variant="contained"
              color="primary"
              onClick={() => {
                submitCampaign();
              }}
            >
              {t('create.validate')}
            </Button>
          </Grid>
        </Grid>
        {/* </Container> */}
      </Grid>
    </Grid>
  );
}

export default Create;
