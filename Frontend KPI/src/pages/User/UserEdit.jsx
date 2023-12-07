import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UserEdit = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("");
  //define state validation
  const [validation, setValidation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const { id } = useParams();

  const getUser = async () => {
    setIsLoading(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`${import.meta.env.VITE_BACKEND_API}/api/user/${id}`)
      .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email);
        setRole(response.data.role);
      })
      .catch((error) => {
        //assign error to state "validation"
        setValidation(error.response.data);
        navigate("/404");
      });
    setIsLoading(false);
  };

  const UpdateHandler = async () => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (!password == "") {
      formData.append("password", password);
      formData.append("password_confirmation", passwordConfirmation);
    }
    formData.append("role", role);

    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${import.meta.env.VITE_BACKEND_API}/api/user/edit/${id}`, formData)
      .then(() => {
        navigate("/users");
      })
      .catch((error) => {
        //assign error to state "validation"
        setValidation(error.response.data);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    getUser();
  }, []);

  return (
    <section className="content">
      <div className="container-fluid overflow-auto">
        <div className="card card-secondary">
          <div className="card-header">
            <h3 className="card-title">
              Edit <b>{email}</b>
            </h3>
          </div>
          {/* /.card-header */}
          {/* form start */}
          {isLoading ? (
            <>
              <div className="d-flex justify-content-center align-items-center my-5">
                <h1>
                  <div
                    className="spinner-border text-secondary text-bold"
                    role="status"
                    style={{ width: "4rem", height: "4rem" }}
                  >
                    <span className="sr-only mx-auto">Loading...</span>
                  </div>
                </h1>
              </div>
            </>
          ) : (
            <>
              <form
                onSubmit={() => {
                  UpdateHandler();
                }}
              >
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="exampleInputEmail1">Name</label>
                        <input
                          required
                          value={name}
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      {validation.name && (
                        <div className="alert alert-danger alert-dismissible fade show">
                          {validation.name[0]}
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
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="exampleInputEmail1">
                          Email address
                        </label>
                        <input
                          required
                          type="email"
                          value={email}
                          className="form-control"
                          placeholder="Enter email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
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
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="exampleInputPassword1">New Password</label>
                        <input
                          type="password"
                          value={password}
                          className="form-control"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
                        <h6 className="text-danger ml-1 mt-1">
                          leave blank to keep current password
                        </h6>
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
                    </div>

                    <div className="col-md-6">
                      <div className="form-group ">
                        <label htmlFor="exampleInputPassword1">
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          value={passwordConfirmation}
                          className="form-control"
                          placeholder="Password"
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4">
                      <div className="form-group ">
                        <label>Role</label>
                        <select
                          className="form-control"
                          required
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
                          <option value="">Select Role</option>
                          <option value={"admin"}>Admin</option>
                          <option value={"user"}>User</option>
                        </select>
                      </div>
                      {validation.message && (
                        <div className="alert alert-danger alert-dismissible fade show">
                          {validation.message}
                          <button
                            type="button"
                            className="close hover-alert"
                            data-dismiss="alert"
                            aria-label="Close"
                          >
                            <i
                              onClick={() => {
                                setValidation([]);
                              }}
                            >
                              <span aria-hidden="true">×</span>
                            </i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {/* /.card-body */}
                <div className="card-footer">
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-plus mr-2"></i>
                    Change
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
        <div className="float-right">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-info btn-block btn-sm"
          >
            <i className="fas fa-caret-left mr-2"></i>
            <span className="">Go back</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default UserEdit;
