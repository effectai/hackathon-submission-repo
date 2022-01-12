import Web3 from "web3";
import { EffectClient, createAccount, createWallet } from "@effectai/effect-js";
import { TEMPLATE_HTML } from "./template";

const EFFECT_URL = "https://testnet.effect.network";

export const campaignUrl = (c) => `${EFFECT_URL}/campaigns/${c}`;

const emptyAccount = () => ({
  providerName: undefined,
  provider: undefined,
  account: undefined,
});

export let connectAccount = emptyAccount();

const client = new EffectClient("jungle");

/**
 * Metamask
 * Generate web3 instance from account with private key.
 * Could also be the web3 object with a metamask connection.
 *
 */
export async function connectMetamask() {
  console.log("Connecting to metamask wallet.");
  const ethereum = window.ethereum;
  if (!ethereum) {
    alert("Metamask not installed.");
    return;
  }
  try {
    const ethAccount = await ethereum.request({
      method: "eth_requestAccounts",
    });
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x38" }], // 0x38 is the chainId of bsc testnet.
    });
    const provider = Web3.givenProvider || ethereum;
    console.log("connect", provider);
    connectAccount.provider = new Web3(provider);
    connectAccount.account = ethAccount;
    connectAccount.providerName = "metamask";
    return connectAccount;
  } catch (error) {
    alert("Something went wrong. See console for error message.");
    console.error("connect metamask", error);
  }

  return undefined;
}

export const logout = () => {
  connectAccount = emptyAccount();
};

export const CATEGORIES = ["Product testing", "Product feedback"];
const image =
  "https://ipfs.effect.ai/ipfs/bafkreiggnttdaxleeii6cdt23i4e24pfcvzyrndf5kzfbqgf3fxjryj5s4";

export const EXAMPLE_TASK = {
  id: 123,
  campaignDescriptions: "Product testing for my new website.",
  title: "Verify login",
  description: "Verify you are able to successfully login to the website",
  url: "https://www.yahoo.com",
};

export const getLastCampaign = async () => {
  return client.force.getMyLastCampaign();
};

export const createCampaign = async (
  campaignName,
  campaignDescription,
  campaignInstructions,
  category,
  tasks, // [{title, description, url}, ...]
  reward
) => {
  const effectAccount = await client.connectAccount(connectAccount.provider);

  const campaignToIpfs = {
    title: campaignName,
    description: campaignDescription,
    instructions: campaignInstructions,
    template: TEMPLATE_HTML,
    image,
    category,
    example_task: EXAMPLE_TASK,
    version: 1,
    reward,
  };

  // Create campaign.
  // campaign object, reward
  const efx_quantity = "1";
  const makeCampaign = await client.force.makeCampaign(
    campaignToIpfs,
    efx_quantity
  );
  console.log("makeCampaign", makeCampaign);
  // await client.force.waitTransaction(makeCampaign.transaction_id);

  // Retrieve last campaign
  const campaign = await getLastCampaign();
  console.log("Campaign", campaign);

  const content = {
    tasks: tasks,
  };

  // Make sure you have enough funds to pay for the batch.
  // Join our discord and use the faucet bot to get funds.
  // https://discord.gg/bq4teBnH3V

  const repetitions = "1";
  // Create batch for campaign.
  // same here as for campaign, id of batch needs to be returned
  const batchResponse = await client.force.createBatch(
    campaign.id,
    content,
    repetitions
  );

  console.log("createBatch", batchResponse);
  // await client.force.waitTransaction(batchResponse);
  const batches = await client.force.getCampaignBatches(campaign.id);
  console.log("returned batches", batches);
  return { batches, campaign };
};
export const submitTask = async () => {};

export async function getBalance(acc) {
  const web3 = acc.provider;
  console.log("Called getBalance", acc.account);
  const effectAccount = await client.connectAccount(web3);
  const accountRow = await client.force.getVAccountByName(
    effectAccount.accountName
  );
  const balance = accountRow[0].balance;
  console.log("Balance", acc.account, JSON.stringify(balance));
  return { balance, accountId: effectAccount.accountName };
}
