// Reports.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import config from "../coreFIles/config";
import Header from "../directives/header";
import Footer from "../directives/footer";
import Sidebar from "../directives/sidebar";

const Reports = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginData = Cookies.get("Code_Maya_Assignment")
      ? JSON.parse(Cookies.get("Code_Maya_Assignment"))
      : null;

    if (!loginData || !loginData.user) {
      navigate(config.baseUrl);
      return;
    }

    const permissions = loginData.user.permissions || [];

    if (!permissions.includes("view:reports")) {
      navigate("/403");
      return;
    }
  }, [navigate]);

  return (
    <div className="wrapper">
      <Header />
      <Sidebar />

      <div className="content-wrapper">
        <section className="content">
          <div className="container mt-3">
            <h1>Reports Page</h1>
           
            <div className="card mt-4 p-3">
              <h3>Sales Report</h3>
              <ul>
                <li>January: $10,000</li>
                <li>February: $12,500</li>
                <li>March: $9,800</li>
              </ul>
            </div>

            <div className="card mt-3 p-3">
              <h3>Employee Report</h3>
              <ul>
                <li>Total Employees: 25</li>
                <li>Active: 23</li>
                <li>On Leave: 2</li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Reports;
