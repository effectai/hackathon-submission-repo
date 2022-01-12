import React, { useState } from "react";
import { Button, Input, Row, Col, Radio, Steps } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
  createCampaign,
  CATEGORIES,
  EXAMPLE_TASK,
  campaignUrl,
} from "../util/effect";
import { getGenericError } from "../util/constants";
import { isValidHttpUrl } from "../util";
import { postCampaign } from "../util/api";

const { Step } = Steps;

function CreateCampaign(props) {
  const [data, setData] = useState({
    ...EXAMPLE_TASK,
    category: CATEGORIES[0],
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState();

  const updateData = (key, value) => {
    setData({ ...data, [key]: value });
  };

  const isValid = (data) => {
    return (
      data.campaignName &&
      data.title &&
      data.description &&
      isValidHttpUrl(data.url)
    );
  };
  const isValidData = isValid(data);

  const create = async () => {
    if (!isValidData) {
      alert("Title, description, and url are required");
      return;
    }
    setError(undefined);
    setLoading(true);

    const instructions = "Complete the associated tasks to earn a reward.";

    try {
      const res = await createCampaign(
        data.campaignName,
        `${data.category} for ${data.url}`,
        instructions,
        data.category,
        [data], // could be a longer list of tasks.,
        1 // default reward.
      );
      setResult(res);
      try {
        await postCampaign(res.campaign);
      } catch (e) {
        console.error("error posting campaign", e);
      }
    } catch (e) {
      console.error("error creating campaign", e);
      setError(getGenericError("create campaign"));
    } finally {
      setLoading(false);
    }
  };

  const getStep = () => {
    if (!!result) {
      return 2;
    } else if (isValidData) {
      return 1;
    }
    return 0;
  };

  return (
    <div>
      <Row>
        <Col span={16}>
          <div className="create-form white boxed">
            <h2>Create new QA campaign</h2>
            <br />

            <h3 className="vertical-margin">Campaign title:</h3>
            <Input
              placeholder="Title of the campaign"
              value={data.campaignName}
              prefix="Campaign:"
              onChange={(e) => updateData("campaignName", e.target.value)}
            />

            <h3 className="vertical-margin">General information:</h3>
            <Input
              placeholder="Title of the task"
              value={data.title}
              prefix="Task title:"
              onChange={(e) => updateData("title", e.target.value)}
            />

            <TextArea
              aria-label="Description"
              onChange={(e) => updateData("description", e.target.value)}
              placeholder="Description of the task"
              prefix="Description"
              value={data.description}
            />
            <Input
              value={data.url}
              placeholder="Location where the test should be performed"
              prefix="Test url:"
              onChange={(e) => updateData("url", e.target.value)}
            />

            <br />

            <h3 className="vertical-margin">Category:</h3>

            <Radio.Group
              name="radiogroup"
              defaultValue={data.category}
              onChange={(e) => updateData("category", e.target.value)}
            >
              {CATEGORIES.map((c, i) => {
                return (
                  <Radio key={i} value={c}>
                    {c}
                  </Radio>
                );
              })}
            </Radio.Group>
            <br />
            <Button
              type="primary"
              className="standard-button"
              onClick={create}
              disabled={loading || !isValidData}
              loading={loading}
            >
              Create QA campaign!
            </Button>
            {!error && !result && loading && (
              <span>&nbsp;Note this may take a few moments.</span>
            )}
            <br />
            <br />
            {error && <div className="error-text">{error}</div>}
            {result && (
              <div>
                <div className="success-text">Created campaign!</div>
                <a href={campaignUrl(result.campaign.id)} target="_blank">
                  View campaign
                </a>
                {/* <div>{JSON.stringify(result, null, "\t")}</div> */}
              </div>
            )}
          </div>
        </Col>
        <Col span={1}></Col>
        <Col span={7}>
          <div className="white boxed">
            <Steps
              className="standard-margin"
              direction="vertical"
              size="small"
              current={getStep()}
            >
              <Step title="Fill in fields" description="Enter required data." />
              <Step
                title="Create campaign"
                description="Requires authorizing a create campaign operation."
              />
              <Step
                title="Wait for feedback"
                description="Your QA campaign will be live for others to complete."
              />
            </Steps>
          </div>
        </Col>
      </Row>
    </div>
  );
}

CreateCampaign.propTypes = {};

export default CreateCampaign;
