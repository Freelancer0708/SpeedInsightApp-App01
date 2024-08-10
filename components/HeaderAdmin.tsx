import React from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useAuthContextAdmin } from '../contexts/AuthContextAdmin';
import Link from 'next/link';

const HeaderAdmin: React.FC = () => {
    const { admin, setAdmin } = useAuthContextAdmin();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await axios.post('/api/auth/logoutAdmin');
            setAdmin(null);
            router.push('/admin/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    return (
        <header>
            {admin && (
                <>
                    <div className='header-left'>
                        <Link href="/admin/">Admin</Link>
                        <Link href="/admin/scrape/">Scrape</Link>
                    </div>
                    <div className='header-right'>
                        <p>{admin.email}</p>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                </>
            )}
        </header>
    );
};

export default HeaderAdmin;
