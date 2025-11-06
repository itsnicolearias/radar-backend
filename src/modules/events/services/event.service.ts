import { notFound } from "@hapi/boom";
import { Event, EventInterest, User } from "../../../models";
import { TEvent } from "../interfaces/event.interface";

class EventService {
  async create(eventData: TEvent, userId: string) {
    try {
      const event = await Event.create({ ...eventData, userId, isPublic: eventData.isPublic || true, isBoosted: false });
      return event;
    } catch (error) {
     throw error;
    }
  }

  async findAll(page: number, limit: number, all: boolean) {
    try {
      if (all) {
        const events = await Event.findAll({
          include: "organizer",
          order: [
            ["isBoosted", "DESC"],
            ["boostedAt", "DESC"],
            ["createdAt", "DESC"],
          ],
        });
        return events;
      }

      const offset = (page - 1) * limit;
      const events = await Event.findAndCountAll({
        offset,
        limit,
        include: "organizer",
        order: [
          ["isBoosted", "DESC"],
          ["boostedAt", "DESC"],
          ["createdAt", "DESC"],
        ],
      });
      return events;
    } catch (error) {
      throw error;
    }
  }

  async findById(eventId: string) {
    try {
      const event = await Event.findByPk(eventId, { include: "organizer" });
      if (!event) {
        throw notFound("Event not found");
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  async update(eventId: string, eventData: Partial<TEvent>) {
    try {
      const event = await this.findById(eventId);
      await event.update(eventData);
      return event;
    } catch (error) {
      throw error;
    }
  }

  async delete(eventId: string) {
    try {
      const event = await this.findById(eventId);
      await event.destroy();
    } catch (error) {
      throw error;
    }
  }

  async addInterest(eventId: string, userId: string) {
    try {
      await this.findById(eventId);
      const user = await User.findByPk(userId);
      if (!user) {
        throw notFound("User not found");
      }
      await EventInterest.create({ eventId, userId });
    } catch (error) {
      throw error;
    }
  }

  async removeInterest(eventId: string, userId: string) {
    try {
      const interest = await EventInterest.findOne({
        where: { eventId, userId },
      });
      if (!interest) {
        throw notFound("Interest not found");
      }
      await interest.destroy();
    } catch (error) {
      throw error;
    }
  }

  async findInterestedUsers(eventId: string) {
    try {
      const event = await Event.findByPk(eventId, { include: "interestedUsers" });
      if (!event) {
        throw notFound("Event not found");
      }
      return event;
    } catch (error) {
      throw error;
    }
  }

  async boost(eventId: string, userId: string) {
    try {
      const event = await this.findById(eventId);
      if (event.userId !== userId) {
        throw notFound("You can only boost your own events");
      }
      await event.update({ isBoosted: true, boostedAt: new Date() });
      return event;
    } catch (error) {
      throw error;
    }
  }
}

export default new EventService();
