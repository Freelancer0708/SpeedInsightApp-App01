import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAuthContextAdmin } from '../../contexts/AuthContextAdmin';

const AdminLoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { admin, setAdmin } = useAuthContextAdmin();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await axios.post('/api/auth/loginAdmin', { email, password });
            setAdmin(response.data.admin);
            setTimeout(() => {
                router.push('/admin');
            }, 100); // 100ミリ秒待機
        } catch (error: any) {
            console.error(error);
            setError(error.response?.data?.message || 'Login failed');
        }
    };

    useEffect(() => {
        if (admin) {
            router.push('/admin');
        }
    }, [admin, router]);

    return (
        <div>
            <section className='login'>
                <h1>Admin Login</h1>
                <form onSubmit={handleSubmit} className='login-form'>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Login</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </section>
        </div>
    );
};

export default AdminLoginPage;
