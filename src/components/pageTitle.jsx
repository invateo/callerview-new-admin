import React from "react";
import { Helmet } from "react-helmet";

const appName = "Callerview Admin"

const PageTitle = ({ title }) => {
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title} - {appName}</title>
    </Helmet>
  );
};

export default PageTitle;
