import axios from "axios";

const API = "http://localhost:80";
export function createBatch(data) {
  return axios.post(API + "/createBatch", data);
}

export function getCampaign() {
  return axios.get(API + "/getMyLastCampaign");
}
