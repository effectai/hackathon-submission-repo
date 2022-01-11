let client, campaignid, batchidentification;
let connectAccount = { providerName: undefined, provider: undefined, account: undefined };
const rewardEfx = 1; // 

$(document).ready(function(){
	// initialize client
	try {
		client = new effectsdk.EffectClient('jungle') //kylin
		} catch (error) {
		console.error(error)
	}

	// prompt wallet link
	Swal.fire({
		title: 'Select your preferred wallet',
		text: 'Or test this campaign with a burner wallet',
		showDenyButton: true,
		showCancelButton: true,
		focusConfirm: false,
		confirmButtonText: '⚓ Anchor',
		denyButtonText: `🦊 Metamask`,
		cancelButtonText: 'Burner Wallet',
		confirmButtonColor: '#66ccff',
		denyButtonColor: '#fccd1d',
		cancelButtonColor: '#9e9e9e',
		// Wait before 
		preConfirm: async () => {return await connectAnchor()}, // connect anchor wallet function
		preDeny: async () => {return await connectMetamask()}, // connect metamask wallet function

	}).then((result) => {
		/* Read more about isConfirmed, isDenied below */
		console.log(result.value)
		if (!result.isConfirmed && !result.isDenied) {
			// connect burner wallet
			Swal.fire({
				Title: 'Burner Wallet',
				text: 'Insert your private key, or click next to create a new wallet',
				input: 'text',
			}).then((privateKey) => {
				let burnerAddress;
				if (privateKey) {
					try {
						burnerAddress = createBurnerWallet(privateKey);
					} catch {
						Swal.fire({
							icon: 'warning', 
							title: 'Oops...',
							text: `Cannot connect to ${privateKey} address.`,
						})
					}
				} else {
					createBurnerWallet();
				}
			})
		} 
		Swal.fire({
			// potentially show "connectAccount.account" and ask confirm
			title: 'Connect TEN to Wallet',
			text: `Connect account: ${result.value} to the Effect Network?`,
			showCancelButton: false ,
			confirmButtonText: 'Go ahead',
			showLoaderOnConfirm: true ,
			preConfirm: async () => {await connectEffectAccount()},
			allowOutsideClick: false,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: 'EYEFX BatchR',
					text: 'Insert batch size',
					inputAttributes: {
						min: 2,
						max: 8,
						step: 1,
						},
					inputValue: 4,
					input: 'range',
				}).then((result) => {
					console.log(result)
					IssueBatch(result.value)
				});
			}
		});
	});
});

function IssueBatch(nTasks) {
	// get campaign
	//
	// insert data in (template)
	// such as
	// 1. website, and
	// 2. question to ask.
	// 3. submit
}

/**
 * SDK Client
 * Create a new Effect SDK client.
 * Note how the entry name is `effectsdk`!.
 */
function generateClient() {
    console.log('Creating SDK...')
    try {
        client = new effectsdk.EffectClient('jungle') //kylin
/* 
        console.log(client)
        const divSdkClient = document.getElementById('sdk-client');
        divSdkClient.innerHTML =
            `SDK Client: Connected (See console for more info.): 
         <p>Host: ${client.config.host}</p>
         <p>IPFS ${client.config.ipfs_node}</p>
         <p>Network: ${client.config.network}</p>`; 

        // If successfull remove disabled attribute for buttons.
        document.getElementById('btn-connect-account').removeAttribute('disabled')
        document.getElementById('btn-get-campaign').removeAttribute('disabled')
		 */
    } catch (error) {
        console.error(error)
		 /*
        const divSdkClient = document.getElementById('sdk-client');
        divSdkClient.innerHTML = `<p>${JSON.stringify(error)}</p>`
		  */
    }
}

/**
 * Calling methods from the effectclient without connecting an account.
 */
async function getCampaign() {
    const balanceReponse = await client.force.getPendingBalance();

    const randomNumber = Math.floor(Math.random() * 10) + 1;
    const campaignResponse = await client.force.getCampaign(randomNumber)
    console.log(JSON.stringify(campaignResponse), JSON.stringify(balanceReponse))

    document.getElementById('show-get-campaign').innerHTML =
        `<p>ID: ${campaignResponse.id}</p>
     <p>Owner: ${campaignResponse.owner}</p>
     <p>Hash: ${campaignResponse.content.field_1}</p>
     <p>Reward : ${JSON.stringify(campaignResponse.reward)}</p>
     <p>Title: ${campaignResponse.info.title}</p>
     <p>Description: ${campaignResponse.info.description}</p>
     <p>PendingBalance:\n${JSON.stringify(balanceReponse)}</p>
    `
}

