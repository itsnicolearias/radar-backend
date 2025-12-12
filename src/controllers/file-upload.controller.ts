import { NextFunction, Request, Response } from "express";
import { generateUploadUrl } from "../config/s3";

export const getSignedUrl = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { fileName, fileType } = req.query;
    if (!fileName || !fileType) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

    const link = await generateUploadUrl(String(fileName), String(fileType))
    res.json(link)
  } catch (error) {
    return next(error)
  }
}