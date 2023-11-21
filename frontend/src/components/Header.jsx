import React, {  } from "react"

function Header () {

  const logoutHandler = async () => {

    //set axios header dengan type Authorization + Bearer token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    //fetch Rest API
    await axios.post('http://localhost:8000/api/logout')
    .then(() => {

        //remove token from localStorage
        localStorage.removeItem("token");

        //redirect halaman login
        history.push('/');
    });
};
  
    return (

        <div>
        {/* Navbar */}  
        <nav className="main-header navbar navbar-expand navbar-white navbar-light">
        <ul className="navbar-nav">
      <a className="nav-link" data-widget="pushmenu" href="#" role="button"><i className="fas fa-bars" /></a>
    <li className="nav-item d-none d-sm-inline-block">
      <a href="index3.html" className="nav-link">Home</a>
    </li>
  </ul>

  <button className="m-2 ms-auto" role="button" style={{zIndex: 999999, border: 'none', background: 'none'}} onClick={logoutHandler}>
        <i className="fas fa-sign-out-alt"></i>
        <span className='ms-1 text-sm'>Log Out</span>
      </button>
</nav>
</div>

    );
}

export default Header;