/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as core_organizations from "../core/organizations.js";
import type * as core_users from "../core/users.js";
import type * as helpers_ResendOTP from "../helpers/ResendOTP.js";
import type * as helpers_auth from "../helpers/auth.js";
import type * as http from "../http.js";
import type * as schema_core from "../schema/core.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  "core/organizations": typeof core_organizations;
  "core/users": typeof core_users;
  "helpers/ResendOTP": typeof helpers_ResendOTP;
  "helpers/auth": typeof helpers_auth;
  http: typeof http;
  "schema/core": typeof schema_core;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
