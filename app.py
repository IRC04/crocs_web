from flask import Flask, request, render_template, jsonify
import paho.mqtt.client as mqtt

app = Flask(__name__)

# Configuración MQTT
MQTT_BROKER = 'broker.hivemq.com'
MQTT_PORT = 1883
MQTT_TOPIC = 'tienda/respuesta'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/enviar', methods=['POST'])
def enviar():
    try:
        data = request.get_json()
        talla = data.get('talla')
        color = data.get('color')

        if not talla or not color:
            return jsonify({'error': 'Faltan datos'}), 400

        mensaje = f"Talla: {talla}, Color: {color}"
        print("📤 Enviando mensaje MQTT:", mensaje)

        # Cliente MQTT (sin WebSocket)
        mqtt_client = mqtt.Client()

        def on_connect(client, userdata, flags, rc):
            if rc == 0:
                print("✅ Conectado a MQTT")
                client.publish(MQTT_TOPIC, mensaje)
            else:
                print(f"❌ Fallo conexión MQTT: {rc}")

        mqtt_client.on_connect = on_connect

        mqtt_client.connect(MQTT_BROKER, MQTT_PORT, 60)
        mqtt_client.loop_start()

        import time
        time.sleep(2)  # Esperar publicación
        mqtt_client.loop_stop()
        mqtt_client.disconnect()

        return jsonify({'status': 'Mensaje enviado correctamente'})
    except Exception as e:
        print("💥 Error:", e)
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
