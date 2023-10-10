import { ProductModel } from "./productsModels";
import {CreateApi} from 'protolib/api'

export const ProductsAPI = CreateApi('products', ProductModel, __dirname)
