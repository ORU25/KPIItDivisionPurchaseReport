import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Loading from "../../components/Loading";

const Departments = () => {
  const token = sessionStorage.getItem("token");
  const Navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, SetSearch] = useState("");
  const [filter, setFilter] = useState([]);
  const [validation, setValidation] = useState([]);

  const getDepartments = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_API}/api/departments`
      );
      setDepartments(response.data);
      setFilter(response.data);
      setPending(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        sessionStorage.removeItem("token");
        Navigate("/");
      } else console.log("error fetching data", error);
    }
  };



  const column = [
   
    
    {
      name: "Action",
      width: "70px",
      cell: (row) => (
        <>
          <Link to={`/department/edit/${row.id}`}>
            <button onClick={""} className="btn btn-sm btn-secondary mr-2">
              <i className="fas fa-pencil-alt"></i>
            </button>
          </Link>
        </>
      ),
    },
    {
      name: "Name",
      selector: "name",
      sortable: true,
    },
  ];

  useEffect(() => {
    const result = departments.filter((item) => {
      return (
        item.name.toLowerCase().match(search.toLocaleLowerCase())
      );
    });
    setFilter(result);
  }, [search]);

  useEffect(() => {
    if (!token) {
      Navigate("/");
    }
    getDepartments();
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
                      <Link to={"/department/create"}>
                        <button
                          className={`btn btn-success btn-sm float-right `}
                        >
                          <i className="fas fa-plus mr-2"></i>
                          Add Department
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

export default Departments;
