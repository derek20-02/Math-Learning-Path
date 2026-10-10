import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../../app/(auth)/login/page';
import SignUpPage from '../../app/(auth)/signup/page';

// Mock de next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        refresh: jest.fn(),
    }),
    useSearchParams: () => ({
        get: jest.fn().mockReturnValue(null),
    }),
}));

// Mock de next-auth/react
jest.mock('next-auth/react', () => ({
    signIn: jest.fn(),
}));

describe('Auth Forms UI & Keyboard Accessibility Tests', () => {
    it('debe enfocar correctamente los elementos al simular interacción por teclado en el Login', () => {
        render(React.createElement(LoginPage));

        const emailInput = screen.getByLabelText(/correo electrónico/i);
        const passwordInput = screen.getByLabelText(/contraseña/i);

        emailInput.focus();
        expect(emailInput).toHaveFocus();

        fireEvent.change(emailInput, { target: { value: 'profesor@test.com' } });
        expect(emailInput).toHaveValue('profesor@test.com');

        passwordInput.focus();
        expect(passwordInput).toHaveFocus();
    });

    it('debe renderizar todos los campos requeridos en el formulario de registro (SignUp)', () => {
        render(React.createElement(SignUpPage));

        expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/rol/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse/i })).toBeInTheDocument();
    });
});