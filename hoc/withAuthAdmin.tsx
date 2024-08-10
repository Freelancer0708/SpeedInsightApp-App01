import { useAuthContextAdmin } from '../contexts/AuthContextAdmin';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const withAuthAdmin = (WrappedComponent: React.ComponentType) => {
    const ComponentWithAuth = (props: any) => {
        const { admin } = useAuthContextAdmin();
        const router = useRouter();

        useEffect(() => {
            if (admin === undefined) return; // 初期状態では何もせず、ユーザー状態が確定するまで待つ
            if (admin === null) {
                router.replace('/admin/login'); // 管理者ログインページのパスに置き換え
            }
        }, [admin, router]);

        if (admin === undefined) {
            return <div>Loading...</div>; // ローディングスピナーなどを表示
        }
        if (admin === null) {
            return null; // ユーザーがいない間は何も表示しない
        }
        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuth;
};

export default withAuthAdmin;
