import React from "react";
import UserSideBar from "./UserSideBar";

function UserDashBoard() {
  return (
    <>
      <div className="flex">
        
        <UserSideBar />

        <h2 className="my-2">Welocome to User Dashboard</h2>
      </div>
    </>
  );
}

export default UserDashBoard;
