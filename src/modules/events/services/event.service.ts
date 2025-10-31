import { Event, EventInterest, User } from "../../../models";
import { TEvent } from "../interfaces/event.interface";
import boom from "boom";

class EventService {
  async create(eventData: TEvent, userId: string) {
    const event = await Event.create({ ...eventData, userId, isPublic: eventData.isPublic || true });
    return event;
  }

  async findAll(page: number, limit: number, all: boolean) {
    if (all) {
      const events = await Event.findAll({ include: "organizer" });
      return events;
    }

    const offset = (page - 1) * limit;
    const events = await Event.findAndCountAll({
      offset,
      limit,
      include: "organizer",
    });
    return events;
  }

  async findById(id: string) {
    const event = await Event.findByPk(id, { include: "organizer" });
    if (!event) {
      throw boom.notFound("Event not found");
    }
    return event;
  }

  async update(id: string, eventData: Partial<TEvent>) {
    const event = await this.findById(id);
    await event.update(eventData);
    return event;
  }

  async delete(id: string) {
    const event = await this.findById(id);
    await event.destroy();
  }

  async addInterest(eventId: string, userId: string) {
    await this.findById(eventId);
    const user = await User.findByPk(userId);
    if (!user) {
      throw boom.notFound("User not found");
    }
    await EventInterest.create({ eventId, userId });
  }

  async removeInterest(eventId: string, userId: string) {
    const interest = await EventInterest.findOne({
      where: { eventId, userId },
    });
    if (!interest) {
      throw boom.notFound("Interest not found");
    }
    await interest.destroy();
  }

  async findInterestedUsers(id: string) {
    const event = await Event.findByPk(id, { include: "interestedUsers" });
    if (!event) {
      throw boom.notFound("Event not found");
    }
    return event.interestedUsers;
  }
}

export default new EventService();
