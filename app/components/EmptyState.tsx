export default function EmptyState({ message = 'No hay datos disponibles' }: { message?: string }) {
    return (
        <div className="p-8 text-center text-gray-500 border border-dashed border-gray-300 rounded-lg my-4">
            <p>{message}</p>
        </div>
    );
}