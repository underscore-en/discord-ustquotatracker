import { connect, model, Model, Mongoose, Schema, SchemaOptions } from 'mongoose';
import { configs } from '../configs';
import { SectionQuota } from '../entities/Ust/SectionQuota';
import { Resource, IResource } from '../ioc';
import { isProduction } from '../utils/env';

@Resource
export class MongoResource implements IResource {
    public connection?: Mongoose;

    public sectionQuotaModel!: Model<SectionQuota>;

    public async startup() {
        /**
         * Notes on mongoose:
         * The only purpose I can find in the internet about the purpose of the first arg of model is to infer the third arg.
         * But since migration, I must specify third arg anyway.
         * To be uniform just copy the classname by now until I've figure out why it exist.
         */
        const defaultSchemaOption: SchemaOptions = {
            versionKey: undefined,
        };

        this.sectionQuotaModel = model(
            "SectionQuota",
            new Schema<SectionQuota>(
                {
                    semester: { type: Schema.Types.Number },
                    classId: { type: Schema.Types.Number },
                    courseCode: { type: Schema.Types.String },
                    section: { type: Schema.Types.String },
                    quota: { type: Schema.Types.Number },
                },
                defaultSchemaOption,
            )
                .loadClass(SectionQuota)
                .index({ classId: 1 }),
            "sectionquotas",
        );

        // Connection should be done after registering all the models
        this.connection = await connect(configs.mongo.uri, {
            dbName: isProduction ? 'productionDB' : 'developmentDB',
            autoIndex: true,
            autoCreate: true,
            readConcern: { level: 'majority' },
            ignoreUndefined: true,
            connectTimeoutMS: 2000,
        });
    }
}
