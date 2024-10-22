import { Request, Response } from "express";
import * as ActivityRepository from "../repository/activity.repository";

export const getActivity = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await ActivityRepository.getById(id);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllActivities = async (req: Request, res: Response) => {
  try {
    const result = await ActivityRepository.getAll();
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllActivityByUserId = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await ActivityRepository.getAllByUserId(id);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getUserProgress = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await ActivityRepository.getProgress(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateUserProgress = async (req: Request, res: Response) => {
  const progress = req.body;
  try {
    const result = await ActivityRepository.updateProgress(progress);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getGeneralUserProgress = async (req: Request, res: Response) => {
  const { id } = req.body;
  try {
    const result = await ActivityRepository.getGeneralProgress(id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
