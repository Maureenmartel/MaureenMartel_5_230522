//Appel de l'api + reponse tranformée au format json
async function getProductsArray() {
  return await fetch('http://localhost:3000/api/products')
    .then((response) => response.json())
    .catch((error) => console.log(error))
}

//Fonction qui créé le lien vers la page produit
function createNewLink(product) {
  let newLink = document.createElement('a')
  newLink.setAttribute("href", `product.html/?id=${product._id}`)
  return newLink
}

//Fonction qui créé une image
function createNewImg(product) {
  let img = document.createElement('img')
  img.src = product.imageUrl
  img.alt = product.altTxt
  return img
}

//Création du titre
function createNewTitle(product) {
  let newTitle = document.createElement('h3')
  newTitle.classList.add("productName")
  newTitle.innerText = product.name
  return newTitle
}

//Création de la description
function createNewP(product) {
  let newP = document.createElement('p')
  newP.classList.add("productDescription")
  newP.innerText = product.description
  return newP
}

//Fonction qui collecte img, h, p et les insère dans un nouvel article
function createNewArticle(product) { // Puisque ma fonction en appelle d'autres qui ont des paramètres, je doit lui donner aussi
  let article = document.createElement('article')
  let img = createNewImg(product)
  let h = createNewTitle(product)
  let p = createNewP(product)
  article.appendChild(img)
  article.appendChild(h)
  article.appendChild(p)
  return article
}

//fonction qui créé un lien et qui attache l'article au lien
function createNewCard(product) {
  let a = createNewLink(product)
  let article = createNewArticle(product)
  a.appendChild(article)
  return a
}

//création pour chercher les infos de l'api et appelle createNewCard pour chaque produit du tableau
async function createAllProductsCards() {
  let products = await getProductsArray()
  for (let product of products) {
    let newCard = createNewCard(product)
    document.getElementById('items').appendChild(newCard)
    //document.getElementById('items').appendChild(createNewCard(product))  //Si je veux le faire en une seule ligne selction du parent
    // appendchild = retour de createNewCard
  }
}

createAllProductsCards()