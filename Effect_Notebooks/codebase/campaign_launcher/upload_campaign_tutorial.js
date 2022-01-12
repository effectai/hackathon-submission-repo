const uploadCampaignIpfs = {

    // The title of the campaign
    title: 'Notebook Wrapper Template test',

    // Description of the campaign
    description: 'Summarize raw data',

    // Instructions for workers on how to complete tasks, accepts Markdown
    instructions: 'Summarize raw data',

    // The template that will be used for the tasks
    template: `<div>
            <h1>Effect Notebooks Client</h1>
            <p>` + '${notes}' + `</p>
            <iframe src="http://localhost:8888" name="notebook" frameborder="0" style="width: 100%;
        height: 800px;">
        </div>`,

    // Campaign image
    image: 'https://effect-notebooks-public.s3.amazonaws.com/data_science_img.jpg',

    // The category of the campaign
    category: 'Notebooks',

    // Example task that will prefill the task template
    example_task: {
        // 'raw_data': 'https://effect-notebooks-public.s3.amazonaws.com/sample_baseball.csv'
        'notes': 'these are sample notes about what the data should be'
    },

    // Version of the campaign
    version: 1,

    // Amount of EFX to reward for completing a task
    reward: 1
}

require('dotenv').config();

const runMain = async function () {
    const effectsdk = require('@effectai/effect-js');
    const client = new effectsdk.EffectClient('jungle');
    console.log("SDK ready");

    const account = effectsdk.createAccount(process.env.PKEY);
    const web3 = effectsdk.createWallet(account);
    const effectAccount = await client.connectAccount(web3);
    console.log("acct connected", effectAccount);

    const makeCampaign = await client.force.makeCampaign(uploadCampaignIpfs, '2');
    console.log("campaign created", makeCampaign);
}

runMain();