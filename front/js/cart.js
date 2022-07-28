//----------------------------------------------------------------------------------//
//-------------- API, récupération et sauvegarde du panier, tableaux  --------------//
//----------------------------------------------------------------------------------//

// --- Fonction pour récupérer la fiche produit avec l'ID correspondant 
async function getObjectWithId(id) {
  return await fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
}

// --- Récupération de mon panier depuis le localStorage, au cas où il existe
let basket = JSON.parse(window.localStorage.getItem("basket"))

// --- Fonction de sauvegarde du panier
function saveBasket(basket) {
  window.localStorage.setItem("basket", JSON.stringify(basket))
}

// --- Je convertis mon objet basket en tableau, pour pouvoir loop à l'intérieur
let productArray = []
for (let elem of Object.keys(basket)) {
  productArray.push(basket[elem])
}

// --- Création d'un tableau avec les ID pour récupérer les informations de l'API
// Objects.keys me permets de récupérer les propriétés propres à mon objet basket
let idArray = Object.keys(basket)

//----------------------------------------------------------------------------------//
//----- Construction du DOM avec les infos croisées de l'API et du localStorage ----//
//----------------------------------------------------------------------------------//

// --- Déclaration de mon parent dans une constante pour construire mon DOM
const sectionCart = document.getElementById('cart__items')

// --- Création de l'article
function createNewArticle(product, color, quantity) {
  let sectionArticle = document.createElement('article')                
  sectionArticle.className = "cart__item"
  sectionArticle.setAttribute("data-id", product._id)
  sectionArticle.setAttribute("data-color", color)
  return sectionArticle
}

// --- Création de la div qui accueille l'image + Affichage de l'image et de son alt depuis l'API
function createDivImg(product) {
  const divImgCart = document.createElement('div')
  divImgCart.className = "cart__item__img"

  const imgCart = document.createElement('img')
  divImgCart.appendChild(imgCart)
  imgCart.src = product.imageUrl
  imgCart.alt = product.altTxt
  
  return divImgCart
}

// --- Création de la div "cart__item__content" + Appel des éléments à afficher
function createDivCartContent(parent, product, color, quantity) {
  const divCartContent = document.createElement('div')
  parent.appendChild(divCartContent)
  divCartContent.className = "cart__item__content"
  divCartContentDescription(divCartContent, product, color)
  divCartContentSettings(divCartContent, quantity)
}

// --- Création de la div "cart__item__content__titlePrice" + Appel des éléments à afficher
function divCartContentDescription(parent, product, color) {
  const cartContentDescription = document.createElement('div')
  parent.appendChild(cartContentDescription)
  cartContentDescription.className = "cart__item__content__titlePrice"
  fillDescriptionOfProduct(product, color, cartContentDescription)
  createPriceProduct(product, cartContentDescription)
}

// --- Affichage du nom du produit depuis l'API + Affichage de la couleur choisie depuis le localStorage
function fillDescriptionOfProduct(product, color, parent) {
  const nameOfProduct = document.createElement('h2')
  parent.appendChild(nameOfProduct)
  nameOfProduct.innerText = product.name

  const colorOfProduct = document.createElement('p')
  parent.appendChild(colorOfProduct)
  colorOfProduct.innerText = color
}

// --- Affichage du prix du produit depuis l'API
function createPriceProduct(product, parent) {
  const priceOfProduct = document.createElement('p')
  parent.appendChild(priceOfProduct)
  priceOfProduct.innerText = product.price + " €"
}

// --- Création de la div "cart__item__content__settings" + Appel des éléments à afficher
function divCartContentSettings(parent, quantity) {
  const cartContentSettings = document.createElement('div')
  parent.appendChild(cartContentSettings)
  cartContentSettings.className = "cart__item__content__settings"
  createProductQuantity(cartContentSettings, quantity)
  divDeleteItem(cartContentSettings)
}

// --- Création de la div + Affichage de la quantité voulue depuis le localStorage
function createProductQuantity(parent, quantity) {
  const divProductQuantity = document.createElement('div')
  parent.appendChild(divProductQuantity)
  divProductQuantity.className = "cart__item__content__settings__quantity"

  const quantityTitle = document.createElement('p')
  divProductQuantity.appendChild(quantityTitle)
  quantityTitle.innerText = "Quantité :"

  let input = createQuantityInput(quantity)

  divProductQuantity.appendChild(input)
}

