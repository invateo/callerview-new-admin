import React, { useState } from "react";
import {NavLink} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ReactComponent as Logo} from "../../assets/icons/logo.svg";
import IllustrationIcon from "../../assets/icons/illustration.svg";
import AxiosInstance from "../../config/axios";
import {Loader} from '../../utility/loader';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSumbit = (e) => {
    e.preventDefault();
    if (email === "" || password === "") {
      toast.error("Please enter a valid email and password");
    }
    else {
      setLoading(true);
      let data = {
        email,
        password
      }
      AxiosInstance.post('/admin/login', data)
      .then(response => { 
          localStorage.setItem('CallerView-XXX', response.data.data.token);      
          if (response.data.status === 200) {
            toast.success(
              <div className="toast-div">Login successfully.</div>
            );
            window.location.reload(); 
          }else {
            setLoading(false);
            toast.error("Login failed");
          }
        })
        .catch(error => {
          setLoading(false);
          toast.error(error.response.data? error.response.data.message : 'Login failed: Unknown error');
        });
    }
  }
    return (
      <div className="login">
        {loading && <Loader loading={loading} />}
        <div className="container sm:px-10">
            <div className="block xl:grid grid-cols-2 gap-4">
                <div className="hidden xl:flex flex-col min-h-screen">
                    <div className="-intro-x flex items-center pt-5">
                        <Logo />
                        {/* <span className="text-white text-lg ml-3"> Callerview Admin</span> */}
                    </div>
                    <div className="my-auto">
                        <img alt="Callerview" className="-intro-x w-1/2 -mt-16" src={IllustrationIcon} />
                        <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                            The all-in-one dashboard 
                            <br />
                            for CallerView.
                        </div>
                    </div>
                </div>
                <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
                    <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-dark-1 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
                        <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                            Sign In
                        </h2>
                        <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">The all-in-one dashboard for CallerView.</div>
                        <div className="intro-x mt-8">
                            <input 
                              className="intro-x login__input form-control py-3 px-4 border-gray-300 block" 
                              placeholder="Email"
                              type="email"
                              onChange={(e) => setEmail(e.target.value)}
                              value={email}
                            />
                            <input 
                              type="password"
                              className="intro-x login__input form-control py-3 px-4 border-gray-300 block mt-4"
                              placeholder="Password"
                              onChange={(e) => setPassword(e.target.value)}
                              value={password}
                            />
                        </div>
                        <div className="intro-x flex text-gray-700 dark:text-gray-600 text-xs sm:text-sm mt-4">
                            <div className="flex items-center mr-auto">
                                <input id="remember-me" type="checkbox" className="form-check-input border mr-2" />
                                <label className="cursor-pointer select-none" for="remember-me">Remember me</label>
                            </div>
                            <NavLink to="/forgot-password">Forgot Password?</NavLink> 
                        </div>
                        <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                            <button onClick={handleSumbit} className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">Login</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
}

export default Login;
