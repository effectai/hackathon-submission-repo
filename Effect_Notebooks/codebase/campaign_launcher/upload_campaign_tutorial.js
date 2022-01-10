const uploadCampaignIpfs = {

    // The title of the campaign
    title: 'Raw Data Test Campaign',

    // Description of the campaign
    description: 'Summarize raw data',

    // Instructions for workers on how to complete tasks, accepts Markdown
    instructions: 'Summarize raw data',

    // The template that will be used for the tasks
    template: `<div>
        <h1>Test CSV Template</h1>
        <a href='` + '${raw_data}' + `' download="efx_notebook_sample.csv">Download Sample Data</a>
        <input type="text" name="data_summary" id="data_summary" placeholder="Summarize Data">
        <button submit type='button'>Submit</button>
    </div>
    `,

    // Campaign image
    image: 'https://effect-notebooks-public.s3.amazonaws.com/data_science_img.jpg',

    // The category of the campaign
    category: '',

    // Example task that will prefill the task template
    example_task: {
        'raw_data': 'https://effect-notebooks-public.s3.amazonaws.com/sample_baseball.csv'
    },

    // Version of the campaign
    version: 1,

    // Amount of EFX to reward for completing a task
    reward: 1
}

const runMain = async function () {
    const effectsdk = require('@effectai/effect-js');
    const client = new effectsdk.EffectClient('jungle');
    console.log("SDK ready");

    const account = effectsdk.createAccount();
    const web3 = effectsdk.createWallet(account);
    const effectAccount = await client.connectAccount(web3);
    console.log("acct connected", effectAccount);

    const makeCampaign = await client.force.makeCampaign(uploadCampaignIpfs, '10');
    console.log("campaign created", makeCampaign);
}

runMain();