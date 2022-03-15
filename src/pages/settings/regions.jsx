import React, { useEffect, useState } from "react";
import Layout from "../../components/layout";
import AxiosInstance from "../../config/axios";
import { toast } from "react-toastify";
import { CustomModal } from "../../components/modal";
import { switchLoading } from "../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { formatDate } from "../videos";
import { ShowDropDown } from "../../components/dropdown";

const Regions = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin: loggedinUser } = useSelector( state => state.utility);
  const [regions, setRegions] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    pages: 0,
    currPage: 1,
    limit: 10
  })
  const [searchVal, setsearchVal] = useState("");
  const [addNewModal, setAddNewModal] = useState(false);
  const [name, setName] = useState("");
  const [editModal, setEditModal] = useState(false);
  const [currentRegion, setCurrentRegion] = useState();

  useEffect(() => {
    getRegions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRegions = (page, limit) => {
    dispatch(switchLoading(true));
    AxiosInstance.get(`/region/view/${page ?? meta.currPage}?limit=${limit ?? meta.limit}`)
      .then((res) => {
        dispatch(switchLoading(false));
        const result = res.data.data;
        setRegions([...result?.region]);
        setMeta({
          ...meta,
          total: result?.count,
          currPage: parseInt(result?.page),
          pages: result?.pages
        })
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(
          err?.response?.data?.message ?? "An unknown error occured."
        );
      });
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal === "") {
      toast.error("Please enter a search value.");
    }
    else {
      dispatch(switchLoading(true));
      AxiosInstance.get(`/region/search/re?q=${searchVal}`)
        .then(res => { 
          setRegions([...res.data.data]);
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
    setMeta({...meta, limit: val});
    getRegions(meta.currPage, val);
  }
  const handleBtnClick = (val) => {
    if (val === "prev") {
      getRegions(meta.currPage - 1, meta.limit);
    } else getRegions(meta.currPage + 1, meta.limit);
  }
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
      const data = {
        name,
      };
      dispatch(switchLoading(true));
      AxiosInstance.post("/region", data)
        .then((res) => {
          dispatch(switchLoading(false));
          toast.success("New region added successfully");
          setRegions([...regions, res.data.data]);
          closeNewModal();
        })
        .catch((err) => {
          dispatch(switchLoading(false));
          toast.error(
            err?.response?.data?.message ?? "An unknown error occured."
          );
        });
    }
  }
  const openEditModal = (payload) => {
    setEditModal(true);
    setCurrentRegion(payload);
  }
  const editRegion = () => {
    dispatch(switchLoading(true));
    const data = {
      name: currentRegion?.name
    }
      AxiosInstance.put(`/region/${currentRegion._id}`, data)
      .then((res) => {
        toast.success("Region updated successfully");
        setEditModal(false);
        setCurrentRegion();
        getRegions();
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
    {editModal && (
      <CustomModal
        modalIsOpen={editModal}
        closeModal={() => {
          setEditModal(false);
        }}
        headerTitle={"Edit Region"}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mt-12 mb-5 md:mb-0">
              <div className="col-span-12">
                <label htmlFor="modal-form-1" className="form-label">
                  Name of Region
                </label>
                <input
                  onChange={(e) => setCurrentRegion({...currentRegion, name: e.target.value})}
                  value={currentRegion?.name}
                  id="modal-form-1"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="Region"
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
              <div onClick={editRegion} className="btn btn-primary w-auto">
                Update
              </div>
            </div>
        </div>
      </CustomModal>
    )}
      <Layout title="Regions">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium mr-5">
                Region Listings
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium mr-5">
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
          <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
              <form id="tabulator-html-filter-form" className="flex w-full">
                <div className="sm:flex w-full items-center sm:mr-4 mt-2 xl:mt-0">
                  <label className="flex-none w-auto xl:flex-initial mr-2">
                    Search:
                  </label>
                  <input
                    type="text"
                    className="form-control w-full mt-2 sm:mt-0"
                    placeholder="Search by name or email..."
                    onChange={(e) => {
                      setsearchVal(e.target.value);
                      if (e.target.value === "") {
                        getRegions(meta.currPage, meta.limit);
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
                {regions.length === 0 ? (
                  <div className="w-full text-center my-10">No Regions.</div>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th className="whitespace-nowrap">Name of Region</th>
                        <th className="whitespace-nowrap">Date Added</th>
                        {(loggedinUser?.privileges?.includes("edit") || loggedinUser?.privileges?.includes("super admin")) && (
                              <th className="whitespace-nowrap text-right">
                                Actions
                              </th>
                            )}
                      </tr>
                    </thead>
                    <tbody>
                      {regions?.map((el, i) => (
                        <tr key={`region-${i}`}>
                          <td className="whitespace-nowrap">{el.name}</td>
                          <td className="whitespace-nowrap">
                                {formatDate(el.createdAt)}
                              </td>
                              {(loggedinUser?.privileges?.includes("edit") || loggedinUser?.privileges?.includes("super admin")) && (
                                <td className="whitespace-nowrap">
                                    <ShowDropDown
                                      openEditModal={() => {
                                        openEditModal(el);
                                      }}
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
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
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
    </>
  );
};

export default Regions;
