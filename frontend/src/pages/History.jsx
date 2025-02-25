import { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
} from "@/components/ui/card.jsx";
import { toast } from "@/hooks/use-toast";

function History() {
    const [payments, setPayments] = useState([]);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        setUserId(currentUser.id);
    }, []);

    useEffect(() => {
        const fetchPayments = async () => {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            if (user.token) {
                try {
                    const res = await axios
                        .get(`${process.env.SERVER_URL}/payments`, {
                            headers: { authorization: `Bearer ${user.token}` },
                        })
                        .then((res) => res.data);
                    if (res.success) {
                        setPayments(res.data.payments);
                    }
                } catch (error) {
                    console.error(error);
                }
            }
        };

        fetchPayments();
        const interval = setInterval(fetchPayments, 10000);
        return () => clearInterval(interval);
    }, []);

    const paidPayments = payments.filter(
        (payment) => payment.payer?.id === userId,
    );
    const receivedPayments = payments.filter(
        (payment) => payment.payee?.id === userId,
    );

    return (
        <div className="container mx-auto p-4 min-h-screen">
            <h1 className="mb-4 text-2xl font-bold">Your Transactions</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Payments Made</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {paidPayments.length ? (
                            <ul className="space-y-2">
                                {paidPayments.map((payment) => (
                                    <li
                                        key={payment.id}
                                        className="border p-2 rounded-md"
                                    >
                                        <div>
                                            <strong>Amount:</strong>{" "}
                                            {payment.amount}
                                        </div>
                                        <div>
                                            <strong>To:</strong>{" "}
                                            {payment.payee?.name || "N/A"}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No payments made.</p>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Payments Received</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {receivedPayments.length ? (
                            <ul className="space-y-2">
                                {receivedPayments.map((payment) => (
                                    <li
                                        key={payment.id}
                                        className="border p-2 rounded-md"
                                    >
                                        <div>
                                            <strong>Amount:</strong>{" "}
                                            {payment.amount}
                                        </div>
                                        <div>
                                            <strong>From:</strong>{" "}
                                            {payment.payer?.name || "N/A"}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No payments received.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

export default History;
