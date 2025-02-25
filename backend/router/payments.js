import { Router } from "express";
import { checkAuth } from "../middlewares/auth.js";
import {
    getAllPaymentsHandler,
    createPaymentHandler,
} from "../handlers/payments.js";

const router = Router();

router.get("/", checkAuth, getAllPaymentsHandler);
router.post("/", checkAuth, createPaymentHandler);

export default router;
