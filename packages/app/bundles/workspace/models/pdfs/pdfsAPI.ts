import { PdfModel } from "./pdfsModels";
import {CreateApi} from 'protolib/api'

export const PdfsAPI = CreateApi('pdfs', PdfModel, __dirname)
