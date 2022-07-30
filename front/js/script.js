//----------------------------------------------------------------------------------//
//------------------------- Création de la page d'accueil --------------------------//
//----------------------------------------------------------------------------------//

// --- Appel de l'api + réponse transformée au format json
async function getProductsArray() {
  return await fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .catch((error) => console.log(error))
}

// --- Fonction qui crée le lien vers la page produit
function createNewLink(product) {
  let newLink = document.createElement('a')
  newLink.setAttribute("href", `./product.html?id=${product._id}`)
  return newLink
}

// --- Fonction qui crée une image
function createNewImg(product) {
  let img = document.createElement('img')
  img.src = product.imageUrl
  img.alt = product.altTxt
  return img
}

// --- Création du titre
function createNewTitle(product) {
  let newTitle = document.createElement('h3')
  newTitle.classList.add("productName")
  newTitle.innerText = product.name
  return newTitle
}

// --- Création de la description
function createNewP(product) {
  let newP = document.createElement('p')
  newP.classList.add("productDescription")
  newP.innerText = product.description
  return newP
}

// --- Fonction qui collecte img, h, p et les insère dans un nouvel article
function createNewArticle(product) { 
  let article = document.createElement('article')
  let img = createNewImg(product)
  let h = createNewTitle(product)
  let p = createNewP(product)
  article.appendChild(img)
  article.appendChild(h)
  article.appendChild(p)
  return article
}

// --- Fonction qui crée un lien et qui attache l'article au lien
function createNewCard(product) {
  let a = createNewLink(product)
  let article = createNewArticle(product)
  a.appendChild(article)
  return a
}

// --- Recherche des infos de l'api et appel de createNewCard pour chaque produit du tableau
async function createAllProductsCards() {
  let products = await getProductsArray()
  for (let product of products) {
    let newCard = createNewCard(product)
    document.getElementById('items').appendChild(newCard) 
  }
}
createAllProductsCards()