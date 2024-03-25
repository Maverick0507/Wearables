import { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import { useAuth } from "../context/authContext";


export default function PrivateRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [auth] = useAuth();

    useEffect(() => {
        const authCheck = async () => {

            const res = await axios.get(` /api/v2/auth/user-auth`, {
                headers: {
                    "Authorization": auth?.token
                }
            });

            if (res.data.ok) {
                setIsAuthenticated(true)
            }
            else {
                setIsAuthenticated(false)
            }
        }

        if (auth?.token) authCheck();
    }, [auth?.token]);



    return isAuthenticated ? <Outlet /> : "Access Denied";
}
