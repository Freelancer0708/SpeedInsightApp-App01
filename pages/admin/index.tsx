import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuthContextAdmin } from '../../contexts/AuthContextAdmin';
import withAuthAdmin from '../../hoc/withAuthAdmin';

const AdminPage: React.FC = () => {
    const { admin } = useAuthContextAdmin();
    const router = useRouter();

    useEffect(() => {
        if (admin === undefined) return; // 初期状態では何もせず、ユーザー状態が確定するまで待つ
        if (admin === null) {
            router.push('/admin/login');
        }
    }, [admin, router]);

    if (admin === undefined) {
        return <div>Loading...</div>; // ユーザー状態が未確定の間はローディング表示
    }

    if (admin === null) {
        return null; // ユーザーがいない間は何も表示しない
    }

    return (
        <div>
            <h1>Welcome, {admin.email}</h1>
            <p>This is the admin dashboard.</p>
        </div>
    );
};

export default withAuthAdmin(AdminPage);
