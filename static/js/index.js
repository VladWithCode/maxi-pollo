// Initialize AOS
// AOS.init();

// INTERACTIONS

const summary = document.querySelector('#summary');
const summaryTitle = document.querySelector('.summary__title');
const scrim = document.querySelector('.scrim');

summaryTitle.addEventListener('click', (e) => {
  e.preventDefault();
  if (summary.classList.contains('dropdown')) {
    summary.classList.remove('dropdown');
    scrim.style.display = 'none';
  } else {
    summary.classList.add('dropdown');
    scrim.style.display = 'block';
  }
});

scrim.addEventListener('click', (e) => {
  e.preventDefault();
  summary.classList.remove('dropdown');
  scrim.style.display = 'none';
});

// INTERACTIONS />

// VARIABLES
const totalElement = document.querySelector('#total');
let total = 0;

// Showroom groups
const navPollos = document.querySelector('#pollos');
const navComidas = document.querySelector('#comidas');
const navExtras = document.querySelector('#extras');
const navBar = document.querySelector('nav.nav');

// Containers
const showroom = document.querySelector('#showroom');
const dropdown = document.querySelector('#dropdown');
const snackbar = document.querySelector('#snackbar');

// Modal info\
const modal = document.querySelector('#modal');
const modalInfo = document.querySelector('.modal__info');
const modalSelect = document.querySelector('#modalSelect');
const modalTotal = document.querySelector('#modal-total');
const modalPrice = document.querySelector('#modal-price');
const modalExit = document.querySelector('.modal__exit');
const modalDelete = document.querySelector('.delete');
const ok = document.querySelector('.ok');
const saucesShowroom = document.querySelector('.sauces');

const modalSaucesBtn = document.querySelector('#modal-sauces-btn');
const modalSauces = document.querySelector('#modal-sauces');

// Arrays
// const showroomItems = [];
const pollos = [];
const comidas = [];
const extras = [];
const dataPollos = [];
const dataComidas = [];
const dataExtras = [];
let dataSummaryItems = [];
const summaryItems = [];

const saucesArr = [];
const sauceOptions = [];
// fetch
let sauces = [];
let products = [];

// VARIBLES />

// FUNCTIONS

// to create food card and add it to the showroom :D
function createAddCard(product, arr) {
  const card = document.createElement('div');
  const category = product.category;

  card.classList.add('food__card', 'card', category);

  card.innerHTML = `
  <div class="description">
    <h2>${product.name}</h2>
    <span>${product.description || ''}</span>
  </div>
  ${
    product.thumb !== undefined && product.thumb !== null
      ? `<div class="image">
    <img src="images/${product.thumb}" alt="pollo">
    </div>`
      : ''
  }
  <div class="resume">
    <p><span>Precio:</span>$${product.price}</p>
    <a data-id="${product._id}" class="btn btn-primary add" href="#">Añadir</a>
  </div>
  `;
  arr.push(card);
}

function createAddSummary(item) {
  const itemElement = document.createElement('p');
  const itemID = document.createAttribute('data-id');
  itemID.value = item.id;
  itemElement.setAttributeNode(itemID);
  itemElement.classList.add('dropdown-item');

  if (item.sauceID) {
    const itemSauce = document.createAttribute('sauce-id');
    itemSauce.value = item.sauceID;
    itemElement.setAttributeNode(itemSauce);
  }
  itemElement.innerHTML = `
  <span>${item.name}</span><u>${item.quantity}</u>$${item.price * item.quantity}
  `;
  summaryItems.push(itemElement);
}

function createAddSauce(sauce) {
  const sauceOption = document.createElement('div');
  sauceOption.innerHTML = `
  <input type="radio" id="${sauce._id}" name="sauce" value="${sauce._id}">
  <label for="${sauce._id}">
      <div class="sauce">
          ${sauce.name}
      </div>
  </label>
  `;

  sauceOptions.push(sauceOption);
}

// to create a resume item and add to summary container
function addSummaryItem(product) {
  if (product.category === 'pollo') {
    if (product.quantity === 1) {
      dataSummaryItems.push(product);
    } else {
      dataSummaryItems.forEach((e) => {
        product.sauceID == e.sauceID ? e.quantity++ : null;
      });
    }
  } else if (dataSummaryItems.find((i) => i.id == product.id)) {
    dataSummaryItems.forEach((e) => {
      product.id == e.id ? e.quantity++ : null;
    });
  } else {
    dataSummaryItems.push(product);
  }

  fillSummary();
}

