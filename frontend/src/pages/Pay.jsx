import { useState } from "react";
import { Button } from "@/components/ui/button.jsx";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import axios from "axios";
import { useToast } from "@/hooks/use-toast.js";

function Pay() {
    const [payee, setPayee] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const response = await axios
            .post(
                `${process.env.SERVER_URL}/payments`,
                { payee, amount },
                {
                    headers: {
                        authorization: `Bearer ${user.token || ""}`,
                    },
                    validateStatus: false,
                },
            )
            .then((res) => res.data);
        if (response.success) {
            toast({
                title: "Success",
                description: response.message,
            });
        } else {
            toast({
                title: "Error",
                description: response.message,
            });
        }
        setLoading(false);
    };

    return (
        <div className="h-full-w-nav w-screen m-auto flex items-center justify-center">
            <Card className="w-[350px]">
                <form onSubmit={handlePayment}>
                    <CardHeader>
                        <CardTitle>Make a Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-6">
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="payee">
                                    Payee VPA or Phone Number
                                </Label>
                                <Input
                                    id="payee"
                                    value={payee}
                                    onChange={(e) => setPayee(e.target.value)}
                                    placeholder="Recipient's VPA or phone number"
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="amount">Amount</Label>
                                <Input
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Amount"
                                    type="number"
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex">
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Pay"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

export default Pay;
