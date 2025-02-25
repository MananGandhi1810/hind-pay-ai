import React from "react";
import "./CircularLoader.css";

const CircularLoader = () => {
    return (
        <div className="circular-loader-container">
            <svg className="circular-loader" viewBox="25 25 50 50">
                <circle
                    className="loader-path"
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    strokeWidth="5"
                />
            </svg>
        </div>
    );
};

export default CircularLoader;
