import Link from 'next/link';
import React from 'react';

const HeaderMain: React.FC = () => {
    return (
        <header>
            <div className='header-left'>
                <Link href="/">Main Page</Link>
                <Link href="/admin">Admin</Link>
            </div>
        </header>
    );
};

export default HeaderMain;
