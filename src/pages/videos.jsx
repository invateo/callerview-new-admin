import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import AxiosInstance from "../config/axios";
import { toast } from "react-toastify";
import { switchLoading } from "../store/actions";
import { useDispatch } from "react-redux";
import { getLoggedinUser } from "./dashboard";
import { CustomModal, ConfirmModal } from "../components/modal";
import { ShowDropDown } from "../components/dropdown";

export const formatDate = (payload) => {
  let date = new Date(payload);
  return date?.getFullYear() +
    "-" +
    ("0" + (date?.getMonth() + 1)).slice(-2) +
    "-" +
    ("0" + date?.getDate()).slice(-2);
};

const Videos = () => {
  const dispatch = useDispatch();
  const [loggedinUser, setLoggedinUser] = useState();
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    pages: 0,
    currPage: 1,
    limit: 10
  })
  const [searchVal, setsearchVal] = useState("");

  const [newVideoModal, setNewVideoModal] = useState(false);
  const [newVideoDetails, setNewVideoDetails] = useState({
    name: "",
    link: "",
    category: "",
    region: "",
    releaseDate: "",
    image: ""
  });
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [ currentVideoId, setCurrentVideoId] = useState("");
  const [currentVideo, setCurrentVideo] = useState();

  useEffect(() => {
    getVideos();
    getLoggedinUser(dispatch, setLoggedinUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal === "") {
      toast.error("Please enter a search value.");
    }
    else {
      dispatch(switchLoading(true));
      AxiosInstance.get(`/video/search?q=${searchVal}`)
        .then(res => { 
          setVideos([...res.data.data]);
          dispatch(switchLoading(false));
          setsearchVal("");
        })
        .catch(error => {
          dispatch(switchLoading(false));
          toast.error(error.response.data? error.response.data.message : 'Unknown error');
        });
    }
  }
  const handleSelectLimit = (e) => {
    const val = e.target.value;
    setMeta({...meta, limit: val});
    getVideos(meta.currPage, val);
  }
  const handleBtnClick = (val) => {
    if (val === "prev") {
      getVideos(meta.currPage - 1, meta.limit);
    } else getVideos(meta.currPage + 1, meta.limit);
  }

  const getVideos = (page, limit) => {
    dispatch(switchLoading(true));
    AxiosInstance.get(`/video/view/${page ?? meta.currPage}?limit=${limit ?? meta.limit}`)
      .then((res) => {
        const result = res.data.data;
        setVideos([...result?.video]);
        setMeta({
          ...meta,
          total: result?.count,
          currPage: parseInt(result?.page),
          pages: result?.pages
        })
        AxiosInstance.get("/category")
        .then((res) => {
          const result = res.data.data;
          setCategories([...result]);
          AxiosInstance.get("/region")
          .then((res) => {
            dispatch(switchLoading(false));
            let result = [...new Set(res.data.data.regions)];
            setRegions(result);
          })
        })
      })
      .catch((err) => {
        dispatch(switchLoading(false));
        toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      });
  };

  const handleCategoryFilter = (e) => {
    const val = e.target.value;
    if (val !== "all") {
      let filteredVideos = videos.filter((el) => el.category === val);
      setVideos(filteredVideos);
    } else getVideos();
  }
  const handleRegionFilter = (e) => {
    const val = e.target.value;
    if (val !== "all") {
      let filteredVideos = videos.filter((el) => el.region === val);
      setVideos(filteredVideos);
    } else getVideos();
  }

  const closeNewVideoModal = () => {
    setNewVideoModal(false);
  }

  const handleChangeInput = (e) => {
    setNewVideoDetails({
      ...newVideoDetails,
      [e.target.name]: e.target.value
    })
  };

  const confirmDelete = (id) => {
    setDeleteModal(true);
    setCurrentVideoId(id);
  }
  const deleteVideo = () => {
    console.log("to delete video", currentVideoId);
      // dispatch(switchLoading(true));
      // AxiosInstance.delete(`/admin/delete/${currentAdminId}`)
      // .then((res) => {
      //   toast.success("Video deleted successfully");
      //   setDeleteModal(false);
      //   setCurrentAdminId("");
      //   getAdmins();
      // })
      // .catch((err) => {
      //   dispatch(switchLoading(false));
      //   setDeleteModal(false);
      //   toast.error(err?.response?.data?.message ?? "An unknown error occured.");
      // });      
  }

  const openEditModal = (payload) => {
    setEditModal(true);
    setCurrentVideo(payload);
    console.log("curr video", payload);
    //more
  }

  const editVideo = () => {
    console.log("to edit video", currentVideo);
    // dispatch(switchLoading(true));
    //   AxiosInstance.put(`/admin/privilege/${currentAdminId}`, data)
    //   .then((res) => {
    //     toast.success("Admin privileges updated successfully");
    //     setEditModal(false);
    //     setCurrentAdminId("");
    //     setCurrentAdminPrivilege([]);
    //     getAdmins();
    //   })
    //   .catch((err) => {
    //     dispatch(switchLoading(false));
    //     toast.error(err?.response?.data?.message ?? "An unknown error occured.");
    //   });
  }

  return (
    <>  
      {newVideoModal && (
        <CustomModal
          modalIsOpen={newVideoModal}
          closeModal={closeNewVideoModal}
          headerTitle={"Add New Video"}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5">
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Video Title
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value={newVideoDetails.name}
                    id="modal-form-1"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Video title"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Release Date
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value={formatDate(newVideoDetails.releaseDate)}
                    id="modal-form-1"
                    type="date"
                    name="releaseDate"
                    className="form-control"
                    placeholder="Video title"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Category
                  </label>
                  <select
                    name="category"
                    id="modal-form-1"
                    className="form-control form-select"
                    onChange={handleChangeInput}
                  >
                    <option value="">Select one:</option>
                    {categories.map((el) => (
                      <option key={el._id} value={el.name}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Region
                  </label>
                  <select
                    name="region"
                    id="modal-form-1"
                    className="form-control form-select"
                    onChange={handleChangeInput}
                  >
                    <option value="" >Select one:</option>
                    {regions.map((el, i) => (
                      <option key={i} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12  md:col-span-">
                  <label htmlFor="modal-form-2" className="form-label">
                    Video URL
                  </label>
                  <input
                    disabled
                    value={newVideoDetails.link}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://videoURL.com"
                  />
                </div>
                <div className="col-span-12  md:col-span-">
                  <label htmlFor="modal-form-2" className="form-label">
                    Image URL
                  </label>
                  <input
                    disabled
                    value={newVideoDetails.image}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://imageURL.com"
                  />
                </div>
              </div>
              <div className="modal-footer text-right">
                <div
                  onClick={closeNewVideoModal}
                  className="btn btn-outline-secondary w-auto mr-2"
                >
                  Cancel
                </div>
                <div onClick={() => {}} className="btn btn-primary w-auto">
                  Add New
                </div>
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
            setCurrentVideoId("");
          }}
          deleteAction={deleteVideo}
          headerTitle={"Video"}
        />
      )}
      {editModal && (
        <CustomModal
          modalIsOpen={editModal}
          closeModal={() => {
            setEditModal(false);
          }}
          headerTitle={"Edit Video Details"}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body grid grid-cols-12 gap-4 gap-y-3 mb-5">
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Video Title
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value={currentVideo.name}
                    id="modal-form-1"
                    name="name"
                    type="text"
                    className="form-control"
                    placeholder="Video title"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Release Date
                  </label>
                  <input
                    onChange={handleChangeInput}
                    value={formatDate(currentVideo.releaseDate)}
                    id="modal-form-1"
                    type="date"
                    name="releaseDate"
                    className="form-control"
                    placeholder="Video title"
                  />
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Category
                  </label>
                  <select
                    name="category"
                    id="modal-form-1"
                    className="form-control form-select"
                    onChange={handleChangeInput}
                  >
                    <option value="">Select one:</option>
                    {categories.map((el) => (
                      <option key={el._id} value={el.name}>
                        {el.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <label htmlFor="modal-form-1" className="form-label">
                    Region
                  </label>
                  <select
                    name="region"
                    id="modal-form-1"
                    className="form-control form-select"
                    onChange={handleChangeInput}
                  >
                    <option value="" >Select one:</option>
                    {regions.map((el, i) => (
                      <option key={i} value={el}>
                        {el}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-12  md:col-span-">
                  <label htmlFor="modal-form-2" className="form-label">
                    Video URL
                  </label>
                  <input
                    disabled
                    value={currentVideo.link}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://videoURL.com"
                  />
                </div>
                <div className="col-span-12  md:col-span-">
                  <label htmlFor="modal-form-2" className="form-label">
                    Image URL
                  </label>
                  <input
                    disabled
                    value={currentVideo.image}
                    id="modal-form-2"
                    type="text"
                    className="form-control"
                    placeholder="https://imageURL.com"
                  />
                </div>
              </div>
              <div className="modal-footer text-right">
                <div
                  onClick={() => {
                    setEditModal(false);
                  }}
                  className="btn btn-outline-secondary w-auto mr-2"
                >
                  Cancel
                </div>
                <div onClick={editVideo} className="btn btn-primary w-auto">
                  Update
                </div>
              </div>
            </div>
          </div>
        </CustomModal>
      )}
      <Layout title="Videos">
        <>
          <div className="top-bar mt-3">
            <div className="pt-10 pb-4">
              <h2 className="text-2xl text-black font-medium truncate mr-5">
                Videos (Free)
              </h2>
            </div>
          </div>
          <div className="intro-y flex items-center justify-between mt-8">
            <h2 className="text-xl text-black font-medium truncate mr-5">
              All Videos
            </h2>
            {loggedinUser?.privileges?.includes("create") && (
              <div className="sm:w-auto sm:mt-0">
                <div className="btn btn-primary shadow-md" onClick={() => setNewVideoModal(true)}>
                  Add New Video
                </div>
              </div>
            )}
          </div>
          <div className="intro-y box p-5 mt-8">
            <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
              <form
                id="tabulator-html-filter-form"
                className="flex w-full items-center justify-between"
              >
                <div className="w-full flex md:w-1/2">
                  <div className="sm:flex items-center sm:mr-8">
                    <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                      Category:
                    </label>
                    <select
                      id="tabulator-html-filter-field"
                      className="form-select w-full sm:w-32 xxl:w-full mt-2 sm:mt-0 sm:w-auto"
                      onChange={handleCategoryFilter}
                    >
                      <option value="all">All</option>
                      {categories.map((el, i) => (
                        <option key={el._id} value={el.name}>
                          {el.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:flex items-center sm:mr-4 mt-2 xl:mt-0">
                    <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">
                      Region:
                    </label>
                    <select
                      id="tabulator-html-filter-field"
                      className="form-select w-full sm:w-32 xxl:w-full mt-2 sm:mt-0 sm:w-auto"
                      onChange={handleRegionFilter}
                    >
                      <option value="all">All</option>
                      {regions.map((el, i) => (
                        <option key={i} value={el}>
                          {el}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="w-full flex md:w-1/2 mt-4 md:mt-0">
                  <div className="sm:flex w-full items-center sm:mr-4 mt-2 xl:mt-0">
                    <label className="flex-none w-auto xl:flex-initial mr-2">
                      Search:
                    </label>
                    <input
                      type="text"
                      className="form-control w-full mt-2 sm:mt-0"
                      placeholder="Search..."
                      onChange={(e) => setsearchVal(e.target.value)}
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
                </div>
              </form>
            </div>
            <div className="overflow-x-auto scrollbar-hidden">
              <div className="mt-5 pb-5 tabulator">
                <div id="responsive-table">
                  <div className="overflow-x-auto">
                    {videos.length === 0 ? (
                      <div className="w-full text-center my-10">No videos.</div>
                    ) : (
                      <table className="table">
                        <thead>
                          <tr>
                            <th className="whitespace-nowrap">Name</th>
                            <th className="whitespace-nowrap">Category</th>
                            <th className="whitespace-nowrap">Region</th>
                            <th className="whitespace-nowrap">Release Date</th>
                            <th className="whitespace-nowrap">Banner</th>
                            <th className="whitespace-nowrap">Video Preview</th>
                            {loggedinUser?.privileges?.includes("edit") && (
                              <th className="whitespace-nowrap text-right">
                                Actions
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {videos.map((video, i) => (
                            <tr key={`video-${i}`}>
                              <td className="whitespace-nowrap">{video.name}</td>
                              <td className="whitespace-nowrap">{video.category}</td>
                              <td className="whitespace-nowrap">{video.region}</td>
                              <td className="whitespace-nowrap">
                                {video.releaseDate}
                              </td>
                              <td className="whitespace-nowrap w-24">
                                <img className="object-contain" alt="video img" src={video.image} />
                              </td>
                              <td className="whitespace-nowrap w-24">
                                <img className="object-contain" alt="video" src={video.link} />
                              </td>
                              <td className="whitespace-nowrap">
                                  <ShowDropDown
                                    openDeleteModal={() => {
                                      confirmDelete(video._id);
                                    }}
                                    openEditModal={() => {
                                      openEditModal(video);
                                    }}
                                    access={loggedinUser?.privileges?.includes("super admin")}
                                  />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
                <div className="tabulator-footer" style={{ marginTop: "1rem" }}>
                  <span className="tabulator-paginator">
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
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      </Layout>
    </>
  );
};

export default Videos;
