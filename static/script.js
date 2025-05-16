// Rellenar select de tallas
const selectTalla = document.getElementById('talla');
for (let i = 37; i <= 44; i++) {
  const option = document.createElement('option');
  option.value = i;
  option.textContent = i;
  selectTalla.appendChild(option);
}

// Función para mostrar opciones QR
document.getElementById('btn-pedir').onclick = function () {
  document.getElementById('formulario-inicial').style.display = 'none';
  document.getElementById('opciones').style.display = 'flex';

  // MQTT: publicar pedido
  const talla = document.getElementById('talla').value;
  const color = document.getElementById('color').value;
  // mqttPublish('pedido', JSON.stringify({ talla, color }));
};

// Función para mostrar mensaje de procesando
document.getElementById('btn-auxiliar').onclick = function () {
  document.getElementById('opciones').style.display = 'none';
  document.getElementById('procesando').style.display = 'block';

  // MQTT: auxiliar activado
  // mqttPublish('auxiliar', 'solicitud');

  setTimeout(() => {
    document.getElementById('procesando').style.display = 'none';
    document.getElementById('acciones').style.display = 'block';
  }, 2000);
};

// Funciones para Compra y Devolución
document.getElementById('btn-compra').onclick = function () {
  mostrarMensaje('Compra Realizada');
  // mqttPublish('accion', 'compra');
};

document.getElementById('btn-devolucion').onclick = function () {
  mostrarMensaje('Colóquelo en la ventana de devolución');
  // mqttPublish('accion', 'devolucion');
};

// Mostrar mensaje final
function mostrarMensaje(texto) {
  document.getElementById('acciones').style.display = 'none';
  document.getElementById('mensaje-final').style.display = 'block';
  document.getElementById('mensaje-texto').textContent = texto;
}

// Reiniciar formulario
document.getElementById('btn-reiniciar').onclick = function () {
  document.getElementById('mensaje-final').style.display = 'none';
  document.getElementById('formulario-inicial').style.display = 'flex';
};