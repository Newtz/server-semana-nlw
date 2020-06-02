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

   const  point = {
      image:'image-fake', 
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
    }
    const point_id = insertedId[0];

    const pointItems = items.map( (item_id: number) => {
      return {
        item_id,
        point_id
      }
    })

    await trx('point_items').insert(pointItems)

    await trx.commit();

    return res.json({
      point
    })
  }

  async index(req: Request, res: Response)
  {
    const { uf, city, items } = req.query
    const parsedItems = String(items).split(',')
                                     .map( item => Number(item.trim() ))
    const points = await knex('points')
                  .join('point_items','point_items.point_id', '=', 'points.id')  
                  .whereIn('point_items.item_id', parsedItems)
                  .where('uf', String(uf))
                  .where('city', String(city))
                  .distinct()
                  .select('points.*')


    return res.json(points);
  }

  async show(req: Request, res: Response)
  {
    const {point_id} = req.params
    const point = await knex('points').where('id', point_id).first()
    const items = await knex('items')
                        .join('point_items', 'point_items.item_id', '=', 'items.id')
                        .where('point_items.point_id', point_id).select('items.title')

    if(!point)
    {
      res.status(400).json({
        error:'Point not Found'
      })
    }

    return res.json({point, items})
  }
}

export default PointsController