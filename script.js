// Constants
const MOCK_API_URL = "https://mockapi.example.com/products"; // Replace with a real API URL if available

// Helper Functions
const toggleClass = (element, className) => {
    element.classList.toggle(className);
};

const showElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) element.classList.remove('hidden');
};

const hideElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) element.classList.add('hidden');
};

const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];
const saveToLocalStorage = (key, value) => localStorage.setItem(key, JSON.stringify(value));

// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    toggleClass(sidebar, 'active');
}

// Navigation: Show/Hide Sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => hideElement(section.id)); // Hide all sections
    showElement(sectionId); // Show the selected section

    // Update UI for dynamic sections
    if (sectionId === "cart") {
        updateCartUI();
    } else if (sectionId === "favorites") {
        updateFavoritesUI();
    }
    else if (sectionId === "categories") {
        loadCategories();
    }
}

// Dynamic Category Loading
function loadCategories() {
    const categoriesContainer = document.getElementById('categories-container');
    const categories = [
        "Electronics",
        "Kitchen Appliances",
        "Home Decor",
        "Fashion",
        "Books",
        "Sports Equipment",
    ];

    // Show Specific Category (Placeholder Functionality)
function showCategory(category) {
    alert(`You clicked on ${category}`);
    // You can expand this function to dynamically load category-specific products or content.
}

    // Clear previous categories
    categoriesContainer.innerHTML = "";

    // Dynamically add category buttons
    categories.forEach((categories) => {
        const button = document.createElement("button");
        button.className = "category-btn";
        button.innerText = categories;
        button.onclick = () => handleCategoryClick(categories);
        categoriesContainer.appendChild(button);
    });
}

// Handle Click on a Category
function handleCategoryClick(categories) {
    alert(`You clicked on ${categories}!`);
    // Optionally redirect or load a specific page for this category
}

// Search Product
async function searchProduct() {
    const searchTerm = document.getElementById('search-bar').value.trim();

    if (!searchTerm) {
        alert('Please enter a product name to search.');
        return;
    }

    try {
        showLoadingMessage('Searching for products...');
        const productData = await fetchProductData(searchTerm);
        displayComparison(productData);
    } catch (error) {
        console.error('Error fetching product data:', error);
        alert('Failed to fetch product data. Please try again later.');
    } finally {
        hideLoadingMessage();
    }
}

// Mock Function to Fetch Product Data
async function fetchProductData(searchTerm) {
    // Simulated delay and mock response
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                flipkart: {
                    price: '₹1,89,900',
                    rating: '4.6',
                    features: ['SSD:1 TB','RAM:16GB','USB PORT : 3 x thunderbolt 4(USB -C)'],
                    reviews: ['Good quality!', 'Value for money!','Battery is good'],
                },
                amazon: {
                    price: '₹1,69,900',
                    rating: '4.5',
                    features: ['Liquid retina XDR display', '16GB Unified Memory ','SSD:512GB'],
                    reviews: ['Fast delivery!', 'Great packaging!','guality is very good'],
                },
            });
        }, 1500);
    });
}

// Display Comparison Results
function displayComparison(productData) {
    const { flipkart, amazon } = productData;

    // Flipkart Data
    document.getElementById('flipkart-price').innerText = flipkart.price || 'N/A';
    document.getElementById('flipkart-rating').innerText = flipkart.rating || 'N/A';
    document.getElementById('flipkart-features').innerHTML = flipkart.features
        .map((feature) => `<li>${feature}</li>`)
        .join('');
    document.getElementById('flipkart-reviews').innerHTML = flipkart.reviews
        .map((review) => `<p>${review}</p>`)
        .join('');

    // Amazon Data
    document.getElementById('amazon-price').innerText = amazon.price || 'N/A';
    document.getElementById('amazon-rating').innerText = amazon.rating || 'N/A';
    document.getElementById('amazon-features').innerHTML = amazon.features
        .map((feature) => `<li>${feature}</li>`)
        .join('');
    document.getElementById('amazon-reviews').innerHTML = amazon.reviews
        .map((review) => `<p>${review}</p>`)
        .join('');

    // Show Comparison Section
    showSection('comparison');
}
// Loading Message
function showLoadingMessage(message) {
    const loadingElement = document.createElement('div');
    loadingElement.id = 'loading-message';
    loadingElement.innerText = message;
    loadingElement.style.position = 'fixed';
    loadingElement.style.top = '50%';
    loadingElement.style.left = '50%';
    loadingElement.style.transform = 'translate(-50%, -50%)';
    loadingElement.style.padding = '20px';
    loadingElement.style.background = 'rgba(0, 0, 0, 0.7)';
    loadingElement.style.color = '#fff';
    loadingElement.style.borderRadius = '8px';
    loadingElement.style.zIndex = '1000';
    document.body.appendChild(loadingElement);
}

function hideLoadingMessage() {
    const loadingElement = document.getElementById('loading-message');
    if (loadingElement) loadingElement.remove();
}

// Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
    updateFavoritesUI();
});
// Sidebar Toggle
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
}