/**
 * BurnerWallet
 * Generates a new account when no parameter is passed.
 * Otherwise pass a web3 private key to create an account.
 */
function createBurnerWallet() {
	 console.log('creating burner wallet...')
	let burnerAccount
	try {
		// When no parameters are passed to createAccount() a new keypair is generated.
		burnerAccount = effectsdk.createAccount( /* Insert Private key here */);
		const burnerWallet = effectsdk.createWallet(burnerAccount);

		connectAccount.provider = burnerWallet
		connectAccount.account = null
		connectAccount.providerName = 'burnerwallet'

		/*
		document.getElementById('burner-wallet').innerHTML = `<p>${JSON.stringify(burnerAccount, null, 2)}</p>`
		document.getElementById('connect-to').innerText = `Connect with burner-wallet ${burnerAccount.address}`
		*/
	} catch (error) {
		alert('Something went wrong. See console for error message');
		console.error(error);
	 }
	 return burnerAccount.address
}

/**
 * Metamask
 * Generate web3 instance from account with private key.
 * Could also be the web3 object with a metamask connection. 
 * 
 * Here we will also make a call to make sure we are on the correct chain.
 * Bsc-Mainnet: 0x38 (hex), 56 (decimal)
 * Bsc-Testnet: 0x61 (hex), 97 (decimal)
 * 
 */
async function connectMetamask() {
	console.log('Connecting to metamask wallet.')
	let ethAccount;
	if (window.ethereum) {
		try {
				ethAccount = await ethereum.request({ method: 'eth_requestAccounts' });
				await ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x38' }] // 0x38 is the chainId of bsc testnet.	
				})

				connectAccount.provider = new Web3(window.ethereum)
				connectAccount.account = null
				connectAccount.providerName = 'metamask'
				// console.log(connectAccount)
				// console.log(ethAccount)

				/* document.getElementById('metamask-account').innerHTML =
					`Metmask Account: <p>${JSON.stringify(ethAccount, null, 2)}</p>
				ChainID: <p>${JSON.stringify(ethereum.chainId, null, 2)}</p>`

				document.getElementById('connect-to').innerText = `Connect with MetamaskAccount: ${ethAccount[0]}`
				*/

		} catch (error) {
				alert('Something went wrong. See console for error message')
				console.error(error)
		}
	} else {
		Swal({
			Title: 'Metamask not installed.',
			icon: 'warning',
		})
	}
	return ethAccount;
}

/**
 * EOS Anchor Wallet
 */
async function connectAnchor() {
	let ancAccount;
	try {
		const transport = new AnchorLinkBrowserTransport()
		const alink = new AnchorLink({
			transport,
			chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
			rpc: 'https://jungle3.greymass.com',
			chains: [
				{
					chainId: '2a02a0053e5a8cf73a56ba0fda11e4d92e0238a4a2aa74fccf46d5a910746840',
					nodeUrl: 'https://jungle3.greymass.com',
				}
			],
		})
		// Perform the login, which returns the users identity
		const identity = await alink.login('hackathon-boilerplate') 
		// The above line would need to be tested when we make an anchor account.

		const { session } = identity
		const signatureProvider = session.makeSignatureProvider()
		const account = { accountName: session.auth.actor.toString(), permission: session.auth.permission.toString() }
		console.log(`Logged in as`, account)
		connectAccount.provider = signatureProvider
		connectAccount.account = account
		connectAccount.providerName = 'anchor'
		ancAccount = session.auth

	} catch (error) {
		alert('Something went wrong. See console for error message')
		console.error(error)
	}
	return ancAccount;
}

/**
 * Connect to Effect Account using burnerwallet, metamask or anchor
 */
async function connectEffectAccount() {
	console.log('Connecting to account with wallet.')
	let connectResponse;
	try {
		if (connectAccount.provider) {
			connectResponse = await client.connectAccount(connectAccount.provider, connectAccount.account)
		} else {
			alert('Login with on of the wallet.')
		}
	} catch (error) {
		// alert('Something went wrong. See console for error message')
		Swal.fire({
			icon: 'warning', 
			title: 'Oops...',
			text: `Cannot connect wallet to effect account.`,
		})
		console.error(error)
	}
}

