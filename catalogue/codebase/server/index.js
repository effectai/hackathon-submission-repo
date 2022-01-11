import Graceful from "@ladjs/graceful";
import Bree from "bree";
import path from "path";

const bree = new Bree({
  root: path.join(__dirname, "jobs"),
  jobs: [
    {
      name: "fetch-submissions",
      interval: "every 30 seconds",
    },
    {
      name: "upload-tasks",
      interval: "every 60 seconds",
    },
  ],
});
const graceful = new Graceful({ brees: [bree] });

graceful.listen();
bree.start();

export * from "./server.js";
