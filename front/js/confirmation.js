//----------------------------------------------------------------------------------//
//------------------------ Affichage du numéro de commande -------------------------//
//----------------------------------------------------------------------------------//

// --- Rechercher l'id de la commande depuis l'URL
function getUrlParamsOrderId() {
  const urlRequest = window.location.search         
  const urlParameters = new URLSearchParams(urlRequest) 
  const orderId = urlParameters.get('order-id')        
  return orderId
}

const orderId = getUrlParamsOrderId()

// --- Fonction pour indiquer où afficher le numéro de commande
function orderNumberDisplay() {
  document.getElementById('orderId').innerText = orderId
}
orderNumberDisplay()






