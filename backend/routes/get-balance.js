const express = require('express');
const router = express.Router();
const effectsdk = require('@effectai/effect-js');
const client = new effectsdk.EffectClient('jungle')

router.get('/', async function (req, res) {
    let accountName = req.query.account_name;
    if (typeof accountName === 'undefined') {
        return res.status(400).send('Invalid request param');
    }

    try {
        const accountInfo = await client.force.getVAccountByName(accountName);
        return res.status(200).send(JSON.stringify(accountInfo[0].balance));
    } catch (err) {
        console.log(err);
        return res.status(500).send(err);
    }

});

module.exports = router;
