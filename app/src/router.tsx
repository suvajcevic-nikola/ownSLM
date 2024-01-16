import {
  Outlet,
  Router,
  Route,
  RootRoute,
} from "@tanstack/react-router";
import App from "./App.tsx";

const rootRoute = new RootRoute({
  component: () => (
    <>
      <Outlet />
    </>
  ),
});

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: "/",
  component: App,
});

const routeTree = rootRoute.addChildren([indexRoute]);

export const router = new Router({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}