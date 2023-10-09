import { NoteSchema, NoteType } from "./notesSchemas"
import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel, ProtoCollection } from 'protolib/base'

export class PageModel extends ProtoModel<PageModel> {
  constructor(data: PageType, session?: SessionDataType) {
    super(data, session);
  }

  protected static _newInstance(data: any, session?: SessionDataType): PageModel {
    return new PageModel(data, session);
  }

  validate(): this {
    NoteSchema.parse(this.data); //validate
    return this;
  }
}

export class NoteCollection extends ProtoCollection<PageModel> {
  constructor(models: PageModel[]) {
    super(models)
  }
}