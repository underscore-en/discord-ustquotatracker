import 'reflect-metadata';
import { interfaces } from 'inversify';
import { container } from './ioc/container';
import { configs, TConfigs } from './configs';
import { propertyKeys, IResource } from './ioc';
import { DiscordController } from './controllers/DiscordController';
import { UstController } from './controllers/UstController';
import { MongoResource } from './resources/MongoResource';
import { DiscordResource } from './resources/DiscordResource';
import { CronJobResource } from './resources/CronJobResource';
import { DiscordService } from './services/DiscordService';
import { KoaResource } from './resources/KoaResource';

export class Server {
    public hasInitialized = false;
    public container = container;

    // resource startup sequence
    private resources: interfaces.ServiceIdentifier<IResource>[] = [
        KoaResource, // no dependence
        MongoResource,
        DiscordResource, // may depend on mongoResource
        CronJobResource, // depends on discordResource
    ];

    private controller = [
        DiscordController,
        UstController,
    ];

    constructor() {
        // pass
    }

    private consoleLog(...args: any[]) {
        console.log(...args);
    }

    public async start() {
        if (!this.hasInitialized) {
            // the line below was important once, but i forgot why.
            this.hasInitialized = true;

            // bind items to container
            this.bindContainerItems();
            this.consoleLog("STARTUP: bindContainerItems() complete.");

            // startup resources
            for (const _resource of this.resources) {
                const resource = await this.container.get<IResource>(_resource);
                await resource.startup();
                this.consoleLog(`STARTUP: ${(_resource as any).name} initialized.`);
            }
        }
        console.log("READY");
    }

    private bindContainerItems() {
        this.container.bind('Configs').toConstantValue(configs);

        const resourceSet: interfaces.Newable<any>[] = Reflect.getMetadata(propertyKeys.resource, global);
        resourceSet.forEach(ctor => {
            this.container.bind(ctor).toSelf().inSingletonScope();
        });

        const serviceSet: interfaces.Newable<any>[] = Reflect.getMetadata(propertyKeys.services, global);
        serviceSet.forEach(ctor => {
            this.container.bind(ctor).toSelf().inRequestScope();
        });

        // string literal binds
        this.container.bind("DiscordService").to(DiscordService).inRequestScope();
        this.container.bind("DiscordController").to(DiscordController).inRequestScope();
        this.container.bind("UstController").to(UstController).inRequestScope();

        return this;
    }

    // for tests
    public getService<T>(service: interfaces.Newable<T>) {
        return this.container.get(service);
    }

    public getConfigs<T>(): TConfigs {
        return this.container.get('Configs');
    }
}
