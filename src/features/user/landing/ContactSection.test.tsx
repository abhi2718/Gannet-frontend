import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { ContactSection } from "./ContactSection";

jest.mock("@/lib/api/client");
import { apiPost } from "@/lib/api/client";
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

function fillForm() {
  fireEvent.change(screen.getByPlaceholderText("Your full name"), {
    target: { value: "Test User" },
  });
  fireEvent.change(screen.getByPlaceholderText("+91 XXXXX XXXXX"), {
    target: { value: "+91 9110066913" },
  });
  fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
    target: { value: "test@user.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Your city"), { target: { value: "Mumbai" } });
  fireEvent.change(screen.getByPlaceholderText(/50 bottles\/month/), {
    target: { value: "Bulk order" },
  });
  fireEvent.change(screen.getByPlaceholderText("Tell us about your water requirements..."), {
    target: { value: "Need 100 bottles a month." },
  });
}

describe("ContactSection", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the contact details and the dealership inquiry heading", () => {
    renderWithClient(<ContactSection />);
    expect(screen.getByText("We Are Here to Help")).toBeInTheDocument();
    expect(screen.getByText("atulvitrified091zi@gmail.com")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Inquiry for Dealership" })).toBeInTheDocument();
  });

  it("shows per-field errors and does not submit when fields are missing/invalid", () => {
    renderWithClient(<ContactSection />);
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "Test User" },
    });
    fireEvent.click(screen.getByText(/Send Message/));
    // The empty phone shows its own error under the phone field.
    expect(screen.getByText("Please enter a valid 10-digit phone number.")).toBeInTheDocument();
    expect(screen.getByText("City is required.")).toBeInTheDocument();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it("keeps letters out of the phone number field", () => {
    renderWithClient(<ContactSection />);
    const phone = screen.getByPlaceholderText("+91 XXXXX XXXXX");
    fireEvent.change(phone, { target: { value: "98abc76543" } });
    expect(phone).toHaveValue("9876543");
  });

  it("submits the enquiry and shows a confirmation", async () => {
    mockApiPost.mockResolvedValue({});
    renderWithClient(<ContactSection />);
    fillForm();
    fireEvent.click(screen.getByText(/Send Message/));
    expect(await screen.findByText(/Message Sent!/)).toBeInTheDocument();
    expect(mockApiPost).toHaveBeenCalledWith(
      "/queries",
      expect.objectContaining({
        fullName: "Test User",
        city: "Mumbai",
        requirement: "Bulk order",
        type: "dealership",
      }),
    );
  });
});
