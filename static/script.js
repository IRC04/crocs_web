document.addEventListener('DOMContentLoaded', () => {
  // === MODELO 3D ===
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

  const modelFolder = '../static/images/';
  const colorSelect = document.getElementById('color');
  const modelViewer = document.getElementById('croc-viewer');

  function updateModel() {
    const color = colorSelect.value;
    if (!color || !modelMap[color]) return;
    const newSrc = modelFolder + modelMap[color];
    modelViewer.setAttribute('src', newSrc);
  }

  if (colorSelect) {
    colorSelect.addEventListener('change', updateModel);
  }

  // === MQTT (solo conexión) ===
  const client = mqtt.connect('wss://broker.emqx.io:8084/mqtt');
  client.on('connect', () => console.log('✅ Conectado a MQTT por WSS'));
  client.on('error', err => console.error('❌ Error MQTT:', err));

 

  // === BOTÓN ENVIAR ===
  const sendBtn = document.getElementById('sendBtn');
  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const talla = document.getElementById('talla').value;
      const color = document.getElementById('color').value;
      const nombre = document.getElementById('nombre').value;
      const dni    = document.getElementById('dni').value;

      if (!talla || !color || !nombre || !dni) {
        alert('Rellena todos los campos antes de enviar.');
        return;
      }

      document.getElementById('pedidoForm').submit();
    });
  }



  // === QR COMPRA / DEVOLUCIÓN ===
  const btnCompra = document.getElementById('btnCompra');
  const btnDevolucion = document.getElementById('btnDevolucion');
  const qrCompra = document.getElementById('qrCompra');
  const qrDevolucion = document.getElementById('qrDevolucion');

  if (btnCompra && qrCompra && btnDevolucion && qrDevolucion) {
    btnCompra.addEventListener('click', () => {
      qrCompra.src = '../static/images/venta.png';
      qrCompra.style.display = 'block';
      qrDevolucion.style.display = 'none';
    });

    btnDevolucion.addEventListener('click', () => {
      qrDevolucion.src = '../static/images/devolucion.png';
      qrDevolucion.style.display = 'block';
      qrCompra.style.display = 'none';
    });
  }
});