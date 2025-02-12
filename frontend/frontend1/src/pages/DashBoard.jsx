import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import NavBar from "../components/NavBar";
import SideBar from "../components/SideBar";
import {
  FaFolder,
  FaGraduationCap,
  FaMoneyBill,
  FaEllipsisH,
  FaUsers,
} from "react-icons/fa";

ChartJS.register(ArcElement, Title, Tooltip, Legend);

function DashBoard() {
  const [documentStats, setDocumentStats] = useState({
    totalDocuments: 0,
    totalUsers: 0,
    categoryCount: {
      Personal: 0,
      Education: 0,
      Financial: 0,
      Others: 0,
    },
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch documents
      const docResponse = await fetch("/proxy/get-all-documents");
      const docData = await docResponse.json();

      // Fetch users
      const userResponse = await fetch("/proxy/get-all-users");
      const userData = await userResponse.json();

      if (docData.allDocumentsData && Array.isArray(docData.allDocumentsData)) {
        const categoryCount = {
          Personal: 0,
          Education: 0,
          Financial: 0,
          Others: 0,
        };

        docData.allDocumentsData.forEach((doc) => {
          if (categoryCount.hasOwnProperty(doc.category)) {
            categoryCount[doc.category]++;
          }
        });

        setDocumentStats({
          totalDocuments: docData.allDocumentsData.length,
          totalUsers: userData.totalUsers || 0,
          categoryCount,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const calculatePercentage = (count) => {
    return documentStats.totalDocuments === 0
      ? 0
      : ((count / documentStats.totalDocuments) * 100).toFixed(1);
  };

  const pieChartData = {
    labels: Object.keys(documentStats.categoryCount).map(
      (category) =>
        `${category} (${calculatePercentage(
          documentStats.categoryCount[category]
        )}%)`
    ),
    datasets: [
      {
        data: Object.values(documentStats.categoryCount),
        backgroundColor: [
          "rgba(144, 238, 144, 0.6)",
          "rgba(173, 216, 230, 0.6)",
          "rgba(255, 218, 185, 0.6)",
          "rgba(216, 191, 216, 0.6)",
        ],
        borderColor: [
          "rgba(144, 238, 144, 1)",
          "rgba(173, 216, 230, 1)",
          "rgba(255, 218, 185, 1)",
          "rgba(216, 191, 216, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = calculatePercentage(value);
            return `Documents: ${value} (${percentage}%)`;
          },
        },
      },
    },
  };

  const statsCards = [
    {
      name: "Total Users",
      value: documentStats.totalUsers,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <FaUsers className="text-2xl mb-2" />,
    },
    {
      name: "Personal",
      value: documentStats.categoryCount.Personal,
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <FaFolder className="text-2xl mb-2" />,
    },
    {
      name: "Education",
      value: documentStats.categoryCount.Education,
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <FaGraduationCap className="text-2xl mb-2" />,
    },
    {
      name: "Financial",
      value: documentStats.categoryCount.Financial,
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <FaMoneyBill className="text-2xl mb-2" />,
    },
    {
      name: "Others",
      value: documentStats.categoryCount.Others,
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <FaEllipsisH className="text-2xl mb-2" />,
    },
  ];

  return (
    <>
      <NavBar />
      <div className="flex">
        <SideBar />
        <div className="flex-1 p-8 bg-gray-50">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <p className="text-xl flex items-center gap-2">
                <FaFolder className="text-orange-500" />
                <span>Total Documents:</span>
                <span className="font-bold text-orange-500">
                  {documentStats.totalDocuments}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
            {statsCards.map(({ name, value, color, icon }) => (
              <div
                key={name}
                className={`p-6 rounded-lg shadow-md ${color} border transition-transform hover:scale-105`}
              >
                {icon}
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-3xl font-bold">{value}</p>
                {name !== "Total Users" && (
                  <p className="text-sm mt-2 opacity-75">
                    {calculatePercentage(value)}% of total
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Category Distribution</h2>
            <div className="h-[400px] flex items-center justify-center">
              <Pie data={pieChartData} options={options} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
