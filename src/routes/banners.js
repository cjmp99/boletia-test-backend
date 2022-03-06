import express from "express";
import { deleteEvent, getEvents, saveEvent, updateEvent, updateImageDesktop, updateImageMobile, updateImageTablet } from "../controllers/banners.js";

const router = express.Router();

router.post("/save-event", saveEvent);
router.get("/banners", getEvents);
router.delete("/banner/:id", deleteEvent);
router.put("/banner/:id", updateEvent);
router.put("/update-image-desktop/:id", updateImageDesktop);
router.put("/update-image-tablet/:id", updateImageTablet);
router.put("/update-image-mobile/:id", updateImageMobile);

export default router;