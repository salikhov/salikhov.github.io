var typerValue = 'Maxim';
var typerIndex = 0;
var typeDelay = 300;

var typeInterval = setInterval(typeChar, typeDelay);

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
