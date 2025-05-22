// script.js
document.addEventListener('DOMContentLoaded', () => {
  // 1) Conectar al broker EMQX por WSS
  console.log('Intentando conectar a MQTT...');
  const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

  client.on('connect', () => {
    console.log('✅ Conectado a MQTT por WSS');
  });
  client.on('error', err => {
    console.error('❌ Error MQTT:', err);
  });
  client.on('reconnect', () => {
    console.log('⏳ Reintentando conexión MQTT...');
  });

  // 2) Localizar el botón de enviar
  const sendButton = document.querySelector('.card button[type="submit"]');
  if (!sendButton) {
    console.error('❌ No he encontrado el botón de envío en el DOM');
    return;
  }

  // 3) Al hacer click en el botón...
  sendButton.addEventListener('click', (e) => {
    e.preventDefault();  // evita recargas

    // 4) Leer valores de los selects
    const tallaEl = document.getElementById('talla');
    const colorEl = document.getElementById('color');
    const talla = tallaEl ? tallaEl.value : '';
    const color = colorEl ? colorEl.value : '';

    if (!talla || !color) {
      alert('Por favor, selecciona talla y color.');
      return;
    }

    // 5) Construir y publicar el payload
    const payload = JSON.stringify({ talla, color });
    console.log('Payload a enviar:', payload);

    if (client.connected) {
      client.publish('tienda/pedidos', payload, {}, err => {
        if (err) {
          console.error('❌ Publicación fallida:', err);
          alert('Error al enviar el pedido. Revisa la consola.');
        } else {
          console.log('✅ Pedido publicado correctamente');
          alert(`Pedido enviado:\n${payload}`);
        }
      });
    } else {
      alert('Aún no se ha conectado al broker MQTT. Inténtalo de nuevo en unos segundos.');
    }
  });
});