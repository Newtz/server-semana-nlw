import express from 'express'
import multer from 'multer'
import multerConfig from '../src/config/muter'
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'
import { celebrate, Joi } from 'celebrate'

const upload = multer(multerConfig)
const routes = express.Router()
const pointsController = new PointsController
const itemsController = new ItemsController

routes.get('/items', itemsController.index)

routes.post(
  '/points', 
  upload.single('image'),
  celebrate({
      body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitude: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
      })
    }, {
      abortEarly:false
    }), 
  pointsController.create)

routes.get('/points/:point_id', pointsController.show)
routes.get('/points', pointsController.index)

export default routes