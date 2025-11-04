import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service';
import type {
  RegisterUserInput,
  LoginUserInput,
  ResendVerificationEmailInput,
} from '../schemas/auth.schema';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: RegisterUserInput = req.body
    const result = await authService.registerUser(data)

    res.status(201).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const resendVerificationEmail = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body as ResendVerificationEmailInput;
    const result = await authService.resendVerificationEmail(email);

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data: LoginUserInput = req.body
    const result = await authService.loginUser(data)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params

    const result = await authService.verifyEmail(token)

    res.status(200).json({
      success: true,
      data: result,
    })
  } catch (error) {
    next(error)
  }
}
