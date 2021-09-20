'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');
const nav = document.querySelector('.nav');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////

// button scrollTo
btnScrollTo.addEventListener('click', function (e) {
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (x,y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'Height/Width of viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // // Scrolling
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );

  // // Smoothing scrolling
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////////
// Page Navigation
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// Page Navigation with event delegation
// 1. Add event listener to common parent element
//2. Determine what element originated the event

document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  // Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Tabbed components

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard  clause
  if (!clicked) return;

  // Remove active classes
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  // active tab
  clicked.classList.add('operations__tab--active');

  // activate content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

// Passing "argument" to an eventHandler function
nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1.0));

// const initialCoords = section1.getBoundingClientRect();
// console.log(initialCoords);

// // Sticky Navigation
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);

//   if (window.scrollY > initialCoords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// });

/*
// Intersection observer API
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
// console.log(observer);
*/

// Sticky navigation
const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;
const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);

// Reveal section
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

// Lazy loading image
const imgTargets = document.querySelectorAll('img[data-src]');

const loading = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  // Replace src with data-src
  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  observer.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loading, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});

imgTargets.forEach(img => imgObserver.observe(img));

// Slider
const slider = function () {
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');

  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  const goToSlide = function (slide) {
    slides.forEach(function (s, i) {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
    activateDot(slide);
  };

  // Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) curSlide = 0;
    else curSlide++;
    goToSlide(curSlide);
  };

  // Prev Slide
  const prevSlide = function () {
    if (curSlide === 0) curSlide = maxSlide - 1;
    else curSlide--;
    goToSlide(curSlide);
  };

  const init = function () {
    createDots();
    goToSlide(0);
  };
  init();

  // Event Handler
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);

  // Keyboard event
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  // Event handler
  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
    }
  });
};
slider();

///////////////////////////////////////
/////////////////////////-//////////////

/*
// Selecting elements

// Selecting document's element
console.log(document.documentElement);

// Selecting document's head's element
console.log(document.head);

// Selecting document's body's element
console.log(document.body);

// Select one element
const header = document.querySelector('.header');

// Select all elements at once
const allSections = document.querySelectorAll('.section');
console.log(allSections);

// console.log(document.getElementById('section--1'));
document.getElementById('section--1');
const allBtns = document.getElementsByTagName('button');
console.log(allBtns);

console.log(document.getElementsByClassName('btn'));

console.log(document.getElementsByName('fname'));

// Creating and inserting elements
//.insertAdjacentHTML()

const message = document.createElement('div');
message.classList.add('cookie-message');

// message.textContent =
//   'We use cookies for improved functionality and analytics <button>Accept</button>';

message.innerHTML =
  'We use cookies for improved functionality and analytics <button class="btn btn--close-cookie">Got it!</button>';

// document.querySelector('.header').prepend(message);
document.querySelector('.header').append(message);
// document.querySelector('.header').append(message.cloneNode(true));

// document.querySelector('.header').before(message);
// document.querySelector('.header').after(message);
// header.before('This is before header');
// alert(
//   'Hello, Ravi Shankar Singh Nishan\nIt seems that you are coding from a long time\n but you have to work a lot for your dream\n So Keep coding, and keep learning!!'
// );

// const nav = header.querySelector('nav');
// nav.after('This is after navigation. Your are coding this code successfully.');

// Delete Elements / Remove Elements

// Modern way to remove element using "remove()" method
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    message.remove();
  });

// // Older way to remove element using "removeChild()" method
// document
//   .querySelector('.btn--close-cookie')
//   .addEventListener('click', function () {
//     message.parentElement.removeChild(message);
//   });

// Styles
// style property sets inline-style in element
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

// Extract inline-style
console.log(message.style.color);
console.log(message.style.backgroundColor);

// getComputedStyle() function
console.log(getComputedStyle(message).color);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

console.log(message.style.height);

document.documentElement.style.setProperty('--color-primary', 'orangered');

message.style.setProperty('font-size', '30px');

// Attribute
const logo = document.querySelector('.nav__logo');
console.log(logo);
console.log(logo.src);
console.log(logo.alt);
logo.alt = 'A pic of Ravi Shankar Singh Nishan after becoming trillionare.';
console.log(logo.alt);
console.log('Class name is: ', logo.className);

// Non-standard Attribute
console.log(logo.designer);

console.log(logo.getAttribute('designer'));
logo.setAttribute('Co-designer', 'Rashmika Shankar Singh Nishan');
console.log(logo.getAttribute('Co-designer'));
logo.setAttribute('Company', 'Bankist');
console.log('Company type from logo: ', logo.getAttribute('company'));

//print absolute URL
console.log(logo.src);
console.log(logo.getAttribute('src'));

const link = document.querySelector('.twitter-link');
console.log(link.href);
console.log(link.getAttribute('href'));

// console.log(document.body);
const navLink = document.querySelector('.nav__link');
console.log(navLink.href);
console.log(navLink.getAttribute('href'));

const navLinkBtn = document.querySelector('.nav__link--btn');
console.log(navLinkBtn.href);
console.log(navLinkBtn.getAttribute('href'));

// Data-set Attribute
console.log(logo.dataset.versionNumber);
console.log(dataset);

*/
/*
// const btnScrollTo = document.querySelector('.btn--scroll-to');

// const section1 = document.querySelector('#section1');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1Coords = section1.getBoundingClientRect();
  // console.log(s1Coords);

  // console.log(e.target.getBoundingClientRect());
  // console.log('Current scroll (x,y)', window.pageXOffset, window.pageYOffset);

  // console.log(
  //   'Height/Width of viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // // Scrolling
  // window.scrollTo(
  //   s1Coords.left + window.pageXOffset,
  //   s1Coords.top + window.pageYOffset
  // );

  // // Smoothing scrolling
  // window.scrollTo({
  //   left: s1Coords.left + window.pageXOffset,
  //   top: s1Coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});
*/

