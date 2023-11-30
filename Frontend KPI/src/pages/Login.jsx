import { useEffect, useState } from "react";
import Logo from "../assets/kpi_logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validation, setValidation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const loginHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData();

    formData.append("email", email);
    formData.append("password", password);

    await axios
      .post(`${import.meta.env.VITE_BACKEND_API}/api/login`, formData)
      .then((response) => {
        if (response.data.token) {
          sessionStorage.setItem("token", response.data.token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        setValidation(error.response.data);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (sessionStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, []);

  return (
    <div id="login" className="hold-transition login-page">
      <div
        id="loginCard"
        className="login-box animate__animated animate__fadeInDown"
      >
        {/* /.login-logo */}
        <div className="card card-outline card-success opacity">
          <div className="card-header text-center ">
            <img src={Logo} alt="" width={"60px"} />
            <p className="kpi-text-color ml-2 text-bold h4 mt-3">
              PT KALTIM PARNA INDUSTRI
            </p>
          </div>
          <div className="card-body ">
            {isLoading ? (
              <>
                <p className="login-box-msg kpi-text-color text-bold h5">
                  PURCHASE REPORT
                </p>
                <div className="d-flex justify-content-center align-items-center my-5">
                  <h1>
                    <div
                      className="spinner-border kpi-text-color text-bold"
                      role="status"
                      style={{ width: "4rem", height: "4rem" }}
                    >
                      <span className="sr-only mx-auto">Loading...</span>
                    </div>
                  </h1>
                </div>
                <div className="row">
                  <div className="col-8">
                    <div className="icheck-primary">
                      <input type="checkbox" id="remember" />
                    </div>
                  </div>
                  {/* /.col */}
                  <div className="col-4">
                    <button type="submit" className="btn btn-success btn-block">
                      <i className="fas fa-sign-in-alt"></i>
                      <span className="ml-2">Login</span>
                    </button>
                  </div>
                  {/* /.col */}
                </div>
              </>
            ) : (
              <>
                <p className="login-box-msg kpi-text-color text-bold h5">
                  PURCHASE REPORT
                </p>
                <form onSubmit={loginHandler}>
                  {validation.message ? (
                    <div className="alert alert-danger alert-dismissible fade show">
                      {validation.message}
                      <button
                        type="button"
                        className="close hover-alert"
                        data-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  ) : null}
                  <div className="input-group mb-3">
                    <input
                      type="email"
                      className="form-control "
                      placeholder="Email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-envelope " />
                      </div>
                    </div>
                  </div>
                  {validation.email && (
                    <div className="alert alert-danger alert-dismissible fade show">
                      {validation.email[0]}
                      <button
                        type="button"
                        className="close hover-alert"
                        data-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  )}
                  <div className="input-group mb-3">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <div className="input-group-append">
                      <div className="input-group-text">
                        <span className="fas fa-lock" />
                      </div>
                    </div>
                  </div>
                  {validation.password && (
                    <div className="alert alert-danger alert-dismissible fade show">
                      {validation.password[0]}
                      <button
                        type="button"
                        className="close hover-alert"
                        data-dismiss="alert"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-8">
                      <div className="icheck-primary">
                        <input type="checkbox" id="remember" />
                      </div>
                    </div>
                    {/* /.col */}
                    <div className="col-4">
                      <button
                        type="submit"
                        className="btn btn-success btn-block"
                      >
                        <i className="fas fa-sign-in-alt"></i>
                        <span className="ml-2">Login</span>
                      </button>
                    </div>
                    {/* /.col */}
                  </div>
                </form>
              </>
            )}
            {/* /.social-auth-links */}
          </div>
          {/* /.card-body */}
        </div>
        {/* /.card */}
      </div>
    </div>
  );
};

export default Login;
