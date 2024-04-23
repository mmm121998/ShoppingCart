let products = [
    {
        id: 'p1',
        name: 'Gray Tshirt',
        tag: 'graytshirt',
        price: 15,
        inCart: 0
    },
    {
        id: 'p2',
        name: 'Gray Hoodies',
        tag: 'grayhoodies',
        price: 20,
        inCart: 0
    },
    {
        id: 'p3',
        name: 'Black Tshirt',
        tag: 'blacktshirt',
        price: 15,
        inCart: 0
    },
    {
        id: 'p4',
        name: 'Black Hoodies',
        tag: 'blackhoodies',
        price: 20,
        inCart: 0
    },
    {
        id: 'p7',
        name: 'Product7',
        tag: 'product7',
        price: 20,
        inCart: 0
    },
];

// Get product by ID
function getProductById(id) {
    return products.find(product => product.id === id);
}

// Add event listener for each add to cart button
let carts = document.querySelectorAll('.add-cart');
carts.forEach(cart => {
    cart.addEventListener('click', () => {
        // Get product details based on the clicked button's ID
        let productId = cart.getAttribute('data-product-id');
        let product = getProductById(productId);
        console.log(product);
        if (product) {
            cartNumbers(product);
            totalCost(product);
        } else {
            console.error('Product not found');
        }
    });
});

// Function to set initial cart number on page load
function onLoadCartNumber() {
    let productNumbers = localStorage.getItem('cartNumbers');
    if (productNumbers) {
        document.querySelector('.cart span').textContent = productNumbers;
    }
}

// Function to update cart number in local storage
function cartNumbers(product) {
    let productNumbers = localStorage.getItem('cartNumbers');
    productNumbers = parseInt(productNumbers);
    if (productNumbers) {
        localStorage.setItem('cartNumbers', productNumbers + 1);
        document.querySelector('.cart span').textContent = productNumbers + 1;
    } else {
        localStorage.setItem('cartNumbers', 1);
        document.querySelector('.cart span').textContent = 1;
    }
    setItems(product);
}

// Function to update items in cart in local storage
function setItems(product) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    if (cartItems !== null) {
        if (cartItems[product.tag] == undefined) {
            cartItems = {
                ...cartItems,
                [product.tag]: product
            };
        }
        cartItems[product.tag].inCart += 1;
    } else {
        product.inCart = 1;
        cartItems = {
            [product.tag]: product
        };
    }
    localStorage.setItem('productsInCart', JSON.stringify(cartItems));
}

// Function to update total cost in local storage
function totalCost(product) {
    let cardCost = localStorage.getItem('totalCost');
    if (cardCost != null) {
        cardCost = parseInt(cardCost);
        localStorage.setItem('totalCost', cardCost + product.price);
    } else {
        localStorage.setItem('totalCost', product.price);
    }
}

// Function to display items in cart
function displayCart() {
    let cardCost = localStorage.getItem('totalCost');
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);
    let productContainer = document.querySelector('.products');

    if (cartItems && productContainer) {
        productContainer.innerHTML = '';
        Object.values(cartItems).map(item => {
            productContainer.innerHTML += `
                <div class="cartproductdetails">
                    <div class="product">
                        <img class="delete-item" src="x-circle-fill.svg" data-tag="${item.tag}">
                        <img class="cart-productimg" src="/images/${item.tag}.jpg">
                        <span>${item.name}</span>
                    </div>
                    <div class="price">$${item.price},00</div>
                    <div class="quantity">
                        <img class="increase-quantity" src="icons/plus-square.svg" data-tag="${item.tag}">
                        <span>${item.inCart}</span>
                        <img class="decrease-quantity" src="icons/dash-square.svg" data-tag="${item.tag}">
                    </div>
                    <div class="total">$${item.inCart * item.price},00</div>
                </div>
            `;
        });
        productContainer.innerHTML += `
            <div class="basketTotalContainer">
                <h4 class="backetTotalTitle">Basket Total</h4>
                <h4 class="basketTotal">$${cardCost},00</h4>
            </div>
        `;

        // Add event listener for delete buttons
        let deleteButtons = document.querySelectorAll('.delete-item');
        deleteButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tag = button.getAttribute('data-tag');
                removeFromCart(tag);
            });
        });

        // Add event listener for increase quantity buttons
        let increaseButtons = document.querySelectorAll('.increase-quantity');
        increaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tag = button.getAttribute('data-tag');
                increaseQuantity(tag);
            });
        });

        // Add event listener for decrease quantity buttons
        let decreaseButtons = document.querySelectorAll('.decrease-quantity');
        decreaseButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tag = button.getAttribute('data-tag');
                decreaseQuantity(tag);
            });
        });
    }
}

// Function to remove item from cart
function removeFromCart(tag) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems[tag]) {
        const itemQuantity = cartItems[tag].inCart;
        const itemPrice = cartItems[tag].price * itemQuantity;
        delete cartItems[tag];
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));

        // Update total cost
        let cardCost = localStorage.getItem('totalCost');
        cardCost = parseInt(cardCost) - itemPrice;
        localStorage.setItem('totalCost', cardCost);

        // Update cart number
        let productNumbers = localStorage.getItem('cartNumbers');
        productNumbers = parseInt(productNumbers) - itemQuantity;
        localStorage.setItem('cartNumbers', productNumbers);

        // Refresh the cart display
        displayCart();
    }
}

// Function to increase item quantity
function increaseQuantity(tag) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems[tag]) {
        cartItems[tag].inCart += 1;
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));

        // Update total cost
        let cardCost = localStorage.getItem('totalCost');
        cardCost = parseInt(cardCost) + cartItems[tag].price;
        localStorage.setItem('totalCost', cardCost);

        // Update cart number
        let productNumbers = localStorage.getItem('cartNumbers');
        productNumbers = parseInt(productNumbers) + 1;
        localStorage.setItem('cartNumbers', productNumbers);

        // Refresh the cart display
        displayCart();
    }
}

// Function to decrease item quantity
function decreaseQuantity(tag) {
    let cartItems = localStorage.getItem('productsInCart');
    cartItems = JSON.parse(cartItems);

    if (cartItems[tag] && cartItems[tag].inCart > 1) {
        cartItems[tag].inCart -= 1;
        localStorage.setItem('productsInCart', JSON.stringify(cartItems));

        // Update total cost
        let cardCost = localStorage.getItem('totalCost');
        cardCost = parseInt(cardCost) - cartItems[tag].price;
        localStorage.setItem('totalCost', cardCost);

        // Update cart number
        let productNumbers = localStorage.getItem('cartNumbers');
        productNumbers = parseInt(productNumbers) - 1;
        localStorage.setItem('cartNumbers', productNumbers);

        // Refresh the cart display
        displayCart();
    }
}

// Call functions to initialize and display cart
onLoadCartNumber();
displayCart();