/**
 * Make Campaign
 * We need to upload the campaign to IPFS, then create the campaign on the blockchain.
 * This is done for us by the makeCampaign function.
 */
async function makeCampaign() {
    console.log('creating campaign...')

    try {
        // Template String is available in this repo, otherwise it can be anywhere else.
        const templateResponse = await fetch('./cmp/index.html')
        const templateText = await templateResponse.text()

        const campaignToIpfs = {
            title: 'EYEFX - Webpage Testing',
            description: 'This campaign is designed to test the usability of webpages.',
            instructions: "This campaign leverages a webcam based Eye Tracking algorithm to record your pupil and head position before presenting you with a specific task, e.g.: finding a specific piece of information on the webpage.",
            template: templateText,
            image: './cmp/media/arteum-ro-7H41oiADqqg-unsplash.jpg',
            category: 'Effect Eye Tracking',
            example_task: { 
						'TestWebsite': 'https://en.wikipedia.org/wiki/Main_Page',
						'InputPrompt': 'How Many Articles are currently present in the English Wikipedia?',
						},
            version: 1,
            reward: rewardEfx,
        }

        const quantity = rewardEfx; 
        const makeCampaingResponse = await client.force.makeCampaign(campaignToIpfs, quantity)
        console.log(makeCampaingResponse)
        await client.force.waitTransaction(makeCampaign)

        // document.getElementById('btn-make-batch').removeAttribute('disabled')

        const retrieveCampaign = await client.force.getMyLastCampaign()
        const divShowCampaign = document.getElementById('show-campaign');
        divShowCampaign.innerHTML = `<p>${JSON.stringify(retrieveCampaign, null, 2)}</p>`
    } catch (error) {
        alert('Something went wrong. See console for error message')
        console.error(error)
    }
}

/**
 * Retrieve the last campaign you made with this account.
 */
async function getLastCampaign() {
    console.log('getting last campaign...')
    try {
        const retrieveCampaign = await client.force.getMyLastCampaign()
        const divShowCampaign = document.getElementById('show-campaign');
        divShowCampaign.innerHTML = `<p>${JSON.stringify(retrieveCampaign, null, 2)}</p>`
        document.getElementById('btn-make-batch').removeAttribute('disabled')
    } catch (error) {
        alert('Something went wrong. See console for error message')
        console.error(error)
    }
}

/**
 * Make Batch
 * Is the method complete in the smart contract in order to retrieve the campaign id???
 * Make sure you have enough funds to pay for the batch.
 * Join our discord and use the faucet bot to get funds.
 * https://discord.gg/bq4teBnH3V
 */
async function makeBatch() {
    try {
        const campaign = await client.force.getMyLastCampaign()
        console.log(`Campaign 🚒:\n${JSON.stringify(campaign)}`)

        const content = {
            'tasks': [
                { "tweet_id": "20" },
                { "tweet_id": "22" },
                { "tweet_id": "23" },
                { "tweet_id": "24" }
            ]
        }

        const repetitions = '1'

        const batchResponse = await client.force.createBatch(campaign.id, content, repetitions)
        // document.getElementById('show-batch').innerHTML = `<p>${JSON.stringify(batchResponse, null, 2)}</p>`
        console.log(batchResponse);
        await client.force.waitTransaction(batchResponse)
        const newBatch = await client.force.getCampaignBatches(campaign.id)
        batchidentification = newBatch.pop().batch_id
        document.getElementById('show-batch').innerHTML = `<p>${JSON.stringify(newBatch, null, 2)}</p>`
        document.getElementById('btn-get-result').removeAttribute('disabled')    

    } catch (error) {
        alert('Something went wrong. See console for error message')
        console.error(error)
    }
}

/**
 * TODO
 * Results
 */
async function getResults() {
    console.log('generating key...')
    try {
        // Get task submissions of batch.
        const lastcampaign = await client.force.getMyLastCampaign()
        const lastBatch = await client.force.getCampaignBatches(lastcampaign.id)
        const taskResults = await client.force.getTaskSubmissionsForBatch(lastBatch.pop().batch_id)
        console.log(`TaskResults for batch with id: ${batchidentification}`, taskResults)

        document.getElementById('show-result').innerHTML = `<p>${JSON.stringify(taskResults, null, 2)}</p>`
    } catch (error) {
        alert('Something went wrong. See console for error message')
        console.error(error)
    }
}

