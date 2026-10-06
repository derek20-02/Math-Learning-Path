import { NextResponse } from "next/server";
import { AssigmentModel } from "@/app/models/Assigment";
import { ObjectId } from "mongodb";

export async function getAssigmentById(assigmentId: string) {
    if (!ObjectId.isValid(assigmentId)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const assigment = await AssigmentModel.findById(assigmentId);

    
    if (!assigment) {
        return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json(assigment, { status: 200 });
}


export async function getAssigmentByStudentId(studentId: string) {
    if (!ObjectId.isValid(studentId)) {
        return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }
    const assigment = await AssigmentModel.findAssigmentByStudentId(studentId);

    
    if (!assigment) {
        return NextResponse.json({ error: "No encontrada" }, { status: 404 });
    }
    return NextResponse.json(assigment, { status: 200 });
}


export async function getAllAssigments() {
    const allAssigments = await AssigmentModel.findAll();
    return NextResponse.json(allAssigments, { status: 200 });
}
