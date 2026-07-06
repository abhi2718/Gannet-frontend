import { render, screen, fireEvent } from "@testing-library/react";
import { TablePagination } from "./TablePagination";

describe("TablePagination", () => {
  it("disables Previous on the first page and Next on the last", () => {
    const { rerender } = render(<TablePagination page={1} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Previous page")).toBeDisabled();
    expect(screen.getByLabelText("Next page")).not.toBeDisabled();
    rerender(<TablePagination page={3} totalPages={3} onPageChange={() => {}} />);
    expect(screen.getByLabelText("Next page")).toBeDisabled();
  });

  it("reports the chosen page number", () => {
    const onPageChange = jest.fn();
    render(<TablePagination page={1} totalPages={3} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText("Page 3"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it("advances via the Next button", () => {
    const onPageChange = jest.fn();
    render(<TablePagination page={2} totalPages={4} onPageChange={onPageChange} />);
    fireEvent.click(screen.getByLabelText("Next page"));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
