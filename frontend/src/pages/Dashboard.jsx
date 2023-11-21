import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Header from '../components/Header';
import Home from '../components/Home';
import SideNav from '../components/SideNav';
import Footer from '../components/Footer';

function Dashboard() {
  const [data, setData] = useState({});
  const navigate = useNavigate();
  const token = localStorage.getItem("token");


  const fetchData = async () => {
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get('http://127.0.0.1:8000/api/dashboard');
      const responseData = response.data;
      setData(responseData);


       
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate('/');
      } else console.log("error fetching data", error);
    };
  };



  useEffect(() => {
    if (!token) {
      navigate('/');
    }

    fetchData();
  }, []);



  
  

  return (
    <div>
      <Header />
      <Home data={data} />
      <SideNav />
      <Footer />
    </div>
  );
}

export default Dashboard;
