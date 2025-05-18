import os
import json
import time
from flask import Flask, request, render_template, jsonify
import paho.mqtt.client as mqtt

app = Flask(__name__)

# Configuración MQTT
MQTT_BROKER = 'broker.hivemq.com'
MQTT_PORT   = 1883
MQTT_TOPIC  = 'tienda/respuesta'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    data = request.get_json(force=True)
    talla = data.get('talla')
    color = data.get('color')

    if not talla or not color:
        return jsonify({'error': 'Faltan datos'}), 400

    # Preparamos payload en JSON
    payload = json.dumps({
        'talla': talla,
        'color': color
    })

    print("📤 Enviando mensaje MQTT:", payload)

    # Publicamos de forma síncrona
    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(MQTT_TOPIC, payload)
    client.disconnect()

    return jsonify({'status': 'Mensaje enviado correctamente'})

if __name__ == '__main__':
    # Render inyecta el puerto en la var. de entorno PORT
    port = int(os.environ.get('PORT', 5000))
    # Bind a 0.0.0.0 para que Render lo exponga
    app.run(debug=True, host='0.0.0.0', port=port)
