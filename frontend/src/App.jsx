import { ThemeProvider } from "@/providers/theme-provider.jsx";
import {
    createBrowserRouter,
    redirect,
    RouterProvider,
} from "react-router-dom";
import Landing from "@/pages/Home.jsx"; // New landing page
import History from "@/pages/History.jsx"; // Former home page, now for history
import Layout from "@/pages/Layout.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import Pay from "@/pages/Pay.jsx";
import AuthContext from "@/providers/auth-context.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import ForgotPassword from "@/pages/ForgotPassword.jsx";
import VerifyOtp from "@/pages/VerifyOtp.jsx";
import ResetPassword from "@/pages/ResetPassword.jsx";
import NoPageFound from "@/pages/404.jsx";
import Call from "./pages/call";
import { ToastProvider } from "./context/ToastContext.jsx";

function App() {
    const initialState = {
        id: null,
        name: null,
        email: null,
        token: null,
        isAuthenticated: false,
    };
    const [user, setUser] = useState(
        () =>
            JSON.parse(
                localStorage.getItem("user") ?? JSON.stringify(initialState),
            ) || initialState,
    );

    const fetchUserData = async () => {
        if (!user.isAuthenticated) {
            return;
        }
        const res = await axios
            .get(`${process.env.SERVER_URL}/auth/user`, {
                headers: {
                    authorization: `Bearer ${user.token}`,
                },
                validateStatus: false,
            })
            .then((res) => res.data);
        if (!res.success) {
            setUser(initialState);
            return;
        }
        setUser({
            ...user,
            id: res.data.id,
            name: res.data.name,
            email: res.data.email,
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const router = createBrowserRouter([
        {
            element: <Layout />,
            errorElement: (
                <p className="w-screen h-full-w-nav flex justify-center align-middle items-center">
                    Something went wrong
                </p>
            ),
            children: [
                {
                    path: "/",
                    element: <Landing />,
                },
                {
                    path: "/history",
                    loader: () => {
                        if (!user.isAuthenticated) {
                            return redirect("/login?next=/history");
                        }
                        return null;
                    },
                    element: <History />,
                },
                {
                    path: "/login",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <Login />,
                },
                {
                    path: "/register",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <Register />,
                },
                {
                    path: "/forgot-password",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <ForgotPassword />,
                },
                {
                    path: "/verify-otp",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <VerifyOtp />,
                },
                {
                    path: "/reset-password",
                    loader: ({ request }) => {
                        const searchParams = new URL(request.url).searchParams;
                        if (user.isAuthenticated) {
                            return redirect(searchParams.get("next") || "/");
                        }
                        return null;
                    },
                    element: <ResetPassword />,
                },
                {
                    path: "/pay",
                    loader: () => {
                        if (!user.isAuthenticated) {
                            return redirect(`/login?next=/pay`);
                        }
                        return null;
                    },
                    element: <Pay />,
                },
                {
                    path: "/call",
                    loader: () => {
                        if (!user.isAuthenticated) {
                            return redirect(`/login?next=/call`);
                        }
                        return null;
                    },
                    element: <Call />,
                },
                {
                    path: "*",
                    element: <NoPageFound />,
                },
            ],
        },
    ]);

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(user));
    }, [user]);

    useEffect(() => {
        fetchUserData();
    }, [user.isAuthenticated, user.token]);

    return (
        <div className="font-inter overflow-x-hidden">
            <AuthContext.Provider
                value={{
                    user,
                    setUser,
                }}
            >
                <ThemeProvider defaultTheme="light">
                    <ToastProvider>
                        <RouterProvider router={router} />
                    </ToastProvider>
                </ThemeProvider>
            </AuthContext.Provider>
        </div>
    );
}

export default App;
