import { useEffect, useState } from "react";

export default function GrowthChart() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchChartData() {
      const res = await fetch("http://localhost:5000/chart-data");
      const data = await res.json();
      setChartData(data);
    }
    fetchChartData();
  }, []);

  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-xl font-semibold">My Growth Chart</h2>
      {chartData ? <img src={chartData.imageUrl} alt="Growth Chart" /> : <p>Loading chart...</p>}
    </div>
  );
}
