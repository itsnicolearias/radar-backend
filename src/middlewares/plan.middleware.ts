import { Response, NextFunction } from "express";
import { AuthRequest } from "../interfaces/auth.interface";
import { forbidden } from "@hapi/boom";

export const checkPremiumPlan = (req: AuthRequest, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user || user.subscriptionStatus !== "premium") {
    return next(forbidden("Only Premium users can perform this action"));
  }

  next();
};
