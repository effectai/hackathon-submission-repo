
const express = require('express')
const app = express();
const port = 8080;
const bodyParser = require("body-parser");

const createWallet = require('./routes/create-wallet');
const getBalance = require('./routes/get-balance');
const getAccount = require('./routes/get-account');
const send = require('./routes/send');
const home = require('./routes/home');
const createCampaign = require('./routes/create-campaign');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/create-wallet', createWallet);
app.use('/get-balance', getBalance);
app.use('/get-account', getAccount);
app.use('/send', send);
app.use('/create-campaign', createCampaign);
app.use('/', home);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});