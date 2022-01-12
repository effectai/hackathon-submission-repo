import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Campains from "../../components/campains/Campains";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"

export default function Home() {
  return (
    <>
      <Topbar />
      <div className="homeContainer">
        <Sidebar />
        <Campains/>
        <Rightbar/>
      </div>
    </>
  );
}