// Navigation: Show/Hide Sections
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((section) => section.classList.remove('active')); // Hide all sections
    const targetSection = document.getElementById(sectionId);
    if (targetSection) targetSection.classList.add('active'); // Show selected section
}

// Add to Cart
function addToCart(platform) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    cartItems.push(`Item from ${platform}`);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
}

// Update Cart UI
function updateCartUI() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartList = document.getElementById('cart-items');
    cartList.innerHTML = cartItems.length
        ? cartItems.map((item) => `<li>${item}</li>`).join('')
        : '<li>Your cart is empty.</li>';
}

// Clear Cart
function clearCart() {
    localStorage.removeItem('cart');
    updateCartUI();
}

// Initialize UI on Load
document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
});
// Load environment variables from .env file
require('dotenv').config();

// Access the Flipkart and Amazon API keys from environment variables
const flipkartApiKey = process.env.FLIPKART_API_KEY;
const amazonApiKey = process.env.AMAZON_API_KEY;

console.log('Flipkart API Key:', flipkartApiKey);
console.log('Amazon API Key:', amazonApiKey);
function buyNow(platform) {
    let url;
    if (platform === 'Flipkart') {
        url = 'https://www.flipkart.com';
    } else if (platform === 'Amazon') {
        url = 'https://www.amazon.in';
    }
    // Redirect the user to the selected platform's URL
    if (url) {
        window.location.href = url;
    } else {
        alert('Platform URL not found!');
    }
}
function toggleProfileMenu() {
    const profileMenu = document.getElementById("profile-menu");
    
    // Toggle the hidden class
    profileMenu.classList.toggle("hidden");

    // If menu is visible, add event listener for outside clicks
    if (!profileMenu.classList.contains("hidden")) {
        document.addEventListener("click", closeMenuOnClickOutside);
    } else {
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}

function closeMenuOnClickOutside(event) {
    const profileMenu = document.getElementById("profile-menu");
    const profileIcon = document.querySelector(".profile-icon");

    // Close the menu if the click is outside the menu or the profile icon
    if (!profileMenu.contains(event.target) && !profileIcon.contains(event.target)) {
        profileMenu.classList.add("hidden");
        document.removeEventListener("click", closeMenuOnClickOutside);
    }
}


// Toggle profile menu visibility
function toggleProfileMenu() {
    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("hidden");
}

// Toggle profile menu visibility
function toggleProfileMenu() {
    const profileMenu = document.getElementById("profile-menu");
    profileMenu.classList.toggle("hidden");
}

// Open the modal for sign-in or log-in
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "flex"; // Show modal as flex to center it
}

// Close the modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "none"; // Hide modal
}

// Close the modal when clicking outside of it
window.onclick = function(event) {
    const signInModal = document.getElementById("sign-in-modal");
    const logInModal = document.getElementById("log-in-modal");

    if (event.target === signInModal) {
        signInModal.style.display = "none";
    } else if (event.target === logInModal) {
        logInModal.style.display = "none";
    }
};

// Handle Sign Up Form Submission
function handleSignUp(event) {
    event.preventDefault();
    const email = document.getElementById("sign-in-email").value;
    const password = document.getElementById("sign-in-password").value;
    console.log("Signing up with", email, password);
    closeModal('sign-in-modal');
}

// Handle Log In Form Submission
function handleLogIn(event) {
    event.preventDefault();
    const email = document.getElementById("log-in-email").value;
    const password = document.getElementById("log-in-password").value;
    console.log("Logging in with", email, password);
    closeModal('log-in-modal');
}

// Toggle between the initial log-in screen and the form fields
function toggleFormFields(formId, initialId) {
    document.getElementById(formId).classList.remove("hidden");
    document.getElementById(initialId).classList.add("hidden");
}

// Go back to the initial log-in screen
function goBack(formId, initialId) {
    document.getElementById(formId).classList.add("hidden");
    document.getElementById(initialId).classList.remove("hidden");
}


const topSearches = [
    { name: "Product 1", link: "product1.html" },
    { name: "Product 2", link: "product2.html" },
    { name: "Product 3", link: "product3.html" },
    { name: "Product 4", link: "product4.html" },
];

const topSearchesContainer = document.getElementById('top-searches');

topSearches.forEach(product => {
    const productCard = document.createElement('a');
    productCard.className = 'product-card';
    productCard.href = product.link;
    productCard.textContent = product.name;
    topSearchesContainer.appendChild(productCard);
});

// Toggle Profile Menu (Show/Hide)
function toggleProfileMenu() {
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.toggle('show');
}

// Open Modal (Log In or Sign Up)
function openModal(modalId) {
    closeAllModals(); // Close any open modals
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
}

// Close All Modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => modal.classList.remove('show'));
}

// Go Back Button (Close Modal and Return to Profile Menu)
function goBack() {
    closeAllModals(); // Close the modal
    const profileMenu = document.getElementById('profile-menu');
    profileMenu.classList.remove('show'); // Close the profile menu
}
