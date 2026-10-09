import { NextRequest } from 'next/server';
import { POST } from '@/app/api/auth/signup/route';
import { dbConnect } from '@/db/connect';
import { UserModel } from '@/db/schema/user';

describe('Integration Test: Auth API (/api/auth/signup)', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        // Limpieza de usuarios de prueba creados durante los tests
        await UserModel.deleteMany({ email: /@test-example\.com$/ });
    });

    it('debe registrar un usuario exitosamente con rol student por defecto', async () => {
        const req = new NextRequest('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Estudiante Test',
                email: 'student@test-example.com',
                password: 'password123',
                role: 'student',
            }),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data.user).toHaveProperty('id');
        expect(data.user.email).toBe('student@test-example.com');
        expect(data.user.role).toBe('student');
    });

    it('no debe permitir el registro con un correo existente', async () => {
        await UserModel.create({
            name: 'Usuario Existente',
            email: 'dup@test-example.com',
            password: 'hashedpassword',
            role: 'student',
        });

        const req = new NextRequest('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Usuario Duplicado',
                email: 'dup@test-example.com',
                password: 'password123',
                role: 'student',
            }),
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(409);
        expect(data.error).toBe('El correo electrónico ya está registrado');
    });

    it('debe rechazar datos de entrada inválidos (password muy corta)', async () => {
        const req = new NextRequest('http://localhost:3000/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Bad Password',
                email: 'badpass@test-example.com',
                password: '123',
                role: 'student',
            }),
        });

        const response = await POST(req);
        expect(response.status).toBe(400);
    });
});