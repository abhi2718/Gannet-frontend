import {
  emailError,
  passwordError,
  phoneError,
  sanitizePhone,
  sanitizePinCode,
  sanitizeText,
  letterTextError,
  minLenError,
  fullNameError,
  messageError,
  requirementError,
  nameError,
  pinCodeError,
  requiredError,
  collectErrors,
} from "./validation";

describe("validation", () => {
  it("accepts a well-formed email and rejects a malformed one", () => {
    expect(emailError("user@test.com")).toBeNull();
    expect(emailError("  user@test.com  ")).toBeNull();
    expect(emailError("not-an-email")).toMatch(/valid email/);
    expect(emailError("a@b")).toMatch(/valid email/);
  });

  it("requires a password with letters and numbers, min 6", () => {
    expect(passwordError("secret1")).toBeNull();
    expect(passwordError("Admin2718@")).toBeNull();
    expect(passwordError("password")).toMatch(/letters and numbers/); // no digit
    expect(passwordError("123456")).toMatch(/letters and numbers/); // no letter
    expect(passwordError("abc12")).toMatch(/letters and numbers/); // too short
  });

  it("accepts a 10-digit Indian mobile, with or without +91, and rejects others", () => {
    expect(phoneError("9876543210")).toBeNull();
    expect(phoneError("+91 98765 43210")).toBeNull();
    expect(phoneError("8318064327")).toBeNull();
    expect(phoneError("12345")).toMatch(/valid 10-digit phone/); // too short
    expect(phoneError("1234567890")).toMatch(/valid 10-digit phone/); // starts with 1
    expect(phoneError("98765432101")).toMatch(/valid 10-digit phone/); // too long
  });

  it("strips letters and stray symbols from a phone value but keeps digits/+/space/-", () => {
    expect(sanitizePhone("98765abc43210")).toBe("9876543210");
    expect(sanitizePhone("+91 98765-43210")).toBe("+91 98765-43210");
    expect(sanitizePhone("phone: 9876543210!")).toBe(" 9876543210");
  });

  it("validates PIN codes, names and required fields", () => {
    expect(pinCodeError("400001")).toBeNull();
    expect(pinCodeError("012345")).toMatch(/valid 6-digit PIN/);
    expect(nameError("Ann")).toBeNull();
    expect(nameError("Al")).toMatch(/at least 3/);
    expect(requiredError("", "City")).toBe("City is required.");
    expect(requiredError("Mumbai", "City")).toBeNull();
  });

  it("keeps digits only for a PIN code, capped at six", () => {
    expect(sanitizePinCode("400001")).toBe("400001");
    expect(sanitizePinCode("40a0b01")).toBe("40001");
    expect(sanitizePinCode("4000019999")).toBe("400001"); // capped at 6
    expect(sanitizePinCode("abc")).toBe("");
  });

  it("strips digits and symbols from city/state text but keeps letters and spaces", () => {
    expect(sanitizeText("New Delhi")).toBe("New Delhi");
    expect(sanitizeText("Delhi123")).toBe("Delhi");
    expect(sanitizeText("Mah@rashtra9")).toBe("Mahrashtra");
  });

  it("requires city/state to be non-empty and letters only", () => {
    expect(letterTextError("Mumbai", "City")).toBeNull();
    expect(letterTextError("New Delhi", "City")).toBeNull();
    expect(letterTextError("", "City")).toBe("City is required.");
    expect(letterTextError("   ", "State")).toBe("State is required.");
    expect(letterTextError("Delhi1", "City")).toBe("City can only contain letters.");
    expect(letterTextError("123", "State")).toBe("State can only contain letters.");
  });

  it("enforces a minimum length on letter text and free text", () => {
    expect(letterTextError("Goa", "City", { min: 4 })).toBe("City must be at least 4 characters.");
    expect(letterTextError("Pune", "City", { min: 4 })).toBeNull();
    expect(minLenError("5 Hill Rd", "Street address", 4)).toBeNull();
    expect(minLenError("5 H", "Street address", 4)).toBe(
      "Street address must be at least 4 characters.",
    );
    expect(minLenError("", "Label", 4)).toBe("Label is required.");
  });

  it("caps letter text at a max length and can be optional", () => {
    expect(letterTextError("Mumbai", "City", { max: 20 })).toBeNull();
    expect(letterTextError("a".repeat(21), "City", { max: 20 })).toBe(
      "City must be at most 20 characters.",
    );
    // Optional field: empty passes, but a filled value is still validated.
    expect(letterTextError("", "Landmark", { max: 20, optional: true })).toBeNull();
    expect(letterTextError("Near1", "Landmark", { optional: true })).toBe(
      "Landmark can only contain letters.",
    );
  });

  it("requires a full name of at least 3 letters with no digits", () => {
    expect(fullNameError("John Doe")).toBeNull();
    expect(fullNameError("Al")).toMatch(/at least 3/);
    expect(fullNameError("John3")).toBe("Full name can only contain letters.");
    expect(fullNameError("John 007")).toBe("Full name can only contain letters.");
  });

  it("requires an enquiry message of at least 10 characters", () => {
    expect(messageError("Need bottles delivered weekly.")).toBeNull();
    expect(messageError("too short")).toBe("Message length must be at least 10 characters long");
    expect(messageError("   ")).toBe("Message length must be at least 10 characters long");
  });

  it("requires an enquiry requirement of at least 10 characters", () => {
    expect(requirementError("50 bottles a month")).toBeNull();
    expect(requirementError("bulk")).toBe("Requirement length must be at least 10 characters");
    expect(requirementError("   ")).toBe("Requirement length must be at least 10 characters");
  });

  it("collectErrors returns only the failing fields", () => {
    const errors = collectErrors(
      { email: "bad", city: "" },
      { email: emailError, city: (v) => requiredError(v, "City") },
    );
    expect(errors.email).toMatch(/valid email/);
    expect(errors.city).toBe("City is required.");
    expect(collectErrors({ email: "a@b.com" }, { email: emailError })).toEqual({});
  });
});
