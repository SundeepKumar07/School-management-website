// GET /api/attendence?lessonId=1&date=2025-09-12
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lessonId = Number(searchParams.get("lessonId"));
  const date = new Date(searchParams.get("date") as string);

  const attendances = await prisma.attendence.findMany({
    where: { lessonId, date },
  });

  return NextResponse.json(attendances);
}