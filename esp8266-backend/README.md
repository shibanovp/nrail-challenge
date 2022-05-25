```bash
arduino-cli lib install WiFi ArduinoJson
arduino-cli lib install --git-url https://github.com/me-no-dev/ESPAsyncTCP.git https://github.com/me-no-dev/ESPAsyncWebServer.git
arduino-cli compile --fqbn esp8266:esp8266:nodemcuv2 .
arduino-cli upload -p /dev/ttyUSB0 --fqbn esp8266:esp8266:nodemcuv2 .
 mklittlefs -c ../esp8266-client/build -b 8192 -p 256 -s 2024 out.bin
esptool.py --port /dev/ttyUSB0 write_flash 0x200000 out.bin
```
