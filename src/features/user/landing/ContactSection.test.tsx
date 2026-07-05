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
    target: { value: "+91 98765 43210" },
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

  it("renders the contact details", () => {
    renderWithClient(<ContactSection />);
    expect(screen.getByText("We Are Here to Help")).toBeInTheDocument();
    expect(screen.getByText("hello@gannetwater.com")).toBeInTheDocument();
  });

  it("requires the mandatory fields before submitting", () => {
    renderWithClient(<ContactSection />);
    fireEvent.change(screen.getByPlaceholderText("Your full name"), {
      target: { value: "Test User" },
    });
    fireEvent.click(screen.getByText(/Send Message/));
    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it("submits the enquiry and shows a confirmation", async () => {
    mockApiPost.mockResolvedValue({});
    renderWithClient(<ContactSection />);
    fillForm();
    fireEvent.click(screen.getByText(/Send Message/));
    expect(await screen.findByText(/Message Sent!/)).toBeInTheDocument();
    expect(mockApiPost).toHaveBeenCalledWith(
      "/queries",
      expect.objectContaining({ fullName: "Test User", city: "Mumbai", requirement: "Bulk order" }),
    );
  });
});
