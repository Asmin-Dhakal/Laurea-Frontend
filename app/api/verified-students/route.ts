import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(req: NextRequest) {
    const password = req.headers.get('x-access-password');
    const correctPassword = process.env.ADMIN_PASSWORD ?? 'UnigoLaurea2026';

    if (!password || password !== correctPassword) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const sql = db();
        const rows = await sql`SELECT * FROM verified_students ORDER BY last_verified_at DESC`;
        return NextResponse.json(rows);
    } catch (err) {
        console.error('[verified-students]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
