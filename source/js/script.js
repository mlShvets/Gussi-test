const accordions = document.querySelectorAll('.services__accordion');
const minusBtn = document.querySelector('.quantity__btn--minus');
const plusBtn = document.querySelector('.quantity__btn--plus');
const quantityNumber = document.querySelector('.quantity__number');
const cost = document.querySelector('.cost__number');
const slides = document.querySelectorAll('.slider__item');
const sliderNumber = document.querySelector('.slider__number');
const sliderTotal = document.querySelector('.slider__total');
const prevBtn = document.querySelector('.slider__btn--prev');
const nextBtn = document.querySelector('.slider__btn--next');
let index = 0;
const PRICE = 120;

//accordion

for (const accordion of accordions) {
  accordion.addEventListener('click', function () {
    this.classList.toggle('services__accordion--open');
    const panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = `${panel.scrollHeight  }px`;
    }
  });
}

//slider

const activeSlide = (number) => {
  for (const slide of slides) {
    slide.classList.remove('slider__item--current');
  }
  slides[number].classList.add('slider__item--current');
  slides.forEach((slide) => {
    if (slide.classList.contains('slider__item--current')) {
      sliderNumber.textContent = `0${number+1}`;
    }
  });
};

const nextSlide = () => {
  if (index === slides.length - 1) {
    index = 0;
    activeSlide(index);
  } else {
    index++;
    activeSlide(index);
  }
};

const prevSlide = () => {
  if (index === 0) {
    index = slides.length - 1;
    activeSlide(index);
  } else {
    index--;
    activeSlide(index);
  }
};

nextBtn.addEventListener('click', nextSlide);
prevBtn.addEventListener('click', prevSlide);

slides.length < 10 ? sliderTotal.textContent = `0${slides.length}` : sliderTotal.textContent = `${slides.length}`;

//quantity counter

const getCosts = (count) => `${count*PRICE}`;

const getQuantity = () => {
  plusBtn.addEventListener('click', () => {
    quantityNumber.value++;
    cost.textContent = getCosts(quantityNumber.value);
    if (quantityNumber.value > '1') {
      minusBtn.removeAttribute('disabled');
    }
  });
  minusBtn.addEventListener('click', () => {
    if (quantityNumber.value > '1') {
      minusBtn.removeAttribute('disabled');
      quantityNumber.value--;
      cost.textContent = getCosts(quantityNumber.value);
    } else {
      minusBtn.setAttribute('disabled', 'disabled');
    }
  });
};

getQuantity();
