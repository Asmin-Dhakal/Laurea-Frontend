import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function GET() {
    try {
        const rows = await sql`SELECT NOW() AS now, current_database() AS database_name`;

        const row = rows[0];

        return NextResponse.json({
            ok: true,
            database: row?.database_name ?? null,
            serverTime: row?.now ?? null,
        });
    } catch (error) {
        const err = error as { code?: string; message?: string };

        return NextResponse.json(
            {
                ok: false,
                code: err.code ?? 'DB_ERROR',
                message: err.message ?? 'Database connection failed',
            },
            { status: 500 }
        );
    }
}