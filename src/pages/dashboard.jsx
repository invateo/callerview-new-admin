import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import { ReactComponent as CartIcon } from "../assets/icons/cart.svg";
import { AdminIcon, UsersIcon } from "../assets/icons.jsx";
import AxiosInstance from "../config/axios";
import { toast } from "react-toastify";
import { colour } from "../styling/colour";
import { NavLink } from "react-router-dom";
import { switchLoading } from "../store/actions";
import { useDispatch } from "react-redux";

export const getLoggedinUser = (dispatch, setLoggedinUser) => {
  AxiosInstance.get("/admin").then((res) => {
    dispatch(switchLoading(false));
    setLoggedinUser({email: res.data.data.admin.email, privileges: res.data.data.privilege?.name});
  })
  .catch((err) => {
    dispatch(switchLoading(false));
    toast.error(
      err?.response?.data?.message ?? "An unknown error occured."
    );
  });
}

const Dashboard = () => {
  const [stats, setStats] = useState({
    videoCount: 0,
    videos: [],
    userCount: 0,
    adminCount: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(switchLoading(true));
    AxiosInstance.get("/total/users")
      .then((res) => {
        let result = res.data.data.totalUsers;
        AxiosInstance.get("/admin/all")
          .then((res) => {
            let admins = res.data.data.length;
            AxiosInstance.get("/video/all")
              .then((res) => {
                dispatch(switchLoading(false));
                setStats({
                  videoCount: res.data.data.videos?.length,
                  videos: res.data.data.videos,
                  userCount: result,
                  adminCount: admins,
                });
              })
              .catch((err) => {
                dispatch(switchLoading(false));
                toast.error(
                  err?.response?.data?.message ?? "An unknown error occured."
                );
              });
          })
          .catch((err) => {
            dispatch(switchLoading(false));
            toast.error(err?.response?.data?.message ?? "An unknown error occured.");
          });
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Layout title="Dashboard">
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
                  <NavLink to="/videos" className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                    <div className="report-box zoom-in">
                      <div className="box p-5 flex justify-between items-start">
                        <div>
                          <CartIcon />
                        </div>
                        <div>
                          <div className="text-3xl font-medium leading-8">
                            {stats.videoCount}
                          </div>
                          <div className="text-base text-gray-600 mt-1">
                            Available Videos
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                  <NavLink to="/users" className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                    <div className="report-box zoom-in">
                      <div className="box p-5 flex justify-between items-start">
                        <div>
                          <UsersIcon width="40" color={colour.orange} />
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
                  </NavLink>
                  <NavLink to="/admins" className="col-span-12 sm:col-span-6 xl:col-span-4 intro-y">
                    <div className="report-box zoom-in">
                      <div className="box p-5 flex justify-between items-start">
                        <div>
                          <AdminIcon width="40" color={colour.secondary} />
                        </div>
                        <div>
                          <div className="text-3xl font-medium leading-8">
                            {stats.adminCount}
                          </div>
                          <div className="text-base text-gray-600 mt-1">
                            All Admins
                          </div>
                        </div>
                      </div>
                    </div>
                  </NavLink>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-6 mt-6">
                <div className="intro-y flex items-center justify-between mt-8">
                  <h2 className="text-xl text-black font-medium truncate mr-5">
                    Video Statistics
                  </h2>
                    <div className="sm:w-auto sm:mt-0">
                        <NavLink to="/downloads" className="btn btn-primary shadow-md">View All</NavLink>
                    </div>
                </div>
                <div className="intro-y box mt-5">
                  <div className="pt-3" id="responsive-table">
                    <div className="overflow-x-auto">
                    {stats.videoCount === 0 ? (
                      <div className="w-full text-center my-10">No videos.</div>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap">Title</th>
                            <th className="whitespace-nowrap">Upload Date</th>
                            <th className="whitespace-nowrap">
                              Number of Downloads
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {stats.videos.slice(0, 6).map((video, i) => (
                            <tr key={`video-${i}`}>
                              <td className="whitespace-nowrap">{video.name}</td>
                              <td className="whitespace-nowrap">
                                {video.releaseDate}
                              </td>
                              <td className="whitespace-nowrap">
                                {video.numberOfUsage}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
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
