import { emailError, passwordError, phoneError, nameError } from "./validation";

describe("auth validation", () => {
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

  it("accepts a 10-digit Indian mobile and rejects others", () => {
    expect(phoneError("9876543210")).toBeNull();
    expect(phoneError("8318064327")).toBeNull();
    expect(phoneError("12345")).toMatch(/Indian mobile/); // too short
    expect(phoneError("1234567890")).toMatch(/Indian mobile/); // starts with 1
    expect(phoneError("98765432101")).toMatch(/Indian mobile/); // too long
  });

  it("requires a name of at least 3 characters", () => {
    expect(nameError("Ann")).toBeNull();
    expect(nameError("Al")).toMatch(/at least 3/);
  });
});
