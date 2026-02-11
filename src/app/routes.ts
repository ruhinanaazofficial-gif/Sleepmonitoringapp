import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Dashboard } from "./components/Dashboard";
import { SleepLog } from "./components/SleepLog";
import { Routines } from "./components/Routines";
import { Analytics } from "./components/Analytics";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "log", Component: SleepLog },
      { path: "routines", Component: Routines },
      { path: "analytics", Component: Analytics },
    ],
  },
]);
