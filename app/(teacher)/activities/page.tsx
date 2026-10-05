import ActivitiesCard from "@/app/components/teacher/ActivitiesCard";
import { getActivitiesByTeacherId,getAllActivities } from "@/app/controllers/ActivityController";

export default async function Page({ params }: { params: Promise<{ activityId: string }> }) {
  const { activityId } = await params;

  //const res= await getAllActivities();
  const res= await getActivitiesByTeacherId("66f000000000000000000001"); //FOR TEST
  
  //Se convierte la respuesta de la API a JSON para poder usarla en el componente ActivitiesCard
  const activities = await res.json();

  return <ActivitiesCard activities={activities} />

}