/* eslint-disable react/prop-types */
import { Link, useLocation } from "react-router-dom";
import Logo from "../assets/kpi_logo.png";

const Sidebar = ({ role }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div>
      <div>
        {/* Main Sidebar Container */}
        <aside className="main-sidebar sidebar-dark-white bg-success elevation-4">
          <a className="brand-link " href="/">
            <div className="row">
              <div className="col-10 col-lg-12">
                <div className="col-12 d-flex justify-content-center align-items-center ">
                  <img
                    src={Logo}
                    alt="PT KPI Logo"
                    className=" img-circle "
                    style={{
                      opacity: ".8",
                      width: "50px",
                      height: "50px",
                    }}
                  />
                </div>
                <div className="brand-text text-white col-12 mt-3  h6 text-bold text-center">
                  PT KALTIM PARNA INDUSTRI
                </div>
              </div>
              <div className="d-inline d-lg-none col-2 col-lg-0">
                <a
                  className="float-right mr-2 "
                  data-widget="pushmenu"
                  href="#"
                  role="button"
                >
                  <i className="fas fa-bars text-white" />
                </a>
              </div>
            </div>
          </a>

          {/* Sidebar */}

          <div className="sidebar">
            {/* Sidebar Menu */}
            <nav className="mt-2">
              <ul
                className="nav nav-pills nav-sidebar flex-column"
                data-widget="treeview"
                role="menu"
                data-accordion="false"
              >
                {/* Add icons to the links using the .nav-icon class
            with font-awesome or any other icon font library */}
                <li className="nav-item ">
                  <Link to={"/dashboard"}>
                    <a
                      className={`nav-link ${
                        currentPath === "/dashboard"
                          ? "active text-success text-bold"
                          : "text-white"
                      }`}
                    >
                      <i className="nav-icon fas fa-th" />
                      <p>Dashboard</p>
                    </a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/pr"}>
                    <a
                      className={`nav-link ${
                        currentPath === "/pr"
                          ? "active text-success text-bold"
                          : "text-white"
                      }`}
                    >
                      <i className="nav-icon fas fa-receipt" />
                      <p>Purchase Requisition</p>
                    </a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to={"/po"}>
                    <a
                      className={`nav-link ${
                        currentPath === "/po"
                          ? "active text-success text-bold"
                          : "text-white"
                      }`}
                    >
                      <i className="nav-icon fas fa-file-invoice" />
                      <p>Purchase Order</p>
                    </a>
                  </Link>
                </li>
                {role != "admin" ? (
                  ""
                ) : (
                  <li className="nav-item">
                    <Link to={"/users"}>
                      <a
                        className={`nav-link ${
                          currentPath === "/users"
                            ? "active text-success text-bold"
                            : "text-white"
                        }`}
                      >
                        <i className="nav-icon fas fa-users text-sm" />
                        <p>Users</p>
                      </a>
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
            {/* /.sidebar-menu */}
          </div>
          {/* /.sidebar */}
        </aside>
        {/* Main Sidebar Container */}
      </div>
    </div>
  );
};

export default Sidebar;
