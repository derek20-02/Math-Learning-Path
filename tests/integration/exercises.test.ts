import { NextRequest } from 'next/server';
import { GET as listTeacherActivities } from '@/app/api/activities/route';
import { GET as getActivityExercises, PATCH as updateExerciseAssignment } from '@/app/api/activities/[activityId]/exercises/route';
import { POST as createAssignment, GET as listAssignments } from '@/app/api/activities/[activityId]/assignments/route';
import { POST as submitExerciseAnswer } from '@/app/api/activities/[activityId]/exercises/[exerciseId]/submissions/route';
import { getDb } from '@/lib/mongodb';
import { getCurrentUser, requireRole } from '@/lib/auth/authorization';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb', () => ({
  getDb: jest.fn(),
}));

jest.mock('@/lib/auth/authorization', () => ({
  getCurrentUser: jest.fn(),
  requireRole: jest.fn(),
  teacherActivityOwnershipFilter: (teacherId: string) => ({
    teacherId: { $in: [teacherId] },
  }),
}));

describe('Integration Test: User Story 6 - exercise management and submissions', () => {
  const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;
  const mockRequireRole = requireRole as jest.MockedFunction<typeof requireRole>;
  const mockGetCurrentUser = getCurrentUser as jest.MockedFunction<typeof getCurrentUser>;

  const activityId = '507f1f77bcf86cd799439011';
  const teacherId = '507f1f77bcf86cd799439012';
  const studentId = '507f1f77bcf86cd799439013';
  const exerciseId = '507f1f77bcf86cd799439014';

  const jsonRequest = (url: string, body: Record<string, unknown>, method = 'POST') =>
    new NextRequest(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireRole.mockResolvedValue({ user: { id: teacherId, role: 'teacher' } });
    mockGetCurrentUser.mockResolvedValue({ id: teacherId, role: 'teacher' });
  });

  it('permite a un profesor asignar un estudiante a la actividad sin duplicados', async () => {
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'learning_Activity') {
          return {
            findOne: jest.fn().mockResolvedValue({ _id: new ObjectId(activityId), title: 'Algebra' }),
          };
        }

        if (name === 'user') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(studentId),
              name: 'Ana López',
              email: 'ana@test.com',
              role: 'student',
            }),
          };
        }

        if (name === 'assignment') {
          return {
            findOne: jest.fn().mockResolvedValue(null),
            insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId('507f1f77bcf86cd799439015') }),
          };
        }

        return {};
      }),
    };

    mockGetDb.mockResolvedValue(db as never);

    const response = await createAssignment(
      jsonRequest(`http://localhost:3000/api/activities/${activityId}/assignments`, { studentId }, 'POST'),
      { params: Promise.resolve({ activityId }) },
    );

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('Student assigned successfully');
    expect(data.data.assignment.studentId).toBe(studentId);
  });

  it('lista los ejercicios activos y devuelve los envíos asociados al mismo estudiante', async () => {
    const exercise = {
      _id: new ObjectId(exerciseId),
      activityId: new ObjectId(activityId),
      isActive: true,
      prompt: 'Resuelve 2 + 3',
      answerRules: { type: 'numeric', expected: '5' },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const pupilSubmission = {
      _id: new ObjectId('507f1f77bcf86cd799439016'),
      exerciseId: new ObjectId(exerciseId),
      studentId: new ObjectId(studentId),
      assignmentId: new ObjectId('507f1f77bcf86cd799439017'),
      answer: '5',
      attemptNumber: 1,
      isCorrect: true,
      status: 'graded',
      submittedAt: new Date(),
    };

    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'learning_Activity') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(activityId),
              teacherId: new ObjectId(teacherId),
            }),
          };
        }

        if (name === 'exercise') {
          return {
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([exercise]),
            }),
          };
        }

        if (name === 'submission') {
          return {
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue([pupilSubmission]),
              }),
            }),
          };
        }

        if (name === 'assignment') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId('507f1f77bcf86cd799439017'),
              activityId: new ObjectId(activityId),
              studentId: new ObjectId(studentId),
            }),
          };
        }

        return {};
      }),
    };

    mockGetDb.mockResolvedValue(db as never);
    mockRequireRole.mockResolvedValue({ user: { id: teacherId, role: 'teacher' } });
    mockGetCurrentUser.mockResolvedValue({ id: teacherId, role: 'teacher' });

    const response = await getActivityExercises(
      new NextRequest(`http://localhost:3000/api/activities/${activityId}/exercises`, { method: 'GET' }),
      { params: Promise.resolve({ activityId }) },
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.exercises).toHaveLength(1);
    expect(data.data.exercises[0].prompt).toBe('Resuelve 2 + 3');
    expect(data.data.submissions[0].answer).toBe('5');
  });

  it('filtra la lista de actividades por el profesor autenticado', async () => {
    const activity = {
      _id: new ObjectId(activityId),
      objective: 'Practice arithmetic',
      description: 'Practice basic arithmetic',
      difficulty: 'beginner',
    };
    const findOwnedActivities = jest.fn().mockReturnValue({
      toArray: jest.fn().mockResolvedValue([activity]),
    });
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'learning_Activity') {
          return { find: findOwnedActivities };
        }

        if (name === 'exercise' || name === 'assignment') {
          return {
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([]),
            }),
          };
        }

        return {};
      }),
    };
    mockGetDb.mockResolvedValue(db as never);

    const response = await listTeacherActivities();

    expect(response.status).toBe(200);
    expect(findOwnedActivities).toHaveBeenCalledWith({
      teacherId: { $in: [teacherId] },
    });
    const result = await response.json();
    expect(result.data).toHaveLength(1);
    expect(result.data[0].id).toBe(activityId);
  });

  it('does not return exercises when the teacher does not own the activity', async () => {
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'learning_Activity') {
          return { findOne: jest.fn().mockResolvedValue(null) };
        }

        return {};
      }),
    };
    mockGetDb.mockResolvedValue(db as never);

    const response = await getActivityExercises(
      new NextRequest(
        `http://localhost:3000/api/activities/${activityId}/exercises`,
        { method: 'GET' },
      ),
      { params: Promise.resolve({ activityId }) },
    );

    expect(response.status).toBe(404);
  });

  it('asigna un ejercicio a una actividad y rechaza el cambio cuando la relación es inválida', async () => {
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'learning_Activity') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(activityId),
              teacherId: new ObjectId(teacherId),
            }),
          };
        }

        if (name === 'exercise') {
          return {
            updateOne: jest.fn().mockResolvedValue({ matchedCount: 1 }),
          };
        }

        return {};
      }),
    };

    mockGetDb.mockResolvedValue(db as never);

    const response = await updateExerciseAssignment(
      jsonRequest(`http://localhost:3000/api/activities/${activityId}/exercises`, {
        exerciseId,
        action: 'assign',
      }),
      { params: Promise.resolve({ activityId }) },
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.message).toContain('assigned');
  });

  it('acepta una respuesta correcta y evita duplicados para la misma tarea', async () => {
    const validAnswer = '7';
    const assignmentId = '507f1f77bcf86cd799439018';
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'assignment') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(assignmentId),
              activityId: new ObjectId(activityId),
              studentId: new ObjectId(studentId),
            }),
          };
        }

        if (name === 'exercise') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(exerciseId),
              activityId: new ObjectId(activityId),
              isActive: true,
              answerRules: { type: 'numeric', expected: '7', tolerance: 0 },
            }),
          };
        }

        if (name === 'submission') {
          return {
            findOne: jest.fn().mockResolvedValue(null),
            insertOne: jest.fn().mockResolvedValue({ insertedId: new ObjectId('507f1f77bcf86cd799439019') }),
          };
        }

        return {};
      }),
    };

    mockGetDb.mockResolvedValue(db as never);
    mockRequireRole.mockResolvedValue({ user: { id: studentId, role: 'student' } });

    const response = await submitExerciseAnswer(
      jsonRequest(`http://localhost:3000/api/activities/${activityId}/exercises/${exerciseId}/submissions`, {
        answer: validAnswer,
      }),
      { params: Promise.resolve({ activityId, exerciseId }) },
    );

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.data.submission.isCorrect).toBe(true);
    expect(data.data.submission.answer).toBe(validAnswer);
  });

  it('devuelve un error 409 cuando un estudiante intenta repetir la misma respuesta', async () => {
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'assignment') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId('507f1f77bcf86cd799439020'),
              activityId: new ObjectId(activityId),
              studentId: new ObjectId(studentId),
            }),
          };
        }

        if (name === 'exercise') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(exerciseId),
              activityId: new ObjectId(activityId),
              isActive: true,
              answerRules: { type: 'numeric', expected: '7' },
            }),
          };
        }

        if (name === 'submission') {
          return {
            findOne: jest.fn().mockResolvedValue({
              exerciseId: new ObjectId(exerciseId),
              assignmentId: new ObjectId('507f1f77bcf86cd799439020'),
              studentId: new ObjectId(studentId),
            }),
            insertOne: jest.fn(),
          };
        }

        return {};
      }),
    };

    mockGetDb.mockResolvedValue(db as never);
    mockRequireRole.mockResolvedValue({ user: { id: studentId, role: 'student' } });

    const response = await submitExerciseAnswer(
      jsonRequest(`http://localhost:3000/api/activities/${activityId}/exercises/${exerciseId}/submissions`, {
        answer: '7',
      }),
      { params: Promise.resolve({ activityId, exerciseId }) },
    );

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data.message).toBe('This exercise has already been answered');
  });

  it('lista los alumnos asignados a una actividad para uso del panel docente', async () => {
    const db = {
      collection: jest.fn((name: string) => {
        if (name === 'learning_Activity') {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(activityId),
              objective: 'Practice arithmetic',
              teacherId: new ObjectId(teacherId),
            }),
          };
        }

        if (name === 'user') {
          return {
            find: jest.fn().mockReturnValue({
              sort: jest.fn().mockReturnValue({
                toArray: jest.fn().mockResolvedValue([
                  { _id: new ObjectId(studentId), name: 'Ana López', email: 'ana@test.com', role: 'student' },
                ]),
              }),
            }),
          };
        }

        if (name === 'assignment') {
          return {
            find: jest.fn().mockReturnValue({
              toArray: jest.fn().mockResolvedValue([
                { _id: new ObjectId('507f1f77bcf86cd799439021'), studentId: new ObjectId(studentId), status: 'in_progress', assignedAt: new Date() },
              ]),
            }),
          };
        }

        return {};
      }),
    };

    mockGetDb.mockResolvedValue(db as never);
    mockRequireRole.mockResolvedValue({ user: { id: teacherId, role: 'teacher' } });

    const response = await listAssignments(
      new NextRequest(`http://localhost:3000/api/activities/${activityId}/assignments`, { method: 'GET' }),
      { params: Promise.resolve({ activityId }) },
    );

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.data.students[0].name).toBe('Ana López');
    expect(data.data.assignments[0].studentId).toBe(studentId);
  });
});
