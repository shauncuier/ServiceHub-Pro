import { createBrowserRouter } from "react-router";
import Root from "../Layout/Root";
import Home from "../Pages/Home";
import AllServices from "../Pages/AllServices";
import ServiceDetails from "../Pages/ServiceDetails";
import AddService from "../Pages/AddService";
import ManageServices from "../Pages/ManageServices";
import BookedServices from "../Pages/BookedServices";
import BookingsPage from "../Pages/BookingsPage";
import ServiceTodo from "../Pages/ServiceTodo";
import ProfileSettings from "../Pages/ProfileSettings";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import ErrorPage from "../Pages/ErrorPage";
import PrivateRoute from "../Auth/PrivateRoute";
import RedirectIfAuthenticated from "../Auth/RedirectIfAuthenticated";

export const router = createBrowserRouter([
    {
        path: "/",
        Component: Root,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true,
                path: "/",
                element: <Home />
            },
            {
                path: "login",
                element: (
                    <RedirectIfAuthenticated redirectTo="/services">
                        <Login />
                    </RedirectIfAuthenticated>
                )
            },
            {
                path: "register",
                element: (
                    <RedirectIfAuthenticated redirectTo="/services">
                        <Register />
                    </RedirectIfAuthenticated>
                )
            },
            {
                path: "services",
                element: <AllServices />
            },
            {
                path: "services/:id",
                element: (
                    <PrivateRoute>
                        <ServiceDetails />
                    </PrivateRoute>
                )
            },
            {
                path: "add-service",
                element: (
                    <PrivateRoute>
                        <AddService />
                    </PrivateRoute>
                )
            },
            {
                path: "manage-services",
                element: (
                    <PrivateRoute>
                        <ManageServices />
                    </PrivateRoute>
                )
            },
            {
                path: "booked-services",
                element: (
                    <PrivateRoute>
                        <BookedServices />
                    </PrivateRoute>
                )
            },
            {
                path: "bookings",
                element: (
                    <PrivateRoute>
                        <BookingsPage />
                    </PrivateRoute>
                )
            },
            {
                path: "service-todo",
                element: (
                    <PrivateRoute>
                        <ServiceTodo />
                    </PrivateRoute>
                )
            },
            {
                path: "profile-settings",
                element: (
                    <PrivateRoute>
                        <ProfileSettings />
                    </PrivateRoute>
                )
            },
            {
                path: "*",
                element: <ErrorPage />
            }
        ]
    },
]);
