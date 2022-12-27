import { Context, Middleware, Next } from "koa";

export const errorHandlerMiddleware: Middleware = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof Error) {
            ctx.status = 500;
            ctx.body = {
                isError: true,
                message: 'Interal Server Error.',
            };
        }
        ctx.status = 500;
        ctx.body = {
            isError: true,
            message: 'What the fuck.',
        };
    }
    return ctx;
};
