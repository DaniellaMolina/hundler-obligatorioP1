// Efecto máquina de escribir
const text = "Tu perro feliz, vos tranquilo...";
let i = 0;
const speed = 100;
const typingElement = document.getElementById("typing");
typingElement.textContent = "";

function typeWriter() {
  if (i < text.length) {
    typingElement.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.onload = typeWriter;