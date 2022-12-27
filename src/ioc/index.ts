import { injectable } from 'inversify';

export type TCtor<T = any> = new (...args: any) => T;

export const propertyKeys = {
    controllers: Symbol('Controllers'),
    resource: Symbol('Resource'),
    services: Symbol('Services'),
    command: Symbol('Command'),
    cron: Symbol('Cron'),
};

export const Resource: ClassDecorator = target => {
    const key = propertyKeys.resource;
    const serviceSet: any[] = Reflect.getMetadata(key, global) ?? [];
    serviceSet.push(target);
    Reflect.defineMetadata(key, serviceSet, global);
    return injectable()(target as any);
};

export interface IResource {
    startup(): any,
}

export const Service: ClassDecorator = target => {
    const key = propertyKeys.services;
    const serviceSet: any[] = Reflect.getMetadata(key, global) ?? [];
    serviceSet.push(target);
    Reflect.defineMetadata(key, serviceSet, global);
    return injectable()(target as any);
};
