import React from "react";

import { Steps, Divider, Button } from "antd";
import { APP_DESC } from "../util/constants";
import logo from "../assets/logo.png";

const { Step } = Steps;

function Home({ login, loggedIn }) {
  return (
    <div>
      <div className="logo-section">
        <img src={logo} className="home-logo" />
        <div className="home-subtitle">{APP_DESC}.</div>
      </div>
      <Steps progressDot current={2}>
        <Step title="Connect your metamask wallet." />
        <Step title="Create campaigns for testing your product or MVP." />
        <Step title="Review testing feedback or earn by completing tasks of your own!" />
      </Steps>
      {!loggedIn && (
        <div className="home-button-section">
          <Button type="primary" size="large" onClick={login}>
            Get started
          </Button>
        </div>
      )}
    </div>
  );
}

Home.propTypes = {};

export default Home;
