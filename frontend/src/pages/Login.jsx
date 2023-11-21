//import hook react
import React, { useEffect, useState } from 'react';

//import hook useHitory from react router dom
import { useNavigate } from 'react-router';

//import axios
import axios from 'axios';

function Login() {

    //define state
    const [email, setEmail] = useState("");
    const [password, setPassword] =useState("");
    //define state validation
    const [validation, setValidation] = useState("");


    //define navigate
    const navigate = useNavigate();

    //hook useEffect
    useEffect(() =>{

        //checck token
        if(localStorage.getItem('token')) {

            //redirect page dashboard
            navigate('/dashboard');
        }
      },  []);
        
    //function "loginHandler"
    const loginHandler = async (e) => {
        e.preventDefault();

        //initialize formData
        const formData = new FormData();

        //append data to formData
        formData.append('email', email);
        formData.append('password', password);

        //send data to server
        await axios.post('http://127.0.0.1:8000/api/login', formData)
        .then((response) => {

            //set token on localStorage
            localStorage.setItem('token', response.data.token);

            //redirect to dashboard
            navigate('/dashboard');

    })
    .catch((error) => {

        //asign error to state "validation"
        setValidation(error.response.data);
    })

};

return (
    <div className="login-page" style={{ backgroundImage: 'url("dist/img/bgkpi.jpg")', backgroundSize: 'cover' }}>
    <div className="container" style={{ marginTop: "120px" }}>
        <div className="row justify-content-center">
            <div className="col-md-4">
                <div className="card border-0 rounded shadow-sm">
                    <div className="card-body text center">
                    <img src="dist/img/kpilogo.png" alt="kpi logo" className="mx-auto d-block mb-3" width="80" height="80" />
                        <h6 className="text-center">HALAMAN LOGIN</h6>
                        <hr/>
                        {
                            validation && validation.message && (
                                <div className="alert alert-danger">
                                    {validation.message}
                                </div>
                            )
                        }
                        <form onSubmit={loginHandler}>
                            <div className="mb-3">
                                <label className="form-label">ALAMAT EMAIL</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Masukkan Alamat Email"/>
                            </div>
                            {
                                validation.email && (
                                    <div className="alert alert-danger">
                                        {validation.email[0]}
                                    </div>
                                )
                            }
                            <div className="mb-3">
                                <label className="form-label">PASSWORD</label>
                                <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Masukkan Password"/>
                            </div>
                            {
                                validation.password && (
                                    <div className="alert alert-danger">
                                        {validation.password[0]}
                                    </div>
                                )
                            }
                            <div className="d-grid gap-2">
                                <button type="submit" className="btn btn-success">LOGIN</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
)
    

}

export default Login;