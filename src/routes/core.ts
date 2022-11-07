import express from "express";
import controller from "../controllers/core";
const router = express.Router();

router.post("/api", controller.convertHtmlToPdf);

export = router;
