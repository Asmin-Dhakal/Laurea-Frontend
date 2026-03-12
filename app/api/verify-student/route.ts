import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { RowDataPacket } from 'mysql2';

interface StudentRow extends RowDataPacket {
    id: number;
    full_name: string;
    email: string;
    seat_number: string;
}

interface VerifiedStudentRow extends RowDataPacket {
    id: number;
    full_name: string;
    email: string;
    seat_number: string;
    verify_count: number;
}

export async function POST(req: NextRequest) {
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

        const [nameRows] = await pool.execute<StudentRow[]>(
            'SELECT * FROM students WHERE full_name = ? LIMIT 1',
            [trimmedName]
        );
        const [emailRows] = await pool.execute<StudentRow[]>(
            'SELECT * FROM students WHERE email = ? LIMIT 1',
            [trimmedEmail]
        );

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
        const [existingRows] = await pool.execute<VerifiedStudentRow[]>(
            'SELECT * FROM verified_students WHERE email = ? LIMIT 1',
            [trimmedEmail]
        );
        const existing = existingRows[0] ?? null;

        if (existing) {
            await pool.execute(
                'UPDATE verified_students SET verify_count = verify_count + 1 WHERE email = ?',
                [trimmedEmail]
            );
            return NextResponse.json({
                success: true,
                message: 'Verification updated',
                seatNumber: existing.seat_number,
                verifyCount: existing.verify_count + 1,
            });
        }

        await pool.execute(
            'INSERT INTO verified_students (full_name, email, seat_number, verify_count) VALUES (?, ?, ?, 1)',
            [nameMatch.full_name, nameMatch.email, nameMatch.seat_number]
        );

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
