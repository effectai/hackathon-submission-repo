const client = new effectsdk.EffectClient('jungle');

// Or: instantiate bsc account from existing private key.
const account = effectsdk.createAccount('0x8acc3b0e1a269574fd0a8d561d01007c0abd519ffa9e66735e7c613aa1fb37a9');

// Generate web3 instance from account.
const web3 = effectsdk.createWallet(account);

const main = async () => {
    // Connect your account to the Effect Client.
    const effectAccount = await client.connectAccount(web3);
    const topic = document.getElementById('topic').value
    // const topic = 'Earth'

    const content = {
        'tasks': [
            {"topic": topic}
        ]
    }
    
    // Retrieve the campaign that was last created/
    const campaign = 105
    
    await client.force.createBatch(campaign, content,1)
}