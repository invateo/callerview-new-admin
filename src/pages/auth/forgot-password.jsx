import React, { useState } from "react";
import {NavLink} from 'react-router-dom';
import {toast} from 'react-toastify';
import {ReactComponent as Logo} from "../../assets/icons/logo.svg";
import IllustrationIcon from "../../assets/icons/illustration.svg";
import AxiosInstance from "../../config/axios";
import {Loader} from '../../utility/loader';

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");

  const handleSumbit = (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter a valid email");
    }
    else {
      setLoading(true);
      let data = {
        email
      }
      AxiosInstance.post('forgot/password', data)
        .then(response => {
          if (response.data.status === 200) {
            setLoading(false);
            setMessage(response.data.message);
            toast.success(
              <div className="toast-div">{response.data.message}</div>
            );
          }
        })
        .catch(error => {
          // console.log(error.response.data);
          setLoading(false);
          toast.error(error.response.data.message);
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
                            Forgot Your Password?
                        </h2>
                        <div className="intro-x mt-2 text-gray-500 xl:hidden text-center">The all-in-one dashboard for CallerView.</div>
                        <div class="intro-x text-slate-500 block mt-2 text-xs sm:text-sm">Enter your admin email address to recover your password.</div>
                        <div className="intro-x mt-8">
                            <input 
                              className="intro-x login__input form-control py-3 px-4 border-gray-300 block" 
                              placeholder="Email"
                              type="email"
                              onChange={(e) => setEmail(e.target.value)}
                              value={email}
                            />
                        </div>
                        <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left flex justify-between">
                            <button onClick={handleSumbit} className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">Submit</button>
                            <NavLink to="/" className="btn btn-secondary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top">Back to Login</NavLink>
                        </div>
                        {message !== "" ? (
                          <div class="alert alert-success-soft show flex items-center my-10" role="alert">{message}.</div>
                        ): null}
                    </div>
                </div>
            </div>
        </div>
      </div>
    );
}

export default ForgotPassword;

