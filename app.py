from flask import Flask, render_template, request, jsonify
import paho.mqtt.client as mqtt
import os

app = Flask(__name__)

BROKER = "broker.hivemq.com"
PORT   = 1883
TOPIC  = "flask/render/test"

mqtt_client = mqtt.Client()
mqtt_client.connect(BROKER, PORT, 60)
mqtt_client.loop_start()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/publish', methods=['POST'])
def publish():
    mensaje = request.json.get("mensaje", "Hola desde web")
    mqtt_client.publish(TOPIC, mensaje)
    return jsonify(status="ok", sent=mensaje)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True)
