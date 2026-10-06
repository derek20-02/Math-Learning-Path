import ActivitiesCard from "@/app/components/teacher/ActivitiesCard";
import { getActivitiesByTeacherId,getAllActivities } from "@/app/controllers/ActivityController";
//import { getServerSession } from 'next-auth';
//import { authOptions } from '@/lib/auth/auth'; // <-- Importan sus authOptions


export default async function Page() {
  
  /*
  const session = await getServerSession(authOptions);
 
  // 2. Extraen el ID del usuario
  const userId = (session?.user as any)?.id;

   if (!userId) {
    throw new Error('No estás autenticado');
  }
  */
  //const { activityId } = await params;
  const activityId = "66f000000000000000000001";

  //const res= await getAllActivities();
  const res= await getActivitiesByTeacherId(activityId); //FOR TEST
  
  //Se convierte la respuesta de la API a JSON para poder usarla en el componente ActivitiesCard
  const activities = await res.json();

  return <ActivitiesCard activities={activities} />

}