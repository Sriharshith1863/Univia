import {createContext, useContext} from 'react';

export const UserContext = createContext({
    username: "username",
    isLoggedIn: false,
    loading: false,
    setLoading: () => {},
    setIsLoggedIn: () => {},
    setUsername: () => {},
    resetUserDetails: () => {},
});

export const useUserContext = () => {
    return useContext(UserContext);
}

export const UserProvider = UserContext.Provider;