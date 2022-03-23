import React, { useEffect, useState, useRef } from "react";
import Layout from "../components/layout";
import AxiosInstance, { base, gettoken } from "../config/axios";
import { toast } from "react-toastify";
import { switchLoading } from "../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { CustomModal, ConfirmModal } from "../components/modal";
import { ShowDropDown } from "../components/dropdown";
import {ReactComponent as UploadIcon} from '../assets/icons/loader-2.svg';
import ReactPlayer from "react-player";
import axios from "axios";

const Adverts = () => {
  const dispatch = useDispatch();
  const { loggedinAdmin: loggedinUser } = useSelector( state => state.utility);
  const [adverts, setAdverts] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    pages: 0,
    currPage: 1,
    limit: 5
  })
  const [searchVal, setsearchVal] = useState("");

  const [newAdvertModal, setNewAdvertModal] = useState(false);
  const [newAdvertDetails, setNewAdvertDetails] = useState({
    name: "",
    link: "",
    image: ""
  });
  const [message, setMessage] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [currentAdvertId, setCurrentAdvertId] = useState("");
  const [currentAdvert, setCurrentAdvert] = useState();
  const [uploadImgLoading, setUploadImgLoading] = useState(false);
  const imageInput = useRef();
  const [uploadAdvertLoading, setUploadAdvertLoading] = useState(false);
  const advertInput = useRef();
  const [statusModal, setStatusModal] = useState(false);
  const [adStatus, setAdStatus] = useState("");

  useEffect(() => {
    getAdverts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal === "") {
      toast.error("Please enter a search value.");
    }
    else {
      dispatch(switchLoading(true));
      AxiosInstance.get(`/advert/search?q=${searchVal}`)
        .then(res => { 
          setAdverts([...res.data.data]);
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
    setMeta({
      ...meta,
      currPage: 1,
      limit: val
    });
    getAdverts(1, val);
  }
  const handleBtnClick = (val) => {
    if (val === "prev") {
      getAdverts(meta.currPage - 1, meta.limit);
    } else getAdverts(meta.currPage + 1, meta.limit);
  }
  const handleStatusFilter = (e) => {
    const val = e.target.value;
    if (val !== "all") {
      dispatch(switchLoading(true));
      AxiosInstance.get("/advert/active")
        .then(res => { 
          setAdverts([...res.data.data.videos]);
          dispatch(switchLoading(false));
        })
        .catch(error => {
          dispatch(switchLoading(false));
          toast.error(error.response.data? error.response.data.message : 'Unknown error');
        });
    } else getAdverts();
  }
  const getAdverts = (page, limit) => {
    dispatch(switchLoading(true));
    AxiosInstance.get(`/advert/view/${page ?? meta.currPage}?limit=${limit ?? meta.limit}`)
      .then((res) => {
        dispatch(switchLoading(false));
        const result = res.data.data;
        setAdverts([...result?.video]);
        setMeta({
          ...meta,
          total: result?.count,
          currPage: parseInt(result?.page),
          pages: result?.pages
        })
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });
  };

  const closeNewAdvertModal = () => {
    setNewAdvertModal(false);
    setNewAdvertDetails({
      name: "",
      link: "",
      image: ""
    })
  }

  const handleChangeInput = (e) => {
    setNewAdvertDetails({
      ...newAdvertDetails,
      [e.target.name]: e.target.value
    })
  };
  const handleChangeEditInput = (e) => {
    setCurrentAdvert({
      ...currentAdvert,
      [e.target.name]: e.target.value
    })
  };

  const confirmDelete = (id) => {
    setDeleteModal(true);
    setCurrentAdvertId(id);
  }
  const deleteAdvert = () => {
      dispatch(switchLoading(true));
      AxiosInstance.delete(`/advert/delete/${currentAdvertId}`)
      .then((res) => {
        toast.success("Advert deleted successfully");
        setDeleteModal(false);
        setCurrentAdvertId("");
        getAdverts();
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        setDeleteModal(false);
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });     
  }

  const openEditModal = (payload) => {
    setEditModal(true);
    setCurrentAdvert(payload);
  }
  const openStatusModal = (payload) => {
    setStatusModal(true);
    setCurrentAdvertId(payload?._id);
    setAdStatus(payload?.active ? "active" : "inactive");
  }

  const editAdvert = () => {
    if (currentAdvert?.name.trim() === "") {
      toast.error("Please enter a title!");
    } else if (currentAdvert?.link.trim() === "" || currentAdvert?.image.trim() === "") {
      toast.error("Please upload both the advert and an image banner.");
    } else {
      let data = {
        name: currentAdvert?.name,
        link: currentAdvert?.link,
        image: currentAdvert?.image
      }
      dispatch(switchLoading(true));
        AxiosInstance.put(`/advert/single/${currentAdvert?._id}`, data)
        .then((res) => {
          toast.success("Advert updated successfully");
          setEditModal(false);
          setCurrentAdvertId("");
          setCurrentAdvert();
          getAdverts();
        })
        .catch((err) => {
          dispatch(switchLoading(false));
          toast.error(err?.response?.data?.message ?? "An unknown error occured.");
        });
    }
  }
  const uploadFile = (e, type, setTypeLoading, advert, setAdvert) => {
    const selectedFile = e.target.files[0];
    let data = new FormData();
    data.append("video", selectedFile);
    
    setTypeLoading(true);
    type !== "img" && setMessage("");
    axios({
      url: `${base}/video/upload`,
      method: "POST",
      data,
      headers: {
        Authorization: `Bearer ${gettoken()}`,
        "Content-Type": "multipart/form-data"
      }
    })
    .then((res) => {
      if (res.data.status === 200) {
        setTypeLoading(false);
        type !== "img" && setMessage("Advert uploaded!");
        if (type === "img") {
          setAdvert({ ...advert, image: res.data.url });
        } else setAdvert({ ...advert, link: res.data.url });
      }
    })
    .catch((err) => {
      setTypeLoading(false);
      type !== "img" && setMessage("Error uploading the file, please try again.");
      toast.error(err?.response?.data?.message ?? "An unknown error occured.");
    });
  }

  const addNewAdvert = () => {
    if (newAdvertDetails.name.trim() === "") {
      toast.error("Please enter a title!");
    } else if (newAdvertDetails.link.trim() === "" || newAdvertDetails.image.trim() === "") {
      toast.error("Please upload both the advert and an image banner.");
    } else {
      dispatch(switchLoading(true));
      AxiosInstance.post("/advert/create", newAdvertDetails)
        .then(res => {
          dispatch(switchLoading(false));
          toast.success("New advert created successfully");
          setAdverts([
            ...adverts,
            res.data.data
          ])
          closeNewAdvertModal();
        })
        .catch(error => {
          dispatch(switchLoading(false));
          toast.error(error.response.data? error.response.data.message : 'Unknown error');
        });
    }
  }
  const editAdStatus = () => {
    const data = {
      status: adStatus === "active",
      advertID: currentAdvertId
    }
      dispatch(switchLoading(true));
      AxiosInstance.put("/advert/active", data)
        .then(res => {
          dispatch(switchLoading(false));
          toast.success("Advert status updated successfully");
          setStatusModal(false);
          setCurrentAdvertId("");
          setAdStatus("");
          getAdverts();
        })
        .catch(error => {
          dispatch(switchLoading(false));
          toast.error(error.response.data? error.response.data.message : 'Unknown error');
        });
  }

  return (
    <>  
      {newAdvertModal && (
        <CustomModal
          modalIsOpen={newAdvertModal}
          closeModal={closeNewAdvertModal}
          headerTitle={"Add New Advert"}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5 md:mb-0">
                <div className="col-span-12">
                  <label htmlFor="modal-form-1" className="form-label">
                    Advert Title
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value={newAdvertDetails.name}
                    id="modal-form-1"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Advert title"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Upload Image
                  </label>
                  <div className="form-control" onClick={() => {
                    !uploadImgLoading && imageInput?.current?.click();
                  }}>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => uploadFile(e, "img", setUploadImgLoading, newAdvertDetails, setNewAdvertDetails)}
                      accept="image/*"
                      ref={imageInput}
                      id="modal-form-2"
                    />
                    {uploadImgLoading ? (
                      <p className="text-sm">
                        <UploadIcon />
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 cursor-pointer">Click here to upload</p>
                    )}
                  </div>
                </div>
                <div className="col-span-12  md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Image URL
                  </label>
                  <input
                    disabled
                    value={newAdvertDetails.image}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://imageURL.com"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Upload Video
                  </label>
                  <div className="form-control p-0 h-32 bg-slate-200 relative" onClick={() => {
                    !uploadAdvertLoading && advertInput?.current?.click();
                  }}>
                    {newAdvertDetails.link === "" ? (
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => uploadFile(e, "video", setUploadAdvertLoading, newAdvertDetails, setNewAdvertDetails)}
                        accept="video/*"
                        ref={advertInput}
                        id="modal-form-2"
                        disabled={uploadAdvertLoading}
                      />
                    ) : (
                      <>
                        <ReactPlayer
                          url={newAdvertDetails.link}
                          controls={true}
                          light={newAdvertDetails.image ?? true}
                          width="100%"
                          height="8rem"
                        />
                        <p className="text-success mt-1 text-xs">You can edit this later.</p>
                      </>
                    )}
                    {uploadAdvertLoading ? (
                      <p className="text-sm text-center absolute uploader w-full">
                        <UploadIcon className="mx-auto" />
                      </p>
                    ) : (
                      <p className="text-sm px-2 text-center text-slate-400 cursor-pointer absolute uploader w-full">Click here to upload</p>
                    )}
                  </div>
                </div>
                <div className="col-span-12  md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Video URL
                  </label>
                  <input
                    disabled
                    value={newAdvertDetails.link}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://videoURL.com"
                  />
                </div>
              </div>
            </div>
              <div className="modal-footer footed text-right">
                <div
                  onClick={closeNewAdvertModal}
                  className="btn btn-outline-secondary w-auto mr-2"
                >
                  Cancel
                </div>
                <div onClick={addNewAdvert} className="btn btn-primary w-auto">
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
            setCurrentAdvertId("");
          }}
          deleteAction={deleteAdvert}
          headerTitle={"Advert"}
        />
      )}
      {editModal && (
        <CustomModal
          modalIsOpen={editModal}
          closeModal={() => {
            setEditModal(false);
          }}
          headerTitle={"Edit Advert Details"}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5 md:mb-0">
                <div className="col-span-12">
                  <label htmlFor="modal-form-1" className="form-label">
                    Advert Title
                  </label>
                  <input
                    onChange={handleChangeEditInput}
                    value={currentAdvert?.name}
                    id="modal-form-1"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Advert title"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Upload Image
                  </label>
                  <div className="form-control" onClick={() => {
                    !uploadImgLoading && imageInput?.current?.click();
                  }}>
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => uploadFile(e, "img", setUploadImgLoading, currentAdvert, setCurrentAdvert)}
                      accept="image/*"
                      ref={imageInput}
                      id="modal-form-2"
                    />
                    {uploadImgLoading ? (
                      <p className="text-sm">
                        <UploadIcon />
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 cursor-pointer">Click here to upload</p>
                    )}
                  </div>
                </div>
                <div className="col-span-12  md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Image URL
                  </label>
                  <input
                    disabled
                    value={currentAdvert?.image}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://imageURL.com"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Upload Video
                  </label>
                  <div className="form-control" onClick={() => {
                    !uploadAdvertLoading && advertInput?.current?.click();
                  }}>
                      <input
                        type="file"
                        style={{ display: "none" }}
                        onChange={(e) => uploadFile(e, "video", setUploadAdvertLoading, currentAdvert, setCurrentAdvert)}
                        accept="video/*"
                        ref={advertInput}
                        id="modal-form-2"
                        disabled={uploadAdvertLoading}
                      />
                    {uploadAdvertLoading ? (
                      <p className="text-sm">
                        <UploadIcon />
                      </p>
                    ) : (
                      <p className="text-sm text-slate-400 cursor-pointer">Click here to upload</p>
                    )}
                  </div>
                  <p className="mt-2 text-slate-500 text-sm">
                    {message === "" ? "Note: No video preview." : message}
                  </p>
                </div>
                <div className="col-span-12  md:col-span-6">
                  <label htmlFor="modal-form-2" className="form-label">
                    Video URL
                  </label>
                  <input
                    disabled
                    value={currentAdvert?.link}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://videoURL.com"
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
                <div onClick={editAdvert} className="btn btn-primary w-auto">
                  Update
                </div>
              </div>
          </div>
        </CustomModal>
      )}
      {statusModal && (
        <CustomModal
          modalIsOpen={statusModal}
          closeModal={() => {
            setStatusModal(false);
          }}
          headerTitle={"Edit Advert Status"}
          shortModal
        >
          <div className="modal-dialog">
            <div className="">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5">
                <div className="col-span-12">
                  <label htmlFor="modal-form-1" className="form-label">
                    Change Status
                  </label>
                  <select
                      className="form-control"
                      onChange={(e) => setAdStatus(e.target.value)}
                      value={adStatus}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                </div>
              </div>
            </div>
              <div className="modal-footer text-right">
                <div
                  onClick={() => {
                    setStatusModal(false);
                  }}
                  className="btn btn-outline-secondary w-auto mr-2"
                >
                  Cancel
                </div>
                <div onClick={editAdStatus} className="btn btn-primary w-auto">
                  Update
                </div>
              </div>
          </div>
        </CustomModal>
      )}
      <Layout title="Adverts">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium mr-5">
                Adverts
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium mr-5">
              All Advert Videos
            </h2>
            {(loggedinUser?.privileges?.includes("create") || loggedinUser?.privileges?.includes("super admin")) && (
              <div className="sm:w-auto sm:mt-0">
                <div className="btn btn-primary shadow-md" onClick={() => setNewAdvertModal(true)}>
                  Add New Advert
                </div>
              </div>
            )}
          </div>
          <div className="intro-y box p-5 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
              <form
                id="tabulator-html-filter-form"
                className="flex flex-wrap w-full items-center justify-between lg:flex-nowrap"
              >
                <div className="w-full sm:flex lg:w-1/2 justify-start items-center">
                  <div className="sm:flex items-center mb-4 sm:mb-0 sm:mr-8">
                    <label className="w-15 flex-none xl:w-auto xl:flex-initial mr-2">
                      Filter by:
                    </label>
                    <select
                      id="tabulator-html-filter-field"
                      className="form-select w-full sm:w-32 xxl:w-full mt-2 sm:mt-0 sm:w-auto"
                      onChange={handleStatusFilter}
                    >
                      <option value="all">All</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>
                <div className="w-full flex items-end lg:w-1/2 mt-4 lg:mt-0">
                  <div className="sm:flex w-full items-center mr-4">
                    <label className="flex-none w-auto xl:flex-initial mr-2">
                      Search:
                    </label>
                    <input
                      type="text"
                      className="form-control w-full mt-2 sm:mt-0"
                      placeholder="Search by video title..."
                      onChange={(e) => {
                        setsearchVal(e.target.value)
                        if(e.target.value === "") {
                          getAdverts(meta.currPage, meta.limit);
                        }
                      }}
                      value={searchVal}
                    />
                  </div>
                  <div className="">
                    <button
                      onClick={handleSearch}
                      id="tabulator-html-filter-go"
                      type="button"
                      className="btn btn-primary w-full sm:w-16"
                    >
                      Go
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="overflow-x-auto scrollbar-hidden">
              <div className="mt-5 pb-5 tabulator">
                <div id="responsive-table">
                  <div className="overflow-x-auto">
                    {adverts.length === 0 ? (
                      <div className="w-full text-center my-10">No adverts.</div>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap">Name</th>
                            <th className="whitespace-nowrap">Number of Usage</th>
                            <th className="whitespace-nowrap">Advert Status</th>
                            {/* <th className="whitespace-nowrap">Banner</th> */}
                            <th className="whitespace-nowrap">Preview</th>
                            {(loggedinUser?.privileges?.includes("edit") || loggedinUser?.privileges?.includes("super admin")) && (
                              <th className="whitespace-nowrap text-right">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {adverts.map((advert, i) => (
                            <tr key={`advert-${i}`}>
                              <td className="whitespace-nowrap">{advert.name}</td>
                              <td className="whitespace-nowrap">{advert.numberOfUsage}</td>
                              <td className="whitespace-nowrap">{advert.active ? "Active" : "Inactive"}</td>
                              {/* <td className="whitespace-nowrap w-24">
                                <img className="object-contain" alt="advert img" src={advert.image} />
                              </td> */}
                              <td className="whitespace-nowrap">
                                <ReactPlayer
                                  url={advert.link}
                                  controls={true}
                                  light={advert.image ?? true}
                                  width="100%"
                                  height="8rem"
                                />
                              </td>
                              {(loggedinUser?.privileges?.includes("edit") || loggedinUser?.privileges?.includes("super admin")) && (
                                <td className="whitespace-nowrap">
                                    <ShowDropDown
                                      openDeleteModal={() => {
                                        confirmDelete(advert._id);
                                      }}
                                      openEditModal={() => {
                                        openEditModal(advert);
                                      }}
                                      openStatusModal={() => {
                                        openStatusModal(advert);
                                      }}
                                      access={loggedinUser?.privileges?.includes("super admin")}
                                      type="ad"
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
    </>
  );
};

export default Adverts;
