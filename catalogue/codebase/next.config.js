require("dotenv").config();

const webpack = require("webpack");
const API_KEY = JSON.stringify(process.env.SHOPIFY_API_KEY);
const HASURA_INSTANCE = JSON.stringify(process.env.HASURA_INSTANCE);

module.exports = {
  webpack: (config) => {
    const env = { API_KEY, HASURA_INSTANCE };
    config.plugins.push(new webpack.DefinePlugin(env));

    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });

    return config;
  },
};
