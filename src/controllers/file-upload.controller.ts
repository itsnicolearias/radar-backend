import { NextFunction, Request, Response } from "express";
import { generateUploadUrl } from "../config/s3";

export const getSignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
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

    const link = await generateUploadUrl(fileName, fileType)
    res.json(link)
  } catch (error) {
    return next(error)
  }
}