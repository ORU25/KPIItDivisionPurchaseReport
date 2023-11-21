
//import react router dom
import { Routes, Route } from "react-router-dom";

//import component Register
import Register from './pages/Register';

//import component Login
import Login from './pages/Login';

//import component Register
import Dashboard from './pages/Dashboard';
import DashboardPurchaseRequestion from "./pages/DashboardPurchaseRequestion";
import DashboardPurchaseOrder from "./pages/DashboardPurchaseOrder";

function App() {
  return (
    <>
      <Routes>
        <Route exact path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/purchaserequestion" element={<DashboardPurchaseRequestion/>} />
        <Route path="/purchaseorder" element={<DashboardPurchaseOrder/>} />
      </Routes>
      
    </>
);
  }

export default App;