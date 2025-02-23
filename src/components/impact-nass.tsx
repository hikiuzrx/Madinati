"use client"

import { Line } from "react-chartjs-2"
import { Doughnut } from "react-chartjs-2"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

export default function ImpactDashboard() {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const environmentalData = {
    labels: months,
    datasets: [
      {
        label: "Green Energy Usage",
        data: [500, 1500, 2300, 4200, 5000, 7000, 9000, 10000, 11000, 12500, 13500, 15000],
        borderColor: "#20B2AA",
        backgroundColor: "#20B2AA",
        tension: 0.4,
      },
      {
        label: "Carbon Emissions (tons)",
        data: [12500, 12000, 11500, 10000, 9000, 8200, 7000, 6000, 5500, 5000, 4500, 4000],
        borderColor: "#FF1493",
        backgroundColor: "#FF1493",
        tension: 0.4,
      },
      {
        label: "Trash Collected (tons)",
        data: [1000, 1500, 3000, 3500, 3200, 5000, 6500, 6200, 6300, 8000, 8200, 9000],
        borderColor: "#1E90FF",
        backgroundColor: "#1E90FF",
        tension: 0.4,
      },
    ],
  }

  const donationData = {
    labels: ["Individual Donors", "Corporate Sponsors", "Grants", "Events"],
    datasets: [
      {
        data: [40, 25, 20, 15],
        backgroundColor: ["#FF1493", "#1E90FF", "#DAA520", "#20B2AA"],
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }

  const volunteerData = {
    labels: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix"],
    datasets: [
      {
        label: "Active Volunteers",
        data: [650, 580, 480, 510, 420],
        backgroundColor: ["#FF1493", "#FF8C00", "#DAA520", "#20B2AA", "#1E90FF"],
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Environmental Impact Overview</h1>

        {/* Environmental Impact Chart */}
        <div className="bg-black/20 p-6 rounded-lg">
          <Line
            data={environmentalData}
            options={{
              responsive: true,
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: { color: "white" },
                },
                x: {
                  grid: {
                    color: "rgba(255, 255, 255, 0.1)",
                  },
                  ticks: { color: "white" },
                },
              },
              plugins: {
                legend: {
                  labels: { color: "white" },
                },
              },
            }}
          />
        </div>
        <div className="flex items-center gap-2 leading-none text-2xl text-gray-300">
                  Showing environmental impact metrics for the last 12 months
        </div>

        <h2 className="text-2xl font-bold text-green-400 mt-12 mb-8">Funding and Engagement Metrics</h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donation Sources */}
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-xl text-white mb-4">Donation Sources</h3>
            <Doughnut
              data={donationData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: { color: "white" },
                  },
                },
              }}
            />
          </div>

          {/* Volunteer Distribution */}
          <div className="bg-black/20 p-6 rounded-lg">
            <h3 className="text-xl text-white mb-4">Volunteer Distribution</h3>
            <Bar
              data={volunteerData}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: { color: "white" },
                  },
                  x: {
                    grid: {
                      color: "rgba(255, 255, 255, 0.1)",
                    },
                    ticks: { color: "white" },
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