// --- Création de l'input Quantité et de ses paramètres
function createQuantityInput(quantity) {
  const inputQuantity = document.createElement('input')
  inputQuantity.type ="number"
  inputQuantity.className = "itemQuantity"
  inputQuantity.name = "itemQuantity"
  inputQuantity.min = "1"
  inputQuantity.max = "100"
  inputQuantity.value = quantity

  return inputQuantity
}

// --- Création de la div et du bouton "supprimer" 
function divDeleteItem(parent) {
  const divDelete = document.createElement('div')
  divDelete.className = "cart__item__content__settings__delete"
  parent.appendChild(divDelete)
  deleteItem(divDelete)
}

function deleteItem(parent) {
  const deleteProduct = document.createElement('p')
  deleteProduct.className = "deleteItem"
  parent.appendChild(deleteProduct)
  deleteProduct.innerText = "Supprimer"
}

// --- Fonction qui récupére les objets d'un tableau de tableau et qui crée mon article
function createArticles(productArray, product, idIndex) {
  for (let array of productArray) {
    // Je store l'index de mon tableau pour m'assurer que les infos correspondent au bon id
    let arrayIndex = productArray.indexOf(array)
    // Si mes deux index correspondent, ma fonction crée un nouvel article            
    if (idIndex === arrayIndex) {  
      for (let object of array) {
        let color = object.color
        let quantity = object.quantity
        let article = createNewArticle(product, color, quantity)
        let divImgCart = createDivImg(product, article)
        article.appendChild(divImgCart)
        createDivCartContent(article, product, color, quantity)
        sectionCart.appendChild(article)
      }
    }
  }
}

//----------------------------------------------------------------------------------//
//------------ Gestion de la quantité totale et du prix total du panier ------------//
//----------------------------------------------------------------------------------//

// --- Collecte des données de l'input Quantité
function inputDataQuantity() {
  // Récupération de la NodeList des éléments du document, correspondant au sélecteur CSS ciblé
  let inputsValue = document.querySelectorAll(".itemQuantity")
  let totalQuantity = 0                                         
  for (let input of inputsValue) {
    totalQuantity = totalQuantity += Number(input.value)
    document.getElementById("totalQuantity").innerText = totalQuantity
  }
}

// --- Pour chaque article, collecte des données de l'input Quantité et infos du prix depuis l'API
async function getTotalPrice() {
  let allProductInBasket = document.querySelectorAll("article.cart__item")
  let totalPrice = 0
  for (let article of allProductInBasket) {
    let numberOfProducts = Number(article.querySelector(".itemQuantity").value)
    let productsId = article.getAttribute("data-id")
    let product = await getObjectWithId(productsId)
    let itemPrice = product.price
    totalPrice = totalPrice += Number(numberOfProducts *= itemPrice)
    document.getElementById("totalPrice").innerText = totalPrice
  }
}

//----------------------------------------------------------------------------------//
//-------------- Modification de la quantité et mise à jour du prix ----------------//
//----------------------------------------------------------------------------------//

function quantityChange() {
  // Je déclare une variable qui va indiquer sur quel sélecteur CSS va s'effectuer le changement
  let quantityInputs = document.querySelectorAll("input.itemQuantity")
  if (quantityInputs !== []) {  //Si j'ai un article dans mon panier
    for (let input of quantityInputs) {
      input.addEventListener('change', () => {
        // Mise à jour de la quantité
        inputDataQuantity()
        // Mise à jour du prix
        getTotalPrice()
        let articleChange = input.closest('article.cart__item')
        let colorChange = articleChange.getAttribute("data-color")
        let idChange = articleChange.getAttribute("data-id")
        let basket = JSON.parse(window.localStorage.getItem("basket"))
        for (let item of basket[idChange]) {
          if (item.color === colorChange && (input.value <= 100 && input.value >= 1)) {
            item.quantity = input.value
            saveBasket(basket)
          }
        }
      })
    }
  } 
}

//----------------------------------------------------------------------------------//
//-------------------------- Suppression d'un article ------------------------------//
//----------------------------------------------------------------------------------//

