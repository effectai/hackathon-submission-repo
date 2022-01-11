const effectsdk = require("@effectai/effect-js");
const { createBatch } = require("./createBatch");
const { createCampaign } = require("./createCampaign");

const client = new effectsdk.EffectClient("jungle");

// e06a634cac5998ba474b451644db53ceb759bf39
const account = effectsdk.createAccount(
  "0x2c755d44a0c2b2fb9fcf47f0d5b96713e72bfbe92578a4239678f5dc952f9ca6"
);
// Generate web3 instance from account.
const web3 = effectsdk.createWallet(account);
// Connect your account to the Effect Client.
client
  .connectAccount(web3)
  .then((effectAccount) =>
    console.log(effectAccount.accountName, effectAccount.address)
  );

module.exports.sendCreateBatch = async function sendCreateBatch(data) {
  const content = {
    tasks: data.map((e) => {
      return {
        image_url: e.image,
        title: e.title,
        description: e.description,
      };
    }),
  };
  console.log(content);
  let campaign = {id: 359}
  try {
    campaign = await getMyLastCampaign();
  }
  catch(err){
    console.log(err)
  }
  return await createBatch(client, campaign.id, content, 1);
};

module.exports.getMyLastCampaign = async function getMyLastCampaign() {
  const campaign = process.env.CAMPAIGN;
  console.log("campaign: ", campaign);
  if (campaign) return JSON.parse(campaign);
  try {
    const campaigns = await client.force.getCampaigns((key = 355), (limit = 5));
    const myCampaigns = campaigns.rows
      .filter((e) => e.owner[1] === "e06a634cac5998ba474b451644db53ceb759bf39")
      .map((e) => ({
        id: e.id,
        title: e.info.title,
        description: e.info.description,
      }));
    const myCampaign = myCampaigns[myCampaigns.length - 1];
    // console.log("myCampaign: ", myCampaign)
    process.env.CAMPAIGN = JSON.stringify(myCampaign);
    return myCampaign;
  } catch (error) {
    return {
      id: 88,
      title: "Friends 🐻",
      description: "All the tree friends are lost. They need you to find them.",
    };
  }
};

module.exports.createCampaign = () => createCampaign(client);
