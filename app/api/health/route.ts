import { getDb } from "@/lib/mongodb";

//Funcion para probar el estado de conexión de base de datos
//path de prueba api/health
export async function GET() {
  try {
    await getDb(); 
    return Response.json({ message: "The connection is ready", status: 200});
  } catch (error) {
    console.error("Health check falló:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}