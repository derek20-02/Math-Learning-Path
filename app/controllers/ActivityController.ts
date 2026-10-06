import { NextResponse } from "next/server";
import { ActivityModel } from "@/app/models/Activity";
import { ObjectId } from "mongodb";

export async function getActivityById(activitysId: string) {
    if (!ObjectId.isValid(activitysId)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const activity = await ActivityModel.findById(activitysId);

    
    if (!activity) {
        return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json(activity, { status: 200 });
}


export async function getActivitiesByTeacherId(activitysId: string) {
    if (!ObjectId.isValid(activitysId)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const activitiesByTeacherId = await ActivityModel.findByTeacherId(activitysId);
    
        
    if (!activitiesByTeacherId) {
        return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json(activitiesByTeacherId, { status: 200 });
}



export async function getAllActivities() {
    const allActivitys = await ActivityModel.findAll();
    return NextResponse.json(allActivitys, { status: 200 });
}
