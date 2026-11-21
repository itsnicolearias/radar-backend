import Boom from "@hapi/boom"

export const MAX_PROFILE_IMAGE_SIZE = 5 * 1024 * 1024

const imageSignatures: Record<string, (_buffer: Buffer) => boolean> = {
  "image/jpeg": (buffer) => buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff,
  "image/png": (buffer) =>
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  "image/webp": (buffer) =>
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP",
}

export const validateProfileImage = (buffer: Buffer, mimeType: string) => {
  const signatureMatches = imageSignatures[mimeType]?.(buffer) ?? false
  if (!signatureMatches) {
    throw Boom.badRequest("Invalid image. Only JPEG, PNG, and WebP files are allowed.")
  }
}
