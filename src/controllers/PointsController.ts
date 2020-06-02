import knex from '../database/connection';
import {Request, Response} from 'express'

class PointsController {
  async create(req: Request, res: Response)
  {
    const { name, 
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
      items } = req.body

    const trx = await knex.transaction()

    const insertedId =  await trx('points').insert({ 
      image:'image-fake', 
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
      })

    const point_id = insertedId[0];

    const pointItems = items.map( (item_id: number) => {
      return {
        item_id,
        point_id
      }
    })

    await trx('point_items').insert(pointItems)

    return res.json({
      success:true
    })
  }

  async index(req: Request, res: Response)
  {
    const points = await knex('points').select('*')  

    return res.json(points);
  }
}

export default PointsController