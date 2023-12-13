import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Pr from "./pages/Pr";
import Po from "./pages/Po";
import { useEffect, useState } from "react";
import PrLine from "./pages/PrLine";
import PoLine from "./pages/PoLine";
import axios from "axios";
import Layout from "./components/Layout";
import Users from "./pages/User/Users";
import UserCreate from "./pages/User/UserCreate";
import NotFound from "./components/NotFound";
import UserEdit from "./pages/User/UserEdit";
// import Dashboard from "./pages/Dashboard";
import FlexibleDashboard from "./pages/FlexibleDashboard";
import Departments from "./pages/Department/Departments";
const App = () => {
  const token = sessionStorage.getItem("token");
  const Navigate = useNavigate();
  const [user, setUser] = useState({
    role: null,
    name: null,
    department: null,
  });

  const getUser = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/user`
    );
    setUser(response.data);
  };

  const handleLogout = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${import.meta.env.VITE_BACKEND_API}/api/logout`)
      .then(() => {
        sessionStorage.removeItem("token");
        setUser({
          role: null,
          name: null,
          department: null,
        });
        Navigate("/");
      });
  };

  useEffect(() => {
    if (token && !user.role && !user.name) {
      getUser();
    } else if (!token) {
      Navigate("/");
    }
  }, [token]);

  const layoutProps = { role: user.role, name: user.name, department: user.department};

  return (
    <div className="">
      <Routes>
        <Route path="/" element={<Login />} />
        {/* <Route
          path="/dashboard"
          element={
            <Layout
              title={"DASHBOARD PT KALTIM PARNA INDUSTRI"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <Dashboard department={user.department} />
            </Layout>
          }
        /> */}

        <Route
          path="/dashboard/:department"
          element={
            <Layout
              title={"Dashboard "}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <FlexibleDashboard />
            </Layout>
          }
        />
        <Route
          path="/pr"
          element={
            <Layout
              title={"Purchase Requisitions"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <Pr />
            </Layout>
          }
        />
        <Route
          path="/po"
          element={
            <Layout
              title={"Purchase Orders"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <Po />
            </Layout>
          }
        />
        <Route
          path="/pr/:pr_no"
          element={
            <Layout
              title={"Purchase Requisition"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <PrLine />
            </Layout>
          }
        />
        <Route
          path="/po/:po_no"
          element={
            <Layout
              title={"Purchase Order"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <PoLine />
            </Layout>
          }
        />
        {user.role == "admin" ? (
          <Route
            path="/users"
            element={
              <Layout
                title={"Users"}
                {...layoutProps}
                handleLogout={handleLogout}
              >
                <Users />
              </Layout>
            }
          />
        ) : (
          ""
        )}
        {user.role == "admin" ? (
          <Route
            path="/user/create"
            element={
              <Layout
                title={"Add Users"}
                {...layoutProps}
                handleLogout={handleLogout}
              >
                <UserCreate />
              </Layout>
            }
          />
        ) : (
          ""
        )}
        {user.role == "admin" ? (
          <Route
            path="/user/edit/:id"
            element={
              <Layout
                title={"Edit Users"}
                {...layoutProps}
                handleLogout={handleLogout}
              >
                <UserEdit />
              </Layout>
            }
          />
        ) : (
          ""
        )}
        {user.role == "admin" ? (
          <Route
            path="/departments"
            element={
              <Layout
                title={"Departments"}
                {...layoutProps}
                handleLogout={handleLogout}
              >
                <Departments />
              </Layout>
            }
          />
        ) : (
          ""
        )}
        <Route
          path="/404"
          element={
            <Layout
              title={"Page Not Found"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <NotFound />
            </Layout>
          }
        />
        <Route
          path="*"
          element={
            <Layout
              title={"Page Not Found"}
              {...layoutProps}
              handleLogout={handleLogout}
            >
              <NotFound />
            </Layout>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
