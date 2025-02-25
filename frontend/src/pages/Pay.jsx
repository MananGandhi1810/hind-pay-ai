import { useContext, useState, useEffect } from "react";
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
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs.jsx";
import axios from "axios";
import { useToast } from "@/hooks/use-toast.js";
import AuthContext from "@/providers/auth-context";
import { getPayeeInfo, getPayerInfo } from "@/utils/payUtils.js";
import { debounce } from "@/lib/utils.js";
import PaymentTrends from "@/components/UserProfile/PaymentTrends.jsx";
import LoadingIndicator from "@/components/UserProfile/LoadingIndicator.jsx";
import { motion, AnimatePresence } from "framer-motion";

function Pay() {
    const [paymentType, setPaymentType] = useState("card");
  const [payee, setPayee] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
    const [showTrends, setShowTrends] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [enablePay, setEnablePay] = useState(false);

    // Card payment form states
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const { toast } = useToast();
    const { user } = useContext(AuthContext);

    useEffect(() => {
        let trendsTimeout;
        let enablePayTimeout;
        if (isLoading) {
            trendsTimeout = setTimeout(() => {
                setIsLoading(false);
                setShowTrends(true);
            }, 4000); // Show trends after 4 seconds
            enablePayTimeout = setTimeout(() => {
                setEnablePay(true);
            }, 6000); // Enable pay after 6 seconds
        }

        return () => {
            clearTimeout(trendsTimeout);
            clearTimeout(enablePayTimeout);
        };
    }, [isLoading]);

    // Animation variants
    const tabContentVariants = {
        enter: (direction) => ({
            x: direction > 0 ? 250 : -250,
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeOut",
            },
        },
        exit: (direction) => ({
            x: direction < 0 ? 250 : -250,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeIn",
            },
        }),
    };

    // Track direction of animation
    const [[page, direction], setPage] = useState([0, 0]);

    // Handle tab change with direction tracking
    const handleTabChange = (value) => {
        const newDirection = value === "upi" ? -1 : 1;
        setPage([value === "upi" ? 0 : 1, newDirection]);
        setPaymentType(value);
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        setLoading(true);

        const paymentData =
            paymentType === "upi"
                ? { payee, amount, paymentMethod: "upi" }
                : {
                      amount,
                      paymentMethod: "card",
                      cardDetails: {
                          number: cardNumber,
                          name: cardName,
                          expiry: expiryDate,
                          cvv,
                      },
                  };

        const response = await axios
            .post(`${process.env.SERVER_URL}/payments`, paymentData, {
                headers: {
                    authorization: `Bearer ${user.token || ""}`,
                },
                validateStatus: false,
            })
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
        <div className="h-full-w-nav w-screen m-auto flex items-center justify-center relative">
            <motion.div
                className="w-[350px] absolute left-1/2 transform -translate-x-1/2"
                initial={{ x: 0 }}
                animate={{ x: showTrends || isLoading ? -250 : 0 }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <Card>
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
                                        onChange={(e) => {
                                            setPayee(e.target.value);
                                        }}
                                        onBlur={debounce(async () => {
                                            const identifier = payee;
                                            if (identifier) {
                                                try {
                                                    await getPayeeInfo(identifier);
                                                    await getPayerInfo(user.token);
                                                } catch (error) {
                                                    console.error(
                                                        "Error in Pay.jsx:",
                                                        error,
                                                    );
                                                }
                                            }
                                        }, 300)}
                                        placeholder="Recipient's VPA or phone number"
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="amount">Amount</Label>
                                    <Input
                                        id="amount"
                                        value={amount}
                                        onFocus={() => setIsLoading(true)}
                                        onChange={(e) => {
                                            setAmount(e.target.value);
                                        }}
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
                                disabled={loading || !enablePay}
                            >
                                {loading ? "Processing..." : "Pay"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>

            {isLoading && !showTrends && (
                <motion.div
                    className="absolute w-[300px] right-1/2 transform translate-x-[450px] flex flex-col items-center space-y-2"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 150, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                >
                    <motion.div
                        className="bg-blue-500 h-4 rounded-full w-full"
                        animate={{
                            width: ["0%", "100%"],
                            transition: { duration: 4 },
                        }}
                    />
                    <div className="flex space-x-4">
                        <LoadingIndicator text="Analyzing Payer" />
                        <LoadingIndicator text="Analyzing Merchant" />
                    </div>
                </motion.div>
            )}

            {showTrends && (
                <motion.div
                    className="absolute right-1/2 transform translate-x-[350px]"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 150, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                >
                    <PaymentTrends />
                </motion.div>
            )}
        </div>
    );
}


export default Pay;
