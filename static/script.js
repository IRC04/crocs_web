// script.js

document.addEventListener('DOMContentLoaded', () => {
  // 1) Mapea cada color con su fichero .glb
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

  // Ruta base de modelos
  const modelFolder = '../static/images/';
  const colorSelect = document.getElementById('color');
  const modelViewer = document.getElementById('croc-viewer');

  // Función para actualizar el modelo
  function updateModel() {
    const color = colorSelect.value;
    if (!color || !modelMap[color]) return;
    const newSrc = modelFolder + modelMap[color];
    console.log('Cambiando modelo a:', newSrc);
    modelViewer.setAttribute('src', newSrc);
  }

  // Listener para cambio de color
  colorSelect.addEventListener('change', updateModel);

  // 2) Conectar al broker EMQX por WSS
  console.log('Intentando conectar a MQTT...');
  const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');

  client.on('connect', () => console.log('✅ Conectado a MQTT por WSS'));
  client.on('error', err => console.error('❌ Error MQTT:', err));
  client.on('reconnect', () => console.log('⏳ Reintentando conexión MQTT...'));

  // 3) Capturar el submit del formulario
  const form = document.getElementById('pedidoForm');
  form.addEventListener('submit', e => {
    e.preventDefault();

    // Leer valores
    const talla = document.getElementById('talla').value;
    const color = colorSelect.value;

    if (!talla || !color) {
      alert('Por favor, selecciona talla y color.');
      return;
    }

    // Construir y publicar JSON
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