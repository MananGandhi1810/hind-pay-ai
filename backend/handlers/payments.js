import { PrismaClient } from "@prisma/client";
import sendEmail from "../utils/email.js";
const prisma = new PrismaClient();

const getAllPaymentsHandler = async (req, res) => {
    const payments = await prisma.payment.findMany({
        where: {
            OR: [{ payerId: req.user.id }, { payeeId: req.user.id }],
        },
        include: {
            payer: { select: { id: true, name: true, vpa: true } },
            payee: { select: { id: true, name: true, vpa: true } },
        },
    });
    res.json({
        success: true,
        message: "Fetched payments",
        data: { payments },
    });
};

const createPaymentHandler = async (req, res) => {
    const { payee, amount } = req.body;
    if (!payee || !amount) {
        return res.status(400).json({
            success: false,
            message: "Payee and amount are required",
            data: null,
        });
    }
    const isPhone = /^\d{10}$/.test(payee);
    if (payee === req.user.vpa || payee === req.user.phone) {
        return res.status(400).json({
            success: false,
            message: "You cannot pay money to yourself",
            data: null,
        });
    }
    if (amount > req.user.balance) {
        return res.status(400).json({
            success: false,
            message: "Insufficient Balance",
            data: null,
        });
    }
    const recipient = await prisma.user.findUnique({
        where: isPhone ? { phone: payee } : { vpa: payee },
    });
    if (!recipient) {
        return res.status(404).json({
            success: false,
            message: "Payee not found",
            data: null,
        });
    }
    const payment = await prisma.payment.create({
        data: {
            amount: parseFloat(amount),
            payerId: req.user.id,
            payeeId: recipient.id,
            status: "Processed",
        },
    });
    await prisma.user.update({
        where: {
            id: req.user.id,
        },
        data: {
            balance: {
                decrement: parseFloat(amount),
            },
        },
    });
    await prisma.user.update({
        where: isPhone ? { phone: payee } : { vpa: payee },
        data: {
            balance: {
                increment: parseFloat(amount),
            },
        },
    });
    await Promise.all([
        sendEmail(
            recipient.email,
            "Payment Received",
            `You have received ₹${amount} from ${req.user.name} (${req.user.vpa})`,
        ),
        sendEmail(
            req.user.email,
            "Payment Successful",
            `You have paid ₹${amount} to ${recipient.name} (${recipient.vpa})`,
        ),
    ]);
    res.json({
        success: true,
        message: "Payment processed successfully",
        data: payment,
    });
};

export { getAllPaymentsHandler, createPaymentHandler };
