import React from "react";
import SideImage from "../assets/img/ss.png";

function HeroSection() {
  return (
    <section className="flex h-screen justify-between items-center px-8 py-32 bg-gradient-to-r from-white via-orange-50 to-white">
      <div className="max-w-md mx-10">
        <span className="text-sm text-gray-500 uppercase tracking-wide">
          Management
        </span>
        <h1 className="text-3xl font-bold text-gray-800 mt-4">
          All your <span className="text-orange-500">documents</span> easily
          accessible
        </h1>
        <p className="text-gray-600 mt-4 text-justify">
          Properly organized things not only look good but also make work easy
          and hassle-free. Software like Document Management System cuts
          information retrieval time from hours to seconds.
        </p>
        <button className="mt-6 px-6 py-2 bg-orange-500 text-white rounded-md">
          Learn more
        </button>
      </div>
      <div className="relative">
        <img
          src={SideImage}
          alt="Person with documents"
          className="rounded-md shadow-lg"
        />
      </div>
    </section>
  );
}

export default HeroSection;
