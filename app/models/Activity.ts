import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodbtest";
import { Activity } from "@/types/activity.types";

const COLLECTION_NAME = "learning_Activity";

export const ActivityModel = {
  async findById(id: string) {
    const db = await getDb();
    return db.collection<Activity>(COLLECTION_NAME).findOne({
      _id: new ObjectId(id) as any,
    });
  },

  async findAll() {
    const db = await getDb();
    return db.collection<Activity>(COLLECTION_NAME).find().toArray();
  },

};