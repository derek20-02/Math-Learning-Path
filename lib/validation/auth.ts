import { z } from 'zod';

export const SignUpSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Dirección de correo electrónico inválida'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    role: z.enum(['student', 'teacher'], {
        message: 'Por favor selecciona un rol válido',
    }),
});

export type SignUpInput = z.infer<typeof SignUpSchema>;