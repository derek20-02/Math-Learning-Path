import { NextRequest, NextResponse } from "next/server";
import {getActivityById} from "@/app/controllers/ActivityController"

// GET /api/activitys/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const {id} = await params;
  return getActivityById(id);
}