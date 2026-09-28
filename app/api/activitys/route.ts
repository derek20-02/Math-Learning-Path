import { NextRequest } from "next/server";
import { getAllActivities } from "@/app/controllers/ActivityController";

export async function GET() {
  return getAllActivities();
}
