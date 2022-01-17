## Catalogue

##### Team Members
- Abdessamad

#### Presentation
https://youtu.be/4-a0LISRtrs

#### Project Description
Catalogue is an app built on Shopify, a platform used by over 1.7M merchants to run their online stores. The goal is to help merchants save time and increase sales by organizing their online product listing with the help of a global human workforce.

Product categorization is both critical and challenging for the e-commerce industry, especially if you handle a wide variety and large volume of products. Some of the benefits of an effective implementation of product categorization include:

- **🛒 Enhancing the shopping experience**  
Product categorization is one of the most crucial factors to ensure a good UX, since it enables the consumer to narrow down their choice with the least number of clicks, while having the widest range of relevant products to choose from, based on their search keyword.

- **🔍 Better SEO**  
A well-organized inventory has a significant impact on a store's SEO ranking. It leads shoppers to know where to find what they are looking for and makes it easy for both people browsing on the store website and people searching on Google or other search engines to find the product.

- **📙 Improving suggestions and personalized recommendations**  
According to Shopify, their [product recommendation algorithm](https://shopify.dev/themes/product-merchandising/recommendations#recommendation-logic) relies on product categorization to help customers discover related products. Product categorization also enables powerful cross-selling and upselling strategies.

- **📈 Increased sales**  
Product categorization naturally leads to higher sales. When a customer can easily find what they are searching for and can navigate through the site easily, it’s more likely that there will be potential conversion.

#### What it does

Trying to handle product categorization internally can be a massive drag on your resources, and while many centralized platforms that already provide product categorization outsourcing like [Clickworker](https://www.clickworker.com/product-categorization-product-tagging/), [Crowdsource](https://www.crowdsource.com/solutions/data-solutions/data-categorization/), and MTurk, the process is cumbersome, expensive and requires a lot of manual work to review and import the results to online stores.

That's why I created a Shopify app that connects to stores, sends their inventory and available categories directly to the workers, and allows merchants to instantly apply the suggested changes without having to deal with spreadsheets or CSV files.

Another huge advantage is that I relied on the Effect Network, a decentralized crowdsourcing platform that has over 10k workers globally. Which enables me to process tons of products quickly, accurately and inexpensively.

<details>
<summary>How it works</summary>


This project is currently fully functional and the campaign is deployed on Effect's testnet.
Here is how it works:
- Merchants are required to add credits (1 credit = 1 task) in order to send tasks to the Effect network. This was implemented using Shopify's app billing API.
- Once the credits are added, merchants can then select products that need to be re-classified, there are two ways to do that:
    - Clicking the "New Request" button from the app's dashboard, they can scroll through their inventory and search by product name.
    - Using Shopify's products page, this option is more powerful since they could apply filters and add products in bulk.
- Initially, requests are marked as "Pending", and they are sent to the Effect network in batches via a background job that runs every minute. Merchants are able to cancel requests if they haven't been sent yet.
- Once the tasks are sent to the workers, the request is marked as "In progress".
- At this stage, a background job pings the Effect network for results every 30s. Once a worker submits a task, the merchant's request gets marked as "Under review" and shows up in the results tab in the app dashboard.
- If the merchant isn't satisfied with the result, they can "Re-request" classification and the task is sent back to the workers.
- If the submission matches the merchant's quality expectations, they can "Apply changes", the product will be updated immediately and the request will be marked as "Done".
- The interface is also updated in real-time, so merchants don't need to refresh the page to keep track of their requests.

</details>

#### Challenges we ran into

The blockchain part was pretty intimidating at first since I had no experience with it, but I quickly realized that Effect has its own SDK and it abstracts away interacting with the blockchain entirely, which made it a lot easier for me to quickly iterate and develop my app.

Another challenge was charging merchants, the initial plan was to allow merchants to connect their wallets and pay workers directly, but I later decided to use my own wallet and Shopify's billing API for many reasons:
- Shopify's ToS requires payments to be made via their app billing API.
- It's much easier for merchants who aren't familiar with the technology.
- It allows me to charge extra to help run the servers and develop new features.
- It's also totally valid and allowed according to [Laurens](https://youtu.be/xx8QEtZQieI?t=3190)!

#### Next Steps
- Publish the app on the Shopify App Store and make it available to the 1.7M merchants relying on the Shopify ecosystem.
- Work with the Effect team to deploy the campaign on the mainnet.
- Allow merchants to have control over the categories available to workers. Currently, workers can select from all the categories in the store.
- Improve the quality of the submissions by adding another validation campaign, and making it an optional feature at an additional cost for merchants.

#### Installation and deployment

- Clone the repo and run `npm install`
- Copy .env.example to .env and add your wallet's private key next to `EFFECT_PRIVATE_KEY=`
- Run `npm run campaign` to deploy the campaign on the testnet and follow the steps presented by the CLI.
- Create a Hasura and Redis instance. They're used to store shops, requests and keep track of credits.
- Install Shopify [CLI](https://shopify.dev/apps/getting-started/create#step-1-install-shopify-cli) and run `shopify login`.
- Run `shopify app connect` to connect the project to your Shopify partner account.
- Follow [these steps](https://shopify.dev/apps/getting-started/create#step-3-start-a-local-development-server) to start a local development server.

#### URLs
https://testnet.effect.network/campaigns/190

https://devpost.com/software/catalogue-16tlek

#### License
This repository is licensed under GNU GPL 3.
