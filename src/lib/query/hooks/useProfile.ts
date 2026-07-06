import { useMutation } from "@tanstack/react-query";
import { updateProfile, type UpdateProfileInput } from "@/features/user/auth/authApi";
import type { AuthUser } from "@/features/user/auth/AuthContext";

/**
 * Update the signed-in customer's profile (name + phone; email is read-only).
 * Returns the refreshed user so the caller can sync it into the auth context.
 */
export function useUpdateProfile(id: string) {
  return useMutation<AuthUser, Error, UpdateProfileInput>({
    mutationFn: (input) => updateProfile(id, input),
  });
}
