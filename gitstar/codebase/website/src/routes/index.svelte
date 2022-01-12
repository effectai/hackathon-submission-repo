<svelte:head>
  <link href="https://fonts.googleapis.com/css?family=Press+Start+2P" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/nes.css@2.3.0/css/nes.css"> <!--  -->
</svelte:head>

<style>
  .container { max-width: 980px; margin: 0 auto; }
  .topic { margin-bottom: 3rem; }
  header { border-bottom: 4px solid #D3D3D3; background-color: white; }
  #app > .container { margin-top: 3rem; }
  .nav-brand > a { color: #212529; }
  .brand-logo { margin-right: 1.5rem; }
  .items > .nes-field { margin-bottom: 1.5rem; }
  .items > .nes-field:last-child { margin-bottom: 0; }
  .h1 > i { margin-right: 1rem; }
  h2 > a {  margin-right: 1rem;  }
  .topic > section { margin-top: 1.5rem; }
  .relative { position: relative; }
  .close-icon { position: absolute; top: 5px; right: 5px; }
button.bottom-right { position: absolute; bottom: 10px; right: 10px; }

  .message-list { display: flex;  flex-direction: column; }
  .message-list > .message { display: flex; }
  .message-list > .message > .nes-balloon { max-width: 550px; }
  .message-list > .message i { align-self: flex-end; }
  .message-list > .message.-left { align-self: flex-start; }
  .message-list > .message.-right { align-self: flex-end; }
  .message-list > .message.-left i { margin-right: 2rem; }
  .message-list > .message.-right i { margin-left: 2rem; }
</style>

<script>
import { onMount, createEventDispatcher } from 'svelte';
import { Serialize, Numeric } from 'eosjs';

function getCompositeKey(accountId, campaignId) {
  const buf = new Serialize.SerialBuffer()
  buf.reserve(64)
  buf.pushUint32(accountId)
  buf.pushUint32(campaignId)
  return parseInt(Numeric.binaryToDecimal(buf.getUint8Array(8)))
}

let client, account, balance;
let num_stars, repo_name, privatekey, order_progress;

const gitstarCampaign = 130;

async function resetConn() {
  account = null;
  client = new effectsdk.EffectClient('jungle');
  balance = null;
}

onMount(async () => {
  await resetConn();
});

async function connectMetaMask() {
  if (!privatekey) { alert('enter your private key'); return; }
  const burner = effectsdk.createAccount(privatekey);
  const web3 = effectsdk.createWallet(burner);
  account = await client.connectAccount(web3);
  balance = parseInt(account.vAccountRows[0].balance.quantity.replace(".0000 EFX", ""))
}

async function makeVtransferSig(numEfx) {
  const accId = account.vAccountRows[0].id
  const nonce = account.vAccountRows[0].nonce
  const serialbuff = new Serialize.SerialBuffer()
  serialbuff.push(1)
  serialbuff.pushUint32(nonce)
  serialbuff.pushArray(Numeric.decimalToBinary(8, accId.toString()))
  serialbuff.pushArray(Numeric.decimalToBinary(8, client.force.config.force_vaccount_id.toString()))
  serialbuff.pushAsset(numEfx + '.0000 ' + client.force.config.efx_symbol)
  serialbuff.pushName(client.force.config.efx_token_account)
  const vaccSig = await client.force.generateSignature(serialbuff)
  return vaccSig
}

function orderAgain() {
    order_progress = null;
}

async function createBatch() {
  if (!account) { alert ('login first'); return; }
  if (!num_stars || !repo_name) { alert('need more info!'); return; }
  if (balance < 10) { alert('not enough balance'); return; }

  order_progress = 1;
  const numEfx = 10

  const batches = await client.force.getCampaignBatches(gitstarCampaign);
  const batchId = batches.length + 1
  const batchPk = getCompositeKey(batchId, gitstarCampaign)

  order_progress = 2;
  const content = {'tasks': [{ "repo": repo_name }]}
  const hash = await client.force.uploadCampaign(content)
  const {root, leaves} = client.force.getMerkleTree(gitstarCampaign, batchId, content.tasks)
  order_progress = 3;

  const accId = account.vAccountRows[0].id

  const vaccSig = await makeVtransferSig(numEfx)

  const actions = [
    {account: "efxforce1111",
     name: 'mkbatch',
     authorization: [{actor: "efxrelayer11", permission: "active"},
                     {actor: "gitgitgitgit", permission: "force"}],
     data: {id: batchId, campaign_id: gitstarCampaign,
            content: { field_0: 0, field_1: hash},
            task_merkle_root: root,
            payer: "efxrelayer11", sig: null}},
    {account: "efxaccount11",
     name: 'vtransfer',
     authorization: [{actor: "efxrelayer11", permission: "active"}],
     data: {from_id: accId,
            to_id: client.force.config.force_vaccount_id,
            quantity: {quantity: numEfx + ".0000 EFX", contract: "efxtoken1112"},
            sig: vaccSig.toString(),
            fee: null,
            memo: batchPk}},
    {account: "efxforce1111",
     name: 'publishbatch',
     authorization: [{actor: "efxrelayer11", permission: "active"}],
     data: {account_id: accId,
            batch_id: batchPk,
            num_tasks: content.tasks.length,
            sig: null}} ]

  const tx = await client.force.sendTransaction(account.accountName, actions)
  order_progress = 4;

  await client.force.waitTransaction(tx)
  order_progress = 5;

  const newBatch = await client.force.getCampaignBatches(gitstarCampaign)
  const batchid = newBatch.pop().batch_id
  order_progress = 6;
}
</script>

<div id="app">
  <header>
    <div class="container">
      <div class="nav-brand">
        <a href="https://git.star"><h1><i class="nes-icon star brand-logo"></i>GitStar</h1></a>
        <p>Code Amongst the Stars.</p>
      </div>
    </div>
  </header>

  <div class="container">
    <section class="topic">
      <h2 id="about"><a href="#about">#</a>About</h2>
      <p>Receive Github stars from real users that are into your project.</p>
    </section>

    <section class="topic">
      <h2 id="usage"><a href="#usage">#</a>Usage</h2>
      <p>You will need EFX in your virtual account. Follow the instructions here and here.</p>
    </section>

    <section class="topic">
      <h2 id="login"><a href="#order">#</a>Login</h2>

      <section>
        <div class="nes-container is-rounded relative">
          {#if !account}
          <p>Paste the private key of your burner wallet below to log in</p>
          <div class="nes-field is-inline">
            <input bind:value={privatekey} type="password" id="privatekey" class="nes-input" placeholder="0xabcd..." style="margin-right: 1.5rem;">
            <button class="nes-btn is-success" on:click={connectMetaMask}>
              Connect
            </button>
          </div>
          {:else}
          <section class="message-list">
            <section class="message -left">
              <i class="nes-octocat animate"></i>
              <div class="nes-balloon from-left">
                Welcome! {account.accountName.substring(1,8)}...<br/>
                You have <b class="is-success nes-text">{balance} EFX</b> in your account.
              </div>
            </section>
          </section>
          <a on:click={resetConn} class="close-icon nes-icon close"></a>
          {/if}
        </div>
      </section>
    </section>

    <section class="topic">
      <h2 id="order"><a href="#order">#</a>Order</h2>
      <section>
        <div class="nes-container items with-title is-rounded">
          <p class="title">Order your stars here</p>
          <div class="nes-field">
            <label for="select-stars">How many stars?</label>
            <div class="nes-select is-primary">
              <select bind:value={num_stars} required id="num-stars">
                <option value="" disabled selected hidden>Select...</option>
                <option value="1">1 Stars [10 EFX]</option>
                <option disabled value="5">5 Stars [50 EFX]</option>
                <option disabled value="10">10 Stars [100 EFX]</option>
                <option disabled value="15">15 Stars [150 EFX]</option>
              </select>
            </div>
          </div>
          <div class="nes-field is-inline">
            <label>https://github.com/</label>
            <input bind:value={repo_name} type="text" id="repo-field" class="nes-input" placeholder="user/repo">
          </div>
          <div class="nes-field">
            {#if !order_progress}
            <button on:click={createBatch} class="nes-btn is-primary">To the stars!</button>
            {:else}
            <progress class="nes-progress {order_progress == 6 ? 'is-pattern' : 'is-primary'}" value={order_progress} max="6"></progress>
            {/if}
          </div>

          {#if order_progress == 6}
          <a href="#" class="nes-badge">
            <span class="is-success">Success</span>
          </a>
          <button on:click={orderAgain} class="nes-btn bottom-right">Order again</button>
          {/if}
        </div>
      </section>
    </section>

    <!-- <section class="topic"> -->
    <!--   <h2 id="order"><a href="#order">#</a>History</h2> -->
    <!--   <div class="nes-table-responsive"> -->
    <!--     <table class="nes-table is-bordered"> -->
    <!--       <thead> -->
    <!--         <tr> -->
    <!--           <th>Account</th> -->
    <!--           <th>Repo</th> -->
    <!--           <th>Stars</th> -->
    <!--         </tr> -->
    <!--     </table> -->
    <!--   </div> -->
    <!-- </section> -->
  </div>
</div>
