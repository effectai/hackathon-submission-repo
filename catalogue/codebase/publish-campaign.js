import { EffectClient, createAccount, createWallet } from "@effectai/effect-js";
import "dotenv/config";
import fs from "fs";

const main = async () => {
  const client = new EffectClient("jungle");
  const account = createAccount(process.env.EFFECT_PRIVATE_KEY);
  const web3 = createWallet(account);
  const effectAccount = await client.connectAccount(web3);
  console.info(`Connected to Effect account: ${effectAccount.accountName}`);

  const campaignContent = {
    title: "Classify products into their appropriate categories",
    description:
      "Help merchants organize their inventory by sorting products into predetermined categories",
    instructions: `Your task is to allow customers to easily find products and help retailers optimize their online stores by organizing their inventory into appropriate categories.

You will be presented with details about the product, a link to the merchant's website and a link to quickly search Google for the product. Once you have done your research, select the appropriate categories from the list of available categories. You can select multiple categories.`,
    template: fs.readFileSync("./template.html", "utf8").toString(),
    image: "https://catalogue.sellerkit.net/assets/icon.png",
    category: "Product Categorization",
    example_task: require("./example-task.json"),
    version: 2,
    reward: 2,
  };
  const transaction = await client.force.makeCampaign(
    campaignContent,
    campaignContent.reward.toString()
  );
  await client.force.waitTransaction(transaction);

  const campaign = await client.force.getMyLastCampaign();
  console.info(`Created campaign #${campaign.id} successfully!`);
  console.warn(`Don't forget to add the following line to your .env file:`);
  console.log(`EFFECT_CAMPAIGN_ID=${campaign.id}`);
};

main();
