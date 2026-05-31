/**
 * Saima Rizwan | Premium Skincare Website Core Logic
 * Author: Frontend Developer
 * Year: 2026
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. NAVIGATION SCROLL EFFECTS & SPYING
    // ==========================================
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        // Toggle sticky header styling
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Link Switching Logic (Scroll Spy)
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            // Replaced deprecated pageYOffset with modern window.scrollY
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(currentSectionId)) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. PREMIUM SHOPPING CART SYSTEM
    // ==========================================
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const shoppingBagIcon = document.querySelector('.nav-icons a:nth-child(2)');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartCountBadge = document.getElementById('cart-count-badge');
    const cartSubtotalPrice = document.getElementById('cart-subtotal-price');
    const quickAddButtons = document.querySelectorAll('.add-to-cart-btn');

    let cartData = [];

    function toggleCart() {
        cartSidebar.classList.toggle('open');
        cartOverlay.classList.toggle('open');
    }

    if (shoppingBagIcon) {
        shoppingBagIcon.addEventListener('click', (e) => {
            e.preventDefault();
            toggleCart();
        });
    }
    
    if (closeCartBtn) closeCartBtn.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    function updateCartDOM() {
        if (cartData.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-text">Your bag is currently empty.</p>';
            cartCountBadge.innerText = '0';
            cartSubtotalPrice.innerText = '$0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;
        let totalItemsCount = 0;

        cartData.forEach((item, index) => {
            total += (item.price * item.quantity);
            totalItemsCount += item.quantity;

            const row = document.createElement('div');
            row.classList.add('cart-item-row');
            row.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p class="cart-price">${item.quantity} x $${item.price.toFixed(2)}</p>
                    <button class="remove-cart-item" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(row);
        });

        cartCountBadge.innerText = totalItemsCount;
        cartSubtotalPrice.innerText = `$${total.toFixed(2)}`;

        // Re-attach delete handlers to newly rendered nodes
        document.querySelectorAll('.remove-cart-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetIndex = parseInt(e.target.getAttribute('data-index'));
                cartData.splice(targetIndex, 1);
                updateCartDOM();
            });
        });
    }

    function addItemToCart(title, price, img) {
        const existingItem = cartData.find(item => item.title === title);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartData.push({ title, price, img, quantity: 1 });
        }
        updateCartDOM();
    }

    // Integrated visual feedback directly inside data processing
    quickAddButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const title = productCard.querySelector('h3').innerText;
            const priceText = productCard.querySelector('.price').innerText;
            const imgSrc = productCard.querySelector('img').src;
            const priceNumeric = parseFloat(priceText.replace('$', ''));

            // Business Logic Execution
            addItemToCart(title, priceNumeric, imgSrc);
            
            // Component UI Visual Feedback Response
            const originalText = button.innerText;
            button.innerText = 'Added ✓';
            button.style.backgroundColor = '#c4a482'; 
            
            setTimeout(() => {
                button.innerText = originalText;
                button.style.backgroundColor = '';
            }, 2000);

            // Flyout activation
            toggleCart(); 
        });
    });

    // ==========================================
    // 3. INTERACTIVE SKIN QUIZ SYSTEM
    // ==========================================
    const quizOptions = document.querySelectorAll('.quiz-opt');
    const quizStep = document.querySelector('.quiz-step');
    const quizResult = document.getElementById('quiz-result');
    const recCard = document.getElementById('recommendation-card');
    const resetQuizBtn = document.getElementById('reset-quiz-btn');

    const productRecommendations = {
        glow: {
            title: "Halawa Wax",
            desc: "Experience salon-quality hair removal at home with our traditional, all-natural Halawa Wax. Crafted for a gentle yet effective grip, it removes hair from the root while providing a natural exfoliation that leaves your skin feeling silky, smooth, and radiant for weeks. Pure, simple, and perfectly effective for all skin types."
        },
        moisture: {
            title: "Zest Neem",
            desc: "Harness the power of natural neem to deep-cleanse and purify your skin. Formulated to combat acne, soothe irritation, and wash away impurities, our Zest Neem soap leaves your skin feeling refreshed, balanced, and perfectly clear. Experience the gentle, antibacterial touch of nature for a healthier, glowing complexion every day."
        },
        purify: {
            title: "Harbal Hair Oil",
            desc: "Stop hair fall and restore your hair’s health with our specialized herbal treatment. Consistent use for 4–6 weeks deeply nourishes the roots, reduces breakage, and promotes visible strength. Start your journey to thicker, more resilient hair today."
        }
    };

    quizOptions.forEach(opt => {
        opt.addEventListener('click', (e) => {
            const chosenConcern = e.target.getAttribute('data-value');
            const recommendation = productRecommendations[chosenConcern];

            if (recommendation) {
                recCard.innerHTML = `
                    <h4>${recommendation.title}</h4>
                    <p style="font-size: 0.9rem; color: #6e6e6e; margin-top: 8px;">${recommendation.desc}</p>
                `;
                quizStep.style.display = 'none';
                quizResult.style.display = 'block';
            }
        });
    });

    if (resetQuizBtn) {
        resetQuizBtn.addEventListener('click', () => {
            quizResult.style.display = 'none';
            quizStep.style.display = 'block';
        });
    }

    // ==========================================
    // 4. TESTIMONIAL SLIDER SYSTEM
    // ==========================================
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
    }

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            currentSlide = parseInt(e.target.getAttribute('data-slide'));
            showSlide(currentSlide);
        });
    });

    setInterval(() => {
        if (slides.length > 0) {
            currentSlide = (currentSlide + 1) % slides.length;
            showSlide(currentSlide);
        }
    }, 6000);

    // ==========================================
    // 5. CONSULTATION BOOKING MODAL
    // ==========================================
    const openModalBtn = document.getElementById('open-booking');
    const closeModalBtn = document.getElementById('close-booking');
    const bookingModal = document.getElementById('booking-modal');

    if (openModalBtn) {
        openModalBtn.addEventListener('click', () => {
            bookingModal.classList.add('open');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            bookingModal.classList.remove('open');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === bookingModal) {
            bookingModal.classList.remove('open');
        }
    });

    // ==========================================
    // 6. FAQ ACCORDION LOGIC
    // ==========================================
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const currentItem = question.parentElement;
            const answer = currentItem.querySelector('.faq-answer');

            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== currentItem && item.classList.contains('active')) {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            currentItem.classList.toggle('active');

            if (currentItem.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
        });
    });

    // ==========================================
    // 7. NEWSLETTER FORM HANDLING
    // ==========================================
    const newsletterForm = document.getElementById('newsletter-form');
    const formMessage = document.getElementById('form-message');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            formMessage.style.color = '#c4a482';
            formMessage.innerText = 'Thank you for subscribing to Saima Rizwan updates.';
            
            newsletterForm.reset();
            
            setTimeout(() => {
                formMessage.innerText = '';
            }, 5000);
        });
    }
});
// --- 10. Premium Product Category Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Active class shift target
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });


    // --- 11. Interactive Star Rating & Live Review Action ---
    const reviewStars = document.querySelectorAll('.star-rating-select i');
    const reviewForm = document.getElementById('product-review-form');
    const reviewStatus = document.getElementById('review-status-msg');
    let selectedRatingValue = 0;

    // Hover and Click control inside dynamic evaluation stars
    reviewStars.forEach(star => {
        star.addEventListener('click', () => {
            selectedRatingValue = parseInt(star.getAttribute('data-rating'));
            
            // Highlight stars logically based on selected index value
            reviewStars.forEach((s, idx) => {
                if (idx < selectedRatingValue) {
                    s.classList.remove('fa-regular');
                    s.classList.add('fa-solid');
                } else {
                    s.classList.remove('fa-solid');
                    s.classList.add('fa-regular');
                }
            });
        });
    });

    if (reviewForm) {
        reviewForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (selectedRatingValue === 0) {
                reviewStatus.style.color = '#c94c4c'; // Red alert warning
                reviewStatus.innerText = 'Please select a star rating level before submitting.';
                return;
            }

            const clientName = document.getElementById('review-user').value;
            
            // Simulating dynamic database secure post
            reviewStatus.style.color = 'var(--accent-color)';
            reviewStatus.innerText = `Thank you ${clientName}! Your premium feedback has been submitted for moderation approval successfully.`;
            
            // Reset fields cleanly
            reviewForm.reset();
            selectedRatingValue = 0;
            reviewStars.forEach(s => {
                s.classList.remove('fa-solid');
                s.classList.add('fa-regular');
            });

            setTimeout(() => {
                reviewStatus.innerText = '';
            }, 5000);
        });
    }

    // --- 14. Integrated In-App Local Checkout & Automated Notification ---
    const mainCheckoutBtn = document.getElementById('main-checkout-trigger');
    const checkoutFormWrapper = document.getElementById('checkout-form-wrapper');
    const deliveryRow = document.getElementById('delivery-row');
    const grandTotalRow = document.getElementById('grand-total-row');
    const cartItemsContainerElement = document.getElementById('cart-items-container');
    
    let checkoutStage = 1; // Stage 1: Cart View, Stage 2: Form Input Submission

    if (mainCheckoutBtn) {
        mainCheckoutBtn.addEventListener('click', () => {
            // Check validation for items
            const currentSubtotalText = document.getElementById('cart-subtotal-price').innerText;
            if (currentSubtotalText === "$0.00" || currentSubtotalText === "0") {
                alert("Your ritual bag is empty.");
                return;
            }

            if (checkoutStage === 1) {
                // Shift screen animation parameters smoothly to display client inputs
                if (cartItemsContainerElement) cartItemsContainerElement.style.display = 'none';
                if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'block';
                if (deliveryRow) deliveryRow.style.display = 'flex';
                if (grandTotalRow) grandTotalRow.style.display = 'flex';

                // Base pricing calculation loops for local currency conversions
                const baseSubtotal = parseFloat(currentSubtotalText.replace(/[^0-9.-]+/g,""));
                const shippingCost = 5.00; // Flat static rate equivalent to RS 300-500
                
                document.getElementById('cart-delivery-price').innerText = `$${shippingCost.toFixed(2)}`;
                document.getElementById('cart-grand-total').innerText = `$${(baseSubtotal + shippingCost).toFixed(2)}`;

                // Update operational button status text fields
                mainCheckoutBtn.innerText = "Place Secure Order";
                checkoutStage = 2;
            } else if (checkoutStage === 2) {
                // Form field validations check loops
                const nameInp = document.getElementById('cust-name').value.trim();
                const phoneInp = document.getElementById('cust-phone').value.trim();
                const provinceInp = document.getElementById('cust-province').value;
                const cityInp = document.getElementById('cust-city').value.trim();
                const addressInp = document.getElementById('cust-address').value.trim();

                if (!nameInp || !phoneInp || !provinceInp || !cityInp || !addressInp) {
                    alert("Please fill out all shipping details to continue your order.");
                    return;
                }

                // Trigger animated status response popup alerts instantly
                const successPopup = document.getElementById('order-success-popup');
                if (successPopup) {
                    successPopup.classList.add('show-alert');
                    
                    // Clear structural state vectors, fields configurations and close cart panel drawer automatically
                    setTimeout(() => {
                        successPopup.classList.remove('show-alert');
                        
                        // Reset layout back to cart screen setup
                        document.getElementById('direct-checkout-form').reset();
                        if (cartItemsContainerElement) cartItemsContainerElement.style.display = 'block';
                        if (checkoutFormWrapper) checkoutFormWrapper.style.display = 'none';
                        if (deliveryRow) deliveryRow.style.display = 'none';
                        if (grandTotalRow) grandTotalRow.style.display = 'none';
                        
                        mainCheckoutBtn.innerText = "Proceed to Checkout";
                        checkoutStage = 1;

                        // Clear cart items array storage completely logic if defined in project scope
                        if (typeof cartData !== 'undefined') {
                            cartData = [];
                            if (typeof updateCartDOM === 'function') updateCartDOM();
                            if (typeof syncNavbarCartCounter === 'function') syncNavbarCartCounter();
                        }
                        
                        // Close sidebar window container smoothly
                        const cartSidebarPanel = document.getElementById('cart-sidebar');
                        const cartOverlayPanel = document.getElementById('cart-overlay');
                        if (cartSidebarPanel) cartSidebarPanel.classList.remove('open');
                        if (cartOverlayPanel) {
                            cartOverlayPanel.classList.remove('open');
                            cartOverlayPanel.style.opacity = '0';
                            cartOverlayPanel.style.pointerEvents = 'none';
                        }
                    }, 3000); // Exactly 3 seconds execution delay loop
                }
            }
        });
    }
    // --- Premium WhatsApp Concierge Toggler Logic ---
const toggleWhatsappBtn = document.getElementById('toggle-whatsapp-box');
const closeWhatsappBtn = document.getElementById('close-whatsapp-box');
const whatsappChatBox = document.getElementById('whatsapp-chat-box');

if (toggleWhatsappBtn && whatsappChatBox) {
    toggleWhatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        whatsappChatBox.classList.toggle('active');
    });
}

if (closeWhatsappBtn && whatsappChatBox) {
    closeWhatsappBtn.addEventListener('click', () => {
        whatsappChatBox.classList.remove('active');
    });
}
// Quick View Modal Logic
const qvModal = document.getElementById('quick-view-modal');
const closeQv = document.querySelector('.close-modal-btn');
const backdrop = document.querySelector('.modal-backdrop');

// Open modal on product click
document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {

        // Cart button ko ignore karein
        if (e.target.classList.contains('add-to-cart-btn')) return;

        const title = card.querySelector('h3').innerText;
        const price = card.querySelector('.price').innerText;
        const img = card.querySelector('img').src;

        document.getElementById('qv-title').innerText = title;
        document.getElementById('qv-price').innerText = price;
        document.getElementById('qv-img').src = img;
        document.getElementById('qv-desc').innerText =
            "Discover premium herbal skincare crafted with natural, chemical-free ingredients to nourish and protect your skin. Our handmade collection of oils, soaps, and wax products is designed to provide gentle yet effective care for all skin types. Blending traditional herbal remedies with modern skincare standards, our products help improve skin health, hydration, and natural glow. We focus on purity, quality, and eco-friendly beauty solutions that are safe for daily use. Experience the luxury of nature with our herbal range and upgrade your skincare routine with clean, effective, and long-lasting results.";


        qvModal.style.display = 'flex';


    });
});

// Close modal (X button)
closeQv.addEventListener('click', () => {
    qvModal.style.display = 'none';
});

// Close modal (backdrop click)
backdrop.addEventListener('click', () => {
    qvModal.style.display = 'none';
});
