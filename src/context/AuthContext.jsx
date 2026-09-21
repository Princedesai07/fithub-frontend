import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("fithub_user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Unable to restore user session:", error);
        localStorage.removeItem("fithub_user");
        localStorage.removeItem("fithub_token");
      }
    }

    setLoading(false);
  }, []);

  async function login(email, password) {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("fithub_token", token);
    localStorage.setItem("fithub_user", JSON.stringify(user));

    setUser(user);

    return user;
  }

  async function register(name, email, password) {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
    });

    const { token, user } = response.data;

    localStorage.setItem("fithub_token", token);
    localStorage.setItem("fithub_user", JSON.stringify(user));

    setUser(user);

    return user;
  }

  async function logout() {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    }

    localStorage.removeItem("fithub_token");
    localStorage.removeItem("fithub_user");

    // Clear FitHub AI conversation data.
    sessionStorage.removeItem("fithub_ai_messages");
    sessionStorage.removeItem("fithub_ai_conversation_id");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}