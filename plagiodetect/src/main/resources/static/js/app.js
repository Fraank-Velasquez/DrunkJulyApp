let textArea;
let btnTrash;
let contadorPalabras;

document.addEventListener("DOMContentLoaded", (event) => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
    }

    textArea = document.getElementById('txtAnalizar');
    btnTrash = document.querySelector('.btn-trash');
    contadorPalabras = document.getElementById('contadortxt');

    const cambiosTxtArea = () => {
        const texto = textArea.value.trim();

        const Palabras = (texto === "") ? 0 : texto.split(/\s+/).length;
        contadorPalabras.innerHTML = `${Palabras}`

        btnTrash.style.display = (texto === "") ? "none" : "flex";

        const isDarkMode = document.body.classList.contains('dark-mode');
        contadorPalabras.style.color = (Palabras >= 10) ? "#d80909" : (isDarkMode ? "#ffffff" : "#3c3c3d");

    }
    typing();
    textArea.addEventListener("input", cambiosTxtArea);

});


let indice = 0;
function typing() {
    const tituloTyping = document.getElementById('typing-title')
    const tituloCompleto = "TECNOLOGÍA GRATIS PARA DETECTAR PLAGIO";
    let velocidad = 100;

    if (indice < tituloCompleto.length) {
        tituloTyping.textContent += tituloCompleto.charAt(indice)
        indice++;

        setTimeout(typing, velocidad);

    }

}

function borrarTexto() {

    textArea = document.getElementById('txtAnalizar');
    btnTrash = document.querySelector('.btn-trash');
    contadorPalabras = document.getElementById('contadortxt');
    textArea.value = "";
    textArea.focus();
    btnTrash.style.display = "none"
    const isDarkMode = document.body.classList.contains('dark-mode');
    contadorPalabras.style.color = isDarkMode ? "#ffffff" : "#3c3c3d";
    contadorPalabras.innerHTML = "0"

}

function modoOscuro() {
    document.body.classList.toggle('dark-mode');

    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    const texto = document.getElementById('txtAnalizar') ? document.getElementById('txtAnalizar').value.trim() : "";
    const Palabras = (texto === "") ? 0 : texto.split(/\s+/).length;
    const contPalabras = document.getElementById('contadortxt');

    if (Palabras < 10 && contPalabras) {
        contPalabras.style.color = isDarkMode ? "#ffffff" : "#3c3c3d";
    }
}
