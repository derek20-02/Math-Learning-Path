import { NextRequest } from "next/server";
import { getAllAssigments } from "@/app/controllers/AssigmentController";

export async function GET() {
  return getAllAssigments();
}
