import { screen, fireEvent } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { InquiryPopup } from "./InquiryPopup";

jest.mock("@/lib/api/client");
import { apiPost } from "@/lib/api/client";
const mockApiPost = apiPost as jest.MockedFunction<typeof apiPost>;

function fillRequiredFields() {
  fireEvent.change(screen.getByPlaceholderText("Your name"), { target: { value: "Test User" } });
  fireEvent.change(screen.getByPlaceholderText("+91 XXXXX XXXXX"), {
    target: { value: "+91 98765 43210" },
  });
  fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
    target: { value: "test@user.com" },
  });
  fireEvent.change(screen.getByPlaceholderText("Your city"), { target: { value: "Mumbai" } });
  fireEvent.change(screen.getByPlaceholderText("e.g. 50 bottles/month"), {
    target: { value: "50 bottles/month" },
  });
}

describe("InquiryPopup", () => {
  beforeEach(() => jest.clearAllMocks());

  it("renders the inquiry form", () => {
    renderWithClient(<InquiryPopup onClose={jest.fn()} />);
    expect(screen.getByText("Need Fresh Natural Drinking Water?")).toBeInTheDocument();
  });

  it("blocks submission until the required fields are filled", () => {
    renderWithClient(<InquiryPopup onClose={jest.fn()} />);
    fireEvent.click(screen.getByText(/Submit Inquiry/));
    expect(screen.getByText("Please fill in all fields.")).toBeInTheDocument();
    expect(mockApiPost).not.toHaveBeenCalled();
  });

  it("submits the enquiry and shows a success state", async () => {
    mockApiPost.mockResolvedValue({});
    renderWithClient(<InquiryPopup onClose={jest.fn()} />);
    fillRequiredFields();
    fireEvent.click(screen.getByText(/Submit Inquiry/));
    expect(await screen.findByText("Inquiry Received!")).toBeInTheDocument();
    expect(mockApiPost).toHaveBeenCalledWith(
      "/queries",
      expect.objectContaining({
        fullName: "Test User",
        mobileNumber: "+91 98765 43210",
        email: "test@user.com",
        city: "Mumbai",
        requirement: "50 bottles/month",
      }),
    );
  });

  it("closes from the Maybe Later button", () => {
    const onClose = jest.fn();
    renderWithClient(<InquiryPopup onClose={onClose} />);
    fireEvent.click(screen.getByText("Maybe Later"));
    expect(onClose).toHaveBeenCalled();
  });
});
