import { NextResponse } from "next/server";
import { ActivityModel } from "@/app/models/Activity";
import { ObjectId } from "mongodb";

export async function getActivityById(id: string) {
    if (!ObjectId.isValid(id)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const activity = await ActivityModel.findById(id);

    if (!activity) {
        return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }

    return NextResponse.json(activity, { status: 200 });
}

export async function getAllActivities() {
    const allActivitys = await ActivityModel.findAll();
    return NextResponse.json(allActivitys, { status: 200 });
}
