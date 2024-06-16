const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const adressInput = document.getElementById("adress");
const adressWarn = document.getElementById("adress-warn");


let cart = [];



// Botão do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display="flex"
    
})
// Fechar o modal quando clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})
// Botão de fechar o modal
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display="none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price")) 

        addToCart(name, price)
    }
})

// ?? função para adicionar o carrinho 
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        // se já existe o item aumenta só a quantidade
        existingItem.quant += 1;
       
    }else{

        cart.push({
            name,
            price,
            quant: 1,
        })
    }
   
    updateCartModal()
}

// ?? funcção atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4","flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between" >
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd. ${item.quant}</p>
                <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

            <button class="remove-from-cart-btn" data-name="${item.name}">
                Remover
            </button>
       
        </div>        
        `
        total += item.price * item.quant;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
    })

    cartCounter.innerHTML = cart.length;

}

// ?? função para remover item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quant > 1){
            item.quant -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }


}


adressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        adressInput.classList.remove("border-red-500")
        adressWarn.classList.add("hidden")
    }
})


// ?? Finalizar pedido
checkoutBtn.addEventListener("click", function(){
    // !! verifica se o restaurante está aberto
    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Olá! Estamos fechados! ",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
            background: "#ef4444",
        },
        }).showToast()
        return;
    }

    if(cart.length === 0) return;
    if(adressInput.value === ""){
        adressWarn.classList.remove("hidden")
        adressInput.classList.add("border-red-500")
        return;
    }

    // ?? Enviar pedido para o whatsapp

    const cartItems = cart.map((item)=>{
        return(
            `${item.name} Quantidade: (${item.quant}) Preço: R$ ${item.price} |`
        )
    }).join("")
    const message = encodeURIComponent(cartItems)
    const phone = "62995020285"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${adressInput.value}`, "_blank")

    cart.length = 0;
    updateCartModal();
})


// ?? verifica o horário de funcionamento para aceitar pedidos
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;// true tá aberto 
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500");
}