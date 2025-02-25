import { useEffect, useState } from "react";
import "../styles/PaymentAnimation.css";

const PaymentAnimation = () => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        // Start the animation after a short delay
        const initialDelay = setTimeout(() => {
            setIsAnimating(true);
        }, 500);

        const interval = setInterval(() => {
            setIsAnimating(true);

            const timer = setTimeout(() => {
                setIsAnimating(false);
            }, 3000);

            return () => clearTimeout(timer);
        }, 4500);

        return () => {
            clearInterval(interval);
            clearTimeout(initialDelay);
        };
    }, []);

    return (
        <div className="payment-animation-container">
            <div
                className={`credit-card card-from ${
                    isAnimating ? "animate-send" : ""
                }`}
            >
                <div className="card-chip"></div>
                <div className="card-number">•••• •••• •••• 4242</div>
                <div className="card-name">Sender Account</div>
            </div>

            <div
                className={`transaction-path ${
                    isAnimating ? "animate-path" : ""
                }`}
            >
                <div className="transaction-dot"></div>
            </div>

            <div
                className={`credit-card card-to ${
                    isAnimating ? "animate-receive" : ""
                }`}
            >
                <div className="card-chip"></div>
                <div className="card-number">•••• •••• •••• 8888</div>
                <div className="card-name">Receiver Account</div>
            </div>

            <div className={`transaction-success ${isAnimating ? "show" : ""}`}>
                <svg viewBox="0 0 24 24" width="24" height="24">
                    <path
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        d="M5,13 L9,17 L19,7"
                    ></path>
                </svg>
            </div>
        </div>
    );
};

export default PaymentAnimation;
