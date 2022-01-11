const express = require('express');
const router = express.Router();
const effectsdk = require('@effectai/effect-js');
const client = new effectsdk.EffectClient('jungle')

router.get('/', async function (req, res) {
    try{
        const account = effectsdk.createAccount();
        const web3 = effectsdk.createWallet(account)
        const effectAccount = await client.connectAccount(web3);
        account['accountId'] = effectAccount.vAccountRows[0].id;
        account['accountName'] = effectAccount.accountName;
        return res.status(200).send(account);
    }catch(err) {
        console.log(err);
        return res.status(500).send(err);
    }
});

module.exports = router;
