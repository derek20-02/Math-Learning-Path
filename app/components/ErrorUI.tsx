interface ErrorProps {
    message?: string;
    retry?: () => void;
}

export default function ErrorUI({ message = 'Ha ocurrido un error inesperado', retry }: ErrorProps) {
    return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 my-4 text-center">
            <p className="font-semibold">{message}</p>
            {retry && (
                <button
                    onClick={retry}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Reintentar
                </button>
            )}
        </div>
    );
}