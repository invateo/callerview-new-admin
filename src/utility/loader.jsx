import styled, { css } from "styled-components";
import { ReactComponent as LoaderIcon } from "../assets/icons/loader.svg";
import { useSelector } from "react-redux";

const DarkBackground = styled.div`
  display: none; /* Hidden by default */
  position: fixed; /* Stay in place */
  z-index: 999; /* Sit on top */
  color: #fff;
  left: 0;
  top: 0;
  width: 100%; /* Full width */
  height: 100%; /* Full height */
  overflow: auto; /* Enable scroll if needed */
  background-color: rgb(0, 0, 0); /* Fallback color */
  background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */

  ${({disappear}) =>
    disappear && css`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
    `}
`;

export const Loader = () => {
  const { loading } = useSelector((state) => state.utility);
  return (
    <div>
      <DarkBackground disappear={loading} >
        <div className="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
          <LoaderIcon />
        </div>
      </DarkBackground>
    </div>
  );
};
