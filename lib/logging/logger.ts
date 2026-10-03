export const logger = {
    info(message: string, meta?: Record<string, any>) {
        console.log(
            JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'info',
                message,
                ...meta,
            })
        );
    },
    error(message: string, meta?: Record<string, any>) {
        console.error(
            JSON.stringify({
                timestamp: new Date().toISOString(),
                level: 'error',
                message,
                ...meta,
            })
        );
    },
};