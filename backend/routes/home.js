const express = require('express');
const router = express.Router();
const effectsdk = require('@effectai/effect-js');
const client = new effectsdk.EffectClient('jungle')

router.get('/', async function (req, res) {
    res.send('welcome to effect wallet!');
});

module.exports = router;