function fillSummary() {
  // summaryItems = [];
  while (summaryItems[0]) {
    summaryItems.pop();
  }

  dataSummaryItems = dataSummaryItems.filter((item) => item.quantity >= 1);

  dataSummaryItems.forEach((item) => {
    item.quantity > 0 ? createAddSummary(item) : null;
  });

  // console.log(dataSummaryItems);

  // if (dataSummaryItems.find((i) => i.id == itemID)) {
  //   const quantityArr = dataSummaryItems.filter((i) => i.id == itemID);
  //   quantityArr.forEach((e) => {
  //     currentQuantity += e.quantity;
  //   });
  // }

  loadDropdown(summaryItems);
}

function loadDropdown(arr) {
  clearHTML(dropdown);

  arr.forEach((e) => {
    dropdown.appendChild(e);
    // // console.log("elemento agregado");
  });
}

// to clean HTML of a container
function clearHTML(container) {
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
}

function loadShowroom(arr) {
  clearHTML(showroom);

  arr.forEach((e) => {
    showroom.appendChild(e);
    // // console.log("elemento agregado");
  });
}

function loadSauces() {
  sauceOptions.forEach((e) => {
    saucesShowroom.appendChild(e);
    // // console.log("elemento agregado");
  });
}

// Nav Active
function navActive(newActive) {
  let active = document.querySelector('.active');
  active.classList.remove('active');

  newActive.classList.add('active');
}

// Fill Arrays
function fillArrays() {
  sauces.forEach((e) => {
    if (e.available) {
      createAddSauce(e);
      // pollo.sauceID = e._id;
      // products.push(pollo);
    }
  });

  products.forEach((e) => {
    if (e.available) {
      if (e.category === 'pollo') {
        createAddCard(e, pollos);
        e.quantity = 0;
        dataPollos.push(e);
        sauces.forEach((s) => {
          if (s.available) {
            const current = { ...e };
            current.sauceID = s._id;
            dataPollos.push(current);
          }
        });
      } else if (e.category === 'comidas') {
        createAddCard(e, comidas);
        dataComidas.push(e);
      } else {
        createAddCard(e, extras);
        dataExtras.push(e);
      }
    }
  });

  loadSauces();
  loadShowroom(pollos);
  updateTotal();
}

// Fill sauces

// Update total
function updateTotal() {
  totalElement.innerHTML = `
    <span>Total: </span>$${total}
  `;
}

function addItem(e) {
  e.preventDefault();

  if (e.target.classList.contains('add')) {
    const item = e.target;
    const itemParent = e.target.parentElement.parentElement;
    const itemID = item.getAttribute('data-id');
    let targetArr;
    let itemPrice;
    let currentQuantity = 0;

    const itemSchema = {
      name: '',
      description: '',
      price: 0,
      quantity: 0,
      id: '',
      category: '',
    };

    itemParent.classList.contains('pollo')
      ? (targetArr = [...dataPollos])
      : itemParent.classList.contains('extras')
      ? (targetArr = [...dataExtras])
      : (targetArr = [...dataComidas]);

    if (dataSummaryItems.find((i) => i.id == itemID)) {
      const quantityArr = dataSummaryItems.filter((i) => i.id == itemID);
      quantityArr.forEach((e) => {
        currentQuantity += e.quantity;
      });
    }

    if (currentQuantity >= 5) {
      createSnackbarError();
    } else if (itemParent.classList.contains('pollo')) {
      modalSauce(itemID);
    } else {
      targetArr.forEach((e) => {
        // itemID == e._id ? itemPrice = e.price : null;
        if (itemID == e._id) {
          itemPrice = e.price;
          itemSchema.price = e.price;
          itemSchema.name = e.name;
          itemSchema.description = e.description;
          itemSchema.quantity += 1;
          itemSchema.id = e._id;
          itemSchema.category = e.category;

          addSummaryItem(itemSchema);
          total += itemPrice;
          updateTotal();
          createSnackbar(itemSchema.name);
        }
      });
    }
  }
}

// Event listener

function loadEventListeners() {
  navPollos.addEventListener('click', () => {
    navActive(navPollos);
    loadShowroom(pollos);
  });

  navComidas.addEventListener('click', () => {
    navActive(navComidas);
    loadShowroom(comidas);
  });

  navExtras.addEventListener('click', () => {
    navActive(navExtras);
    loadShowroom(extras);
  });

  showroom.addEventListener('click', addItem);
  dropdown.addEventListener('click', (i) => {
    navBar.childNodes.length !== 5 ? null : createModal(i);
  });
}

