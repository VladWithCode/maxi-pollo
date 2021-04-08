import { NextFunction, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import {
  calculateSalePrice,
  createSaleContents,
  createSaleMailHTML,
  createSaleMailText,
  getMealIDArray,
  getSauceIDArray,
} from '../functions/helpers';
import {
  CLIENT_ID,
  CLIENT_SECRET,
  REFRESH_TOKEN,
  oAuth2Client,
} from '../config/oauth';
import MealModel, { Meal } from '../models/Meal';
import Sale, { ISale } from '../models/Sale';
import Sauce, { ISauce } from '../models/Sauce';

class PublicAPIController {
  public getSaleState(
    req: Request,
    res: Response,
    next: NextFunction
  ): void | Response {
    return res.json({
      status: 'OK',
      state: req.app.locals.saleState,
    });
  }

  public async fetchMeals(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const category: string = req.query.category as string;

    let foundMeals: Meal[];

    if (category && category.length > 0) {
      foundMeals = await MealModel.find({ category: category }).sort({
        price: 1,
      });
    } else {
      foundMeals = await MealModel.find().sort({ price: 1 });
    }

    if (foundMeals && !foundMeals.length) {
      if (category !== undefined || category !== null) {
        return res.json({
          status: 'NO_CONTENT',
          message: `No se han encontrado productos disponibles con categoria: ${category}`,
        });
      }

      return res.json({
        status: 'NO_CONTENT',
        message: `No se han encontrado productos disponibles.`,
      });
    }

    return res.json({
      status: 'OK',
      message: `Se han encontrado ${
        foundMeals!.length
      } documentos con categoria "${category}"`,
      meals: foundMeals?.map((meal) => meal.toJSON()),
    });
  }

  public async fetchSauces(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const foundSauces = await Sauce.find(
      { available: true },
      { name: true, available: true }
    );

    if (foundSauces && !foundSauces.length) {
      return res.json({
        status: 'NOT_FOUND',
        message: `No se han encontrado salsas disponibles`,
      });
    }

    return res.json({
      status: 'OK',
      message: `Se han encontrado ${foundSauces.length} salsas disponibles.`,
      sauces: foundSauces.map((sauce) => sauce.toJSON()),
    });
  }

  public async initSale(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const { contents, customer, payMeth } = req.body;

    const sauceIds = getSauceIDArray(contents);
    const mealIds = getMealIDArray(contents);

    let queries = ([
      MealModel.find({ _id: mealIds }),
      Sauce.find({ _id: sauceIds }),
    ] as unknown) as [Promise<Meal[]>, Promise<ISauce[]>];

    const [meals, sauces] = await Promise.all<Meal[], ISauce[]>(queries);
    const saleContents = createSaleContents(contents, meals, sauces);

    const newSale = new Sale({
      customer: {
        name: customer.clientname,
        phone: customer.phone,
      },
      address: {
        street: customer.street,
        extNumber: customer.extnumber,
        nbHood: customer.nbhood,
        postalCode: customer.postalcode,
        intNumber: customer.intnumber || null,
        refs: customer.refs || null,
      },
      content: {
        items: saleContents,
      },
      paymentMethod: payMeth || 'Efectivo',
      subtotal: calculateSalePrice(saleContents),
    });

    try {
      await newSale.save();
    } catch (err) {
      console.log(err);
      return res.json({
        status: 'SAVE_ERROR',
        message: `Ha ocurrido un error al guardar la compra en la base de datos.
        ${err.message || ''}`,
        err,
      });
    }

    return res.json({
      status: 'OK',
      message: 'Sale initialized',
      sale: newSale.toJSON(),
    });
  }

  public async confirmSale(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void | Response> {
    const saleId: string = req.body.id as string;

    const saleQuery = Sale.findById(saleId);
    const accessTokenQuery = oAuth2Client.getAccessToken();

    const [sale, accessToken] = await Promise.all([
      saleQuery,
      accessTokenQuery,
    ]);

    if (!sale) {
      return res.json({
        status: 'SALE_NOT_FOUND',
        message: 'No se pudo encontrar una venta con este id',
      });
    }

    sale!.state = 'confirmed';
    sale!.confirmedAt = Date.now();

    try {
      await sale.save();
    } catch (err) {
      console.log(err);
      return res.json({
        status: 'SAVE_ERROR',
        message:
          err.message ||
          'Ocurrio un error al intentar actualizar la base de datos',
        err,
      });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'vladwithcode@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'MAXIPollo | <vladwithcode@gmail.com>',
      to: process.env.CONTACT_MAIL || 'vladwithb@gmail.com',
      subject: 'Se ha recibido un nuevo pedido',
      text: createSaleMailText(sale),
      html: createSaleMailHTML(sale),
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.log(err);
      return res.json({
        status: 'MAIL_ERROR',
        message:
          'Se ha completado la venta, pero no ha sido posible enviar el correo electronico.',
        err,
      });
    }

    return res.json({
      status: 'OK',
    });
  }
}

export default new PublicAPIController();
