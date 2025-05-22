

document.addEventListener('DOMContentLoaded', () => {
  // Mapea cada color con su fichero .glb (nombres según tus archivos existentes)
  const modelMap = {
    Rojo: 'Crocs-Rojo.glb',
    Azul: 'Crocs-Azul.glb',
    Verde: 'Crocs-Verde.glb',
    Negro: 'Crocs-Negro.glb',
    Blanco: 'Crocs-Blanco.glb',
    Amarillo: 'Crocs-Amarillo.glb',
    Morado: 'Crocs-Morado.glb',
    Rosa: 'Crocs-Rosa.glb',
  };

  // Ruta base donde guardas los modelos (ajusta si están en 'images' o 'models')
  const modelFolder = '../static/images/';

  const colorSelect = document.getElementById('color');
  const modelViewer = document.getElementById('croc-viewer');

  colorSelect.addEventListener('change', () => {
    const color = colorSelect.value;
    if (!color || !modelMap[color]) return;

    const newSrc = modelFolder + modelMap[color];
    modelViewer.src = newSrc; // También puedes usar setAttribute si quieres
  });

  // Eventos para cambio inmediato
  colorSelect.addEventListener('input', updateModel);
  colorSelect.addEventListener('change', updateModel);
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

  // 2) Capturar el submit del formulario
  const form = document.getElementById('pedidoForm');
  form.addEventListener('submit', e => {
    e.preventDefault();

    // 3) Leer valores
    const talla = document.getElementById('talla').value;
    const color = document.getElementById('color').value;

    if (!talla || !color) {
      alert('Por favor, selecciona talla y color.');
      return;
    }

    // 4) Construir JSON
    const payload = JSON.stringify({ talla, color });
    console.log('Payload a enviar:', payload);

    // 5) Publicar JSON en MQTT
    // Esperar a estar conectado antes de publicar
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