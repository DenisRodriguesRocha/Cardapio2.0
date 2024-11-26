const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const checkboxWarn = document.getElementById("checkbox-warn")
const pix = document.getElementById("Pix");
const cartao = document.getElementById("Cartao");
const dinheiro = document.getElementById("Dinheiro");

let cart = [];

// Função para desmarcar outras checkboxes
function uncheckOthers(checkedCheckbox) {
    [pix, cartao, dinheiro].forEach(checkbox => {
        if (checkbox !== checkedCheckbox) {
            checkbox.checked = false;
        }
    });
}

// Adiciona o evento change a cada checkbox
[pix, cartao, dinheiro].forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        uncheckOthers(this);
    });
});

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    updateCartModal();
    cartModal.style.display = "flex";
});

//Fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none";
    }
});

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none";
});

menu.addEventListener("click", function (event) {
    let parentButton = event.target.closest(".add-to-cart-btn");

    if (parentButton) {
        const name = parentButton.getAttribute("data-name");
        const price = parseFloat(parentButton.getAttribute("data-price"));

        //Adicionar no carrinho
        addToCard(name, price);
    }
});

//Funcao para adicionar no carrinho
function addToCard(name, price) {
    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        //Se o item ja existe aumenta apenas a quantidade +1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        });
    }

    updateCartModal();
}

//Atualiza Carrinho
function updateCartModal() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium">${item.name}</p>
                <p>Qtd:${item.quantity}</p>
                <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>

            <div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>
            </div>
        </div>
        `;

        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;

    checkboxWarn.classList.add("hidden");
    checkboxWarn.classList.remove("border-red-500");
}

//Funcao para remover o item do carrinho
cartItemsContainer.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-from-cart-btn")) {
        const name = event.target.getAttribute("data-name");
        removeItemCart(name);
    }
});

function removeItemCart(name) {
    const index = cart.findIndex(item => item.name === name);

    if (index !== -1) {
        const item = cart[index];

        if (item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

//Pegar o que digitar
addressInput.addEventListener("input", function (event) {
    let inputValue = event.target.value;

    if (inputValue !== "") {
        addressInput.classList.remove("border-red-500");
        addressWarn.classList.add("hidden");
    }
});

//Finalizar o pedido
checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) return;

    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Verificar se pelo menos um checkbox está marcado
     
    if (!pix.checked && !cartao.checked && !dinheiro.checked) {
        checkboxWarn.classList.remove("hidden");
        checkboxWarn.classList.add("border-red-500");
        return;
    }

    // Verificar qual checkbox está marcada
    let selectedPaymentMethod = "";
    if (pix.checked) selectedPaymentMethod = "Pix";
    if (cartao.checked) selectedPaymentMethod = "Cartão";
    if (dinheiro.checked) selectedPaymentMethod = "Dinheiro";

    //Enviar o pedido para a API do Whats
    const cartItems = cart.map((item) => {
        return `(${item.quantity}) ${item.name} - Preço: R$ ${item.price}`;
    }).join("\n");

    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const totalFormatted = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    const message = encodeURIComponent(
        `Pedido: \n${cartItems} \n\nTotal: ${totalFormatted} \nEndereço: ${addressInput.value}\nMétodo de Pagamento: ${selectedPaymentMethod}`
    );
    const phone = "+5583991387015";

    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");

    cart = [];
    updateCartModal();
});

//Verificar a hora e manipular o card horário
function checkRestaurantOpen() {
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22;
    //true = restaurante está aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}
