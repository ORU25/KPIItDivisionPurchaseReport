import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserCreate = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [role, setRole] = useState("");
  const [departments, setDepartments] = useState("");
  const [department, setDepartment] = useState("");
  //define state validation
  const [validation, setValidation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const getDepartment = async () => {
    setIsLoading(true);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .get(`${import.meta.env.VITE_BACKEND_API}/api/departments`)
      .then((response) => {
        setDepartments(response.data)
      })
      .catch((error) => {
        //assign error to state "validation"
        setValidation(error.response.data);
      });
    setIsLoading(false);
  }

  const registerHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("password_confirmation", passwordConfirmation);
    formData.append("role", role);
    formData.append("department_id", department);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .post(`${import.meta.env.VITE_BACKEND_API}/api/register`, formData)
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
    getDepartment()
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="content">
      <div className="container-fluid overflow-auto">
        <div className="card card-secondary">
          <div className="card-header">
            <h3 className="card-title">Add User</h3>
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
              <form onSubmit={registerHandler}>
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
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input
                          required
                          type="password"
                          value={password}
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Password"
                          onChange={(e) => setPassword(e.target.value)}
                        />
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
                          required
                          type="password"
                          value={passwordConfirmation}
                          className="form-control"
                          id="exampleInputPassword1"
                          placeholder="Password"
                          onChange={(e) =>
                            setPasswordConfirmation(e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="form-group col-4">
                      <label>Department</label>
                      <select
                        className="form-control"
                        required
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                      >
                        <option value="">Select Department</option>
                        {departments &&  departments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                        
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-4">
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
                  </div>
                </div>
                {/* /.card-body */}
                <div className="card-footer">
                  <button type="submit" className="btn btn-success">
                    <i className="fas fa-plus mr-2"></i>
                    Add
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

export default UserCreate;
