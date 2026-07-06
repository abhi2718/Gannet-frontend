import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUpdateUser, useDeleteUser } from "./useUserMutations";
import { apiPatch, apiDelete } from "@/lib/api/client";

jest.mock("@/lib/api/client", () => ({
  ...jest.requireActual("@/lib/api/client"),
  apiPatch: jest.fn(),
  apiDelete: jest.fn(),
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

describe("useUserMutations", () => {
  beforeEach(() => jest.clearAllMocks());

  it("PATCHes /users/:id with the edited fields", async () => {
    (apiPatch as jest.Mock).mockResolvedValue({});
    const { result } = renderHook(() => useUpdateUser(), { wrapper });
    await result.current.mutateAsync({
      id: "u1",
      input: { username: "Jane", status: "inactive" },
    });
    await waitFor(() =>
      expect(apiPatch).toHaveBeenCalledWith("/users/u1", {
        username: "Jane",
        status: "inactive",
      }),
    );
  });

  it("DELETEs /users/:id", async () => {
    (apiDelete as jest.Mock).mockResolvedValue(null);
    const { result } = renderHook(() => useDeleteUser(), { wrapper });
    await result.current.mutateAsync("u2");
    await waitFor(() => expect(apiDelete).toHaveBeenCalledWith("/users/u2"));
  });
});
