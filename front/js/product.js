//Rechercher l'URL du produit avec son ID
function getUrlParamsId() {
  const urlRequest = window.location.search
  const urlParameters = new URLSearchParams(urlRequest)
  const id = urlParameters.get('id')
  return id
}

//Constante pour stocker le résultat de l'appel à l'API
const id = getUrlParamsId()

//Fonction pour récupérer la fiche produit avec l'ID correspondant
async function getObjectWithId() {
  return await fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .catch((error) => console.log(error))
}

//Fonction pour créer une image (src + alt)
function createNewImage(product) {
  let newImage = document.createElement('img')
  newImage.src = product.imageUrl
  newImage.alt = product.altTxt
  document.querySelector(".item__img").appendChild(newImage)
}

//Fonction pour modifier le contenu de l'id "title"
function fillNewTitle(product) {
  let newTitle = document.getElementById('title')
  newTitle.innerText = product.name
}

//Fonction pour modifier le contenu de l'id "price"
function fillNewPrice(product) {
  let newPrice = document.getElementById('price')
  newPrice.innerText = product.price
}

//Fonction pour modifier le contenu de l'id "description"
function fillNewDescription(product) {
  let newDescription = document.getElementById('description')
  newDescription.innerText = product.description
}

//Fonction pour créer une option (choix des coloris)
function createNewOption(color) {
  let newOption = document.createElement('option')
  newOption.setAttribute("value", color)
  newOption.value = color
  newOption.innerText = color
  return newOption
}

//Fonction pour ajouter les coloris disponibles des différents articles
function fillColors(product) {
  for (let color of product.colors) {
    let newColor = createNewOption(color)
    document.getElementById('colors').appendChild(newColor)
  }
}

//Fonction qui attends le résultat de getObjectWithId pour modifier le contenu de la page produit
async function fillProductPage() {
  const product = await getObjectWithId()
  createNewImage(product)
  fillNewTitle(product)
  fillNewPrice(product)
  fillNewDescription(product)
  fillColors(product)
}

fillProductPage()