import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { ReactComponent as CartIcon } from "../assets/icons/cart.svg";
import { ReactComponent as MoneyIcon } from "../assets/icons/money.svg";
import { ReactComponent as UsersIcon } from "../assets/icons/users.svg";
import { Loader } from "../utility/loader";
import AxiosInstance from "../config/axios";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    videoCount: 0,
    videos: [],
    userCount: 0
  })

  useEffect(() => {
    setLoading(true);
    AxiosInstance.get('/total/users')
    .then(res => {
      setLoading(false);
      let result = res.data.data.totalUsers;
      AxiosInstance.get('/video/all')
      .then(res => {
        setLoading(false);
        setStats({
          videoCount: res.data.data.videos?.length,
          videos: res.data.data.videos,
          userCount: result
        })
      })
      .catch(err => console.log(err));
    })
    .catch(err => console.log(err));
  }, []);


  return (
    <Layout>
      {loading && <Loader /> }
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium truncate mr-5">
                Dashboard
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 xxl:col-span-9">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 mt-8">
                  <div className="grid grid-cols-12 gap-6 mt-5">
                    <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                      <div className="report-box zoom-in">
                        <div className="box p-5 flex justify-between items-start">
                          <div>
                            <CartIcon />
                          </div>
                          <div>
                            <div className="text-3xl font-medium leading-8">{stats.videoCount}</div>
                            <div className="text-base text-gray-600 mt-1">
                              Available Videos
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                      <div className="report-box zoom-in">
                        <div className="box p-5 flex justify-between items-start">
                          <div>
                            <MoneyIcon />
                          </div>
                          <div>
                            <div className="text-3xl font-medium leading-8">
                              0
                            </div>
                            <div className="text-base text-gray-600 mt-1">
                              All-time Sales
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                      <div className="report-box zoom-in">
                        <div className="box p-5 flex justify-between items-start">
                          <div>
                            <UsersIcon />
                          </div>
                          <div>
                            <div className="text-3xl font-medium leading-8">
                              {stats.userCount}
                            </div>
                            <div className="text-base text-gray-600 mt-1">
                              Total Users
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
    </Layout>
  );
};

export default Dashboard;
