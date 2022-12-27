import cors from '@koa/cors';
import Koa from 'koa';
import Router from 'koa-router';
import { Resource, IResource } from "../ioc";
import { errorHandlerMiddleware } from '../middlewares/errorHandlerMiddleware';

@Resource
export class KoaResource implements IResource {
    private app = new Koa();
    private router = new Router();

    private attachRoutes() {
        // root
        this.router.get('/', ctx => {
            ctx.body = 'hi auntie';
        });

        // gcp startup
        this.router.get('/_ah/warmup', async ctx => {
            ctx.body = { isSuccess: true };
        });

        return this;
    }

    public startup() {
        this.attachRoutes()
            .app
            .use(cors({
                origin: '*',
            }))
            .use(this.router.routes())
            .use(this.router.allowedMethods())
            .use(errorHandlerMiddleware)
            .listen(process.env.PORT);
    }
}
