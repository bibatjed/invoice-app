import { createContext, ReactNode, useCallback, useContext, useState } from "react";

interface IUserContext {
  user: string;
  setUser: (token: string) => void;
}
const UserContext = createContext<null | IUserContext>(null);

export default function UserContextProvider(props: { children: ReactNode | ReactNode[] }) {
  const [user, setUser] = useState<string>(() => localStorage.getItem("accessToken") as string);

  const setLocalUser = useCallback((token: string) => {
    localStorage.setItem("accessToken", token);
    setUser(token);
  }, []);

  return <UserContext.Provider value={{ user, setUser: setLocalUser }}>{props.children}</UserContext.Provider>;
}

export function useAuth() {
  const user = useContext(UserContext);
  if (!user) {
    throw new Error("User Context is required");
  }
  return user;
}
