import React, { useEffect, useState } from "react";
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
} from "recharts";
import Loader from "./Loader";
import FraudRatioRecharts from "./FraudRatioRecharts";

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
    const [barChartData, setBarChartData] = useState(null);
    const [lineChartData, setLineChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setBarChartData(generateRandomData(7));
            setLineChartData(generateRandomData(10));
            setLoading(false);
        }, 2500);
    }, []);

    return (
        <div className="space-y-6">
            {loading ? (
                <div className="flex justify-center items-center h-48">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="flex flex-row space-x-4">
                        <div className="bg-white p-4 rounded-md shadow">
                            <h2 className="text-lg font-semibold mb-4">
                                Fraud Ratio
                            </h2>
                            <FraudRatioRecharts fraudPercentage={80} />
                        </div>
                        <div className="bg-white p-4 rounded-md shadow">
                            <h2 className="text-lg font-semibold mb-4">
                                Payment Trends
                            </h2>
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
                    </div>

                    <div className="bg-white p-4 rounded-md shadow">
                        <h2 className="text-lg font-semibold mb-4">
                            Daily Payment Amounts
                        </h2>
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
                            <Line
                                type="monotone"
                                dataKey="amount"
                                stroke="#82ca9d"
                                activeDot={{ r: 8 }}
                            />
                        </LineChart>
                    </div>
                </>
            )}
        </div>
    );
};

export default PaymentTrends;
