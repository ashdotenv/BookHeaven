import React from "react";
import { useGetActiveBannerQuery } from "../Redux/APIService";

const Banner = () => {
  const { data: banner, isLoading, isError } = useGetActiveBannerQuery();

  if (isLoading || isError || !banner) return null;
  if (!banner.message) return null;

  return (
    <div style={{
      background: "#f59e42",
      color: "#fff",
      padding: "0.75rem 0",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1.1rem",
      letterSpacing: "0.5px",
      zIndex: 1000
    }}>
      {banner.message}
    </div>
  );
};

export default Banner;