/**
 * @jest-environment node
 */

import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

import { PATCH } from "@/app/api/activities/[activityId]/route";
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

describe("PATCH /api/activities/[activityId]", () => {
    const activityId = new ObjectId().toString();
    const teacherId = "teacher-123";

    const findOne = jest.fn();
    const updateOne = jest.fn();
    const collection = jest.fn();

    function createContext(id = activityId) {
        return {
            params: Promise.resolve({
                activityId: id,
            }),
        };
    }

    function createRequest(body: Record<string, unknown>) {
        return new NextRequest(
            `http://localhost:3000/api/activities/${activityId}`,
            {
                method: "PATCH",
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
            findOne,
            updateOne,
        });

        mockedGetDb.mockResolvedValue({
            collection,
        } as unknown as Awaited<ReturnType<typeof getDb>>);
    });

    test("successfully edits an activity owned by the teacher", async () => {
        const existingActivity = {
            _id: new ObjectId(activityId),
            title: "Numerical Patterns",
            objective: "Identify numerical patterns",
            description:
                "Students identify and describe numerical patterns.",
            difficulty: "medium",
            teacherId,
            status: "draft",
        };

        const updatedActivity = {
            ...existingActivity,
            objective: "Recognize numerical patterns",
            description:
                "Students recognize and explain numerical patterns.",
            difficulty: "hard",
        };

        findOne
            .mockResolvedValueOnce(existingActivity)
            .mockResolvedValueOnce(updatedActivity);

        updateOne.mockResolvedValue({
            acknowledged: true,
            matchedCount: 1,
            modifiedCount: 1,
        });

        const request = createRequest({
            objective: "Recognize numerical patterns",
            description:
                "Students recognize and explain numerical patterns.",
            difficulty: "hard",
        });

        const response = await PATCH(request, createContext());
        const data = await response.json();

        expect(response.status).toBe(200);

        expect(data.message).toBe(
            "Activity updated successfully.",
        );

        expect(data.activity.objective).toBe(
            "Recognize numerical patterns",
        );

        expect(data.activity.description).toBe(
            "Students recognize and explain numerical patterns.",
        );

        expect(data.activity.difficulty).toBe("hard");

        expect(updateOne).toHaveBeenCalledTimes(1);
    });

    test("rejects update when no editable fields are provided", async () => {
        const request = createRequest({});

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data.error).toBe(
            "At least one activity field must be provided.",
        );

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects an invalid objective", async () => {
        const request = createRequest({
            objective: "",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data.error).toBe(
            "Objective must contain at least 5 characters.",
        );

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects an invalid description", async () => {
        const request = createRequest({
            description: "Short",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data.error).toBe(
            "Description must contain at least 10 characters.",
        );

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects invalid difficulty", async () => {
        const request = createRequest({
            difficulty: "extreme",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(400);

        expect(data.error).toBe(
            "Difficulty must be easy, medium, or hard.",
        );

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects an invalid activity ID", async () => {
        const request = createRequest({
            objective: "Recognize numerical patterns",
        });

        const response = await PATCH(
            request,
            createContext("activity-123"),
        );

        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Invalid activity ID.");

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("returns 404 when the activity does not exist", async () => {
        findOne.mockResolvedValueOnce(null);

        const request = createRequest({
            objective: "Recognize numerical patterns",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe("Activity not found.");

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects update when the authenticated user is a student", async () => {
        mockedGetCurrentUser.mockResolvedValue({
            id: "student-123",
            name: "Test Student",
            email: "student@example.com",
            role: "student",
        } as TestUser);

        const request = createRequest({
            objective: "Recognize numerical patterns",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(403);

        expect(data.error).toBe(
            "Forbidden: teacher access required.",
        );

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects update when teacher does not own the activity", async () => {
        findOne.mockResolvedValueOnce({
            _id: new ObjectId(activityId),
            title: "Another Teacher Activity",
            objective: "Identify numerical patterns",
            description:
                "Students identify and describe numerical patterns.",
            difficulty: "medium",
            teacherId: "different-teacher",
            status: "draft",
        });

        const request = createRequest({
            objective: "Recognize numerical patterns",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(403);

        expect(data.error).toBe(
            "Forbidden: you do not own this activity.",
        );

        expect(updateOne).not.toHaveBeenCalled();
    });

    test("rejects unauthenticated users", async () => {
        mockedGetCurrentUser.mockResolvedValue(undefined);

        const request = createRequest({
            objective: "Recognize numerical patterns",
        });

        const response = await PATCH(
            request,
            createContext(),
        );

        const data = await response.json();

        expect(response.status).toBe(401);
        expect(data.error).toBe("Unauthorized.");

        expect(updateOne).not.toHaveBeenCalled();
    });
});