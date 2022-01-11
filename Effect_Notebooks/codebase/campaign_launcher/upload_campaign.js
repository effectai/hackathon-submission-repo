const uploadCampaignIpfs = {

    // The title of the campaign
    title: 'Effect Notebooks Test',

    // Description of the campaign
    description: 'Allow users to submit notebooks with data science insights into the data provided',

    // Instructions for workers on how to complete tasks, accepts Markdown
    instructions: 'Analyze the data in the given CSV',

    // The template that will be used for the tasks
    template: `
    


    
    `,

    // Campaign image
    image: 'https://effect-notebooks-public.s3.amazonaws.com/data_science_img.jpg',

    // The category of the campaign
    category: 'Data Science',

    // Example task that will prefill the task template
    example_task: {
        'notebook': 'http://localhost:8888/notebooks/virtualFileSystem/task_notebook.ipynb',
        'notes': 'Sample notes on how the data should be cleaned'
    },

    // Version of the campaign
    version: 1,

    // Amount of EFX to reward for completing a task
    reward: 1
}

const account = effectsdk.createAccount(process.env.privateKey);
const web3 = effectsdk.createWallet(account);
const effectAccount = await client.connectAccount(web3);

const makeCampaign = await client.force.makeCampaign(campaignToIpfs, '10')
