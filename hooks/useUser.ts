"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useCurrentUser() {
  return useQuery(api.core.users.getCurrentUser);
}