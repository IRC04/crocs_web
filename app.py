import os, json
from flask import Flask, request, jsonify, render_template
import paho.mqtt.client as mqtt

app = Flask(__name__, template_folder='templates')

# Configuración MQTT sobre WebSockets
MQTT_BROKER = 'broker.emqx.io'
MQTT_PORT   = 8083           # WebSocket port (no bloqueado)
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
    print("📤 Publicando en MQTT (WS):", payload)

    # Cliente MQTT sobre WebSockets
    client = mqtt.Client(transport='websockets')
    client.ws_set_options(path="/mqtt")   # EMQX usa /mqtt por defecto
    client.connect(MQTT_BROKER, MQTT_PORT, 60)
    client.loop_start()
    client.publish(MQTT_TOPIC, payload)
    client.loop_stop()
    client.disconnect()

    return jsonify({'status': 'Publicado vía WS', 'payload': payload})

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
