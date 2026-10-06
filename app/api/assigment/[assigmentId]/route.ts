import { NextRequest } from "next/server";
import { getAssigmentById } from "@/app/controllers/AssigmentController";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assigmentId: string }> }
) {
  const { assigmentId } = await params;
  return getAssigmentById(assigmentId);
}