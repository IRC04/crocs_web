// script.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Conectar al broker EMQX por WSS
  const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

  client.on('connect', () => {
    console.log('Conectado a MQTT por WSS');
  });
  client.on('error', err => {
    console.error('Error MQTT:', err);
  });

  // 2) Capturar el submit del formulario
  const form = document.getElementById('pedidoForm');
  form.addEventListener('submit', e => {
    e.preventDefault();

    // 3) Leer valores
    const talla = document.getElementById('talla').value;
    const color = document.getElementById('color').value;

    // 4) Construir y publicar JSON
    const payload = JSON.stringify({ talla, color });
    client.publish('tienda/pedidos', payload, {}, err => {
      if (err) {
        console.error('Publicación fallida:', err);
      } else {
        alert(`Pedido enviado:\n${payload}`);
      }
    });
  });
});