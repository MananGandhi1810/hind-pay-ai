import React from "react";
import { PieChart, Pie, Cell, Legend } from "recharts";

const FraudRatioRecharts = ({ fraudPercentage = 80 }) => {
    const data = [
        { name: "Fraud", value: fraudPercentage },
        { name: "Legitimate", value: 100 - fraudPercentage },
    ];

    const COLORS = ["#FF4136", "#2ECC40"]; // Red for fraud, Green for legitimate

    return (
        <PieChart width={400} height={300}>
            <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
            >
                {data.map((entry, index) => (
                    <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>
            <Legend />
        </PieChart>
    );
};

export default FraudRatioRecharts;
