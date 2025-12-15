import { badRequest, notFound } from "@hapi/boom";
import { TEvent } from "../interfaces/event.interface";
import { GetNearbyUsersInput } from "../schemas/radar.schema";
import Event from "../models/event.model";
import EventInterest from "../models/eventInterest.model";
import User from "../models/user.model";
import { sequelize } from "../models";

class EventService {
  async getNearbyEvents(data: GetNearbyUsersInput) {
    try {
      const { latitude, longitude, radius } = data;

      const nearbyEvents = await Event.findAll({
          attributes: {
            include: [
              [
                sequelize.fn(
                  'ST_Distance',
                  sequelize.cast(sequelize.fn('ST_MakePoint', longitude, latitude), 'geography'),
                  sequelize.cast(sequelize.fn('ST_MakePoint', sequelize.col('longitude'), sequelize.col('latitude')), 'geography')
                ),
                'distance',
              ],
            ],
          },
          where: sequelize.where(
            sequelize.fn(
              'ST_DWithin',
              sequelize.cast(sequelize.fn('ST_MakePoint', longitude, latitude), 'geography'),
              sequelize.cast(sequelize.fn('ST_MakePoint', sequelize.col('longitude'), sequelize.col('latitude')), 'geography'),
              radius
            ),
            true
          ),
          order: [[sequelize.literal('distance'), 'ASC']],
          limit: 50,
        });

      return nearbyEvents;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async create(eventData: TEvent, userId: string) {
    try {
      const event = await Event.create({ ...eventData, userId, isPublic: eventData.isPublic || true });
      return event;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async findAll(page: number, limit: number, all: boolean) {
    try {
      if (all) {
        const events = await Event.findAll({ include: ["Organizer", "InterestedUsers"] });
        return events;
      }

      const offset = (page - 1) * limit;
      const events = await Event.findAndCountAll({
        offset,
        limit,
        include: ["Organizer", "InterestedUsers"],
      });
      return events;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async findById(eventId: string) {
    try {
      const event = await Event.findByPk(eventId, { include: ["Organizer", "InterestedUsers"] });
      if (!event) {
        throw notFound("Event not found");
      }
      return event;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async update(eventId: string, eventData: Partial<TEvent>, userId: string) {
    try {
      const event = await this.findById(eventId);
      if (event.userId !== userId) {
        throw badRequest('You are not authorized to update this event', { statusCode: 403 });
      }
      await event.update(eventData);
      return event;
    } catch (error) {
      throw badRequest(error);
    }
  }

  async delete(eventId: string, userId: string) {
    try {
      const event = await this.findById(eventId);
      if (event.userId !== userId) {
        throw badRequest('You are not authorized to delete this event', { statusCode: 403 });
      }
      await event.destroy();
    } catch (error) {
      throw badRequest(error);
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
      throw badRequest(error);
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
      throw badRequest(error);
    }
  }

  async findInterestedUsers(eventId: string) {
    try {
      const event = await Event.findByPk(eventId, { include: "InterestedUsers" });
      if (!event) {
        throw notFound("Event not found");
      }
      return event;
    } catch (error) {
      throw badRequest(error);
    }
  }
}

export default new EventService();
