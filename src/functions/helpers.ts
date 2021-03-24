import { NextFunction, Request, Response } from 'express';
import { Meal } from '../models/Meal';
import { ISale, ISaleItem } from '../models/Sale';
import { ISauce } from '../models/Sauce';

/* General Purpouse */
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const priceToString = (p: Number): String => {
  let [pInts, pDecs] = p.toFixed(2).split('.');

  return `${(+pInts).toLocaleString()}.${pDecs || '00'}`;
};

/* Auth */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/login');
};

/* Sales */

/**
 * Get the sauces' ids for each item containing one
 *
 * @param sauceItems - The array of sauce-containing items (mostly chicken type meals)
 * @returns An array of IDs of the sauces stored in the DB
 */
export const getSauceIDArray = (sauceItems: any[]): string[] => {
  const idArray: string[] = [];

  sauceItems.forEach((i: any) => {
    if (!i.sauce || i.sauce.length <= 0) return;

    if (idArray.indexOf(i.sauce) >= 0) return;

    idArray.push(i.sauce);
  });

  return idArray;
};

/**
 * Get the meals' ids for each item containing one
 *
 * @param mealItems - The array of meal-containing items (Any item added to the cart on the app)
 * @returns An array of IDs of the meals stored in the DB
 */
export const getMealIDArray = (mealItems: any[]): string[] => {
  const idArray: string[] = [];

  mealItems.forEach((i: any) => {
    if (i.qty <= 0) return;

    if (idArray.indexOf(i.id) >= 0) return;

    idArray.push(i.id);
  });

  return idArray;
};

/**
 * Create the contents array for a new `Sale`
 *
 * @param contents - The contents of the order sent by the user-client
 * @param meals - The Meal documents retrived for the corresponding  order
 * @param sauces - The Sauce documents retrived for the corresponding order
 * @returns An array of `ISaleItem` objects ready to be attached to a `Sale` document
 */
export const createSaleContents = (
  contents: any[],
  meals: Meal[],
  sauces?: ISauce[]
): ISaleItem[] => {
  const resultContents: ISaleItem[] = [];
  // console.log(contents)
  // console.log(meals, sauces);

  contents.forEach((item) => {
    const foundMeal = meals.find(
      (meal) => String(meal._id) === String(item.id)
    );
    const foundSauce = sauces?.find(
      (sauce) => String(sauce._id) === String(item.sauce)
    );

    let total = +(item.qty * foundMeal!?.price).toFixed(2);
    const resultItem: ISaleItem = {
      title: foundMeal?.name || '',
      sauce: foundSauce?.name,
      qty: item.qty,
      price: foundMeal?.price || 0,
      total,
    };

    resultContents.push(resultItem);
  });

  return resultContents;
};

export const calculateSalePrice = (contents: ISaleItem[]): Number => {
  let total = 0;

  total = contents.reduce((acc, item) => {
    const itemTotal = +(item.qty * item.price).toFixed(2);
    return acc + itemTotal;
  }, total);

  return total;
};

export const createSaleMailText = (sale: ISale): string => {
  const result = '';

  `Se ha recibido una nueva orden
  ** Informacion de cliente **:
  Nombre: ${sale.customer.name}
  Telefono: ${sale.customer.phone}
  --
  ** Domicilio del cliente **
  Calle: ${sale.address.street}
  Colonia: ${sale.address.nbHood}
  Numero Exterior: ${sale.address.extNumber}
  Numero Interior: ${sale.address.intNumber || 'N/A'}
  Codigo Postal: ${sale.address.postalCode}
  Referencias: ${sale.address.refs || 'N/A'}
  --
  ** Contenidos **
  ${contentsToString(sale.content.items)}
  <Recuerda que los precios mostrados son el resultado del precio unitario del articulo multiplicado por la cantidad seleccionada por el usuario.>
  --
  ** Pago **
  Metodo de Pago: ${sale.paymentMethod || 'Efectivo'}
  Subtotal: ${sale.subtotal}
  Envio: $ 25.00 ~ $ 40.00 (Confirmar al cliente a traves de llamada telefonica)
  Total: $${priceToString(sale.subtotal + 25)} ~ $${priceToString(
    sale.subtotal + 40
  )} (Confirmar al cliente a traves de llamada telefonica)`;

  return result;

  function contentsToString(items: ISaleItem[]): string {
    let result = '';

    return result;
  }
};

export const createSaleMailHTML = (sale: ISale): string => {
  let result = '';

  result += `<h1>Se ha recibido una nueva orden</h1>
  <h3>Información del Cliente</h3>
  <p><strong>Nombre:</strong> ${sale.customer.name}</p>
  <p><strong>Telefóno:</strong> ${sale.customer.phone}</p>
  <hr>
  <h3>Domicilio del Cliente</h3>
  <p><i>Calle:</i> ${sale.address.street}</p>
  <p><i>Colonia:</i> ${sale.address.nbHood}</p>
  <p><i>Número Exterior:</i> ${sale.address.extNumber}</p>
  ${
    sale.address.intNumber &&
    `<p><i>Número Interior:</i> ${sale.address.intNumber}</p>` || ''
  }
  <p><i>Código Postal:</i> ${sale.address.postalCode}</p>
  ${sale.address.refs && `<p><i>Referencias:</i> ${sale.address.refs}</p>` || ''}
  <hr>
  <h3>Contenidos</h3>
  ${contentsToHTML(sale.content.items)}
  <div><small>Recuerda que los precios mostrados son el resultado del precio unitario del articulo multiplicado por la cantidad seleccionada por el usuario.</small></div>
  <hr>
  <h3>Pago</h3>
  <p><strong>Método de Pago:</strong> ${sale.paymentMethod || 'Efectivo'}</p>
  <p><strong>Subtotal:</strong> $${priceToString(sale.subtotal)}</p>
  <p><strong>Envío:</strong> $ 25.00 ~ $ 40.00 (Confirmar al cliente a través de llamada telefónica)</p>
  <p><strong>Total:</strong> $${priceToString(
    sale.subtotal + 25
  )} ~ $${priceToString(
    sale.subtotal + 40
  )} (Confirmar al cliente a través de llamada telefónica)</p>
  `;

  return result;

  function contentsToHTML(saleContents: ISaleItem[]): string {
    let html = '<ul>';

    saleContents.forEach((item) => {
      html += `<li><strong>${item.title}${item.sauce && ` (${item.sauce})`}</strong> -- x <strong>${
        item.qty
      }</strong> -- $${item.total}</li>`;
    });

    html += '</ul>';

    return html;
  }
};
