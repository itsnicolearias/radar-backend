import { NextFunction, Response } from "express";
import { generateUploadUrl } from "../config/s3";
import { AuthRequest } from "../middlewares/auth.middleware";

export const getSignedUrl = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

    const { fileName, fileType } = req.query;
    if (!fileName || !fileType) {
    return res.status(400).json({ error: "Missing parameters in file upload" });
    }

    if (typeof fileName !== 'string' || typeof fileType !== 'string') {
    return res.status(400).json({ error: "Parameters must be strings in file upload." });
    }

    if (fileType !== "image/jpeg" && fileType !== "image/png") {
      return res.status(400).json({ error: "Invalid file type. Only JPEG and PNG are allowed." });
    }

    const link = await generateUploadUrl(fileName, fileType, req.user.userId)
    res.json(link)
  } catch (error) {
    return next(error)
  }
}