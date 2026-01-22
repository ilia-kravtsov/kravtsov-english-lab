import {setupAuthRequestInterceptor} from "@/features/auth/interceptors/auth-request.interceptor.ts";
import {setupAuthResponseInterceptor} from "@/features/auth/interceptors/auth-response.interceptor.ts";

export function setupAuth() {
  setupAuthRequestInterceptor();
  setupAuthResponseInterceptor();
}