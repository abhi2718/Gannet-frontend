import { screen } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { DashboardOverview } from "./DashboardOverview";

describe("DashboardOverview", () => {
  it("renders the overview heading and stat tiles", () => {
    renderWithClient(<DashboardOverview />);
    expect(screen.getByText("Dashboard Overview")).toBeInTheDocument();
    expect(screen.getByText("Total Bookings")).toBeInTheDocument();
  });

  it("renders recent queries once loaded", async () => {
    renderWithClient(<DashboardOverview />);
    expect(await screen.findByText("Rahul Verma")).toBeInTheDocument();
  });
});
