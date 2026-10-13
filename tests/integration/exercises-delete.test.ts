/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

import { DELETE } from "@/app/api/exercises/[exerciseId]/route";
import { getDb } from "@/lib/mongodb";
import { requireRole } from "@/lib/auth/authorization";

jest.mock("@/lib/mongodb", () => ({
  getDb: jest.fn(),
}));

jest.mock("@/lib/auth/authorization", () => ({
  requireRole: jest.fn(),
  teacherActivityOwnershipFilter: (teacherId: string) => ({
    teacherId: { $in: [teacherId] },
  }),
}));

describe("DELETE /api/exercises/[exerciseId]", () => {
  const mockGetDb = getDb as jest.MockedFunction<typeof getDb>;
  const mockRequireRole = requireRole as jest.MockedFunction<typeof requireRole>;
  const exerciseId = "507f1f77bcf86cd799439014";
  const activityId = "507f1f77bcf86cd799439011";
  const teacherId = "507f1f77bcf86cd799439012";

  function createRequest() {
    return new NextRequest(`http://localhost:3000/api/exercises/${exerciseId}`, {
      method: "DELETE",
    });
  }

  function createDatabase({
    activity,
    submission = null,
    deletedCount = 1,
  }: {
    activity: object | null;
    submission?: object | null;
    deletedCount?: number;
  }) {
    const deleteOne = jest.fn().mockResolvedValue({ deletedCount });
    const db = {
      collection: jest.fn((name: string) => {
        if (name === "exercise") {
          return {
            findOne: jest.fn().mockResolvedValue({
              _id: new ObjectId(exerciseId),
              activityId: new ObjectId(activityId),
            }),
            deleteOne,
          };
        }

        if (name === "learning_Activity") {
          return { findOne: jest.fn().mockResolvedValue(activity) };
        }

        if (name === "submission") {
          return {
            findOne: jest.fn().mockResolvedValue(submission),
          };
        }

        return {};
      }),
    };

    return { db, deleteOne };
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequireRole.mockResolvedValue({
      user: { id: teacherId, role: "teacher" },
    });
  });

  it("deletes an exercise owned by the teacher when it has no submissions", async () => {
    const { db, deleteOne } = createDatabase({
      activity: { _id: new ObjectId(activityId) },
    });
    mockGetDb.mockResolvedValue(db as never);

    const response = await DELETE(createRequest(), {
      params: Promise.resolve({ exerciseId }),
    });

    expect(response.status).toBe(200);
    expect(deleteOne).toHaveBeenCalledWith({
      _id: new ObjectId(exerciseId),
      activityId: new ObjectId(activityId),
    });
  });

  it("preserves exercises that already have student submissions", async () => {
    const { db, deleteOne } = createDatabase({
      activity: { _id: new ObjectId(activityId) },
      submission: { _id: new ObjectId() },
    });
    mockGetDb.mockResolvedValue(db as never);

    const response = await DELETE(createRequest(), {
      params: Promise.resolve({ exerciseId }),
    });

    expect(response.status).toBe(409);
    expect(deleteOne).not.toHaveBeenCalled();
  });

  it("does not delete exercises from another teacher's activity", async () => {
    const { db, deleteOne } = createDatabase({ activity: null });
    mockGetDb.mockResolvedValue(db as never);

    const response = await DELETE(createRequest(), {
      params: Promise.resolve({ exerciseId }),
    });

    expect(response.status).toBe(404);
    expect(deleteOne).not.toHaveBeenCalled();
  });

  it("rejects an invalid exercise ID", async () => {
    const response = await DELETE(
      new NextRequest("http://localhost:3000/api/exercises/invalid", {
        method: "DELETE",
      }),
      { params: Promise.resolve({ exerciseId: "invalid" }) },
    );

    expect(response.status).toBe(400);
    expect(mockGetDb).not.toHaveBeenCalled();
  });
});
