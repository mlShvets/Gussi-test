// // JS

const accordions = document.querySelectorAll('.services__accordion');

for (const accordion of accordions) {
  accordion.addEventListener('click', function () {
    this.classList.toggle('services__accordion--open');
    const content = this.nextElementSibling;
    if (accordion.classList.contains('services__accordion--open')) {
      content.classList.remove('visually-hidden');
      content.style.opacity = 1;
    } else {
      content.classList.add('visually-hidden');
      content.style.opacity = 0;
    }
  });
}
