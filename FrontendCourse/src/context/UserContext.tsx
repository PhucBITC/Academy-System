import { createContext, useContext } from 'react';

export const UserContext = createContext<IContext | null>(null);

export const useUser = () => useContext(UserContext);
