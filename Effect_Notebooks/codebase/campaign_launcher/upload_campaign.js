const uploadCampaignIpfs = {

    // The title of the campaign
    title: 'Effect Notebooks Test 3',

    // Description of the campaign
    description: 'Create a method to clean data in an automated way, without viewing the original data yourself',

    // Instructions for workers on how to complete tasks, accepts Markdown
    instructions: 'Complete the implementation of the clean data method in the notebook. Use the supplied data to build your method',

    // The template that will be used for the tasks
    template: `<div style='height:100%;'>
    <script src='https://unpkg.com/@effectai/effect-js/dist/index.js'></script>
    <script src='https://code.jquery.com/jquery-3.6.0.min.js'
        integrity='sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=' crossorigin='anonymous'></script>
    <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css' rel='stylesheet'
        integrity='sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3' crossorigin='anonymous'>
        <script>setTimeout(() => window.forceResize(), 100)</script>
        <style>
        body {
            text-align: center;
            max-width: 90%;
            margin: 0 auto;
            font-family: Arial, Helvetica, sans-serif;
        }

        .card {
            padding: 20px;
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
        }

        button,
        input[type=file] {
            background-color: orange;
            /* Green */
            border: none;
            border-radius: 8px;
            color: white;
            padding: 10px 16px;
            text-align: center;
            text-decoration: none;
            font-size: 16px;
        }
    </style>
    <script>
        const interval = setInterval(function () {
            $.get('http://127.0.0.1:5000/method', function (data, status) {
                // console.log(data);
                let persistenceEl = document.getElementById('method_definition');
                persistenceEl.value = data['method'];
            })
        }, 1000);

    </script>

    <div>
        <h1>Effect Notebooks Client</h1>
        <div class='card' style='margin-bottom: 50px;'>
            <p>
                Use the notebook below to create a method that will clean the data
            </p>
            <h4>Notes from the uploader</h4>
            <p>`+ '${notes}' + `</p>
            <input type='hidden' name='method_definition' id='method_definition' value='cleanData()'>
            <button submit type='button' style='width: 250px;margin: auto;'>SUBMIT WORK</button>
        </div>

        <iframe src='` + '${notebook}' + `' id='notebookFrame' frameborder='0'
            style='width: 100%;
    height: 800px;'>
    </div></div>`,

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