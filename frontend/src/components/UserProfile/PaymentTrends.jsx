import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';

const generateRandomData = (numPoints) => {
    const data = [];
    let date = new Date();
    for (let i = 0; i < numPoints; i++) {
        date.setDate(date.getDate() + 1);
        data.push({
            date: date.toLocaleDateString(),
            amount: Math.floor(Math.random() * 1000) + 100, // Random amount between 100 and 1100
        });
    }
    return data;
};

const PaymentTrends = () => {
  const barChartData = generateRandomData(10); // 10 data points for the bar chart
  const lineChartData = generateRandomData(7);  // 7 data points for the line chart

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Payment Trends (Bar Chart)</h2>
        <BarChart
          width={500}
          height={300}
          data={barChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </div>

      <div className="bg-white p-4 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Daily Payment Amounts (Line Chart)</h2>
        <LineChart
          width={500}
          height={300}
          data={lineChartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#82ca9d" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
};

export default PaymentTrends;
