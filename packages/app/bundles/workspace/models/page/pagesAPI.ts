import { PageModel } from "./pagesModels";
import {CreateApi} from 'protolib/api'

export const PagesAPI = CreateApi('pages', PageModel, __dirname)