function removeProductFromBasket() {
  let deleteButtons = document.querySelectorAll("p.deleteItem")
  for (let deleteButton of deleteButtons) {
    deleteButton.addEventListener('click', () => {
      let articleToRemoveTargeted = deleteButton.closest('article.cart__item')
      let articleIdToDelete = articleToRemoveTargeted.getAttribute("data-id")
      let articleColorToDelete = articleToRemoveTargeted.getAttribute("data-color")
      let basket = JSON.parse(window.localStorage.getItem("basket"))
      let targetedProductsToDelete = basket[articleIdToDelete]
      for (let targetedProductToDelete of targetedProductsToDelete) {
        if (targetedProductToDelete.color === articleColorToDelete) {
          let indexOfTargetDelete = targetedProductsToDelete.indexOf(targetedProductToDelete)
          targetedProductsToDelete.splice(indexOfTargetDelete, 1)
          if (targetedProductsToDelete.length == 0) {
            delete basket[`${articleIdToDelete}`]
          }
          saveBasket(basket)
          articleToRemoveTargeted.parentNode.removeChild(articleToRemoveTargeted)
        }
      }
      inputDataQuantity()
      getTotalPrice()
    })
  }
}

//----------------------------------------------------------------------------------//
//------------------------------ Gestion du panier ---------------------------------//
//----------------------------------------------------------------------------------//

// --- Fonction qui vérifie que les indices de mes tableaux correspondent, puis crée mes articles
async function fillProductPage() {
  for (let id of idArray) {
    let idIndex = idArray.indexOf(id)
    let product = await getObjectWithId(id)                   
    createArticles(productArray, product, idIndex)
  }
}

// --- Fonction qui attend la création de l'article, puis met à jour le panier à chaque modification
async function manageBasket() {
  await fillProductPage()
  inputDataQuantity()
  getTotalPrice()
  quantityChange()
  removeProductFromBasket()
}
manageBasket()

//----------------------------------------------------------------------------------//
//------------- Constantes nécessaires pour la validation de formulaire ------------//
//----------------------------------------------------------------------------------//

// --- Constante pour indiquer l'endroit où mes regex interviennent
const formValidaton = document.querySelector('form.cart__order__form')

// --- Constante pour cibler l'input "submit"
const formSubmit = document.getElementById('order')

// --- Constantes pour cibler les différents inputs du formulaire
const firstNameInput = document.getElementById('firstName')
const lastNameInput = document.getElementById('lastName')
const addressInput = document.getElementById('address')
const cityInput = document.getElementById('city')
const emailInput = document.getElementById('email')

// --- Constantes qui contiennent les regex de vérification de formulaire
const nameRegex = /^([a-zéèàç]+){1}([\S\-\1])*$/
const addressRegex = /^([0-9]{1,4})\ {1}([^\t\n\r][a-zéèàçùA-Z0-9\s\-\,\.]+)$/
const cityRegex = /([0-9]{5}){1}\s([A-Za-zéèàçù]+){1}([\S\-\2])*$/
const emailRegex = /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

//----------------------------------------------------------------------------------//
//----------------- Validation du formulaire + messages d'erreur -------------------//
//----------------------------------------------------------------------------------//

// --- Vérification de l'input "firstName" et ajout du message d'erreur
firstNameInput.addEventListener("input", () => {
  // Si la valeur de mon input est invalide, affichage d'un message d'erreur personnalisé
  if (nameRegex.test(firstNameInput.value) == false) {
    document.getElementById('firstNameErrorMsg').innerText = " Votre prénom ne doit contenir que des lettres, tiret autorisé pour les prénoms composés." 
  } else {
    document.getElementById('firstNameErrorMsg').innerText = ""
  }
})

// --- Vérification de l'input "lastName" et ajout du message d'erreur
lastNameInput.addEventListener("input", () => {
  if (nameRegex.test(lastNameInput.value) == false) {
    document.getElementById('lastNameErrorMsg').innerText = " Votre nom ne doit contenir que des lettres, tiret autorisé pour les prénoms composés."
  } else {
    document.getElementById('lastNameErrorMsg').innerText = ""
  }
})

// --- Vérification de l'input "address" et ajout du message d'erreur
addressInput.addEventListener("input", () => {
  if (addressRegex.test(addressInput.value) == false) {
    document.getElementById('addressErrorMsg').innerText = " Votre addresse doit contenir le numéro suivi du nom de la voie"
  } else {
    document.getElementById('addressErrorMsg').innerText = ""
  }
})

// --- Vérification de l'input "city" et ajout du message d'erreur
cityInput.addEventListener("input", () => {
  if (cityRegex.test(cityInput.value) == false) {
    document.getElementById('cityErrorMsg').innerText = " Veuillez indiquer d'abord votre code postal puis le nom de votre ville."
  } else {
    document.getElementById('cityErrorMsg').innerText = ""
  }
})

