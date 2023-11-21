import React from 'react';
import Header from '../components/Header';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';
import PurchaseRequestion from '../components/PurchaseRequestion';

function DashboardPurchaseRequestion() {

  return (
    <div>
      <Header />
      <PurchaseRequestion />
      <SideNav />
      <Footer />
    </div>
  );
}

export default DashboardPurchaseRequestion;
