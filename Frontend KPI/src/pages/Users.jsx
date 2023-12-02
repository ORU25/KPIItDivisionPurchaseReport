import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Loading from "../components/Loading";

const Users = () => {
  const token = sessionStorage.getItem("token");
  const Navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);

  const getUsers = async () => {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_API}/api/users`
    );
    setUsers(response.data);
    setFilter(response.data);
    setPending(false);
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
          <button onClick={""} className="btn btn-sm btn-secondary mr-2">
            <i className="fas fa-pencil-alt"></i>
          </button>
          <button onClick={""} className="btn btn-sm btn-danger">
            <i className="fas fa-trash "></i>
          </button>
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
                      <button
                        className={`btn btn-success btn-sm float-right `}
                      >
                        <i className="fas fa-user-plus mr-2"></i>
                        Add User</button>
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
