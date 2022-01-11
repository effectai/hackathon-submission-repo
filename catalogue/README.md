## Catalogue

##### Team Members
- Abdessamad

#### Project Description
Product categorization is both critical and challenging for the e-commerce industry, especially for merchants that handle a wide variety and large volume of products, since product classification becomes increasingly expensive and time-consuming as their inventory grows.

That's why I decided to leverage the Effect ecosystem and help Shopify merchants offload these tasks to Effect's global workforce.

#### Summary
This project is currently fully functional and the campaign is deployed on Effect's testnet.
This is how it works:
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

#### URLs
https://testnet.effect.network/campaigns/190
https://devpost.com/software/catalogue-16tlek

#### Presentation
https://youtu.be/4-a0LISRtrs

#### Next Steps
The next step would be to publish the app on the [Shopify App Store](https://apps.shopify.com/) and make it available to the 1.7M merchants relying on the Shopify ecosystem.

#### Installation and deployment

- Clone the repo and run `npm install`
- Copy .env.example to .env and add your wallet's private key next to `EFFECT_PRIVATE_KEY=`
- Run `npm run campaign` to deploy the campaign on the testnet and follow the steps presented by the CLI.
- Create a Hasura and Redis instance. They're used to store shops, requests and keep track of credits.
- Install Shopify [CLI](https://shopify.dev/apps/getting-started/create#step-1-install-shopify-cli) and run `shopify login`.
- Run `shopify app connect` to connect the project to your Shopify partner account.
- Follow [these steps](https://shopify.dev/apps/getting-started/create#step-3-start-a-local-development-server) to start a local development server.

#### License
This repository is licensed under GNU GPL 3.
