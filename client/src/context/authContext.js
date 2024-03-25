import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: ""
  });
  useEffect(()=>
  {
    const data = localStorage.getItem('auth')
    if(data)
    {
        const paresedData = JSON.parse(data)
        setAuth(
            {
                ...auth,
                user:paresedData.user,
                token:paresedData.token
            }
        )
    }
  },[])

  return (
    <AuthContext.Provider value={[auth, setAuth]}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook
const useAuth = () => useContext(AuthContext);

export { useAuth, AuthProvider };
