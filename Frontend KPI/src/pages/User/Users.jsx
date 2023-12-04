import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading";

const Users = () => {
  const token = sessionStorage.getItem("token");
  const Navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [validation, setValidation] = useState([]);

  const getUsers = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/users`
      );
      setUsers(response.data);
      setFilter(response.data);
      setPending(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        sessionStorage.removeItem("token");
        Navigate("/");
      } else console.log("error fetching data", error);
    }
  };

  const deleteUser = async (userId) => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    await axios
      .delete(`${import.meta.env.VITE_BACKEND_API}/api/user/${userId}`)
      .then(() => {
        getUsers();
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          sessionStorage.removeItem("token");
          Navigate("/");
        }

        if (error.response && error.response.status === 403) {
          setValidation(error.response.data);
        }
      });
  };

  const column = [
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
    {
      name: "Email",
      selector: "email",
      sortable: true,
    },
    {
      name: "Role",
      selector: "role",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <Link to={`/user/edit/${row.id}`}>
            <button onClick={""} className="btn btn-sm btn-secondary mr-2">
              <i className="fas fa-pencil-alt"></i>
            </button>
          </Link>
          <button
            onClick={""}
            data-toggle="modal"
            data-target={`#Modal${row.id}`}
            className="btn btn-sm btn-danger"
          >
            <i className="fas fa-trash "></i>
          </button>
          <div
            className="modal fade"
            id={`Modal${row.id}`}
            tabIndex={-1}
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
                    Delete <b>{row.email}</b>
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <h6 className="text-center">
                  
                    Are you sure to delete this user ?
                  </h6>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    data-dismiss="modal"
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      deleteUser(row.id);
                    }}
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    },
  ];

  useEffect(() => {
    const result = users.filter((item) => {
      return (
        item.name.toLowerCase().match(search.toLocaleLowerCase()) ||
        item.email.toLowerCase().match(search.toLocaleLowerCase()) ||
        item.role.toLowerCase().match(search.toLocaleLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    getUsers();
    window.scrollTo(0, 0);
  }, [token, Navigate]);

  return (
    <section className="content">
      <div className="container-fluid overflow-auto">
        {validation.message && (
          <div className="alert alert-danger alert-dismissible fade show">
            {validation.message}
            <button
              type="button"
              className="close hover-alert"
              data-dismiss="alert"
              aria-label="Close"
            >
              <i onClick={() => {
                    setValidation([]);
                  }}>
                <span
                  aria-hidden="true"
                  
                >
                  ×
                </span>
              </i>
            </button>
          </div>
        )}
        <DataTable
          columns={column}
          data={filter}
          progressPending={pending}
          progressComponent={
            <Loading color={"secondary"} classes={"h5 my-5"} />
          }
          subHeader
          subHeaderComponent={
            <div className="row justify-content-between w-100">
              {!pending ? (
                <>
                  <div className="col-auto">
                    <>
                      <Link to={"/user/create"}>
                        <button
                          className={`btn btn-success btn-sm float-right `}
                        >
                          <i className="fas fa-user-plus mr-2"></i>
                          Add User
                        </button>
                      </Link>
                    </>
                  </div>
                  <div className="col-md-4 mt-2 mt-md-0">
                    <input
                      type="text"
                      className=" form-control"
                      placeholder="Search..."
                      value={search}
                      onChange={(e) => SetSearch(e.target.value)}
                    />
                  </div>
                </>
              ) : (
                ""
              )}
            </div>
          }
        />
      </div>
    </section>
  );
};

export default Users;
