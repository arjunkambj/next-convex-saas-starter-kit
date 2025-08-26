"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function useOrganization() {
  return useQuery(api.core.organizations.getOrganizationWithMembers);
}

export function useInviteTeamMembers() {
  return useMutation(api.core.organizations.inviteTeamMembers);
}

export function useGetInvitedUsers() {
  return useQuery(api.core.organizations.getInvitedUsers);
}

export function useCancelInvite() {
  return useMutation(api.core.organizations.cancelInvite);
}

export function useResendInvite() {
  return useMutation(api.core.organizations.resendInvite);
}