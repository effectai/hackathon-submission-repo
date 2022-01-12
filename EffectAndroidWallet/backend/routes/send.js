const express = require('express');
const router = express.Router();
const effectsdk = require('@effectai/effect-js');
const client = new effectsdk.EffectClient('jungle')

router.post('/', async function (req, res) {
    let key = req.body.key;
    let sendToAccountId = req.body.send_to_account_id;
    let amount_efx = req.body.amount_efx;


    if (typeof key === 'undefined' ||
        typeof sendToAccountId === 'undefined' ||
        typeof amount_efx === 'undefined') {

        return res.status(400).send('Invalid request param');
    }

    try {
        const account = effectsdk.createAccount(key);
        const web3 = effectsdk.createWallet(account);
        await client.connectAccount(web3);
        await client.account.vtransfer(sendToAccountId, amount_efx);

        return res.status(200).send({success : true});
    } catch (err) {
        console.log(err);
        return res.status(500).send({success : false});
    }

});

module.exports = router;
