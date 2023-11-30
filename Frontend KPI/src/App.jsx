import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Pr from "./pages/Pr";
import Po from "./pages/Po";
import { useEffect } from "react";
import PrLine from "./pages/PrLine";
import PoLine from "./pages/PoLine";
const App = () => {
  const token = localStorage.getItem("token");
  const Navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
  }, [token]);
  
  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pr" element={<Pr />} />
        <Route path="/po" element={<Po />}  />
        <Route path="/pr/:pr_no" element={<PrLine />} />
        <Route path="/po/:po_no" element={<PoLine />} />
      </Routes>
    </div>
  );
};

export default App;
