import { NextApiRequest, NextApiResponse } from 'next';
import Admin from '../../../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import sequelize from '../../../db';

sequelize.sync();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).end();
    }

    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ where: { email } });

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ adminId: admin.id, role: 'admin' }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.setHeader('Set-Cookie', cookie.serialize('adminToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            maxAge: 3600,
            sameSite: 'strict',
            path: '/'
        }));

        return res.status(200).json({ admin });
    } catch (error: any) {
        console.error('Error logging in admin:', error);
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
