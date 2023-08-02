import React from "react";
import { Link } from "react-router-dom";


export const Navbar = () => {
  return (
    <div className="navbar">
      <div className="links">
        <Link to="/">DashBoard</Link>
        <Link to="/investments">My Investments</Link>
        <Link to="/contact"> Contact </Link>
      </div>
    </div>
  );
}