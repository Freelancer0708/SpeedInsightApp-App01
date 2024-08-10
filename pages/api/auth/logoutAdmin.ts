import { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', cookie.serialize('adminToken', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        maxAge: -1,
        sameSite: 'strict',
        path: '/'
    }));

    res.status(200).json({ message: 'Admin logged out' });
}
