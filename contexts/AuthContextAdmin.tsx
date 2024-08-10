import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export type GlobalAuthState = {
    admin: any | null | undefined;
    setAdmin: React.Dispatch<React.SetStateAction<any | null | undefined>>;
};

const initialState: GlobalAuthState = {
    admin: undefined,
    setAdmin: () => {},
};

const AuthContext = createContext<GlobalAuthState>(initialState);

type Props = { children: ReactNode };

export const AuthProviderAdmin = ({ children }: Props) => {
    const [admin, setAdmin] = useState<any | null | undefined>(initialState.admin);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdmin = async () => {
            try {
                const response = await axios.get('/api/auth/meAdmin', { withCredentials: true });
                setAdmin(response.data);
            } catch (error) {
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };
        fetchAdmin();
    }, []);

    return (
        <AuthContext.Provider value={{ admin, setAdmin }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuthContextAdmin = () => useContext(AuthContext);
