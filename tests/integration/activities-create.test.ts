/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";

import { POST } from "@/app/api/activities/route";
import { getCurrentUser } from "@/lib/auth/authorization";
import { getDb } from "@/lib/mongodb";

jest.mock("@/lib/auth/authorization", () => ({
    getCurrentUser: jest.fn(),
}));

jest.mock("@/lib/mongodb", () => ({
    getDb: jest.fn(),
}));

const mockedGetCurrentUser = getCurrentUser as jest.MockedFunction<
    typeof getCurrentUser
>;

const mockedGetDb = getDb as jest.MockedFunction<typeof getDb>;

type TestUser = Awaited<ReturnType<typeof getCurrentUser>> & {
    id: string;
    role: "teacher" | "student";
};

describe("POST /api/activities", () => {
    const teacherId = "teacher-123";

    const insertOne = jest.fn();
    const collection = jest.fn();

    function createRequest(body: Record<string, unknown>) {
        return new NextRequest(
            "http://localhost:3000/api/activities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            },
        );
    }

    beforeEach(() => {
        jest.clearAllMocks();

        mockedGetCurrentUser.mockResolvedValue({
            id: teacherId,
            name: "Test Teacher",
            email: "teacher@example.com",
            role: "teacher",
        } as TestUser);

        collection.mockReturnValue({
            insertOne,
        });

        mockedGetDb.mockResolvedValue({
            collection,
        } as unknown as Awaited<ReturnType<typeof getDb>>);

        insertOne.mockResolvedValue({
            acknowledged: true,
            insertedId: {
                toString: () => "activity-123",
            },
        });
    });

    test("creates a valid activity for an authenticated teacher", async () => {
        const request = createRequest({
            title: "Numerical Patterns",
            objective: "Identify patterns in numerical sequences",
            description:
                "Students identify and describe numerical patterns.",
            difficulty: "medium",
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(201);

        expect(data.message).toBe(
            "Activity created successfully.",
        );

        expect(data.activity).toMatchObject({
            id: "activity-123",
            title: "Numerical Patterns",
            objective: "Identify patterns in numerical sequences",
            description:
                "Students identify and describe numerical patterns.",
            difficulty: "medium",
            teacherId,
            status: "draft",
        });

        expect(insertOne).toHaveBeenCalledTimes(1);

        expect(insertOne).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "Numerical Patterns",
                objective:
                    "Identify patterns in numerical sequences",
                description:
                    "Students identify and describe numerical patterns.",
                difficulty: "medium",
                teacherId,
                status: "draft",
            }),
        );
    });

    test("rejects incomplete activity data", async () => {
        const request = createRequest({
            title: "Numerical Patterns",
            objective: "",
            description: "",
            difficulty: "medium",
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data.error).toBe(
            "Objective must contain at least 5 characters.",
        );

        expect(insertOne).not.toHaveBeenCalled();
    });

    test("rejects invalid difficulty", async () => {
        const request = createRequest({
            title: "Numerical Patterns",
            objective: "Identify patterns",
            description:
                "Students identify numerical patterns.",
            difficulty: "extreme",
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data.error).toBe(
            "Difficulty must be easy, medium, or hard.",
        );

        expect(insertOne).not.toHaveBeenCalled();
    });

    test("rejects unauthorized activity creation", async () => {
        mockedGetCurrentUser.mockResolvedValue(undefined);

        const request = createRequest({
            title: "Numerical Patterns",
            objective: "Identify patterns",
            description:
                "Students identify numerical patterns.",
            difficulty: "medium",
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe("Unauthorized.");

        expect(insertOne).not.toHaveBeenCalled();
    });

    test("rejects activity creation by a student", async () => {
        mockedGetCurrentUser.mockResolvedValue({
            id: "student-123",
            name: "Test Student",
            email: "student@example.com",
            role: "student",
        } as TestUser);

        const request = createRequest({
            title: "Numerical Patterns",
            objective: "Identify patterns",
            description:
                "Students identify numerical patterns.",
            difficulty: "medium",
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(403);

        expect(data.error).toBe(
            "Forbidden: teacher access required.",
        );

        expect(insertOne).not.toHaveBeenCalled();
    });
});