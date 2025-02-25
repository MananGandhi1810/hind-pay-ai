import { useContext, useState, useEffect } from "react";
import { Button } from "@/components/ui/button.jsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs.jsx";
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
import AuthContext from "@/providers/auth-context";
import { getPayeeInfo, getPayerInfo } from "@/utils/payUtils.js";
import { debounce } from "@/lib/utils.js";
import PaymentTrends from "@/components/UserProfile/PaymentTrends.jsx";
import LoadingIndicator from "@/components/UserProfile/LoadingIndicator.jsx";
import { motion, AnimatePresence } from "framer-motion";

function Pay() {
    const [paymentType, setPaymentType] = useState("upi");
    const [payee, setPayee] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [showTrends, setShowTrends] = useState(false);
    //   const [isLoading, setIsLoading] = useState(false);
    const [enablePay, setEnablePay] = useState(false);

    // Card payment form states
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const { toast } = useToast();
    const { user } = useContext(AuthContext);

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

    const [[page, direction], setPage] = useState([0, 0]);

    useEffect(() => {
        let enablePayTimeout;
        if (showTrends) {
            enablePayTimeout = setTimeout(() => {
                setEnablePay(true);
            }, 2000);
        }

        return () => {
            clearTimeout(enablePayTimeout);
        };
    }, [showTrends]);

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
                className="w-[400px] absolute top-1/2 transform -translate-y-1/2"
                initial={{ x: 0 }}
                animate={{
                    x: showTrends ? -500 : 0,
                }}
                transition={{ type: "spring", stiffness: 100 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">
                            Make a Payment
                        </CardTitle>
                    </CardHeader>
                    <Tabs
                        defaultValue="upi"
                        onValueChange={handleTabChange}
                        value={paymentType}
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="upi">UPI Payment</TabsTrigger>
                            <TabsTrigger value="card">Card Payment</TabsTrigger>
                        </TabsList>

                        <div
                            className="relative overflow-hidden"
                            style={{ minHeight: "350px" }}
                        >
                            <AnimatePresence
                                initial={false}
                                custom={direction}
                                mode="wait"
                            >
                                {paymentType === "upi" ? (
                                    <motion.div
                                        key="upi"
                                        className="absolute w-full"
                                        custom={direction}
                                        variants={tabContentVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                    >
                                        <form onSubmit={handlePayment}>
                                            <CardContent className="pb-6">
                                                {/* UPI form fields */}
                                                <div className="grid w-full items-center gap-4">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label htmlFor="payee">
                                                            Payee VPA or Phone
                                                            Number
                                                        </Label>
                                                        <Input
                                                            id="payee"
                                                            value={payee}
                                                            onChange={(e) =>
                                                                setPayee(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onBlur={debounce(
                                                                async () => {
                                                                    const identifier =
                                                                        payee;
                                                                    if (
                                                                        identifier
                                                                    ) {
                                                                        try {
                                                                            await getPayeeInfo(
                                                                                identifier,
                                                                            );
                                                                            await getPayerInfo(
                                                                                user.token,
                                                                            );
                                                                        } catch (error) {
                                                                            console.error(
                                                                                "Error in Pay.jsx:",
                                                                                error,
                                                                            );
                                                                        }
                                                                    }
                                                                },
                                                                300,
                                                            )}
                                                            placeholder="Recipient's VPA or phone number"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label htmlFor="amount">
                                                            Amount
                                                        </Label>
                                                        <Input
                                                            id="amount"
                                                            value={amount}
                                                            onFocus={() =>
                                                                setShowTrends(
                                                                    true,
                                                                )
                                                            }
                                                            onChange={(e) =>
                                                                setAmount(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Amount"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-col gap-3">
                                                {loading && (
                                                    <div className="w-full mb-3">
                                                        <LoadingIndicator />
                                                    </div>
                                                )}
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={
                                                        loading || !enablePay
                                                    }
                                                >
                                                    {loading
                                                        ? "Processing..."
                                                        : "Pay via UPI"}
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="card"
                                        className="absolute w-full"
                                        custom={direction}
                                        variants={tabContentVariants}
                                        initial="enter"
                                        animate="center"
                                        exit="exit"
                                    >
                                        <form onSubmit={handlePayment}>
                                            <CardContent className="pb-6">
                                                {/* Card form fields */}
                                                <div className="grid w-full items-center gap-4">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label htmlFor="cardNumber">
                                                            Card Number
                                                        </Label>
                                                        <Input
                                                            id="cardNumber"
                                                            value={cardNumber}
                                                            onChange={(e) =>
                                                                setCardNumber(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="1234 5678 9012 3456"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label htmlFor="cardName">
                                                            Cardholder Name
                                                        </Label>
                                                        <Input
                                                            id="cardName"
                                                            value={cardName}
                                                            onChange={(e) =>
                                                                setCardName(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="Name on card"
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="flex flex-col space-y-1.5">
                                                            <Label htmlFor="expiryDate">
                                                                Expiry Date
                                                            </Label>
                                                            <Input
                                                                id="expiryDate"
                                                                value={
                                                                    expiryDate
                                                                }
                                                                onChange={(e) =>
                                                                    setExpiryDate(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="MM/YY"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col space-y-1.5">
                                                            <Label htmlFor="cvv">
                                                                CVV
                                                            </Label>
                                                            <Input
                                                                id="cvv"
                                                                value={cvv}
                                                                onChange={(e) =>
                                                                    setCvv(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                placeholder="123"
                                                                type="password"
                                                                maxLength={3}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label htmlFor="amount">
                                                            Amount
                                                        </Label>
                                                        <Input
                                                            id="amount"
                                                            value={amount}
                                                            onChange={(e) =>
                                                                setAmount(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            onFocus={() =>
                                                                setShowTrends(
                                                                    true,
                                                                )
                                                            }
                                                            placeholder="Amount"
                                                            type="number"
                                                        />
                                                    </div>
                                                </div>
                                            </CardContent>
                                            <CardFooter className="flex flex-col gap-3">
                                                {loading && (
                                                    <div className="w-full mb-3">
                                                        <LoadingIndicator />
                                                    </div>
                                                )}
                                                <Button
                                                    type="submit"
                                                    className="w-full"
                                                    disabled={
                                                        loading || !enablePay
                                                    }
                                                >
                                                    {loading
                                                        ? "Processing..."
                                                        : "Pay with Card"}
                                                </Button>
                                            </CardFooter>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </Tabs>
                </Card>
            </motion.div>
            {showTrends && (
                <motion.div
                    className="absolute right-0 top-1/2 transform -translate-y-1/2"
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: -150, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    style={{
                        width: "55%",
                        display: showTrends ? "block" : "none",
                    }}
                >
                    <PaymentTrends />
                </motion.div>
            )}
        </div>
    );
}

export default Pay;
