import React, { useState, useEffect } from "react";
import { Spin, Space } from "antd";
import { List, Typography, Divider } from "antd";

import CampaignCard from "./CampaignCard";
import { getCampaigns } from "../util/api";

function CampaignList({ account, type = "card" }) {
  const [campaigns, setCampaigns] = useState();
  const [loading, setLoading] = useState(false);

  const fetchCampaign = async () => {
    setLoading(true);
    try {
      const response = await getCampaigns(account);
      setCampaigns(response.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [account]);

  const getBody = () => {
    if (loading) {
      return <Spin size="large" />;
    }

    if (campaigns && campaigns.length > 0) {
      if (type === "card") {
        return (campaigns || []).map((c, i) => {
          return (
            <span key={i}>
              <CampaignCard campaign={c} />
            </span>
          );
        });
      } else {
        return (
          <List
            size="large"
            header={<div>Campaigns</div>}
            // footer={<div>Footer</div>}
            bordered
            dataSource={campaigns}
            renderItem={(item) => <List.Item>{JSON.stringify(item)}</List.Item>}
          />
        );
      }
    }

    return <p>No entries found.</p>;
  };

  return (
    <div>
      <h2>{account ? "My product campaigns" : "Find jobs"}</h2>
      <br />
      <br />
      {getBody()}
    </div>
  );
}

CampaignList.propTypes = {};

export default CampaignList;
