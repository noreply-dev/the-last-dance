import { NoteSchema, NoteType } from "./notesSchemas"
import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel, ProtoCollection } from 'protolib/base'

export class ProductModel extends ProtoModel<ProductModel> {
  constructor(data: NoteType, session?: SessionDataType) {
    super(data, session);
  }

  protected static _newInstance(data: any, session?: SessionDataType): NoteModel {
    return new NoteModel(data, session);
  }

  validate(): this {
    NoteSchema.parse(this.data); //validate
    return this;
  }
}

export class NoteCollection extends ProtoCollection<NoteModel> {
  constructor(models: NoteModel[]) {
    super(models)
  }
}