import config from "../coreFIles/config";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { logout as apiLogout } from "../Action/action";

const Sidebar = () => {
  const pageUrl = window.location.pathname;

  const handleLogout = async () => {
    try {

      const loginData = Cookies.get("Code_Maya_Assignment")
        ? JSON.parse(Cookies.get("Code_Maya_Assignment"))
        : null;

      if (loginData?.refreshToken) {
        await apiLogout({ refreshToken: loginData.refreshToken });
      }
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      Cookies.remove("Code_Maya_Assignment");
      window.location.href = config.baseUrl;
    }
  };

  return (
    <>
      <aside className="main-sidebar">
        <section className="sidebar position-relative">
          <div className="multinav">
            <div className="multinav-scroll ps--active-y ps--scrolling-y pt-10" style={{ height: "100%" }}>
              <ul className="sidebar-menu" data-widget="tree">
                <li key="user-list" className={pageUrl.match("/user-list") ? "active" : ""}>
                  <Link to={`${config.baseUrl}user-list`}>
                    <i className="fa fa-list" aria-hidden="true"></i>
                    <span>USER LIST</span>
                  </Link>
                </li>

                <li key="reports" className={pageUrl.match("/reports") ? "active" : ""}>
                  <Link to={`${config.baseUrl}reports`}>
                    <i className="fa fa-list" aria-hidden="true"></i>
                    <span>Report</span>
                  </Link>
                </li>

                <li key="logout" className="">
                  <a href="#" onClick={handleLogout}>
                    <i className="fa fa-sign-out" />
                    <span>LOGOUT</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </aside>
    </>
  );
};

export default Sidebar;
