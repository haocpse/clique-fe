import { createBrowserRouter } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import HomePage from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CreateProfile from "@/pages/Profile/CreateProfile";
import EditProfile from "@/pages/Profile/EditProfile";
import MyProfile from "@/pages/Profile/MyProfile";
import Discover from "@/pages/Discover";
import MatchDetail from "@/pages/MatchDetail";
import NotFoundPage from "@/pages/NotFound";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import GuestRoute from "@/components/common/GuestRoute";
import PartnerRegister from "@/pages/PartnerRegister";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: "/login",
    element: (
      <GuestRoute>
        <Login />
      </GuestRoute>
    ),
  },
  {
    path: "/register",
    element: (
      <GuestRoute>
        <Register />
      </GuestRoute>
    ),
  },
  {
    path: "/partner/register",
    element: <PartnerRegister />,
  },
  {
    path: "/profile/create",
    element: (
      <ProtectedRoute>
        <CreateProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/edit",
    element: (
      <ProtectedRoute>
        <EditProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile/me",
    element: (
      <ProtectedRoute>
        <MyProfile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/discover",
    element: (
      <ProtectedRoute>
        <Discover />
      </ProtectedRoute>
    ),
  },
  {
    path: "/match/:id",
    element: (
      <ProtectedRoute>
        <MatchDetail />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
