import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import AxiosInstance from "../config/axios";
import { toast } from "react-toastify";
import { CustomModal, ConfirmModal } from "../components/modal";
import { switchLoading } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { ShowDropDown } from "../components/dropdown";

const Admin = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin: loggedinUser } = useSelector( state => state.utility);
  const [admins, setAdmins] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    name: "",
    email: "",
    privileges:[]
  })
  const [checkValues, setCheckValues] = useState([
    { val: "view", checked: false },
    { val: "edit", checked: false },
    { val: "create", checked: false },
    { val: "super admin", checked: false },
  ])
  const [addNewModal, setAddNewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentAdminId, setCurrentAdminId] = useState("");
  const [currentAdminPrivilege, setCurrentAdminPrivilege] = useState([])

  useEffect(() => {
    dispatch(switchLoading(true));
    AxiosInstance.get("/admin/all")
      .then((res) => {
        const admins = res.data.data;
        setAdmins(admins.filter((el) => el.email !== loggedinUser?.email));
        dispatch(switchLoading(false));
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(
          err?.response?.data?.message ?? "An unknown error occured."
        );
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getAdmins = () => {
    dispatch(switchLoading(true));
    AxiosInstance.get("/admin/all")
          .then((res) => {
            const admins = res.data.data;
            dispatch(switchLoading(false));
            setAdmins(admins.filter(el => el.email !== loggedinUser?.email));
          })
          .catch((err) => {
            dispatch(switchLoading(false));
            toast.error(err?.response?.data?.message ?? "An unknown error occured.");
          });
  };
  const openAdminModal = () => {
    setAddNewModal(true);
  }
  const closeAdminModal = () => {
    setAddNewModal(false);
    setNewAdmin({
      name: "",
      email: "",
      privileges:[]
    });
    setCheckValues([
      { val: "view", checked: false },
      { val: "edit", checked: false },
      { val: "create", checked: false },
      { val: "super admin", checked: false },
    ]);
  }
  const handleCheck = (e, checkArr, setCheckArr) => {
    const arr = [...checkArr];
    const item = arr.find(item => item.val === e.target.value);
    item.checked = !item.checked;
    setCheckArr(arr);
  }
  const formatCheckValues = (checkArr) => {
    let arr = [];
    checkArr.filter(el => el.checked === true).forEach(el => arr.push(el.val));
    return arr;
  }
  // Add new admin
  const addNewAdmin = () => {
    const arr = formatCheckValues(checkValues);
    if (newAdmin.name.trim() === "" || newAdmin.email.trim() === "") {
      toast.error("Please fill all fields!")
    } else if (arr.length === 0) {
      toast.error("Please select at least one privilege!")
    } else {
      let data = {
        name: newAdmin.name,
        email: newAdmin.email,
        privilege: [...arr, "super admin"]
      }
      dispatch(switchLoading(true));
      AxiosInstance.post("/admin/create", data)
          .then((res) => {
            dispatch(switchLoading(false));
            toast.success("New Admin added successfully");
            setAdmins([
              ...admins, 
              {
                name: res.data.admin.name,
                email: res.data.admin.email,
                privileges: res.data.privileges
              }
            ])
            closeAdminModal();
          })
          .catch((err) => {
            dispatch(switchLoading(false));
            toast.error(err?.response?.data?.message ?? "An unknown error occured.");
          });
    }
  }

  const confirmDelete = (id) => {
    setDeleteModal(true);
    setCurrentAdminId(id);
  }
  const deleteAdmin = () => {
      dispatch(switchLoading(true));
      AxiosInstance.delete(`/admin/delete/${currentAdminId}`)
      .then((res) => {
        toast.success("Admin deleted successfully");
        setDeleteModal(false);
        setCurrentAdminId("");
        getAdmins();
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        setDeleteModal(false);
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });      
  }

  const openEditModal = (id, arr) => {
    setCurrentAdminId(id);
    let values = [
      { val: "view", checked: false },
      { val: "edit", checked: false },
      { val: "create", checked: false },
      { val: "super admin", checked: false },
    ];
    arr.forEach((val) => {
      let found = values.find(el => el.val === val);
      found.checked = true;
    })
    setCurrentAdminPrivilege(values);
    setEditModal(true);
  }

  const editAdmin = () => {
    const arr = formatCheckValues(currentAdminPrivilege);
    let data = {
      name: arr
    }
    // to come back to
    dispatch(switchLoading(true));
      AxiosInstance.put(`/admin/privilege/${currentAdminId}`, data)
      .then((res) => {
        toast.success("Admin privileges updated successfully");
        setEditModal(false);
        setCurrentAdminId("");
        setCurrentAdminPrivilege([]);
        getAdmins();
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });
  }

  return (
    <>
    {addNewModal && (
      <CustomModal
        modalIsOpen={addNewModal}
        closeModal={closeAdminModal}
        headerTitle={"Add New Admin"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5 md:mb-0">
              <div className="col-span-12">
                <label htmlFor="modal-form-1" className="form-label">
                  Username
                </label>
                <input
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, name: e.target.value })
                  }
                  value={newAdmin.name}
                  id="modal-form-1"
                  type="text"
                  className="form-control"
                  placeholder="username"
                />
              </div>
              <div className="col-span-12">
                <label htmlFor="modal-form-2" className="form-label">
                  Email
                </label>
                <input
                  onChange={(e) =>
                    setNewAdmin({ ...newAdmin, email: e.target.value })
                  }
                  value={newAdmin.email}
                  id="modal-form-2"
                  type="email"
                  className="form-control"
                  placeholder="example@gmail.com"
                />
              </div>
              <div className="col-span-12">
                <label>Privileges</label>
                <div className="flex flex-col sm:flex-row mt-2">
                    {checkValues.map((el, i) => (
                      <div key={`checkbox-${i}`} className="form-check mr-4 mt-2 sm:mt-0">
                        <input

                          type="checkbox"
                          className="form-check-input"
                          checked={el.checked}
                          value={el.val}
                          onChange={(e) => handleCheck(e, checkValues, setCheckValues)}
                        />
                        <label className="form-check-label" htmlFor="checkbox-switch-4">
                          {el.val.toUpperCase()}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
            <div className="modal-footer footed text-right">
              <div
                onClick={closeAdminModal}
                className="btn btn-outline-secondary w-auto mr-2"
              >
                Cancel
              </div>
              <div onClick={addNewAdmin} className="btn btn-primary w-auto">
                Add New
              </div>
            </div>
        </div>
      </CustomModal>
    )}
    {deleteModal && (
      <ConfirmModal
        modalIsOpen={deleteModal}
        closeModal={() => {
          setDeleteModal(false);
          setCurrentAdminId("");
        }}
        deleteAction={deleteAdmin}
        headerTitle={"Admin"}
      />
    )}
    {editModal && (
      <CustomModal
        modalIsOpen={editModal}
        closeModal={() => {
          setEditModal(false);
        }}
        headerTitle={"Edit Admin Privileges"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5 md:mb-0">
              <div className="col-span-12">
                <label>Privileges</label>
                <div className="flex flex-col sm:flex-row mt-2">
                    {currentAdminPrivilege.map((el, i) => (
                      <div key={`checkbox-${i}`} className="form-check mr-4 mt-2 sm:mt-0">
                        <input

                          type="checkbox"
                          className="form-check-input"
                          checked={el.checked}
                          value={el.val}
                          onChange={(e) => handleCheck(e, currentAdminPrivilege, setCurrentAdminPrivilege)}
                        />
                        <label className="form-check-label" htmlFor="checkbox-switch-4">
                          {el.val.toUpperCase()}
                        </label>
                      </div>
                    ))}
                </div>
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
              <div onClick={editAdmin} className="btn btn-primary w-auto">
                Update
              </div>
            </div>
        </div>
      </CustomModal>
    )}
      <Layout title="Admins">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium mr-5">
                Admin Management
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium mr-5">
              All Admins
            </h2>
            {(loggedinUser?.privileges?.includes("create") || loggedinUser?.privileges?.includes("super admin")) && (
            <div className="sm:w-auto sm:mt-0">
              <div
                className="btn btn-primary shadow-md"
                onClick={openAdminModal}
              >
                Add New Admin
              </div>
            </div>
            )}
          </div>
          <div className="intro-y box p-5 mt-8" style={{zIndex: "0"}}>
            <div id="responsive-table">
              <div className="overflow-x-auto">
                {admins.length === 0 ? (
                  <div className="w-full text-center my-10">No Admins.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap">Username</th>
                        <th className="whitespace-nowrap">Email</th>
                        <th className="whitespace-nowrap">Privileges</th>
                        {(loggedinUser?.privileges?.includes("edit") || loggedinUser?.privileges?.includes("super admin")) && (
                          <th className="whitespace-nowrap text-right">
                            Actions
                          </th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {admins.map((admin, i) => (
                        <tr key={`video-${i}`}>
                          <td className="whitespace-nowrap">{admin.name}</td>
                          <td className="whitespace-nowrap">{admin.email}</td>
                          <td className="whitespace-nowrap">
                            {admin.privileges.map((el, i) => (
                              <span
                                key={i}
                                className={`${
                                  i % 2 === 0
                                    ? "bg-primary/10 text-primary"
                                    : "bg-success/20 text-success"
                                } rounded px-2 mr-2`}
                              >
                                {el}
                              </span>
                            ))}
                          </td>
                          {(loggedinUser?.privileges?.includes("edit") || loggedinUser?.privileges?.includes("super admin")) && (
                            <td className="whitespace-nowrap">
                                <ShowDropDown
                                  openDeleteModal={() => {
                                    confirmDelete(admin._id);
                                  }}
                                  openEditModal={() => {
                                    openEditModal(admin._id, admin.privileges);
                                  }}
                                  access={loggedinUser?.privileges?.includes("super admin")}
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
          </div>
        </>
      </Layout>
    </>
  );
};

export default Admin;
