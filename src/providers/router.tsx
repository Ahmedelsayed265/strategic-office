import { createBrowserRouter } from "react-router";
import RootLayout from "@/layouts/RootLayout";

import Error from "@/routes/Error";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <Error />,
    element: <RootLayout />,
  },
]);
