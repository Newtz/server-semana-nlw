import express from 'express'
import multer from 'multer'
import multerConfig from '../src/config/muter'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'
import { celebrate } from 'celebrate'
import { firstArgument,secondArgument} from '../src/Validators/createPointValidator'

const upload = multer(multerConfig)
const routes = express.Router()
const pointsController = new PointsController
const itemsController = new ItemsController

routes.get('/items', itemsController.index)

routes.post(
  '/points', 
  upload.single('image'),
  celebrate(firstArgument, secondArgument), 
  pointsController.create)

routes.get('/points/:point_id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes