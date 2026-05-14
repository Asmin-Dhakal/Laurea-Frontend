import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: NextRequest) {
    const sql = db();
    try {
        const body = await req.json();
        const { name, email } = body;

        if (!name || !email) {
            return NextResponse.json(
                { success: false, message: 'Both name and email are required' },
                { status: 400 }
            );
        }

        const trimmedName = (name as string).trim().toLowerCase();
        const trimmedEmail = (email as string).trim().toLowerCase();

        const nameRows = await sql`SELECT * FROM students WHERE LOWER(full_name) = ${trimmedName} LIMIT 1`;
        const emailRows = await sql`SELECT * FROM students WHERE LOWER(email) = ${trimmedEmail} LIMIT 1`;

        const nameMatch = nameRows[0] ?? null;
        const emailMatch = emailRows[0] ?? null;

        if (!nameMatch && !emailMatch) {
            return NextResponse.json(
                { success: false, message: 'Name and email are invalid' },
                { status: 400 }
            );
        }

        if (nameMatch && !emailMatch) {
            return NextResponse.json(
                { success: false, message: 'Please use the email you used to apply to Laurea UAS' },
                { status: 400 }
            );
        }

        if (!nameMatch && emailMatch) {
            return NextResponse.json(
                { success: false, message: 'Please use your full name as seen on your passport.' },
                { status: 400 }
            );
        }

        if (!nameMatch || !emailMatch || nameMatch.id !== emailMatch.id) {
            return NextResponse.json(
                { success: false, message: 'Name and email do not belong to the same student' },
                { status: 400 }
            );
        }

        // Upsert into verified_students
        const existingRows = await sql`SELECT * FROM verified_students WHERE LOWER(email) = ${trimmedEmail} LIMIT 1`;
        const existing = existingRows[0] ?? null;

        if (existing) {
            await sql`UPDATE verified_students SET verify_count = verify_count + 1, last_verified_at = NOW() WHERE LOWER(email) = ${trimmedEmail}`;
            return NextResponse.json({
                success: true,
                message: 'Verification updated',
                seatNumber: existing.seat_number,
                verifyCount: existing.verify_count + 1,
            });
        }

        await sql`INSERT INTO verified_students (full_name, email, seat_number, verify_count) VALUES (${nameMatch.full_name}, ${nameMatch.email}, ${nameMatch.seat_number}, 1)`;

        return NextResponse.json({
            success: true,
            message: 'Verification successful',
            seatNumber: nameMatch.seat_number,
            verifyCount: 1,
        });
    } catch (err) {
        console.error('[verify-student]', err);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
