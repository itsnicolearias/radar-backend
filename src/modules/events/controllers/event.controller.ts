import { NextFunction, Request, Response } from "express";
import eventService from "../services/event.service";
import { TEvent } from "../interfaces/event.interface";
import { AuthRequest } from "../../../middlewares/auth.middleware";

class EventController {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const event = await eventService.create(
        req.body as TEvent,
        req.user.userId
      );
      res.status(201).json(event);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, all = false } = req.query;
      const events = await eventService.findAll(
        Number(page),
        Number(limit),
        Boolean(all)
      );
      res.json(events);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.findById(req.params.eventId);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await eventService.update(
        req.params.eventId,
        req.body as Partial<TEvent>
      );
      res.json(event);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await eventService.delete(req.params.eventId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async addInterest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      await eventService.addInterest(req.params.eventId, req.user.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async removeInterest(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      await eventService.removeInterest(req.params.eventId, req.user.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  async findInterestedUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await eventService.findInterestedUsers(req.params.eventId);
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async boost(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const event = await eventService.boost(req.params.eventId, req.user.userId);
      res.json(event);
    } catch (error) {
      next(error);
    }
  }
}

export default new EventController();
