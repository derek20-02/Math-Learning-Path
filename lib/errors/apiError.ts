export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message);
    }
}

export function handleApiError(error: unknown) {
    if (error instanceof ApiError) {
        return Response.json({ error: error.message }, { status: error.statusCode });
    }
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
}