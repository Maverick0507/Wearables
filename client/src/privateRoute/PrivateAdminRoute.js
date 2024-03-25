import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext.js";
import { Outlet } from "react-router-dom";
import axios from "axios";

export default function PrivateRoute() {
  const [ok, setOk] = useState(false);
  const [auth, setAuth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(` /api/v2/auth/admin-auth`, {
          headers: {
            "Authorization": auth?.token
          }
        });

        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        console.error(error);
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : "Access Denied";
}
