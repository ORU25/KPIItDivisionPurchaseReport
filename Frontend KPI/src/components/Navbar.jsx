/* eslint-disable react/prop-types */


const Navbar = ({ title, name, handleLogout}) => {

  // const [user, setUser] = useState("");

  // const getUser = async () => {
  //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  //   await axios
  //     .get(`${import.meta.env.VITE_BACKEND_API}/api/user`)
  //     .then((response) => {
  //       setUser(response.data);
  //     });
  // };

  const logoutHandler = async () => {
    await handleLogout();
  };
  // useEffect(() => {
  //   getUser();
  // }, []);
  return (
    <nav className="main-header navbar navbar-expand navbar-white navbar-light">
      {/* Left navbar links */}
      <ul className="navbar-nav">
        <li className="nav-item d-flex align-items-center">
          <a className="nav-link" data-widget="pushmenu" href="#" role="button">
            <i className="fas fa-bars" />
          </a>
          <h4 className="m-0 font-weight-bold text-secondary ">{title}</h4>
        </li>
      </ul>
      {/* Right navbar links */}
      <ul className="navbar-nav ml-auto">
        {/* Notifications Dropdown Menu */}

        <li className="nav-item">
          <a
            className="nav-link"
            data-widget="fullscreen"
            href="#"
            role="button"
          >
            <i className="fas fa-expand-arrows-alt text-secondary" />
          </a>
        </li>

        <li className="nav-item dropdown">
          <a className="nav-link" data-toggle="dropdown">
            <i className="fas fa-user" />
          </a>
          <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
            <div className="dropdown-item dropdown-header ">{name}</div>
            <div className="dropdown-divider" />
            <button
              onClick={logoutHandler}
              className="dropdown-item dropdown-footer"
            >
              <div className="bg-danger rounded-lg py-2 ">
                <i className="fas fa-sign-out-alt"></i>
                <span className="ml-2">Logout</span>
              </div>
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
