import React, { useEffect, useState, useRef } from "react";
import { ReactComponent as MenuIcon } from "../assets/icons/menu.svg";

export const ShowDropDown = ({ openDeleteModal, openEditModal, openStatusModal, access, type}) => {
  const [isShow, setIsShow] = useState(false);
  const [dropdown, setdropdown] = useState("none");
  useEffect(() => {
    if (isShow) {
      setdropdown("flex");
    } else {
      setdropdown("none");
    }
  }, [isShow]);
  let opendropdown = () => {
    setIsShow(!isShow);
  };

  const wrapperRef = useRef(null);

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
      setIsShow(false);
    }
  };

  return (
    <div ref={wrapperRef}>
      <div id="dropdown" x-data={`{ dropdownOpen: ${isShow} }`} className="relative ml-2 text-right">
        <button
          onClick={() => opendropdown()}
          style={{ transform: "translateY(3px)" }}
        >
          <MenuIcon />
        </button>

        <div
          x-show="dropdownOpen "
          className={`w-40 overflow-hidden mr-5 absolute assnewassetsoptionsdown bg-white pointer transition transform origin-top ${
            dropdown === "flex" ? "p-2 opacity-1 translate-y-0 shadow-md dropdown-div" : "opacity-0 h-0 -translate-y-2 p-0"
          }`}
        >
          <button
            onClick={() => {
              opendropdown();
              openEditModal();
            }}
            className="p-2 text-base text-primary rounded-sm hover:bg-slate-100  cursor-pointer w-full text-left flex"
          >
            Edit
          </button>
          {type === "ad" && (
            <button
              onClick={() => {
                opendropdown();
                openStatusModal();
              }}
              className="p-2 text-base text-slate-500 rounded-sm hover:bg-slate-100  cursor-pointer w-full text-left flex"
            >
              Change Status
            </button>
          )}
          {access && (
            <button
              onClick={() => {
                openDeleteModal();
                opendropdown();
              }}
              className="p-2 text-base text-danger rounded-sm hover:bg-slate-100 cursor-pointer w-full text-left flex"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};