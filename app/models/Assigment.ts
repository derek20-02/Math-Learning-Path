import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodbtest";
import { Assigment } from "@/types/assigment.types";

const COLLECTION_NAME = "assignment";

export const AssigmentModel = {
    async findById(id: string) {
        const db = await getDb();
        return db.collection<Assigment>(COLLECTION_NAME).findOne({
            _id: new ObjectId(id) as any,
        });
    },


      async findAssigmentByStudentId(studentId: string) {
        const db = await getDb();
        return db
          .collection<Assigment>(COLLECTION_NAME)
          //.find({ studentId }) 
          .find({
            studentId: { $in: [studentId, new ObjectId(studentId)] } as any,
          }) //PARA PRUEBAS
          .toArray();
      },

    async findAll() {
        const db = await getDb();
        return db.collection<Assigment>(COLLECTION_NAME).find().toArray();
    },
}