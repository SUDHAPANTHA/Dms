import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from "chart.js";
import Navbar from "./Navbar";
import UserSideBar from "./UserSideBar";
import {
  FaFolder,
  FaGraduationCap,
  FaMoneyBill,
  FaEllipsisH,
} from "react-icons/fa";

// Register ChartJS components
ChartJS.register(ArcElement, Title, Tooltip, Legend);

function UserDashboard() {
  const [documentStats, setDocumentStats] = useState({
    totalDocuments: 0,
    categoryCount: {
      Personal: 0,
      Education: 0,
      Financial: 0,
      Others: 0,
    },
  });

  useEffect(() => {
    fetchDocumentStats();
  }, []);

  const fetchDocumentStats = async () => {
    try {
      const response = await fetch("/proxy/get-all-documents");
      const data = await response.json();
      console.log("Raw API response:", data); // Debug log

      if (data.allDocumentsData && Array.isArray(data.allDocumentsData)) {
        // Initialize counts
        const categoryCount = {
          Personal: 0,
          Education: 0,
          Financial: 0,
          Others: 0,
        };

        // Count documents for each category
        data.allDocumentsData.forEach((doc) => {
          console.log("Processing document:", doc); // Debug log for each document
          const category = doc.category;
          if (categoryCount.hasOwnProperty(category)) {
            categoryCount[category]++;
          }
        });

        // Get total count directly from array length
        const totalDocs = data.allDocumentsData.length;

        console.log("Final category counts:", categoryCount); // Debug log
        console.log("Total documents:", totalDocs); // Debug log

        setDocumentStats({
          totalDocuments: totalDocs,
          categoryCount,
        });
      }
    } catch (error) {
      console.error("Error fetching document stats:", error);
    }
  };

  // Calculate percentages for pie chart
  const calculatePercentage = (count) => {
    return documentStats.totalDocuments === 0
      ? 0
      : ((count / documentStats.totalDocuments) * 100).toFixed(1);
  };

  // Pie Chart Data
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
          "rgba(144, 238, 144, 0.6)", // light green
          "rgba(173, 216, 230, 0.6)", // light blue
          "rgba(255, 218, 185, 0.6)", // peach
          "rgba(216, 191, 216, 0.6)", // thistle
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

  // Category cards configuration
  const categoryCards = [
    {
      name: "Personal",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: <FaFolder className="text-2xl mb-2" />,
    },
    {
      name: "Education",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <FaGraduationCap className="text-2xl mb-2" />,
    },
    {
      name: "Financial",
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <FaMoneyBill className="text-2xl mb-2" />,
    },
    {
      name: "Others",
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: <FaEllipsisH className="text-2xl mb-2" />,
    },
  ];

  return (
    <>
      <Navbar />
      <div className="flex">
        <UserSideBar />
        <div className="flex-1 p-8 bg-gray-50">
          {/* Total Documents Card */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-4">Document Statistics</h1>
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

          {/* Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {categoryCards.map(({ name, color, icon }) => (
              <div
                key={name}
                className={`p-6 rounded-lg shadow-md ${color} border transition-transform hover:scale-105`}
              >
                {icon}
                <h3 className="text-xl font-bold mb-2">{name}</h3>
                <p className="text-3xl font-bold">
                  {documentStats.categoryCount[name]}
                </p>
                <p className="text-sm mt-2 opacity-75">
                  {calculatePercentage(documentStats.categoryCount[name])}% of
                  total
                </p>
              </div>
            ))}
          </div>

          {/* Pie Chart */}
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

export default UserDashboard;
