/* eslint-disable react/prop-types */

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const token = sessionStorage.getItem("token")
  const Navigate = useNavigate();
  useEffect(()=>{
    if (!token) {
      Navigate("/")
    }
  },[])
  return (
    <div className="error">
      <div className="error-page">
        <h2 className="headline text-danger"> 404</h2>
        <div className="error-content">
          <h3>
            <i className="fas fa-exclamation-triangle text-danger" /> Oops!
            Page not found.
          </h3>
          <h3>
          We could not find the page you were looking for. 
          </h3>
         
        </div>
        {/* /.error-content */}
      </div>
    </div>
  );
};

export default NotFound;
