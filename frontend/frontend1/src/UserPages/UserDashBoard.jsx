import React from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

function UserDashBoard() {
  return (
    <>
      <NavBar />
      <div className="flex">
        <SideBar />

        <h2 className="my-2">Welocome to Admin Dashboard</h2>
      </div>
    </>
  );
}

export default UserDashBoard;
