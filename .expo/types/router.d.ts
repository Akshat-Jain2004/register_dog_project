/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/CloudinaryImageUpload` | `/_sitemap` | `/animation` | `/demo` | `/dogs` | `/user-list`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
