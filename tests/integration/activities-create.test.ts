import { NextRequest } from "next/server";
import { POST } from "@/app/api/activities/route";

describe("POST /api/activities", () => {
    test("accepts valid activity data", async () => {
        const request = new NextRequest(
            "http://localhost:3000/api/activities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: "Identify patterns in numerical sequences",
                    description:
                        "Students identify and describe numerical patterns.",
                    difficulty: "medium",
                }),
            },
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.activity).toEqual({
            objective: "Identify patterns in numerical sequences",
            description:
                "Students identify and describe numerical patterns.",
            difficulty: "medium",
        });
    });

    test("rejects incomplete activity data", async () => {
        const request = new NextRequest(
            "http://localhost:3000/api/activities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: "",
                    description: "",
                    difficulty: "medium",
                }),
            },
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
            "Objective and description are required.",
        );
    });

    test("rejects invalid difficulty", async () => {
        const request = new NextRequest(
            "http://localhost:3000/api/activities",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    objective: "Identify patterns",
                    description: "Students identify numerical patterns.",
                    difficulty: "extreme",
                }),
            },
        );

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe(
            "Difficulty must be easy, medium, or hard.",
        );
    });

    test.skip("rejects unauthorized activity creation", async () => {
        // TODO:
        // Enable this test after the shared authentication foundation
        // is merged and POST /api/activities uses teacher authorization.
        //
        // Expected behavior:
        // - unauthenticated request is rejected
        // - response status should be 401
    });
});