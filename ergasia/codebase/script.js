// Get Header
const header = document.getElementById('header');

// Get menu list
const menuList = document.getElementById('menuList');

// Get overLay layer
const overlay = document.getElementById('overlayLayer');

// Get toggle menu button
const toggleMenuButton = document.getElementById('toggleMenuBtn');

// Get slider area
const sliderArea = document.querySelector('#sliderArea');

// Get slider items
const sliderItems = Array.from(document.querySelectorAll('.testimonial__slider .testimonial__slide'));

// Get number of slides
const slidesCount = sliderItems.length;

// Get previous and next buttons
const nextButton = document.querySelector('#sliderNextBtn');
const previousButton = document.querySelector('#sliderPrevBtn');

// Get slide width
var slideWidth = sliderItems[0].offsetWidth;

// Set current slide
var currentSlide = 0;

// Function definitions
let preventMneuLinksFronFoucs;

// Handle (resize) events
window.addEventListener('resize', () => {
  // Call functions
  preventMneuLinksFronFoucs();
  updateSlideWidth();
});

// Handle (click) event on (previous) and (next) buttons
nextButton.addEventListener('click', nextSlide);
previousButton.addEventListener('click', previousSlide);

// Handle (click) events
toggleMenuButton.addEventListener('click', function() {
  // Check, if the (aria-expanded) value is (false)
  if(toggleMenuButton.getAttribute('aria-expanded') == 'false') {
    // Call function
    openMneu();
  }else { // Else
    // Call function
    closeMenu();
  };
});
overlay.addEventListener('click', closeMenu);

// When scroll change, add class on (header) (the scroll effect of header)
window.addEventListener('scroll', function(e) {
  if(this.scrollY > header.offsetHeight / 2) {
    header.classList.add('header--active');
  }else {
    header.classList.remove('header--active');
  }
});

// Open mneu function
function openMneu() {
  toggleMenuButton.setAttribute('aria-expanded', 'true');
  toggleMenuButton.classList.add('toggle-menu--active');

  document.body.classList.add('scroll-hide');
  menuList.classList.add('navbar__menu--open');
  menuList.querySelectorAll('a').forEach(link => {
    link.setAttribute('tabindex', '0');
  });
  overlay.classList.add('header__overlay--open');

  // Listen for (keydown)
  document.addEventListener('keydown', handleKeyDown);

  // Handle key down function 
  function handleKeyDown(e) {
    if(e.code == 'Tab') {
      // Call function
      menuFocusSystem();
      // Remove the (event listener)
      document.removeEventListener('keydown', handleKeyDown);
    };
  };
};

// Close mneu function
function closeMenu() {
  toggleMenuButton.setAttribute('aria-expanded', 'false');
  toggleMenuButton.classList.remove('toggle-menu--active');
  
  document.body.classList.remove('scroll-hide');
  menuList.classList.remove('navbar__menu--open');
  menuList.querySelectorAll('a').forEach(link => {
    link.setAttribute('tabindex', '-1');
  });
  overlay.classList.remove('header__overlay--open');
};

// Menu focus system function (to control the focus, of the menu when open)
function menuFocusSystem() {
  // Get first and last child of (menuList)
  const firstChild = menuList.querySelectorAll('a')[0];
  const lastChild = menuList.querySelectorAll('a')[menuList.childElementCount - 1];

  // Focus the first item of the menu List
  setTimeout(() => {
    menuList.querySelectorAll('a')[0].focus();
  }, 100);

  // Keep focus inside menu
  menuList.addEventListener('focusin', function(e) {
    if(e.target == lastChild) {
      e.target.addEventListener('focusout', function() {
        toggleMenuButton.focus();
      });
    };
  });
};

// Prevent menu links from focus function
(preventMneuLinksFronFoucs = function () {
  if(window.innerWidth < 640) {
    menuList.querySelectorAll('a').forEach(link => {
      link.setAttribute('tabindex', '-1');
    });
  }else {
    menuList.querySelectorAll('a').forEach(link => {
      link.setAttribute('tabindex', '0');
    });
  }
})();

// Update slide width function
function updateSlideWidth() {
  // Set up (slideWidth) value
  slideWidth = sliderItems[0].offsetWidth;

  // Set (marginLeft) of the (sliderArea)
  sliderArea.style.marginLeft = `-${slideWidth * currentSlide}px`;
};

// Next slide function
function nextSlide() {
  if(!nextButton.classList.contains('disabled')) {
    // increment (currentSlide);
    currentSlide++;
    
    // Call function
    sliderChecker();
  }
};

// Previous slide function
function previousSlide() {
  if(!previousButton.classList.contains('disabled')) {
    // Decrement (currentSlide);
    currentSlide--;
    
    // Call function
    sliderChecker();
  }
};

// Slider checker
function sliderChecker() {
  // Multiply (slideWidth) with (currentSlide)
  let sliderMove = slideWidth * currentSlide;

  // Move (sliderArea) with the (sliderMove) value
  sliderArea.style.marginLeft = `-${sliderMove}px`;

  // Check if (currentslide) is the first
  if(currentSlide == 0) {
    // Add (disabled) class on (previousButton)
    previousButton.classList.add('disabled');

    // Move the focus on (nextButton)
    nextButton.focus();
  }else { // Else
    // Remove (disabled) class from (previousButton)
    previousButton.classList.remove('disabled');
  };

  // Check if (currentslide) is the last
  if(currentSlide == slidesCount - 1) {
    // Add (disabled) class on (nextButton)
    nextButton.classList.add('disabled');

    // Move the focus on (previousButton)
    previousButton.focus();
  }else { // Else
    // Remove (disabled) class from (nextButton)
    nextButton.classList.remove('disabled');
  };
};