function createSnackbar(name) {
  clearHTML(snackbar);

  const snack = document.createElement('div');
  snack.classList.add('snackbar');

  snack.innerHTML = `
    <p>${name} al carrito</p>
  `;

  snackbar.appendChild(snack);
}

function createSnackbarError(msg = 0) {
  clearHTML(snackbar);

  const snack = document.createElement('div');
  snack.classList.add('snackbar', 'snackbar-error');

  if (msg === 0) {
    snack.innerHTML = `
    <p>Límite de 5 por producto</p>
  `;
  } else if (msg == 1) {
    snack.innerHTML = `
    <p>Selecciona una salsa</p>
  `;
  } else if (msg == 2) {
    snack.innerHTML =
      '<p>Debes de aceptar la tarifa de envio para realizar un pedido.</p>';
  } else {
    snack.innerHTML = `
    <p>No has agregado ningún producto</p>
  `;
  }

  snackbar.appendChild(snack);
}

// Create modal for sauces
function modalSauce(id) {
  modalSauces.style.display = 'flex';

  modalSaucesBtn.onclick = () => {
    if (document.querySelector('input[name="sauce"]:checked')) {
      const sauceSelected = document.querySelector(
        'input[name="sauce"]:checked'
      ).value;

      closeModalSauce(sauceSelected, id);
    } else {
      createSnackbarError(1);
    }
  };
}

// Create modal with the content of the clicked item
function createModal(e) {
  console.log(e.target);
  if (
    e.target.hasAttribute('data-id') ||
    e.target.parentElement.hasAttribute('data-id')
  ) {
    const itemSelected = e.target.parentElement.hasAttribute('data-id')
      ? e.target.parentElement
      : e.target;

    dataSummaryItems.forEach((e) => {
      if (
        itemSelected.getAttribute('data-id') == e.id &&
        itemSelected.getAttribute('sauce-id') == e.sauceID
      ) {
        modalInfo.innerHTML = `\
        <h3>${e.name}</h3>
        <span>${e.description}</span>
        `;
        modalPrice.innerHTML = `
        $${e.price}c/u
        `;
        modalSelect.value = e.quantity;

        modalTotal.innerHTML = `
        <span>Total:</span> $${e.price * e.quantity}
        `;

        modalSelect.oninput = () => {
          if (itemSelected.getAttribute('data-id') == e.id) {
            e.quantity = Number(modalSelect.value);
            modalTotal.innerHTML = `
          <span>Total:</span> $${e.price * e.quantity}
          `;
          }
        };

        modalDelete.onclick = () => {
          if (e.sauceID) {
            const currentPollo = dataPollos.find(
              (i) => i.sauceID == e.sauceID && i._id == e.id
            );
            if (itemSelected.getAttribute('sauce-id') == e.sauceID) {
              currentPollo.quantity = 0;
              e.quantity = 0;
            }
          } else {
            e.quantity = 0;
          }
          closeModal();
        };
      }
    });

    modal.style.display = 'flex';

    modalExit.addEventListener('click', () => {
      closeModal();
    });

    ok.addEventListener('click', () => {
      closeModal();
    });

    modal.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal')) {
        closeModal();
      }
    });
  }
}

function closeModal() {
  modal.style.display = 'none';
  fillSummary();
  checkTotal();
  updateTotal();
}

function closeModalSauce(sauceID, polloID) {
  if (dataPollos.find((e) => e._id == polloID && e.sauceID == sauceID)) {
    const currentPollo = dataPollos.find(
      (e) => e._id == polloID && e.sauceID == sauceID
    );

    const sauceName = sauces.find((s) => s._id == sauceID).name;

    currentPollo.quantity++;
    const itemSchema = {
      name: `${currentPollo.name} || ${sauceName}`,
      description: currentPollo.description,
      price: currentPollo.price,
      quantity: currentPollo.quantity,
      id: currentPollo._id,
      category: currentPollo.category,
      sauceID: currentPollo.sauceID,
    };

    modalSauces.style.display = 'none';
    addSummaryItem(itemSchema);
    total += itemSchema.price;
    updateTotal();
    createSnackbar(itemSchema.name);
  }
}

function checkTotal() {
  total = 0;
  dataSummaryItems.forEach((e) => {
    total += e.price * e.quantity;
  });
}

// FUNCTIONS />

