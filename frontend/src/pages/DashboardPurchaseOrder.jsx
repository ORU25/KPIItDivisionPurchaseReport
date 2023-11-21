import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Header from '../components/Header';
import Home from '../components/Home';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import PurchaseOrder from '../components/PurchaseOrder';

function DashboardPurchaseOrder() {

  return (
    <div>
      <Header />
      <PurchaseOrder />
      <SideNav />
      <Footer />
    </div>
  );
}

export default DashboardPurchaseOrder;
