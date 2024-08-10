import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import Admin from '../../../models/Admin';
import cookie from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.adminToken;
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

        if (decoded.role !== 'admin') {
            return res.status(401).json({ message: 'Invalid token: not an admin' });
        }

        const admin = await Admin.findByPk(decoded.adminId);

        if (!admin) {
            return res.status(401).json({ message: 'Admin not found' });
        }

        return res.status(200).json(admin);
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