// CLASSES />

// PAGE CODE

// initializations
(async () => {
  await initApp();
  fillArrays();
  loadEventListeners();
})();

// finish order
const finishBtn = document.querySelector('.next');
const foodContainer = document.querySelector('.food');
const navOptions = document.querySelector('.nav__options');
const form = document.querySelector('.address');
const backBtn = document.querySelector('.back');

const backToFirstStep = () => {
  backBtn.classList.add('d-none');
  form.classList.add('d-none');
  navOptions.classList.remove('d-none');
  foodContainer.classList.remove('d-none');
  modalDelete.classList.remove('d-none');
  finishBtn.classList.remove('d-none');

  loadShowroom(pollos);
};

const backToSecondStep = () => {
  // Hide confirmation view
  document.querySelector('.confirm').classList.add('d-none');
  // Unhide form, order-resume & summary elements
  form.classList.remove('d-none');
  document.querySelector('.order-resume').classList.remove('d-none');
  document.querySelector('#summary').classList.remove('d-none');
  // Clean confirmation view
  const confirmTitles = document.querySelector('.confirm__titles');
  const confirmContents = document.querySelector('.confirm__contents');
  confirmContents.innerHTML = '';
  document.querySelector('.confirm__summary').innerHTML = '';
  confirmContents.appendChild(confirmTitles);

  // Assign backBtn click handler to be backToFirstStep function again
  backBtn.onclick = backToFirstStep;
};

backBtn.onclick = backToFirstStep;

finishBtn.addEventListener('click', async () => {
  if (summaryItems.length >= 1) {
    backBtn.classList.remove('d-none');
    backBtn.innerText = '← Regresar';

    form.classList.remove('d-none');

    const formHTML = `
    <form action="/api/sale" method="POST" class="form" id="detailForm">

    <h3 class="form__title">Dirección y Datos de Envío.</h3>

    <input type="text" class="form__field" name="clientname" placeholder="Su nombre" required>
    
    <input type="text" class="form__field" name="street" placeholder="Calle" required>

    <input type="number" class="form__field" name="extnumber" placeholder="Numero Exterior" required>

    <input type="number" class="form__field" name="intnumber" placeholder="Numero Interior">

    <input type="text" class="form__field" name="refs" placeholder="Referencias">

    <input type="text" class="form__field" name="nbhood" placeholder="Colonia" required>

    <input type="number" class="form__field" name="postalcode" placeholder="Codigo Postal" required>

    <input type="number" class="form__field" name="phone" placeholder="Telefono" minlength=10 maxlength=10 pattern="[0-9]{10,}" title="Numero telefonico de 10 digitos" required>

    <button type="submit" class="btn btn-success">
        <span class="text">Continuar</span>
    </button>
    </form>
    `;

    if (form.innerHTML !== formHTML) {
      form.innerHTML = formHTML;
    }

    navOptions.classList.add('d-none');
    foodContainer.classList.add('d-none');
    modalDelete.classList.add('d-none');
    finishBtn.classList.add('d-none');
    clearHTML(showroom);

    const detailForm = document.forms['detailForm'];

    detailForm.addEventListener('submit', handleOrderSubmit);
  } else {
    createSnackbarError(2);
  }
});

async function handleOrderSubmit(e) {
  e.preventDefault();

  const acceptShipmentFee = confirm(
    'El envio puede variar entre $25 y $40 pesos dependiendo de la zona.\nSe confirmara esta tarifa por llamada telefonica.\n¿Estás de acuerdo?'
  );

  if (!acceptShipmentFee) return createSnackbarError(2);

  const order = {};
  let res;

  order.customer = getCustomerInfo(new FormData(this));
  order.contents = parseCartItemsToIDArray(dataSummaryItems);

  try {
    res = await (
      await fetch('/api/sale', {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    ).json();
  } catch (err) {
    console.log(err);
    return alert(err.message);
  }

  if (res.status !== 'OK') {
    console.log(res);
    return alert(res.message);
  }

  displayConfirmationForm(res.sale);
}

function displayConfirmationForm(sale) {
  // Retrive confirmation container element
  const confirmContainer = document.querySelector('.confirm');
  // Hide customer info form & order-resume element
  form.classList.add('d-none');
  document.querySelector('.order-resume').classList.add('d-none');
  document.querySelector('#summary').classList.add('d-none');

  fillConfirmationContents(sale.content);
  fillConfirmationSummary(sale.subtotal);

  confirmContainer.classList.remove('d-none');
  confirmContainer.querySelector(
    '.confirm__submit'
  ).onclick = handleSaleConfirmation(sale);
  backBtn.onclick = backToSecondStep;
}

function handleSaleConfirmation(sale) {
  return async (e) => {
    e.preventDefault();

    const res = await (
      await fetch('/api/sale/confirm', {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ id: sale._id }),
      })
    ).json();

    if (res.status !== 'OK') {
      console.log(res);
      return alert(res.message);
    }

    console.log(res);
    backBtn.classList.add('d-none');
    document.querySelector('.confirm').classList.add('d-none');
    document.querySelector('.finish').classList.remove('d-none');
  };
}

