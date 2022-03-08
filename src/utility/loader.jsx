import { SpinnerCircularFixed } from "spinners-react";
import styled, { css } from "styled-components";

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

  ${() =>
    css`
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      justify-content: center;
      align-items: center;
    `}
`;

export const Loader = () => {
  return (
    <div>
      <DarkBackground>
        <SpinnerCircularFixed
          size={50}
          thickness={100}
          speed={100}
          color="rgba(255, 255, 255, 1)"
          secondaryColor="rgba(0, 0, 0, 0.44)"
        />
      </DarkBackground>
    </div>
  );
};
