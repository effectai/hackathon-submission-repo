const url = `http://localhost:3001`;
const axios = require("axios");

const instance = axios.create({
  baseURL: url,
  timeout: 6000,
});

export const getCampaigns = (address) => {
  let url = "/campaigns";
  if (address) {
    url += `?address=${address}`;
  }
  return instance.get(url);
};

export const postCampaign = (body) => {
  return instance.post("/campaign", body);
};