function fillConfirmationContents(saleContents) {
  const contentsContainer = document.querySelector('.confirm__contents');
  const { items } = saleContents;

  items.forEach((item) => {
    const itemHTML = createConfirmationItem(item);

    contentsContainer.insertAdjacentHTML('beforeend', itemHTML);
  });
}

function createConfirmationItem(item) {
  return `<div class="confirm__item">
  <div class="title" title="${item.title} (${item.sauce})"><span class="tit">${
    item.title
  }</span>${
    item.sauce !== undefined && item.sauce !== null
      ? `<span class="sp"></span><span class="sc">${item.sauce}</span>`
      : ''
  }</div>
  <div class="qty">${item.qty}</div>
  <div class="price">$ ${item.total}</div>
  </div>
  `;
}

function fillConfirmationSummary(subTot) {
  const summaryContainer = document.querySelector('.confirm__summary');
  const minTot = subTot + 25;
  const maxTot = subTot + 40;

  const summaryHTML = `<div class="concept">
  <div class="title">Subtotal:</div>
  <div class="value">$ ${priceToString(subTot)}</div>
</div>
<div class="concept">
  <div class="title">Envío (*):</div>
  <div class="value">$ 25.00 ~ 40.00</div>
</div>
<div class="concept">
  <div class="title">Total:</div>
  <div class="value">$ ${priceToString(minTot)} ~ ${priceToString(
    maxTot
  )} </div>
</div>`;

  summaryContainer.insertAdjacentHTML('beforeend', summaryHTML);
}

function parseCartItemsToIDArray(cart) {
  const result = [];

  cart.forEach((i) => {
    const parsedItem = {
      id: i._id || i.id,
      qty: i.quantity,
    };

    if (i.sauceID && i.sauceID.length > 0) parsedItem.sauce = i.sauceID;

    result.push(parsedItem);
  });

  return result;
}

function getCustomerInfo(form) {
  const result = {};

  for (let [k, v] of form.entries()) {
    if (!v || v.length <= 0) continue;
    result[k] = v;
  }

  return result;
}

async function fetchProducts(category = null) {
  const resultProducts = [];

  let fetchedProducts;

  try {
    const svRes = await (
      await fetch(
        `/api/meals${
          category && category.length > 0 ? `?category=${category}` : ''
        }`
      )
    ).json();

    if (svRes.status !== 'OK') {
      console.log(svRes);
      return alert(svRes.message);
    }

    fetchedProducts = svRes.meals;
  } catch (err) {
    console.log(err);
    return alert(
      'Ha ocurrido un error al comunicarse con la base de datos.\nIntente de nuevo mas tarde.'
    );
  }

  return fetchedProducts;
}

async function fetchSauces() {
  let fetchedSauces;

  try {
    const svRes = await (
      await fetch('/api/sauces')
    ).json();

    if (svRes.status !== 'OK') {
      console.log(svRes);
      return alert(svRes.message);
    }

    fetchedSauces = svRes.sauces;
  } catch (err) {
    console.log(err);
    return alert(
      'Ha ocurrido un error al comunicarse con la base de datos.\nIntente de nuevo mas tarde.'
    );
  }

  return fetchedSauces;
}

async function initApp() {
  const res = await (await fetch('/api/sale/state')).json();

  if (!res.state) {
    document.querySelector('.food').classList.add('d-none');
    document.querySelector('.summary').classList.add('d-none');
    document.querySelector('.order-resume').classList.add('d-none');
    document.querySelector('.nosale').classList.remove('d-none');
    return;
  }

  products = await fetchProducts();
  sauces = await fetchSauces();
}

function priceToString(p) {
  const [pInts, pDecs] = `${p.toFixed(2)}`.split('.');

  return `${(+pInts).toLocaleString()}.${pDecs || '00'}`;
}
