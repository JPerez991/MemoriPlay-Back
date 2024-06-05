import { Router } from "express";
import {
  getActivity,
  getAllActivityByUserId,
  getAllActivities,
  getUserProgress,
  updateUserProgress,
  getGeneralUserProgress,
} from "../controllers/activity.controller";
import validateToken from "./validate-token";

const router = Router();

router.post("/get", validateToken, getActivity);
router.post("/get-by-user", validateToken, getAllActivityByUserId);
router.get("/get-all", validateToken, getAllActivities);
router.post("/progress/get", validateToken, getUserProgress);
router.post("/progress/update", validateToken, updateUserProgress);
router.post("/progress/general", validateToken, getGeneralUserProgress);

export default router;
