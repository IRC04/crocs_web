document.getElementById('enviar').addEventListener('click', async () => {
  const talla = document.getElementById('talla').value;
  const color = document.getElementById('color').value;

  if (!talla || !color) {
    alert('Por favor selecciona talla y color');
    return;
  }

  try {
    const res = await fetch('/enviar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ talla, color })
    });
    const data = await res.json();
    console.log('Respuesta del servidor:', data);
  } catch (err) {
    console.error('Error al enviar pedido:', err);
  }
});
