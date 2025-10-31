import { z } from "zod";

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userId:
 *           type: string
 *           format: uuid
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isPublic:
 *           type: boolean
 *         maxAttendees:
 *           type: integer
 *         price:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CreateEvent:
 *       type: object
 *       required:
 *         - title
 *         - startDate
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         location:
 *           type: string
 *         latitude:
 *           type: number
 *         longitude:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         isPublic:
 *           type: boolean
 *         maxAttendees:
 *           type: integer
 *         price:
 *           type: number
 */
export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100),
    description: z.string().optional(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().optional(),
    isPublic: z.boolean().optional(),
    maxAttendees: z.number().int().optional(),
    price: z.number().optional(),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().optional(),
    location: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional(),
    isPublic: z.boolean().optional(),
    maxAttendees: z.number().int().optional(),
    price: z.number().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const eventIdSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
