import {NotesAPI} from './notes/notesAPI'
import { ProductsAPI } from './workspace/models/product/productsAPI'

export default (app) => {
    NotesAPI(app)
    ProductsAPI(app)
}