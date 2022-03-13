import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import AxiosInstance from "../../config/axios";
import { toast } from "react-toastify";
import { CustomModal } from "../../components/modal";
import { switchLoading } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../videos";

const Categories = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin: loggedinUser } = useSelector( state => state.utility);
  const [categories, setCategories] = useState([]);
  const [addNewModal, setAddNewModal] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    getCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategories = () => {
    dispatch(switchLoading(true));
    AxiosInstance.get("/category")
      .then((res) => {
        const result = res.data.data;
        setCategories([...result]);
        dispatch(switchLoading(false));
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(
          err?.response?.data?.message ?? "An unknown error occured."
        );
      });
  };
  const openNewModal = () => {
    setAddNewModal(true);
  }
  const closeNewModal = () => {
    setAddNewModal(false);
    setName("");
  }

  const addNewCategory = () => {
    if (name.trim() === "") {
      toast.error("Please enter a category name!")
    } else {
      console.log("new category", name);
      // dispatch(switchLoading(true));
      // AxiosInstance.post("/admin/create", data)
      //     .then((res) => {
      //       dispatch(switchLoading(false));
      //       toast.success("New Admin added successfully");
      //       setAdmins([
      //         ...admins, 
      //         {
      //           name: res.data.admin.name,
      //           email: res.data.admin.email,
      //           privileges: res.data.privileges
      //         }
      //       ])
      //       closeAdminModal();
      //     })
      //     .catch((err) => {
      //       dispatch(switchLoading(false));
      //       toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      //     });
    }
  }

  return (
    <>
    {addNewModal && (
      <CustomModal
        modalIsOpen={addNewModal}
        closeModal={closeNewModal}
        headerTitle={"Add New Video Category"}
        shortModal
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5">
              <div className="col-span-12">
                <label htmlFor="modal-form-1" className="form-label">
                  Category Name
                </label>
                <input
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  value={name}
                  id="modal-form-1"
                  type="text"
                  className="form-control"
                  placeholder="category"
                />
              </div>
            </div>
            <div className="modal-footer text-right">
              <div
                onClick={closeNewModal}
                className="btn btn-outline-secondary w-auto mr-2"
              >
                Cancel
              </div>
              <div onClick={addNewCategory} className="btn btn-primary w-auto">
                Add New
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    )}
      <Layout title="Categories">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium truncate mr-5">
                Category Listings
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium truncate mr-5">
              All Categories
            </h2>
            {(loggedinUser?.privileges?.includes("create") || loggedinUser?.privileges?.includes("super admin")) && (
              <div className="sm:w-auto sm:mt-0">
                <div
                  className="btn btn-primary shadow-md"
                  onClick={openNewModal}
                >
                  Add New Category
                </div>
              </div>
            )}
          </div>
          <div className="intro-y box p-5 mt-8" style={{zIndex: "0"}}>
            <div id="responsive-table">
              <div className="overflow-x-auto">
                {categories.length === 0 ? (
                  <div className="w-full text-center my-10">No Categories.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap">Category Name</th>
                        <th className="whitespace-nowrap">Date Added</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((el, i) => (
                        <tr key={`category-${i}`}>
                          <td className="whitespace-nowrap">{el.name}</td>
                          <td className="whitespace-nowrap">{formatDate(el.createdAt)}</td>
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

export default Categories;
