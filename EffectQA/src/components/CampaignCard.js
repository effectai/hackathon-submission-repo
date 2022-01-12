import React from "react";
import { Card } from "antd";
import { campaignUrl } from "../util/effect";
import { DollarOutlined, ChromeOutlined } from "@ant-design/icons";

function CampaignCard({ campaign }) {
  const open = () => {
    window.open(campaignUrl(campaign.id), "_blank");
  };
  return (
    <span className="site-card-border-less-wrapper">
      <Card
        title={campaign.info.category}
        bordered={false}
        style={{ width: 400, cursor: "pointer" }}
        actions={[
          <span onClick={open}>
            <ChromeOutlined className="pointer" key="open" />
            &nbsp; Open Job
          </span>,
          <span>
            <DollarOutlined key="reward" />
            &nbsp;Reward{campaign.info.reward} EFX
          </span>,
        ]}
      >
        <p>{campaign.info.title}</p>
        <p>{campaign.info.description}</p>
        {/* <p>Reward: {campaign.reward}</p> */}
      </Card>
    </span>
  );
}

CampaignCard.propTypes = {};

export default CampaignCard;
