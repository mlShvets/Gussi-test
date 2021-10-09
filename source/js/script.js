// JS
const accordions = document.querySelectorAll('.services__accordion');
const minusBtn = document.querySelector('.quantity__btn--minus');
const plusBtn = document.querySelector('.quantity__btn--plus');
const quantityNumber = document.querySelector('.quantity__number');

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

//quantity counter

const getQuantity = () => {
  plusBtn.addEventListener('click', () => {
    quantityNumber.value++;
    if (quantityNumber.value > '1') {
      minusBtn.removeAttribute('disabled');
    }
  });
  minusBtn.addEventListener('click', () => {
    if (quantityNumber.value > '1') {
      minusBtn.removeAttribute('disabled');
      quantityNumber.value--;
    } else {
      minusBtn.setAttribute('disabled', 'disabled');
    }
  });
};

getQuantity();
