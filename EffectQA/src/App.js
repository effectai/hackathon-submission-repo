import React, { useState, useEffect } from "react";
import Home from "./components/Home";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";

import { Layout, Menu, Button } from "antd";
import { connectMetamask, getBalance, logout } from "./util/effect";

import logo from "./assets/logo.png";
import CreateCampaign from "./components/CreateCampaign";
import Discover from "./components/CampaignList";

import "antd/dist/antd.css";
import "./App.css";
import CampaignList from "./components/CampaignList";

const { Header, Footer, Sider, Content } = Layout;

function App() {
  const [loading, setLoading] = useState(false);
  const [account, setAccount] = useState();
  const [balance, setBalance] = useState();

  const loggedIn = !!account;

  const exit = () => {
    logout();
    setAccount(undefined);
  };

  const connectAccount = async () => {
    setLoading(true);
    let acc;
    try {
      acc = await connectMetamask();
      setAccount(acc);
    } catch (e) {
      console.error("error connecting", e);
      return;
    } finally {
      setLoading(false);
    }

    try {
      const b = await getBalance(acc);
      setBalance(b);
    } catch (e) {
      console.log("error getting balance", e, acc.account);
    }
  };

  const selectedKeys = () => {
    const key = window.location.pathname;
    const kmap = {
      "/discover": "1",
      "/create": "2",
      "/my-campaigns": "3",
    };
    return kmap[key] || "1";
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Layout>
          <Header>
            <Menu
              theme="light"
              mode="horizontal"
              selectedKeys={[selectedKeys()]}
            >
              <Menu.Item key="0">
                <img src={logo} className="header-logo" />
              </Menu.Item>
              {loggedIn && (
                <>
                  <Link to="/discover">
                    <Menu.Item key="1">Discover</Menu.Item>
                  </Link>
                  {balance && (
                    <Link to="/my-campaigns">
                      <Menu.Item key="3">My Campaigns</Menu.Item>
                    </Link>
                  )}
                  <Link to="/create">
                    <Menu.Item key="2">Create Job</Menu.Item>
                  </Link>
                </>
              )}

              {loggedIn && (
                <span className="float-right">
                  <span>
                    Logged in:&nbsp;
                    <a
                      href="#"
                      className="pointer"
                      onClick={(e) => {
                        e.preventDefault();
                        alert(account.account[0]);
                      }}
                    >
                      {account.account[0].slice(0, 4)}**
                    </a>
                    &nbsp;
                    <span>
                      (
                      <a
                        href="#"
                        className="pointer"
                        onClick={(e) => {
                          e.preventDefault();
                          exit();
                        }}
                      >
                        logout
                      </a>
                      )
                    </span>
                    &nbsp;
                    {balance && balance.balance.quantity && (
                      <span>{balance.balance.quantity}</span>
                    )}
                  </span>
                </span>
              )}

              {!loggedIn && (
                <Button
                  className="header-button"
                  loading={loading}
                  disabled={loading}
                  type="primary"
                  onClick={connectAccount}
                >
                  Login
                </Button>
              )}
            </Menu>
          </Header>
          <Layout>
            <Content style={{ margin: "24px 16px 0" }}>
              <div className="content-area">
                {!loggedIn && (
                  <Home login={connectAccount} loggedIn={loggedIn} />
                )}
                {loggedIn && (
                  <Routes>
                    <Route path={"/"} element={<Discover />} />
                    <Route
                      path={"/discover"}
                      element={<CampaignList type="card" account={undefined} />}
                    />
                    <Route
                      path="/my-campaigns"
                      element={
                        <CampaignList
                          type="card"
                          account={balance && balance.accountId}
                        />
                      }
                    />
                    <Route path="/create" element={<CreateCampaign />} />
                  </Routes>
                )}
              </div>
            </Content>
          </Layout>
          {/* <Footer>Footer</Footer> */}
        </Layout>
      </BrowserRouter>
    </div>
  );
}

export default App;
