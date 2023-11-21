import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function SideNav() {
    return (
<div>
  <aside className="main-sidebar sidebar-dark-white elevation-4" style={{ backgroundColor: 'green' }}>
  <a href="index3.html" className="brand-link" style={{ textDecoration: 'none' }}>
    <img src="../dist/img/kpilogo.png" alt="Kpi Logo" className="brand-image img-circle elevation-8" style={{opacity: '.8'}} />
    <span className="brand-text " style={{ fontWeight: 'bold' }}>PT. KPI</span>
  </a>

  <div className="sidebar">
    <nav className="mt-2">
      <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
        <li className="nav-item menu-open">
          <NavLink to="/Dashboard" className="nav-link" activeClassName="active">
            <i className="nav-icon fas fa-tachometer-alt" />
            <p>
              Dashboard
            </p>
          </NavLink>
        </li>
       
        <li className="nav-item">
        <NavLink to="/PurchaseOrder" className="nav-link" activeClassName="active">
            <i className="nav-icon fas fa-chart-pie" />
            <p>
             Purchase Order
            </p>
        </NavLink>
        </li>

        <li className="nav-item">
        <NavLink to="/PurchaseRequestion" className="nav-link" activeClassName="active">
            <i className="nav-icon fas fa-chart-pie" />
            <p>
             Purchase Requestion
            </p>
        </NavLink>
        </li>
      </ul>
    </nav>
  </div>
</aside>
        </div>
    );
}

export default SideNav;