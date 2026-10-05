import ActivitiesDetailsCard from "@/app/components/teacher/ActivityDetailsCard";
import { getActivityById } from "@/app/controllers/ActivityController";

export default async function Page({ params }: { params: Promise<{ activityId: string }> }) {

  const { activityId } = await params;
  
  const res = await getActivityById(activityId);
  //Se convierte la respuesta de la API a JSON para poder usarla en el componente ActivitiesCard
  const activity = await res.json();
  
  return <ActivitiesDetailsCard activity={activity} />

}