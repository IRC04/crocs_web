
const broker = "wss://broker.emqx.io:8084/mqtt"; 
const topic = "pedido/cliente";
const clientId = "web_" + parseInt(Math.random() * 100000);

const client = new Paho.MQTT.Client(broker, clientId);


client.connect({
  onSuccess: () => console.log("Conectado a MQTT"),
  onFailure: err => console.error("Fallo conexión MQTT", err),
  useSSL: true
});


document.getElementById('btn-pedir').addEventListener('click', () => {
  mostrarOpciones();
  enviarPedido();
});
document.getElementById('btn-auxiliar').addEventListener('click', mostrarProcesando);
document.getElementById('btn-compra').addEventListener('click', () => mostrarMensaje('Compra Realizada'));
document.getElementById('btn-devolucion').addEventListener('click', () => mostrarMensaje('Colóquelo en la ventana de devolución'));
document.getElementById('btn-volver').addEventListener('click', volverAlInicio);


function enviarPedido() {
  const talla = document.querySelector('.select-talla').value;
  const color = document.querySelector('.select-color').value;

  fetch("/enviar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ talla, color })
  })
  .then(res => res.json())
  .then(data => console.log("Respuesta del servidor:", data))
  .catch(err => console.error("Error enviando al servidor:", err));
}



function mostrarOpciones() {
  document.querySelector('.tarjeta-principal').style.display = 'none';
  document.querySelector('.opciones').style.display = 'flex';
}

function mostrarProcesando() {
  document.querySelector('.opciones').style.display = 'none';
  document.querySelector('.procesando').style.display = 'block';

  setTimeout(() => {
    document.querySelector('.procesando').style.display = 'none';
    document.querySelector('.acciones').style.display = 'block';
  }, 2000);
}

function mostrarMensaje(texto) {
  document.querySelector(".acciones").style.display = 'none';
  document.querySelector(".mensaje-final").style.display = 'block';
  document.getElementById("mensaje-texto").textContent = texto;
}

function volverAlInicio() {
  document.querySelector(".mensaje-final").style.display = "none";
  document.querySelector(".tarjeta-principal").style.display = "flex";
}
