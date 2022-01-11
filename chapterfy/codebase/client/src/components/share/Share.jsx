import "./share.css";
import { useContext, useRef, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import * as effectsdk from "@effectai/effect-js";
import { createAccount } from "@effectai/effect-js";

export default function Share() {
  const [campaignName, setCampaignName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [reward, setReward] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [batchVideo, setBatchVideo] = useState("");
  const [creatingNewCampaign, setCreatingNewCampaign] = useState(false);
  const [username, setUsername] = useState("");
  const [campaigns, setCampaigns] = useState([{ name: "No active campaigns" }]);
  const [campaignId, setCampaignId] = useState("");
  const [campaignDetails, setCampaignDetails] = useState("");
  const [newbatchLoading, setNewBatchLoading] = useState("");


  useEffect(() => {
    const getUsername = async () => {
      const client = new effectsdk.EffectClient("jungle");
      const account = effectsdk.createAccount(
        ""
      );
      const web3 = effectsdk.createWallet(account);
      const effectAccount = await client.connectAccount(web3);
      setUsername(effectAccount.accountName);
      console.log(effectAccount.accountName);
    };
    getUsername();
  }, []);

  const createEffectCampaign = async () => {
    setCreatingNewCampaign(true);
    const client = new effectsdk.EffectClient("jungle");
    const account = effectsdk.createAccount(
      ""
    );
    const web3 = effectsdk.createWallet(account);
    const effectAccount = await client.connectAccount(web3);
    console.log(effectAccount);
    //const uploadData = getUploadData();
    console.log(uploadCampaignIpfs);
    //const campaign = await client.force.getMyLastCampaign();
    const makeCampaign = await client.force.makeCampaign(
      uploadCampaignIpfs,
      "1"
    );
    //console.log(makeCampaign);
    setTimeout(async function () {
      const campaign = await client.force.getMyLastCampaign();
      console.log(campaign.id);
      setCreatingNewCampaign(false);
      const newCampaignData = {
        userId: username,
        name: campaignName,
        video: videoLink,
        desc: description,
        campaignId: campaign.id,
      };
      try {
        await axios.post("/campaigns", newCampaignData);
        window.open(
          "https://testnet.effect.network/campaigns/" + campaign.id + "'"
        );
      } catch (err) {}
    }, 5000);
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/campaigns/getCampaigns/" + username);
      console.log(res.data);
      setCampaigns(res.data);
    };
    fetchPosts();
  }, [username]);

  const uploadCampaignIpfs = {
    title: campaignName,
    description: description,
    instructions: instructions,
    template:
      `<div style="text-align:center">
    <div className="content">
        <h2>Make chapters for this video 🎬</h2>
        <iframe height="200" src='` +
      "${video_url}" +
      `'></iframe>
        <div style="display:flex;justify-content:center">
            <div style="flex: 1">Start</div>
            <input style="flex: 1" type="text" id="inputStart"></input>
        </div>
        <div style="display: flex; justify-content:center">
            <div style="flex: 1">End</div>
            <input style="flex: 1 " type="text" id="inputEnd"></input>
        </div>
        <div style="display: flex; justify-content: center">
            <div style="flex: 1">Title</div>
            <input style="flex: 1" type="text" id="inputTitle"></input>
        </div>
        <div style="display:flex; justify-content: center">
            <button onclick="addChapter();">Add</button>
        </div>
        <h4>Chapter List</h4>
        <div style="
          display: flex;
          align-items:center;
          flex-direction:column;" id="chapterList">

        </div>
        <script>
            function addChapter() {
                let titleText = document.getElementById("inputTitle").value;
                let startText = document.getElementById("inputStart").value;
                let endText = document.getElementById("inputEnd").value;
                let newChapter = "<div style='display:flex; align-items:center; flex-direction:colomn'><div style='padding-right: 5px'>" + titleText + ":</div><div>" + startText + " - " + "</div> <div>" + endText + "</div></div>";
                alert(newChapter);
                document.getElementById("chapterList").insertAdjacentHTML('beforeend', newChapter);
            }
            
        </script>
    </div>
</div>`,
    image:
      "https://ipfs.effect.ai/ipfs/bafkreiggnttdaxleeii6cdt23i4e24pfcvzyrndf5kzfbqgf3fxjryj5s4",
    category: "Video Chapters",
    example_task: {
      video_url: "https://www.youtube.com/embed/xx8QEtZQieI",
    },
    tasks: [{ video_url: videoLink }],
    version: 1,
    reward: 1,
  };
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);
  const [showActiveCampains, setShowActiveCampains] = useState(false);
  const [showNewCampain, setShowNewCampain] = useState(true);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showCampaignCard, setShowCampaignCard] = useState(false);

  const renderActiveCampains = () => {
    return (
      <div className="activeCampainsContent">
        <div className="activeCampainsGrid">
          {campaigns !== "" &&
            campaigns.map((campain) => (
              <div className="gridItem" key={campain.name}>
                <div className="gridItemTitle">{campain.name}</div>
                <iframe width="200" src={campain.video}></iframe>
                <button
                  onClick={campaignCardClick()}
                  className="gridItemButton"
                >
                  View Details
                </button>
              </div>
            ))}
        </div>
      </div>
    );
  };

  const getCampaignDetails = async () => {
    const client = new effectsdk.EffectClient("jungle");
    const account = effectsdk.createAccount(
      ""
    );
    const web3 = effectsdk.createWallet(account);
    const effectAccount = await client.connectAccount(web3);
    const campaign = await client.force.getCampaign(campaignId);
    //console.log(campaign);
    setCampaignDetails(campaign.info);
  };

  const renderCampaignCard = () => {
    // const details = getCampaignDetails();
    // console.log(campaignDetails);

    return (
      <div className="cardContainer">
        <div className="cardTitle">
          <h1>Effect SDK Intro</h1>
        </div>
        <div className="cardVideo">
          <iframe
            width="420"
            height="315"
            src="https://www.youtube.com/embed/xx8QEtZQieI"
          ></iframe>
        </div>
        <div className="formContent">
          <div className="formBox">
            <div className="formContentRow">
              <div className="formTitle">Add New Batch</div>
            </div>
            <div className="formContentRow">
              <div className="formLabel">Video URL</div>
              <input
                type="text"
                onChange={(e) => setBatchVideo(e.target.value)}
                className="formInput"
              />
            </div>
            <div className="formContentRow">
              <button className="submitButton" onClick={addNewBatch()}>
                Add
              </button>
            </div>
          </div>
        </div>
        <div className="cardResults">
          {newbatchLoading && <h3>Adding new batch...</h3>}
        </div>
      </div>
    );
  };

  const addNewBatch = () => async () => {
    setNewBatchLoading(true);
    const content = {
      tasks: [{ video_url: batchVideo }],
    };
    createBatchFunction(content);
  };

  const createBatchFunction = async (content) => {
    const client = new effectsdk.EffectClient("jungle");
    const account = effectsdk.createAccount(
      ""
    );
    const web3 = effectsdk.createWallet(account);
    const effectAccount = await client.connectAccount(web3);
    //const campaign = await client.force.getMyLastCampaign();
    const newbatch = await client.force.createBatch(351, content, 1);
    console.log(newbatch);
    if (newbatch!==""){
      setNewBatchLoading(false);
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    createEffectCampaign();
    //getLastCampaign();
  };

  const getLastCampaign = async () => {
    const client = new effectsdk.EffectClient("jungle");
    const account = effectsdk.createAccount(
      ""
    );
    const web3 = effectsdk.createWallet(account);
    const effectAccount = await client.connectAccount(web3);
    const campaign = await client.force.getMyLastCampaign();
    console.log(campaign.id);
  };

  const renderPreview = () => {
    return (
      <div style={{ textAlign: "center" }}>
        <div className="content">
          <h2>Make chapters for this video 🎬</h2>
          <iframe
            height="200"
            src="https://www.youtube.com/embed/tgbNymZ7vqY"
          ></iframe>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ flex: 1 }}>Start</div>
            <input style={{ flex: 1 }} type="text"></input>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ flex: 1 }}>End</div>
            <input style={{ flex: 1 }} type="text"></input>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ flex: 1 }}>Title</div>
            <input style={{ flex: 1 }} type="text"></input>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button>Add</button>
          </div>
          <h4>Chapter List</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="listContent">
              <div id="titleText"></div>
              <div id="startText"></div>
              <div id="endText"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderNewCampain = () => {
    return (
      <div className="formContent">
        <form onSubmit={handleSubmit} className="formBox">
          <div className="formContentRow">
            <div className="formTitle">Add New Campaign</div>
          </div>
          <div className="formContentRow">
            <div className="formLabel">Campaign Name</div>
            <input
              type="text"
              onChange={(e) => setCampaignName(e.target.value)}
              className="formInput"
            />
          </div>
          <div className="formContentRow">
            <div className="formLabel">Video Link</div>
            <input
              type="text"
              onChange={(e) => setVideoLink(e.target.value)}
              className="formInput"
            />
          </div>
          <div className="formContentRow">
            <div className="formLabel">Campaign Description</div>
            <input
              type="text"
              onChange={(e) => setDescription(e.target.value)}
              className="formInput"
            />
          </div>
          <div className="formContentRow">
            <div className="formLabel">Campaign Instructions</div>
            <textarea
              row="3"
              onChange={(e) => setInstructions(e.target.value)}
              className="formInput"
            />
          </div>
          <div className="formContentRow">
            <div className="formLabel">Campaign Reward</div>
            <input
              type="text"
              onChange={(e) => setReward(e.target.value)}
              className="formInput"
            />
          </div>
          {/* <div className="formContentRow">
            <div className="formLabel">Private Key</div>
            <input
              type="text"
              onChange={(e) => setPrivateKey(e.target.value)}
              className="formInput"
            />
          </div> */}
          <div className="formContentRow">
            <button className="submitButton" type="submit">
              Submit
            </button>
          </div>
        </form>
        {creatingNewCampaign && <h1>Creating New Campaign...</h1>}
        {/* {renderPreview()} */}
      </div>
    );
  };

  const renderAccountSettings = () => {
    return (
      <div className="formContent">
        <div className="formContentRow">
          <div className="formTitle">Account Settings</div>
        </div>
        <div className="formContentRow">
          <div className="formLabel">Account Name</div>
          <input type="text" className="formInput" />
        </div>
        <div className="formContentRow">
          <div className="formLabel">Wallet</div>
          <input type="text" className="formInput" />
        </div>
        <div className="formContentRow">
          <div className="formLabel">Campain Description</div>
          <input type="text" className="formInput" />
        </div>
        <div className="formContentRow">
          <div className="formLabel">Campain Instructions</div>
          <textarea row="3" className="formInput" />
        </div>
        <div className="formContentRow">
          <div className="formLabel">Campain Reward</div>
          <input type="text" className="formInput" />
        </div>
        <div className="formContentRow">
          <button className="submitButton">Submit</button>
        </div>
      </div>
    );
  };

  const activeCampainsClick = () => async () => {
    setShowActiveCampains(true);
    setShowNewCampain(false);
    setShowAccountSettings(false);
    setShowCampaignCard(false);
  };

  const addCampainClick = () => async () => {
    setShowActiveCampains(false);
    setShowNewCampain(true);
    setShowAccountSettings(false);
    setShowCampaignCard(false);
  };

  const accountSettingsClick = () => async () => {
    setShowActiveCampains(false);
    setShowNewCampain(false);
    setShowAccountSettings(true);
    setShowCampaignCard(false);
  };
  const campaignCardClick = () => async () => {
    setShowActiveCampains(false);
    setShowNewCampain(false);
    setShowAccountSettings(false);
    setShowCampaignCard(true);
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <button className="tabButton" onClick={addCampainClick()}>
            Add New Campain
          </button>
          <button className="tabButton" onClick={activeCampainsClick()}>
            Active Campains
          </button>
          <button className="tabButton" onClick={accountSettingsClick()}>
            Account Settings
          </button>
        </div>
        <hr className="shareHr" />
        {showActiveCampains === true && renderActiveCampains()}
        {showNewCampain === true && renderNewCampain()}
        {showAccountSettings === true && renderAccountSettings()}
        {showCampaignCard === true && renderCampaignCard()}
      </div>
    </div>
  );
}
