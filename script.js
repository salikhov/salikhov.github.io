const typerValue = 'Maxim';
let typerIndex = 0;
const typeDelay = 300;

const typeInterval = setInterval(typeChar, typeDelay);

function typeChar() {
  if (typerIndex < typerValue.length) {
    var typerElement = document.getElementById('typer');
    var existingHTML = typerElement.innerHTML;
    typerElement.innerHTML = existingHTML + typerValue.charAt(typerIndex);
    typerIndex++;
  } else {
    clearInterval(typeInterval);
  }
}