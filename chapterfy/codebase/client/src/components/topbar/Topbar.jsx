import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";


export default function Topbar() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.clear()
    window.location.href = "http://localhost:3000/";
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">

      </div>
      <div className="topbarCenter">
      <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Chapterfy</span>
        </Link>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink" onClick={handleLogout}>Log out</span>
        </div>
      </div>
    </div>
  );
}
