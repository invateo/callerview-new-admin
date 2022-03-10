import React, { useEffect, useState } from "react";
import Layout from "../components/layout";
import AxiosInstance from "../config/axios";
import { toast } from "react-toastify";
import { switchLoading } from "../store/actions";
import { useDispatch } from "react-redux";

const Downloads = () => {
  const dispatch = useDispatch();
  const [videos, setVideos] = useState([]);
  const [meta, setMeta] = useState({
    total: 0,
    pages: 0,
    currPage: 1,
    limit: 10
  })
  const [searchVal, setsearchVal] = useState("");

  useEffect(() => {
    getVideos();
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
        dispatch(switchLoading(false));
        const result = res.data.data;
        setVideos([...result?.video]);
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

  return (
    <Layout title="Downloads">
      <>
        <div className="top-bar mt-3">
          <div className="pt-10 pb-4">
            <h2 className="text-2xl text-black font-medium truncate mr-5">
              Video Downloads
            </h2>
          </div>
        </div>
        <div className="intro-y box p-5 mt-8">
          <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
            <form id="tabulator-html-filter-form" className="flex w-full">
              <div className="sm:flex w-full items-center sm:mr-4 mt-2 xl:mt-0">
                <label className="flex-none w-auto xl:flex-initial mr-2">Search:</label>
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
                        <th className="whitespace-nowrap">Title</th>
                        <th className="whitespace-nowrap">Upload Date</th>
                        <th className="whitespace-nowrap">
                          Number of Downloads
                        </th>
                      </tr>
                    </thead>
                      <tbody>
                        {videos.map((video, i) => (
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
              <div className="tabulator-footer" style={{ marginTop: "1rem" }}>
                <span className="tabulator-paginator">
                <label className="w-12 flex-none xl:w-auto xl:flex-initial mr-2">Filter:</label>
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
  );
};

export default Downloads;
