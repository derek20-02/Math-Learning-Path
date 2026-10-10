import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import TeacherActivityExercisesPage from '../../app/(teacher)/activities/[id]/page';
import StudentExercisesPage from '../../app/(student)/learning-path/[activityId]/exercises/page';
import { getSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useParams: jest.fn(),
}));

jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
}));

describe('E2E: User Story 6 - exercise manager and student workflow', () => {
  const activityId = '507f1f77bcf86cd799439011';
  const studentId = '507f1f77bcf86cd799439013';
  const exerciseId = '507f1f77bcf86cd799439014';

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it('renderiza la vista docente con los ejercicios y la opción de gestionar asignaciones', async () => {
    (useParams as jest.Mock).mockReturnValue({ id: activityId });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            exercises: [
              {
                _id: exerciseId,
                activityId,
                prompt: 'Resuelve 2 + 3',
                answerRules: { type: 'numeric', expected: '5' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            submissions: [],
            exerciseOptions: [],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            students: [
              { id: studentId, name: 'Ana López', email: 'ana@test.com' },
            ],
            assignments: [
              {
                id: 'assignment-1',
                studentId,
                studentName: 'Ana López',
                email: 'ana@test.com',
                status: 'in_progress',
                assignedAt: new Date().toISOString(),
              },
            ],
          },
        }),
      });

    render(React.createElement(TeacherActivityExercisesPage));

    expect(await screen.findByRole('button', { name: /manage exercises/i })).toBeInTheDocument();
    expect(screen.getByText(/resuelve 2 \+ 3/i)).toBeInTheDocument();
  });

  it('permite a un estudiante responder un ejercicio y muestra el estado guardado', async () => {
    (useParams as jest.Mock).mockReturnValue({ activityId });
    (getSession as jest.Mock).mockResolvedValue({ user: { id: studentId } });

    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            exercises: [
              {
                _id: exerciseId,
                activityId,
                prompt: 'Calcular 3 + 4',
                answerRules: { type: 'numeric', expected: '7' },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
            ],
            submissions: [],
          },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            submission: {
              _id: 'submission-1',
              exerciseId,
              studentId,
              assignmentId: 'assignment-1',
              answer: '7',
              attemptNumber: 1,
              isCorrect: true,
              status: 'graded',
              submittedAt: new Date().toISOString(),
            },
          },
        }),
      });

    render(React.createElement(StudentExercisesPage));

    const answerInput = await screen.findByPlaceholderText('Not answered');
    fireEvent.change(answerInput, { target: { value: '7' } });
    fireEvent.click(screen.getByRole('button', { name: /submit answer/i }));

    await waitFor(() => {
      expect(screen.getByText(/answer saved/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `/api/activities/${activityId}/exercises/${exerciseId}/submissions`,
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      }),
    );
  });
});
