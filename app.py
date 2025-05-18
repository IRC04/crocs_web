import os
import json
from flask import Flask, request, jsonify, render_template
import paho.mqtt.client as mqtt

app = Flask(__name__, template_folder='templates', static_folder='static')

# Datos del broker
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

    payload = json.dumps({'talla': talla, 'color': color})
    print("📤 Publicando en MQTT:", payload)

    client = mqtt.Client()
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.publish(MQTT_TOPIC, payload)
    client.disconnect()

    return jsonify({'status': 'Publicado', 'payload': payload})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)