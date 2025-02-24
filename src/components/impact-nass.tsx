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
  // Static demo data
  const monthlyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Actual Carbon Emissions",
        data: [50, 45, 40, 35, 30, 25],
        borderColor: "#20B2AA",
        backgroundColor: "#20B2AA",
        tension: 0.4,
      },
      {
        label: "Expected Car Emissions",
        data: [100, 95, 90, 85, 80, 75],
        borderColor: "#FF1493",
        backgroundColor: "#FF1493",
        tension: 0.4,
      }
    ],
  }

  const transportModeData = {
    labels: ["Bus", "Metro", "Tramway", "Walking"],
    datasets: [
      {
        data: [40, 30, 20, 10],
        backgroundColor: ["#20B2AA", "#1E90FF", "#DAA520", "#4CAF50"],
        borderColor: "rgba(255, 255, 255, 0.2)",
        borderWidth: 1,
      },
    ],
  }

  const transportData = {
    labels: ["Bus", "Metro", "Tramway", "Telepherique", "Walking"],
    datasets: [
      {
        label: "Carbon Saved (kg CO₂)",
        data: [150, 200, 180, 120, 300],
        backgroundColor: ["#20B2AA", "#1E90FF", "#DAA520", "#FF8C00", "#4CAF50"],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-white mb-8">Transport Carbon Impact Overview</h1>

        {/* Carbon Savings Chart */}
        <div className="bg-card p-6 rounded-lg border border-border">
          <h3 className="text-xl text-card-foreground mb-4">Carbon Emissions Timeline</h3>
          <Line
            data={monthlyData}
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

        <div className="grid md:grid-cols-2 gap-8">
          {/* Transport Mode Distribution */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl text-card-foreground mb-4">Transport Mode Distribution</h3>
            <Doughnut
              data={transportModeData}
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

          {/* Carbon Savings by Transport Type */}
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-xl text-card-foreground mb-4">Carbon Savings by Transport Type</h3>
            <Bar
              data={transportData}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg text-primary mb-2">Total Carbon Saved</h3>
            <p className="text-3xl font-bold text-card-foreground">950 kg CO₂</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg text-muted-foreground mb-2">Actual Emissions</h3>
            <p className="text-3xl font-bold text-card-foreground">225 kg CO₂</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-border">
            <h3 className="text-lg text-destructive mb-2">Car Equivalent</h3>
            <p className="text-3xl font-bold text-card-foreground">1175 kg CO₂</p>
          </div>
        </div>
      </div>
    </div>
  )
}