// --- Vérification de l'input "email" et ajout du message d'erreur
emailInput.addEventListener("input", () => {
  if (emailRegex.test(emailInput.value) == false) {
    document.getElementById('emailErrorMsg').innerText = " Veuillez saisir un email correct. (Exemples: kanap@contact.fr, infos.kanap@contact.com, infos-kanap@contact.net)"
  } else {
    document.getElementById('emailErrorMsg').innerText = ""
  }
})

//----------------------------------------------------------------------------------//
//------------- Envoi des infos formulaire et du panier au back-end ----------------//
//----------------------------------------------------------------------------------//

// --- Fonction qui vérifie si mon tableau est vide ou contient déjà un produit
function isArrayEmpty(array) {
  if (array.length > 0) { 
    return array
  } else {
    return undefined
  } 
}

// --- Création du tableau de produits et ajout des articles au tableau
function createIdsProductsArray(nodeList) {
  // Création d'un tableau pour stocker les items présents dans mon panier
  let articlesIdAddedToCart = [] 
  for (let articleAddedToCart of nodeList) { 
    // J'indique l'endroit où les infos doivent être collectées et je selectionne la value
    let entryValueItemQuantity = articleAddedToCart.querySelector("input").value
    // Je récupère l'id du produit trouvé
    let productId = articleAddedToCart.getAttribute('data-id')
    // Si l'id n'est pas déjà présente dans mon tableau et que mon input n'est pas à zero, alors je push l'id dans mon tableau
    if ((!articlesIdAddedToCart.includes(productId)) && entryValueItemQuantity > 0) {
      articlesIdAddedToCart.push(productId)
    }
  }
  if (isArrayEmpty(articlesIdAddedToCart)) {
    return articlesIdAddedToCart
  } else {
    return undefined
  }
}

// --- Vérification de tous les inputs de coordonnées
function formValidation() {
  if (nameRegex.test(firstNameInput.value) && nameRegex.test(lastNameInput.value) && addressRegex.test(addressInput.value) && cityRegex.test(cityInput.value) && emailRegex.test(emailInput.value)) {
    return true
  } else {
    return false
  }
}

// --- Création du compte utilisateur
function createNewUser() {
  if (formValidation()) {
    let contact = {
      firstName : firstNameInput.value,
      lastName : lastNameInput.value,
      address : addressInput.value,
      city : cityInput.value,
      email : emailInput.value,
    }
    return contact
  } else {
    return undefined
  }
}

// --- Création de la commande
function orderCreation(articlesAddedToCart) {
  console.log(articlesAddedToCart)
  let productsIdsArray = createIdsProductsArray(articlesAddedToCart)
  let user = createNewUser()
  // Si j'ai bien des produits dans mon panier et que mes inputs de formulaire sont correctement saisis
  if ((productsIdsArray && user) != undefined) {
    // Je crée un objet pour stocker les informations utilisateurs + un tableau d'ID
    let order = {
      contact: user,
      products : []
    }
    for (let article of productsIdsArray) {
      order.products.push(article)
    }
    return order
  } else {
    return undefined
  }
}

// --- Fonction Post de l'objet et récupération de l'orderId
async function retrieveOrderId(order) {
  return fetch (`http://localhost:3000/api/products/order`, {
    method : "POST",
    headers : {
      "Accept" : "application/json",
      "Content-type" : "application/json"
    },
    body : order
  })
  .then((response) => response.json())
  .catch((error) => console.log(error))
}

// --- Fonction d'envoi du formulaire si toutes les vérifications sont correctes
function sendBasketOrder() {
  let btnCommand = document.getElementById("order")
  const elemParent = btnCommand.closest('form')
  btnCommand.addEventListener('click', async (event) => {
    event.preventDefault()
    const articlesAddedToCart = document.querySelectorAll("article.cart__item")
    if (orderCreation(articlesAddedToCart) != undefined) {
      let order = JSON.stringify(orderCreation(articlesAddedToCart))
      let orderComplete = await retrieveOrderId(order)
      let orderId = orderComplete.orderId
      // Suppression du panier après validation de la commande
      window.localStorage.removeItem('basket')
      // Suppression de l'URL du panier de l'historique du document
      window.location.replace(`./confirmation.html?order-id=${orderId}`)
    } else {
      // Pop-up alert dans le cas où le panier est vide et/ou le formulaire n'est pas rempli correctement
      window.alert("Veuillez vérifier vos informations de contact, ou que votre panier contient au moins un article.")
    }
  })
}
sendBasketOrder()

































