import { ProductSchema, ProductType } from "./productsSchemas"
import { SessionDataType } from 'protolib/api/lib/session'
import { ProtoModel, ProtoCollection } from 'protolib/base'

export class ProductModel extends ProtoModel<ProductModel> {
    constructor(data: ProductType, session?: SessionDataType) {
        super(data, session);
    }

    protected static _newInstance(data: any, session?: SessionDataType): ProductModel {
        return new ProductModel(data, session);
    }

    validate(): this {
        ProductSchema.parse(this.data); //validate
        return this;
    }
}

export class ProductCollection extends ProtoCollection<ProductModel> {
    constructor(models: ProductModel[]) {
        super(models)
    }
}