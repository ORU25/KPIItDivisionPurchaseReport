import { useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";

const Dashboard = () => {

  const token = sessionStorage.getItem('token')
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <section className="content">
        <div className="container-fluid">
          <div className="h2 mb-3 font-weight-bold text-center text-olive">
            DEPARTMENT / DIVISION
            <hr className="w-50 font-weight-bold"></hr>
          </div>
          <div className=" d-flex justify-content-center flex-wrap">
            <Link
              to={"/dashboard/information%20technology"}
              className="btn btn-secondary btn-lg p-3 m-3 col-3"
            >
              Information Technology
            </Link>
            <Link className="btn btn-secondary disabled btn-lg p-3 m-3 col-3">
              Other
            </Link>
            <Link className="btn btn-secondary disabled btn-lg p-3 m-3 col-3">
              Other
            </Link>
            <Link className="btn btn-secondary disabled btn-lg p-3 m-3 col-3">
              Other
            </Link>
            <Link className="btn btn-secondary disabled btn-lg p-3 m-3 col-3">
              Other
            </Link>
            <Link className="btn btn-secondary disabled btn-lg p-3 m-3 col-3">
              Other
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;
