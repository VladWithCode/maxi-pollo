"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSaleMailHTML = exports.createSaleMailText = exports.calculateSalePrice = exports.createSaleContents = exports.getMealIDArray = exports.getSauceIDArray = exports.isAuthenticated = exports.priceToString = exports.uuidv4 = void 0;
var uuidv4 = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};
exports.uuidv4 = uuidv4;
var priceToString = function (p) {
    var _a = p.toFixed(2).split('.'), pInts = _a[0], pDecs = _a[1];
    return (+pInts).toLocaleString() + "." + (pDecs || '00');
};
exports.priceToString = priceToString;
var isAuthenticated = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/admin/login');
};
exports.isAuthenticated = isAuthenticated;
var getSauceIDArray = function (sauceItems) {
    var idArray = [];
    sauceItems.forEach(function (i) {
        if (!i.sauce || i.sauce.length <= 0)
            return;
        if (idArray.indexOf(i.sauce) >= 0)
            return;
        idArray.push(i.sauce);
    });
    return idArray;
};
exports.getSauceIDArray = getSauceIDArray;
var getMealIDArray = function (mealItems) {
    var idArray = [];
    mealItems.forEach(function (i) {
        if (i.qty <= 0)
            return;
        if (idArray.indexOf(i.id) >= 0)
            return;
        idArray.push(i.id);
    });
    return idArray;
};
exports.getMealIDArray = getMealIDArray;
var createSaleContents = function (contents, meals, sauces) {
    var resultContents = [];
    contents.forEach(function (item) {
        var _a;
        var foundMeal = meals.find(function (meal) { return String(meal._id) === String(item.id); });
        var foundSauce = sauces === null || sauces === void 0 ? void 0 : sauces.find(function (sauce) { return String(sauce._id) === String(item.sauce); });
        var total = +(item.qty * ((_a = foundMeal) === null || _a === void 0 ? void 0 : _a.price)).toFixed(2);
        var resultItem = {
            title: (foundMeal === null || foundMeal === void 0 ? void 0 : foundMeal.name) || '',
            sauce: foundSauce === null || foundSauce === void 0 ? void 0 : foundSauce.name,
            qty: item.qty,
            price: (foundMeal === null || foundMeal === void 0 ? void 0 : foundMeal.price) || 0,
            total: total,
        };
        resultContents.push(resultItem);
    });
    return resultContents;
};
exports.createSaleContents = createSaleContents;
var calculateSalePrice = function (contents) {
    var total = 0;
    total = contents.reduce(function (acc, item) {
        var itemTotal = +(item.qty * item.price).toFixed(2);
        return acc + itemTotal;
    }, total);
    return total;
};
exports.calculateSalePrice = calculateSalePrice;
var createSaleMailText = function (sale) {
    var result = '';
    "Se ha recibido una nueva orden\n  ** Informacion de cliente **:\n  Nombre: " + sale.customer.name + "\n  Telefono: " + sale.customer.phone + "\n  --\n  ** Domicilio del cliente **\n  Calle: " + sale.address.street + "\n  Colonia: " + sale.address.nbHood + "\n  Numero Exterior: " + sale.address.extNumber + "\n  Numero Interior: " + (sale.address.intNumber || 'N/A') + "\n  Codigo Postal: " + sale.address.postalCode + "\n  Referencias: " + (sale.address.refs || 'N/A') + "\n  --\n  ** Contenidos **\n  " + contentsToString(sale.content.items) + "\n  <Recuerda que los precios mostrados son el resultado del precio unitario del articulo multiplicado por la cantidad seleccionada por el usuario.>\n  --\n  ** Pago **\n  Metodo de Pago: " + (sale.paymentMethod || 'Efectivo') + "\n  Subtotal: " + sale.subtotal + "\n  Envio: $ 25.00 ~ $ 40.00 (Confirmar al cliente a traves de llamada telefonica)\n  Total: $" + exports.priceToString(sale.subtotal + 25) + " ~ $" + exports.priceToString(sale.subtotal + 40) + " (Confirmar al cliente a traves de llamada telefonica)";
    return result;
    function contentsToString(items) {
        var result = '';
        return result;
    }
};
exports.createSaleMailText = createSaleMailText;
var createSaleMailHTML = function (sale) {
    var result = '';
    result += "<h1>Se ha recibido una nueva orden</h1>\n  <h3>Informaci\u00F3n del Cliente</h3>\n  <p><strong>Nombre:</strong> " + sale.customer.name + "</p>\n  <p><strong>Telef\u00F3no:</strong> " + sale.customer.phone + "</p>\n  <hr>\n  <h3>Domicilio del Cliente</h3>\n  <p><i>Calle:</i> " + sale.address.street + "</p>\n  <p><i>Colonia:</i> " + sale.address.nbHood + "</p>\n  <p><i>N\u00FAmero Exterior:</i> " + sale.address.extNumber + "</p>\n  " + (sale.address.intNumber &&
        "<p><i>N\u00FAmero Interior:</i> " + sale.address.intNumber + "</p>" || '') + "\n  <p><i>C\u00F3digo Postal:</i> " + sale.address.postalCode + "</p>\n  " + (sale.address.refs && "<p><i>Referencias:</i> " + sale.address.refs + "</p>" || '') + "\n  <hr>\n  <h3>Contenidos</h3>\n  " + contentsToHTML(sale.content.items) + "\n  <div><small>Recuerda que los precios mostrados son el resultado del precio unitario del articulo multiplicado por la cantidad seleccionada por el usuario.</small></div>\n  <hr>\n  <h3>Pago</h3>\n  <p><strong>M\u00E9todo de Pago:</strong> " + (sale.paymentMethod || 'Efectivo') + "</p>\n  <p><strong>Subtotal:</strong> $" + exports.priceToString(sale.subtotal) + "</p>\n  <p><strong>Env\u00EDo:</strong> $ 25.00 ~ $ 40.00 (Confirmar al cliente a trav\u00E9s de llamada telef\u00F3nica)</p>\n  <p><strong>Total:</strong> $" + exports.priceToString(sale.subtotal + 25) + " ~ $" + exports.priceToString(sale.subtotal + 40) + " (Confirmar al cliente a trav\u00E9s de llamada telef\u00F3nica)</p>\n  ";
    return result;
    function contentsToHTML(saleContents) {
        var html = '<ul>';
        saleContents.forEach(function (item) {
            html += "<li><strong>" + item.title + (item.sauce && " (" + item.sauce + ")") + "</strong> -- x <strong>" + item.qty + "</strong> -- $" + item.total + "</li>";
        });
        html += '</ul>';
        return html;
    }
};
exports.createSaleMailHTML = createSaleMailHTML;
