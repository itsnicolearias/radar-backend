import { MAX_PROFILE_IMAGE_SIZE, validateProfileImage } from "../services/image-storage/image-validation"

describe("profile image validation", () => {
  it("allows JPEG, PNG, and WebP files with matching signatures", () => {
    expect(() => validateProfileImage(Buffer.from([0xff, 0xd8, 0xff]), "image/jpeg")).not.toThrow()
    expect(() =>
      validateProfileImage(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), "image/png"),
    ).not.toThrow()
    expect(() =>
      validateProfileImage(Buffer.from("RIFFxxxxWEBP"), "image/webp"),
    ).not.toThrow()
  })

  it("rejects mismatched and unsupported file types", () => {
    expect(() => validateProfileImage(Buffer.from("not an image"), "image/jpeg")).toThrow()
    expect(() => validateProfileImage(Buffer.from("RIFFxxxxWEBP"), "image/gif")).toThrow()
  })

  it("sets the initial upload limit to 5 MB", () => {
    expect(MAX_PROFILE_IMAGE_SIZE).toBe(5 * 1024 * 1024)
  })
})
