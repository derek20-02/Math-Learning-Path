import { NextRequest } from "next/server";
import { PATCH } from "@/app/api/activities/[activityId]/route";

describe("PATCH /api/activities/[activityId]", () => {
    const activityId = "activity-123";

    function createContext() {
        return {
            params: Promise.resolve({ activityId }),
        };
    }

    test("accepts valid activity update data", async () => {
        const request = new NextRequest(
            `http://localhost:3000/api/activities/${activityId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: "Recognize numerical patterns",
                    description:
                        "Students recognize and explain numerical patterns.",
                    difficulty: "hard",
                }),
            },
        );

        const response = await PATCH(request, createContext());
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.activityId).toBe(activityId);
        expect(data.updates).toEqual({
            objective: "Recognize numerical patterns",
            description:
                "Students recognize and explain numerical patterns.",
            difficulty: "hard",
        });
    });

    test("rejects update when no editable fields are provided", async () => {
        const request = new NextRequest(
            `http://localhost:3000/api/activities/${activityId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({}),
            },
        );

        const response = await PATCH(request, createContext());
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
            "At least one activity field must be provided.",
        );
    });

    test("rejects an empty objective", async () => {
        const request = new NextRequest(
            `http://localhost:3000/api/activities/${activityId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: "",
                }),
            },
        );

        const response = await PATCH(request, createContext());
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe("Objective cannot be empty.");
    });

    test("rejects invalid difficulty", async () => {
        const request = new NextRequest(
            `http://localhost:3000/api/activities/${activityId}`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    difficulty: "extreme",
                }),
            },
        );

        const response = await PATCH(request, createContext());
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
            "Difficulty must be easy, medium, or hard.",
        );
    });

    test.skip("rejects update when the authenticated user is a student", async () => {
        // TODO:
        // Enable after the shared authentication foundation is merged.
        //
        // Expected final behavior:
        // 1. Mock the authenticated user with role "student".
        // 2. Send a valid PATCH request.
        // 3. Verify that the API rejects the update.
        // 4. Expected HTTP status: 403 Forbidden.
    });

    test.skip("rejects update when teacher does not own the activity", async () => {
        // TODO:
        // Enable after authentication and database persistence are integrated.
        //
        // The authenticated teacher must only be able to update
        // activities where activity.teacherId matches the teacher's ID.
    });
});