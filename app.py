from flask import Flask, render_template, request, jsonify
import paho.mqtt.client as mqtt
import os

app = Flask(__name__)

# Configuración MQTT
BROKER = os.getenv("MQTT_BROKER", "broker.hivemq.com")
PORT   = int(os.getenv("MQTT_PORT", 1883))
TOPIC  = os.getenv("MQTT_TOPIC", "flask/render/test")

# Callbacks MQTT
def on_connect(client, userdata, flags, rc):
    print("MQTT conectado con código:", rc)

def on_message(client, userdata, msg):
    print(f"Recibido en {msg.topic}: {msg.payload.decode()}")

# Cliente MQTT
mqtt_client = mqtt.Client()
mqtt_client.on_connect = on_connect
mqtt_client.on_message = on_message
mqtt_client.connect(BROKER, PORT, 60)
mqtt_client.loop_start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/publish', methods=['POST'])
def publish():
    data = request.json or {}
    mensaje = data.get("mensaje", "Mensaje por defecto")
    mqtt_client.publish(TOPIC, mensaje)
    return jsonify({"status":"ok","sent":mensaje})

if __name__ == '__main__':
    # Para Render: escucha en 0.0.0.0 y puerto de entorno o 10000
    port = int(os.getenv("PORT", 10000))
    app.run(host='0.0.0.0', port=port, debug=True)
