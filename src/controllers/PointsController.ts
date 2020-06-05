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
      image:req.file.filename,
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
      })

   const  point = {
      id: insertedId[0],
      image:`http://192.168.1.101:3333/uploads/${req.file.filename}`,
      name, 
      email,
      whatsapp,
      latitude,
      longitude,
      uf,
      city,
    }
    const point_id = insertedId[0];

    const pointItems = items
      .split(',')
      .map( (item: string ) => Number(item.trim() ) )
      .map( (item_id: number) => {
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
    console.log(req)
    const parsedItems = String(items).split(',')
                                     .map( item => Number(item.trim() ))
    const points = await knex('points')
                  .join('point_items','point_items.point_id', '=', 'points.id')  
                  .whereIn('point_items.item_id', parsedItems)
                  .where('uf', String(uf))
                  .where('city', String(city))
                  .distinct()
                  .select('points.*')

    const serializedPoints = points.map( point => {
      return {
        ...point,
        image:`http://192.168.1.101:3333/uploads/${point.image}`
      }
    })


    return res.json(serializedPoints);
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

    const serializedPoint = {
        ...point,
        image:`http://192.168.1.101:3333/uploads/${point.image}`
      }

    return res.json({serializedPoint, items})
  }
}

export default PointsController