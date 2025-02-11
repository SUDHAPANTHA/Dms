import React, { useState, useEffect } from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import Navbar from "./Navbar";
import UserSideBar from "./UserSideBar";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function UserDashboard() {
  const [documentStats, setDocumentStats] = useState({
    totalDocuments: 0,
    categoryCount: {},
  });

  useEffect(() => {
    fetchDocumentStats();
  }, []);

  const fetchDocumentStats = async () => {
    try {
      const response = await fetch("/proxy/get-all-documents");
      const data = await response.json();

      if (data.allDocumentsData) {
        // Calculate category counts
        const categoryCount = data.allDocumentsData.reduce((acc, doc) => {
          acc[doc.category] = (acc[doc.category] || 0) + 1;
          return acc;
        }, {});

        setDocumentStats({
          totalDocuments: data.allDocumentsData.length,
          categoryCount,
        });
      }
    } catch (error) {
      console.error("Error fetching document stats:", error);
    }
  };

  // Pie Chart Data
  const pieChartData = {
    labels: Object.keys(documentStats.categoryCount),
    datasets: [
      {
        data: Object.values(documentStats.categoryCount),
        backgroundColor: [
          "rgba(144, 238, 144, 0.6)", // light green
          "rgba(255, 255, 255, 0.6)", // white
          "rgba(173, 216, 230, 0.6)", // light blue
          "rgba(255, 182, 193, 0.6)", // light pink
        ],
        borderColor: [
          "rgba(144, 238, 144, 1)",
          "rgba(255, 255, 255, 1)",
          "rgba(173, 216, 230, 1)",
          "rgba(255, 182, 193, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Bar Chart Data
  const barChartData = {
    labels: Object.keys(documentStats.categoryCount),
    datasets: [
      {
        label: "Number of Documents",
        data: Object.values(documentStats.categoryCount),
        backgroundColor: "rgba(144, 238, 144, 0.6)",
        borderColor: "rgba(144, 238, 144, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Document Categories Distribution",
      },
    },
  };

  return (
    <>
      <Navbar />
      <div className="flex">
        <UserSideBar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-4">Document Statistics</h1>
            <div className="bg-white p-4 rounded-lg shadow-md">
              <p className="text-xl mb-2">
                Total Documents:{" "}
                <span className="font-bold">
                  {documentStats.totalDocuments}
                </span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Pie Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Category Distribution (Pie Chart)
              </h2>
              <div className="h-[300px] flex items-center justify-center">
                <Pie data={pieChartData} options={options} />
              </div>
            </div>

            {/* Bar Graph */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-bold mb-4">
                Category Distribution (Bar Graph)
              </h2>
              <div className="h-[300px] flex items-center justify-center">
                <Bar data={barChartData} options={options} />
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white p-4 rounded-lg shadow-md md:col-span-2">
              <h2 className="text-xl font-bold mb-4">Category Breakdown</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(documentStats.categoryCount).map(
                  ([category, count]) => (
                    <div key={category} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-semibold">{category}</h3>
                      <p className="text-2xl font-bold">{count}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;