// console.log('Total height of the document:', document.body.clientHeight);
// console.log(document.documentElement.clientWidth);
// console.log(document.documentElement.clientHeight);
// console.log(section1.clientHeight);

/*
// window.scrollTo(s1Coords);
console.log(section1.getBoundingClientRect());

const goToTop = document.querySelector('.f--link');
//console.log(goToTop);
goToTop.addEventListener('click', function () {
  // window.scrollTo({ left: 0, top: 0, behavior: 'smooth' });

  document.querySelector('.header').scrollIntoView({ behavior: 'smooth' });

  // document.documentElement.scrollIntoView({ behavior: 'smooth' });
});
*/

/*
//Events

const h1 = document.querySelector('h1');

const alertH1 = function () {
  alert('addEventListener: Great you are reading the heading :D');
};
h1.addEventListener('mouseenter', alertH1);

setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 3000);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: Great you are reading the heading :D');
// };

*/

/*
// rgb(255,255,2555)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('LINK', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // Stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('CONTAINER', e.target, e.currentTarget);
  console.log(e.currentTarget === this);

  // stop propagation
  // e.stopPropagation();
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('NAV', e.target, e.currentTarget);
  console.log(e.currentTarget === this);
});

*/

/*
const h1 = document.querySelector('h1');

//Going downwards: child
console.log(h1.querySelectorAll('.highlight'));

console.log(h1.childNodes);
console.log(h1.children);
const node = h1.childNodes;
console.log(node[1]);

console.log(document.querySelector('.header').children);

console.log('First element child: ', h1.firstElementChild);
console.log('Last element child: ', h1.lastElementChild);

// firstElementChild and lastElementChild Property
h1.firstElementChild.style.color = 'white';
h1.lastElementChild.style.color = 'orangered';

// Going upwards: parent
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest('.header').style.background = 'var(--gradient-secondary)';

h1.closest('h1').style.background = 'var(--gradient-primary)';

// Going sideways: siblings
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.parentElement.children);
[...h1.parentElement.children].forEach(function (e) {
  if (e !== h1) e.style.transform = 'scale(0.5)';
});
*/

// document.addEventListener('DOMContentLoaded', function (e) {
//   console.log('HTML parsed and DOM tree built!', e);
// });

// // Load event
// window.addEventListener('load', function (e) {
//   console.log('Page is fully loaded!', e);
// });

// // beforeunload Event
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = 'Why you are cancelling this tab?';
// });
