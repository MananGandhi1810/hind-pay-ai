import { useContext, useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";

function Pay() {
    const [paymentType, setPaymentType] = useState("card");
    const [payee, setPayee] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);

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
        <div className="h-full-w-nav w-screen m-auto flex items-center justify-center">
            <Card className="w-[400px]">
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
                        <TabsTrigger value="card">Card Payment</TabsTrigger>
                        <TabsTrigger value="upi">UPI Payment</TabsTrigger>
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
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Recipient's VPA or phone number"
                                                        required
                                                    />
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
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Amount"
                                                        type="number"
                                                        required
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
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="1234 5678 9012 3456"
                                                        required
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
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Name on card"
                                                        required
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="flex flex-col space-y-1.5">
                                                        <Label htmlFor="expiryDate">
                                                            Expiry Date
                                                        </Label>
                                                        <Input
                                                            id="expiryDate"
                                                            value={expiryDate}
                                                            onChange={(e) =>
                                                                setExpiryDate(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder="MM/YY"
                                                            required
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
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col space-y-1.5">
                                                    <Label htmlFor="cardAmount">
                                                        Amount
                                                    </Label>
                                                    <Input
                                                        id="cardAmount"
                                                        value={amount}
                                                        onChange={(e) =>
                                                            setAmount(
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Amount"
                                                        type="number"
                                                        required
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
        </div>
    );
}

export default Pay;
