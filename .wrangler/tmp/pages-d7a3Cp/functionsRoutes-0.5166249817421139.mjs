import { onRequestPost as __api_admin_auth_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/auth.ts"
import { onRequestGet as __api_admin_checkin_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/checkin.ts"
import { onRequestPost as __api_admin_checkin_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/checkin.ts"
import { onRequestGet as __api_admin_checkin_stats_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/checkin-stats.ts"
import { onRequestGet as __api_admin_email_deliveries_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/email-deliveries.ts"
import { onRequestDelete as __api_admin_users_ts_onRequestDelete } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestGet as __api_admin_users_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestPost as __api_admin_users_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestPut as __api_admin_users_ts_onRequestPut } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestPost as __api_auth_forgot_password_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/auth/forgot-password.ts"
import { onRequestPost as __api_auth_login_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/auth/login.ts"
import { onRequestGet as __api_auth_reset_password_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/auth/reset-password.ts"
import { onRequestPost as __api_auth_reset_password_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/auth/reset-password.ts"
import { onRequestPost as __api_camper_activate_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/activate.ts"
import { onRequestGet as __api_camper_events_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/events.ts"
import { onRequestPost as __api_camper_events_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/events.ts"
import { onRequestPost as __api_camper_login_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/login.ts"
import { onRequestGet as __api_camper_profile_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/profile.ts"
import { onRequestPost as __api_camper_profile_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/profile.ts"
import { onRequestPut as __api_camper_profile_ts_onRequestPut } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/profile.ts"
import { onRequestPost as __api_camper_resend_email_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/resend-email.ts"
import { onRequestDelete as __api_events_schedule_ts_onRequestDelete } from "/Users/dionedomingo/Projects/summer-camp/functions/api/events/schedule.ts"
import { onRequestGet as __api_events_schedule_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/events/schedule.ts"
import { onRequestPost as __api_events_schedule_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/events/schedule.ts"
import { onRequestPost as __api_agent_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/agent.ts"
import { onRequestDelete as __api_churches_ts_onRequestDelete } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestGet as __api_churches_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestPost as __api_churches_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestPut as __api_churches_ts_onRequestPut } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestGet as __api_events_index_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/events/index.ts"
import { onRequestPost as __api_events_index_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/events/index.ts"
import { onRequestPost as __api_invite_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/invite.ts"
import { onRequestPost as __api_signup_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/signup.ts"
import { onRequestGet as __api_stats_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/stats.ts"
import { onRequestPost as __api_sync_pcci_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/sync-pcci.ts"

export const routes = [
    {
      routePath: "/api/admin/auth",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_auth_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/checkin",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_checkin_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/checkin",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_checkin_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/checkin-stats",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_checkin_stats_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/email-deliveries",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_email_deliveries_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "DELETE",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestDelete],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "GET",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestGet],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "POST",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestPost],
    },
  {
      routePath: "/api/admin/users",
      mountPath: "/api/admin",
      method: "PUT",
      middlewares: [],
      modules: [__api_admin_users_ts_onRequestPut],
    },
  {
      routePath: "/api/auth/forgot-password",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_forgot_password_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/auth/reset-password",
      mountPath: "/api/auth",
      method: "GET",
      middlewares: [],
      modules: [__api_auth_reset_password_ts_onRequestGet],
    },
  {
      routePath: "/api/auth/reset-password",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_reset_password_ts_onRequestPost],
    },
  {
      routePath: "/api/camper/activate",
      mountPath: "/api/camper",
      method: "POST",
      middlewares: [],
      modules: [__api_camper_activate_ts_onRequestPost],
    },
  {
      routePath: "/api/camper/events",
      mountPath: "/api/camper",
      method: "GET",
      middlewares: [],
      modules: [__api_camper_events_ts_onRequestGet],
    },
  {
      routePath: "/api/camper/events",
      mountPath: "/api/camper",
      method: "POST",
      middlewares: [],
      modules: [__api_camper_events_ts_onRequestPost],
    },
  {
      routePath: "/api/camper/login",
      mountPath: "/api/camper",
      method: "POST",
      middlewares: [],
      modules: [__api_camper_login_ts_onRequestPost],
    },
  {
      routePath: "/api/camper/profile",
      mountPath: "/api/camper",
      method: "GET",
      middlewares: [],
      modules: [__api_camper_profile_ts_onRequestGet],
    },
  {
      routePath: "/api/camper/profile",
      mountPath: "/api/camper",
      method: "POST",
      middlewares: [],
      modules: [__api_camper_profile_ts_onRequestPost],
    },
  {
      routePath: "/api/camper/profile",
      mountPath: "/api/camper",
      method: "PUT",
      middlewares: [],
      modules: [__api_camper_profile_ts_onRequestPut],
    },
  {
      routePath: "/api/camper/resend-email",
      mountPath: "/api/camper",
      method: "POST",
      middlewares: [],
      modules: [__api_camper_resend_email_ts_onRequestPost],
    },
  {
      routePath: "/api/events/schedule",
      mountPath: "/api/events",
      method: "DELETE",
      middlewares: [],
      modules: [__api_events_schedule_ts_onRequestDelete],
    },
  {
      routePath: "/api/events/schedule",
      mountPath: "/api/events",
      method: "GET",
      middlewares: [],
      modules: [__api_events_schedule_ts_onRequestGet],
    },
  {
      routePath: "/api/events/schedule",
      mountPath: "/api/events",
      method: "POST",
      middlewares: [],
      modules: [__api_events_schedule_ts_onRequestPost],
    },
  {
      routePath: "/api/agent",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_agent_ts_onRequestPost],
    },
  {
      routePath: "/api/churches",
      mountPath: "/api",
      method: "DELETE",
      middlewares: [],
      modules: [__api_churches_ts_onRequestDelete],
    },
  {
      routePath: "/api/churches",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_churches_ts_onRequestGet],
    },
  {
      routePath: "/api/churches",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_churches_ts_onRequestPost],
    },
  {
      routePath: "/api/churches",
      mountPath: "/api",
      method: "PUT",
      middlewares: [],
      modules: [__api_churches_ts_onRequestPut],
    },
  {
      routePath: "/api/events",
      mountPath: "/api/events",
      method: "GET",
      middlewares: [],
      modules: [__api_events_index_ts_onRequestGet],
    },
  {
      routePath: "/api/events",
      mountPath: "/api/events",
      method: "POST",
      middlewares: [],
      modules: [__api_events_index_ts_onRequestPost],
    },
  {
      routePath: "/api/invite",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_invite_ts_onRequestPost],
    },
  {
      routePath: "/api/signup",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_signup_ts_onRequestPost],
    },
  {
      routePath: "/api/stats",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_stats_ts_onRequestGet],
    },
  {
      routePath: "/api/sync-pcci",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_sync_pcci_ts_onRequestPost],
    },
  ]