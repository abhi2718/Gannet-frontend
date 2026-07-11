import { screen } from "@testing-library/react";
import { renderWithClient } from "@/test-utils/renderWithClient";
import { DashboardOverview } from "./DashboardOverview";

describe("DashboardOverview", () => {
  it("shows a loader before the data resolves", () => {
    renderWithClient(<DashboardOverview />);
    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();
  });

  it("renders the overview heading and stat tiles once loaded", async () => {
    renderWithClient(<DashboardOverview />);
    expect(await screen.findByText("Dashboard Overview")).toBeInTheDocument();
    expect(screen.getByText("Total Bookings")).toBeInTheDocument();
  });

  it("renders recent queries once loaded", async () => {
    renderWithClient(<DashboardOverview />);
    expect(await screen.findByText("Rahul Verma")).toBeInTheDocument();
  });
});
