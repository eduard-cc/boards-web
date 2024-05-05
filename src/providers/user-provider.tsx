import { getInitials } from "@/utils/get-initials";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserContextType {
  imageUrl: string | null;
  name: string | null;
  email: string | null;
  initials: string | null;
  updateUserData: (newUserData?: Partial<UserData>) => void;
  clearUserData: () => void;
}

interface UserData {
  imageUrl: string | null;
  name: string | null;
  email: string | null;
  initials: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const initialUserData = {
    imageUrl: null,
    name: null,
    email: null,
    initials: null,
  };
  const [userData, setUserData] = useState<UserData>(initialUserData);

  const updateUserData = (newUserData?: Partial<UserData>) => {
    if (newUserData?.name) {
      newUserData.initials = getInitials(newUserData.name);
    }
    setUserData((prevUserData) => ({
      ...prevUserData,
      ...newUserData,
    }));
  };

  const clearUserData = () => {
    setUserData(initialUserData);
  };

  return (
    <UserContext.Provider
      value={{ ...userData, updateUserData, clearUserData }}
    >
      {children}
    </UserContext.Provider>
  );
}
