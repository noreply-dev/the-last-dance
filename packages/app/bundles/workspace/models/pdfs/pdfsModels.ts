import { PdfSchema, PdfType } from "./pdfsSchemas"
import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel, ProtoCollection } from 'protolib/base'

export class PdfModel extends ProtoModel<PdfModel> {
    constructor(data: PdfType, session?: SessionDataType) {
        super(data, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): PdfModel {
        return new PdfModel(data, session);
    }

    validate(): this {
        PdfSchema.parse(this.data); //validate
        return this;
    }
}

export class PdfCollection extends ProtoCollection<PdfModel> {
    constructor(models: PdfModel[]) {
        super(models)
    }
}