import { NextFunction, Request, Response } from 'express';
import Admin from '../models/Admin';
import MealModel, { Meal } from '../models/Meal';
import Sauce, { ISauce } from '../models/Sauce';

class PrivateAPIController {
  // State management
  public async fetchCurrentState(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const result: {
      saleState: boolean;
      sauceState?: [
        {
          name: string;
          state: boolean;
        }
      ];
      mealState?: [
        {
          name: string;
          state: boolean;
        }
      ];
    } = {
      saleState: req.app.locals.saleState,
    };
    const queries = ([Sauce.find(), MealModel.find()] as unknown) as [
      Promise<ISauce[]>,
      Promise<Meal[]>
    ];
    let sauces: ISauce[], meals: Meal[];

    try {
      [sauces, meals] = await Promise.all<ISauce[], Meal[]>(queries);
    } catch (err) {
      next(err);
    }

    sauces! &&
      sauces.forEach((sauce: ISauce) => {
        if (!result.sauceState)
          return (result.sauceState = [
            { name: sauce.name, state: sauce.available },
          ]);

        return result.sauceState.push({
          name: sauce.name,
          state: sauce.available,
        });
      });

    meals! &&
      meals.forEach((meal: Meal) => {
        if (!result.mealState)
          return (result.mealState = [
            { name: meal.name, state: meal.available },
          ]);

        return result.mealState.push({
          name: meal.name,
          state: meal.available,
        });
      });

    return res.status(200).json({
      status: 'OK',
      state: result,
    });
  }

  // Meal management
  public async createMeal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { title, price, category, description, thumb } = req.body;

    const newMeal: Meal = new MealModel({
      title,
      price,
      category,
      description,
      thumb,
    });

    try {
      await newMeal.save();
    } catch (err) {
      return next(err);
    }

    res.json({
      status: 'CREATED',
      message: 'Producto creado exitosamente',
      id: newMeal.id,
    });
    return;
  }

  public async updateMeal(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { id } = req.params;
    const { title, price, category, description, thumb } = req.body;

    const foundMeal = await MealModel.findById(id);

    if (!foundMeal) {
      res.json({
        status: 'NOT_FOUND',
        message: `No se encontro producto con id: ${id}`,
      });
      return;
    }

    foundMeal?.set({
      title: title || foundMeal.name,
      price: price || foundMeal.price,
      category: category || foundMeal.category,
      description: description || foundMeal.description,
      thumb: thumb || foundMeal.thumb,
    });

    try {
      await foundMeal?.save();
    } catch (err) {
      return next(err);
    }

    res.json({
      status: 'UPDATED',
      newProduct: foundMeal.toJSON(),
      id,
    });
  }

  public async updateMealAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { id } = req.params;
    const foundMeal = await MealModel.findById(id);

    if (!foundMeal) {
      res.json({
        status: 'NOT_FOUND',
        message: `No se encontro producto con id: ${id}`,
      });
      return;
    }

    foundMeal.available = !foundMeal?.available;

    try {
      await foundMeal?.save();
    } catch (err) {
      return next(err);
    }

    return res.json({
      status: 'UPDATED',
      availability: foundMeal?.available,
      id,
    });
  }

  // Sauce management
  public async createSauce(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { title } = req.body;

    const newSauce = new Sauce({
      title,
    });

    try {
      await newSauce.save();
    } catch (err) {
      return next(err);
    }

    res.json({
      status: 'CREATED',
      message: 'Salsa creada exitosamente',
      id: newSauce._id,
    });
    return;
  }

  public async updateSauce(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { id } = req.params;
    const { title } = req.body;
    const foundSauce = await Sauce.findById(id);

    if (!foundSauce) {
      res.json({
        status: 'NOT_FOUND',
        message: `No se encontro salsa con id: ${id}`,
      });
      return;
    }

    foundSauce!.name = title;

    try {
      await foundSauce?.save();
    } catch (err) {
      return next(err);
    }

    res.json({
      status: 'UPDATED',
      newSauce: foundSauce?.toJSON(),
      id,
    });
  }

  public async updateSauceAvailability(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { id } = req.params;
    const foundSauce = await Sauce.findById(id);

    if (!foundSauce) {
      res.json({
        status: 'NOT_FOUND',
        message: `No se encontro salsa con id: ${id}`,
      });
      return;
    }

    foundSauce!.available = !foundSauce?.available;

    try {
      await foundSauce?.save();
    } catch (err) {
      return next(err);
    }

    res.json({
      status: 'UPDATED',
      availability: foundSauce?.available,
      id,
    });
    return;
  }

  // User Management
  public async registerAdmin(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    console.log('register');
    const { user, pass, confirmPass } = req.body;

    if (pass !== confirmPass)
      return res.status(400).json({
        status: 'PASS_ERROR',
        message: `Las contraseñas no coinciden`,
      });

    if (await Admin.exists({ name: user.trim().toLowerCase() }))
      return res.json({
        status: 'USER_ERROR',
        message: `El nombre de usuario ya esta registrado`,
      });

    const newAdmin = new Admin({
      name: user,
      pass: pass,
    });

    try {
      await newAdmin.save();
    } catch (err) {
      next(err);
    }

    return res.json({
      status: 'CREATED',
      message: `Usuario ${user} fue registrado con exito`,
    });
  }
}

export default new PrivateAPIController();
