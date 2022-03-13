import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import AxiosInstance from "../../config/axios";
import { toast } from "react-toastify";
import { CustomModal } from "../../components/modal";
import { switchLoading } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";

const Regions = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin: loggedinUser } = useSelector( state => state.utility);
  const [regions, setRegions] = useState([]);
  const [addNewModal, setAddNewModal] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    getRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRegions = () => {
    dispatch(switchLoading(true));
    AxiosInstance.get("/region")
      .then((res) => {
        dispatch(switchLoading(false));
        let result = [...new Set(res.data.data.regions)];
        setRegions(result);
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

  const addNewRegion = () => {
    if (name.trim() === "") {
      toast.error("Please enter a region!")
    } else {
      console.log("new region", name);
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
        headerTitle={"Add New Video Region"}
        shortModal
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5">
              <div className="col-span-12">
                <label htmlFor="modal-form-1" className="form-label">
                  Name of Region
                </label>
                <input
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  value={name}
                  id="modal-form-1"
                  type="text"
                  className="form-control"
                  placeholder="region"
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
              <div onClick={addNewRegion} className="btn btn-primary w-auto">
                Add New
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    )}
      <Layout title="Regions">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium truncate mr-5">
                Region Listings
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium truncate mr-5">
              All Regions
            </h2>
            {(loggedinUser?.privileges?.includes("create") || loggedinUser?.privileges?.includes("super admin")) && (
              <div className="sm:w-auto sm:mt-0">
                <div
                  className="btn btn-primary shadow-md"
                  onClick={openNewModal}
                >
                  Add New Region
                </div>
              </div>
            )}
          </div>
          <div className="intro-y box p-5 mt-8" style={{zIndex: "0"}}>
            <div id="responsive-table">
              <div className="overflow-x-auto">
                {regions.length === 0 ? (
                  <div className="w-full text-center my-10">No Regions.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap">Name of Region</th>
                      </tr>
                    </thead>
                    <tbody>
                      {regions.map((el, i) => (
                        <tr key={`region-${i}`}>
                          <td className="whitespace-nowrap">{el}</td>
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

export default Regions;
