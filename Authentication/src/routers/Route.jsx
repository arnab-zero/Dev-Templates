import { createBrowserRouter } from "react-router-dom";
import SignIn from "../pages/SignIn";
import Root from "../layouts/Root";
import SignUp from "../pages/SignUp";

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
    ],
  },
]);

export default router;
