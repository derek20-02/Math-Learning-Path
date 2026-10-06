import { NextRequest, NextResponse } from "next/server";
import {getAssigmentById} from "@/app/controllers/AssigmentController"

// GET /api/assigments/[assigmentId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ assigmentId: string }> }
) {
  const {assigmentId} = await params;
  return   (assigmentId);
}