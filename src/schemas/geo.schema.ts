import { z } from "zod"

// Helper to strictly parse numbers from strings and reject invalids
const toNumber = (value: unknown) => {
  if (typeof value === "string") {
    const trimmed = value.trim()
    if (trimmed === "") return NaN
    const n = Number(trimmed)
    return Number.isFinite(n) ? n : NaN
  }
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN
  }
  return NaN
}

export const latitudeSchema = z.preprocess(
  (v) => toNumber(v),
  z
    .number({ required_error: "latitude is required", invalid_type_error: "latitude must be a number" })
    .finite({ message: "latitude must be a finite number" })
    .min(-90, { message: "latitude must be >= -90" })
    .max(90, { message: "latitude must be <= 90" })
)

export const longitudeSchema = z.preprocess(
  (v) => toNumber(v),
  z
    .number({ required_error: "longitude is required", invalid_type_error: "longitude must be a number" })
    .min(-180, { message: "longitude must be >= -180" })
    .max(180, { message: "longitude must be <= 180" })
)

export const radiusSchema = z.preprocess(
  (v) => (v === undefined ? undefined : toNumber(v)),
  z
    .number({ invalid_type_error: "radius must be a number" })
    .gt(0, { message: "radius must be > 0" })
    .max(50000, { message: "radius must be <= 50000" })
)

export const geoQuerySchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  radius: radiusSchema.optional().default(1000),
})

export type GeoQueryInput = z.infer<typeof geoQuerySchema>
