import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import "./styles/global.css";

// Import your route components (Home and EditPaper)
import Home from "./routes/Home";
import EditPaper from "./routes/EditPaper";

// This is the main entry point of your React application
// You need to set up React Router here to enable client-side routing
// Requirements:
// 1. Create a router configuration using createBrowserRouter
// 2. Set up two routes:
//    - Home route ("/") should render the Home component
//    - Edit route ("/edit/:id") should render the EditPaper component
//    Note: ":id" is a URL parameter that will be used to identify which paper to edit

// TODO: Define your router configuration here
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/edit/:id", element: <EditPaper /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
