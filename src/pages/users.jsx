import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import AxiosInstance from "../config/axios";
import { toast } from "react-toastify";
import { switchLoading } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal, ConfirmModal } from "../components/modal";
import { ShowDropDown } from "../components/dropdown";
import {formatDate} from './videos';

const Users = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin } = useSelector( state => state.utility);
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    pages: 0,
    currPage: 1,
    limit: 5
  })
  const [searchVal, setsearchVal] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUser, setCurrentUser] = useState({
    id: "",
    pin: ""
  });

  // const [newUserModal, setNewUserModal] = useState(false);
  // const [newUserDetails, setNewUserDetails] = useState({
  //   email: "",
  //   phoneNumber: "",
  //   password: "",
  //   name: "",
  //   pin: "",
  //   phoneIMEI: ""
  // });

  useEffect(() => {
    getUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal === "") {
      toast.error("Please enter a search value.");
    }
    else {
      dispatch(switchLoading(true));
      AxiosInstance.get(`/user/search?q=${searchVal}`)
        .then(res => { 
          setUsers([...res.data.data]);
          setMeta({
            ...meta,
            total: res.data.data.length,
            currPage: 1,
            pages: 1
          })
          dispatch(switchLoading(false));
        })
        .catch(error => {
          dispatch(switchLoading(false));
          toast.error(error.response.data? error.response.data.message : 'Unknown error');
        });
    }
  }
  const handleSelectLimit = (e) => {
    const val = e.target.value;
    setsearchVal("");
    setMeta({
      ...meta,
      currPage: 1,
      limit: val
    });
    getUsers(1, val);
  }
  const handleBtnClick = (val) => {
    if (val === "prev") {
      getUsers(meta.currPage - 1, meta.limit);
    } else getUsers(meta.currPage + 1, meta.limit);
  }

  const getUsers = (page, limit) => {
    dispatch(switchLoading(true));
    AxiosInstance.get(`/user/view/${page ?? meta.currPage}?limit=${limit ?? meta.limit}`)
      .then((res) => {
        const result = res.data.data;
        setUsers([...result?.users]);
        setMeta({
          ...meta,
          total: result?.count,
          currPage: parseInt(result?.page),
          pages: result?.pages
        })
        dispatch(switchLoading(false));
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });
  };

  const handleChangeEditInput = (e) => {
    setCurrentUser({
      ...currentUser,
      [e.target.name]: e.target.value
    })
  };

  const confirmDelete = (id) => {
    setDeleteModal(true);
    setCurrentUserId(id);
  }
  const deleteUser = () => {
      dispatch(switchLoading(true));
      AxiosInstance.delete(`/user/delete/${currentUserId}`)
      .then((res) => {
        toast.success("User deleted successfully");
        setDeleteModal(false);
        setCurrentUserId("");
        getUsers();
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        setDeleteModal(false);
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });     
  }

  const openEditModal = (payload) => {
    setEditModal(true);
    setCurrentUser({
      ...currentUser,
      id: payload?._id,
    });
  }

  const editUser = () => {
    console.log(currentUser);
    if (currentUser?.pin.trim() === "") {
      toast.error("Please enter a pin!")
    } else if (currentUser?.pin.trim().length < 4) {
      toast.error("Please enter a pin of at least 4 numbers!")
    } else {
      let data = {
        pin: currentUser?.pin
      }
      dispatch(switchLoading(true));
        AxiosInstance.put(`/user/update/${currentUser?.id}`, data)
        .then((res) => {
          toast.success("User details updated successfully");
          setEditModal(false);
          setCurrentUserId("");
          setCurrentUser({
            id: "",
            pin: ""
          });
          getUsers();
        })
        .catch((err) => {
          dispatch(switchLoading(false));
          toast.error(err?.response?.data?.message ?? "An unknown error occured.");
        });
    }
  }

  // const closenewUserModal = () => {
  //   setNewUserModal(false);
  //   setNewUserDetails({
  //     name: "",
  //     link: "",
  //     category: "",
  //     region: "",
  //     releaseDate: "",
  //     image: ""
  //   })
  // }

  // const handleChangeInput = (e) => {
  //   setNewUserDetails({
  //     ...newUserDetails,
  //     [e.target.name]: e.target.value
  //   })
  // };

  // const addNewUser = () => {};

  return (
    <>  
      {deleteModal && (
        <ConfirmModal
          modalIsOpen={deleteModal}
          closeModal={() => {
            setDeleteModal(false);
            setCurrentUserId("");
          }}
          deleteAction={deleteUser}
          headerTitle={"User"}
        />
      )}
      {editModal && (
        <CustomModal
          modalIsOpen={editModal}
          closeModal={() => {
            setEditModal(false);
          }}
          headerTitle={"Edit User Details"}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5 md:mb-0">
                <div className="col-span-12">
                  <label htmlFor="modal-form-1" className="form-label">
                    New Pin
                  </label>
                  <input
                    onChange={handleChangeEditInput}
                    value={currentUser?.pin}
                    id="modal-form-1"
                    name="pin"
                    type="number"
                    className="form-control"
                    placeholder="Enter new pin"
                  />
                </div>
              </div>
            </div>
              <div className="modal-footer footed text-right">
                <div
                  onClick={() => {
                    setEditModal(false);
                  }}
                  className="btn btn-outline-secondary w-auto mr-2"
                >
                  Cancel
                </div>
                <div onClick={editUser} className="btn btn-primary w-auto">
                  Update
                </div>
              </div>
          </div>
        </CustomModal>
      )}
      <Layout title="Users">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium  mr-5">
                Users Management
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium  mr-5">
              All Users
            </h2>
            {/* {(loggedinAdmin?.privileges?.includes("create") || loggedinAdmin?.privileges?.includes("super admin")) && (
              <div className="sm:w-auto sm:mt-0">
                <div className="btn btn-primary shadow-md" onClick={() => setNewUserModal(true)}>
                  Add New User
                </div>
              </div>
            )} */}
          </div>
          <div className="intro-y box p-5 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
              <form id="tabulator-html-filter-form" className="flex w-full items-end">
                <div className="sm:flex w-full items-center mr-4">
                  <label className="flex-none w-auto xl:flex-initial mr-2">Search:</label>
                  <input
                    type="text"
                    className="form-control w-full mt-2 sm:mt-0"
                    placeholder="Search by email..."
                    onChange={(e) => {
                      setsearchVal(e.target.value)
                      if(e.target.value === "") {
                        getUsers(meta.currPage, meta.limit);
                      }
                    }}
                    value={searchVal}
                  />
                </div>
                <div className="mt-2 xl:mt-0">
                  <button
                    onClick={handleSearch}
                    id="tabulator-html-filter-go"
                    type="button"
                    className="btn btn-primary w-full sm:w-16"
                  >
                    Go
                  </button>
                </div>
              </form>
            </div>
            <div className="overflow-x-auto scrollbar-hidden">
              <div className="mt-5 pb-5 tabulator">
                <div id="responsive-table">
                  <div className="overflow-x-auto">
                    {users.length === 0 ? (
                      <div className="w-full text-center my-10">No users.</div>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap">Email</th>
                            <th className="whitespace-nowrap">Phone Number</th>
                            <th className="whitespace-nowrap">Phone IMEI</th>
                            <th className="whitespace-nowrap">Subscription Status</th>
                            <th className="whitespace-nowrap">Date of Registration</th>
                            {/* <th className="whitespace-nowrap">Banner</th> */}
                            {(loggedinAdmin?.privileges?.includes("edit") || loggedinAdmin?.privileges?.includes("super admin")) && (
                              <th className="whitespace-nowrap text-right">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, i) => (
                            <tr key={`video-${i}`}>
                              <td className="whitespace-nowrap">{user.email}</td>
                              <td className="whitespace-nowrap">{user.phoneNumber}</td>
                              <td className="whitespace-nowrap">{user.phoneIMEI}</td>
                              <td className="whitespace-nowrap">{user.hasSubscribed ? "Active" : "Inactive"}</td>
                              <td className="whitespace-nowrap">{formatDate(user.createdAt)}</td>                              
                              {(loggedinAdmin?.privileges?.includes("edit") || loggedinAdmin?.privileges?.includes("super admin")) && (
                              <td className="whitespace-nowrap">
                                  <ShowDropDown
                                    openDeleteModal={() => {
                                      confirmDelete(user._id);
                                    }}
                                    openEditModal={() => {
                                      openEditModal(user);
                                    }}
                                    access={loggedinAdmin?.privileges?.includes("super admin")}
                                  />
                              </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="tabulator-footer" style={{ marginTop: "1rem" }}>
                  <div className="tabulator-paginator flex justify-between">
                    <div>
                    <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                      Filter:
                    </label>
                    <select
                      className="tabulator-page-size cursor-pointer"
                      aria-label="Page Size"
                      onChange={handleSelectLimit}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                    </div>
                    <div>
                    <button
                      className="tabulator-page"
                      aria-label="Prev Page"
                      title="Prev Page"
                      data-page="prev"
                      disabled={meta.currPage === 1}
                      onClick={() => handleBtnClick("prev")}
                    >
                      Prev
                    </button>
                    <span className="tabulator-pages">
                      <div className="tabulator-page active cursor-default">
                        {meta.currPage}/{meta.pages}
                      </div>
                    </span>
                    <button
                      className="tabulator-page"
                      aria-label="Next Page"
                      title="Next Page"
                      data-page="next"
                      disabled={meta.currPage === meta.pages}
                      onClick={() => handleBtnClick("next")}
                    >
                      Next
                    </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      </Layout>
      {/* {newUserModal && (
        <CustomModal
          modalIsOpen={newUserModal}
          closeModal={closenewUserModal}
          headerTitle={"Add New User"}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5 md:mb-0">
                <div className="col-span-12">
                  <label htmlFor="modal-form-1" className="form-label">
                    Still dummy
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value={newUserDetails.email}
                    id="modal-form-1"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Video title"
                  />
                </div>
              </div>
            </div>
              <div className="modal-footer footed text-right">
                <div
                  onClick={closenewUserModal}
                  className="btn btn-outline-secondary w-auto mr-2"
                >
                  Cancel
                </div>
                <div onClick={addNewUser} className="btn btn-primary w-auto">
                  Add New
                </div>
              </div>
          </div>
        </CustomModal>
      )} */}
    </>
  );
};

export default Users;
