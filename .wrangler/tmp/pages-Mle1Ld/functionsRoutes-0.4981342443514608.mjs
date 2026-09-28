import { onRequestPost as __api_admin_auth_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/auth.ts"
import { onRequestGet as __api_admin_checkin_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/checkin.ts"
import { onRequestPost as __api_admin_checkin_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/checkin.ts"
import { onRequestGet as __api_admin_checkin_stats_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/checkin-stats.ts"
import { onRequestDelete as __api_admin_users_ts_onRequestDelete } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestGet as __api_admin_users_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestPost as __api_admin_users_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestPut as __api_admin_users_ts_onRequestPut } from "/Users/dionedomingo/Projects/summer-camp/functions/api/admin/users.ts"
import { onRequestPost as __api_auth_login_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/auth/login.ts"
import { onRequestPost as __api_camper_activate_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/activate.ts"
import { onRequestPost as __api_camper_login_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/login.ts"
import { onRequestGet as __api_camper_profile_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/profile.ts"
import { onRequestPost as __api_camper_profile_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/profile.ts"
import { onRequestPut as __api_camper_profile_ts_onRequestPut } from "/Users/dionedomingo/Projects/summer-camp/functions/api/camper/profile.ts"
import { onRequestPost as __api_agent_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/agent.ts"
import { onRequestDelete as __api_churches_ts_onRequestDelete } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestGet as __api_churches_ts_onRequestGet } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestPost as __api_churches_ts_onRequestPost } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
import { onRequestPut as __api_churches_ts_onRequestPut } from "/Users/dionedomingo/Projects/summer-camp/functions/api/churches.ts"
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
      routePath: "/api/auth/login",
      mountPath: "/api/auth",
      method: "POST",
      middlewares: [],
      modules: [__api_auth_login_ts_onRequestPost],
    },
  {
      routePath: "/api/camper/activate",
      mountPath: "/api/camper",
      method: "POST",
      middlewares: [],
      modules: [__api_camper_activate_ts_onRequestPost],
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