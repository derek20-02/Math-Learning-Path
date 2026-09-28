import { NextRequest, NextResponse } from "next/server";
import {getActivityById} from "@/app/controllers/ActivityController"

// GET /api/activitys/[activitysId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ activitysId: string }> }
) {
  const {activitysId} = await params;
  return getActivityById(activitysId);
}