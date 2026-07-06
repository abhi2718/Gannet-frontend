import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "./ConfirmDialog";

describe("ConfirmDialog", () => {
  it("renders the title and message and fires the callbacks", () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();
    render(
      <ConfirmDialog
        title="Delete order"
        message="Are you sure?"
        onConfirm={onConfirm}
        onCancel={onCancel}
      />,
    );
    expect(screen.getByRole("alertdialog", { name: "Delete order" })).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledTimes(1);
    fireEvent.click(screen.getByText("Delete"));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("disables both buttons while a delete is in flight", () => {
    render(
      <ConfirmDialog
        title="X"
        message="Y"
        loading
        confirmLabel="Remove"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(screen.getByText("Remove")).toBeDisabled();
    expect(screen.getByText("Cancel")).toBeDisabled();
  });
});
