import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DepartmentCreate = () => {
  const [name, setName] = useState("");

  //define state validation
  const [validation, setValidation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");

  const registerHandler = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name);

    await axios
      .post(`${import.meta.env.VITE_BACKEND_API}/api/departments`, formData)
      .then(() => {
        navigate("/departments");
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
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="content">
      <div className="container-fluid overflow-auto">
        <div className="card card-secondary">
          <div className="card-header">
            <h3 className="card-title">Add Department</h3>
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

export default DepartmentCreate;
