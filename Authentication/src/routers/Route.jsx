import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Root from "../layouts/Root";
import SignUp from "../pages/SignUp";
import MultiFactorAuth from "../pages/MultiFactorAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: null,
    children: [
      {
        path: "/sign-up",
        element: <SignUp />,
      },
      {
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        path: "/mfa",
        element: <MultiFactorAuth />,
      },
    ],
  },
]);

export default router;
