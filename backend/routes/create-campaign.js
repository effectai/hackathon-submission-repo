const express = require('express');
const router = express.Router();
const effectsdk = require('@effectai/effect-js');
const client = new effectsdk.EffectClient('jungle')

router.post('/', async function (req, res) {

    let key = req.body.key;
    let title = req.body.title;
    let description = req.body.description;
    let instructions = req.body.instructions;
    let campaignUrl = req.body.campaign_url;
    let amountEfxToAward = req.body.amount_efx_to_award;
    let questionOne = req.body.question_one;
    let questionTwo = req.body.question_two;
    let questionThree = req.body.question_three;
    let questionFour = req.body.question_four;
    let questionFive = req.body.question_five;

    const uploadCampaignIpfs = {
        title: title,
        description: description,   
        instructions: instructions,  
      
        template: `<div id="task">
        <image src='${campaignUrl}}'></image>
        <h2>${title}</h2>
        
        <form class="workorder-form">
          <h4>${description}</h4>
          <h4>${instructions}</h4>
          <label>${questionOne}</label>
          <input type="text" name="questionOne" value="" />
          <br />
          <br />
      
          <label>${questionTwo}</label>
          <input type="text" name="questionTwo" value="" />
          <br />
          <br />
      
          <label>${questionThree}</label>
          <input type="text" name="questionThree" value="" />
          <br />
          <br />
      
          <label>${questionFour}</label>
          <input type="text" name="questionFour" value="" />
          <br />
          <br />
      
          <label>${questionFive}</label>
          <input type="text" name="questionFive" value="" />
          <br />
          <br />
          <button type="submit">Submit</button>
      
         
        </form>
          
      </div>`,      
      
        image: campaignUrl,  
        category: 'Post event survey',     
        example_task: {
          'image_url': campaignUrl
        },
        version: 1,        
        reward: amountEfxToAward        
      }

    try {
        const account = effectsdk.createAccount(key);
        const web3 = effectsdk.createWallet(account);
        await client.connectAccount(web3);
        await client.force.makeCampaign(uploadCampaignIpfs, '1')
        const lastCampaign = await client.force.getMyLastCampaign();
        
        const content = {
            'tasks': [
                {"ipfs": "bafkreiggnttdaxleeii6cdt23i4e24pfcvzyrndf5kzfbqgf3fxjryj5s4"}
            ]
        }

        //const batch = await client.force.createBatch(lastCampaign.id, content, 1)
        //console.log('Batch: ' + JSON.stringify(batch));
        return res.status(200).send(JSON.stringify(lastCampaign));

    } catch (err) {
        console.log("Error: " + err)
        return res.status(500).send(err)
    }
});

module.exports = router;
