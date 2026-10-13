import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { dbConnect } from '@/db/connect';
import { UserModel } from '@/db/schema/user';
import { z } from 'zod';

const signupSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Correo electrónico inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['student', 'teacher']).default('student'),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = signupSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { errors: validation.error.flatten().fieldErrors },
                { status: 400 }
            );
        }

        const { name, email, password, role } = validation.data;

        await dbConnect();

        const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { error: 'El correo electrónico ya está registrado' },
                { status: 409 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await UserModel.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
        });

        return NextResponse.json(
            {
                message: 'Usuario creado exitosamente',
                user: {
                    id: newUser._id.toString(),
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error en signup:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
}