#include <Arduino.h>
#ifdef ESP32
#include <WiFi.h>
#include <AsyncTCP.h>
#elif defined(ESP8266)
#include <ESP8266WiFi.h>
#include <ESPAsyncTCP.h>
#endif
#include <ESPAsyncWebServer.h>
#include "AsyncJson.h"
#include "ArduinoJson.h"
#include "LittleFS.h"

int ledPins[] = {4, 5};

AsyncWebServer server(80);

const char *ssid = "ssid";
const char *password = "password";

const char *PARAM_PIN = "pin";

void notFound(AsyncWebServerRequest *request)
{
    AsyncResponseStream *response = request->beginResponseStream("application/json");
    DynamicJsonDocument json(1024);
    json["error"] = "Not found";
    serializeJson(json, *response);
    response->setCode(404);
    request->send(response);
}

void setup()
{

    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    if (WiFi.waitForConnectResult() != WL_CONNECTED)
    {
        Serial.printf("WiFi Failed!\n");
        return;
    }

    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());

    if (!LittleFS.begin())
    {
        Serial.println("Failed to mount FS");
    }
    for (int p : ledPins)
    {
        pinMode(p, OUTPUT);
        digitalWrite(p, LOW);
    }
    server.serveStatic("/", LittleFS, "/")
        .setDefaultFile("index.html");

    server.on("/pins", HTTP_GET, [](AsyncWebServerRequest *request)
              {
        AsyncResponseStream *response = request->beginResponseStream("application/json");
        DynamicJsonDocument json(1024);
        JsonArray pins = json["data"].createNestedArray("pins");
        for (int p : ledPins)
        {
            pins.add(p);
            Serial.println(p);
        };
        serializeJson(json, *response);
        request->send(response); });

    server.on("/is-on", HTTP_GET, [](AsyncWebServerRequest *request)
              {
        int pin = ledPins[0];
        if( request->hasParam(PARAM_PIN) )
        {
            pin = request->getParam(PARAM_PIN)->value().toInt();
        } 
        bool isOn = digitalRead(pin) == HIGH;
        AsyncResponseStream *response = request->beginResponseStream("application/json");
        DynamicJsonDocument json(1024);
        json["data"]["isOn"] = isOn;
        serializeJson(json, *response);
        request->send(response); });

    server.on("/toggle", HTTP_POST, [](AsyncWebServerRequest *request)
              {
        int pin = ledPins[0];
        if( request->hasParam(PARAM_PIN) )
        {
            pin = request->getParam(PARAM_PIN)->value().toInt();
        } 
        int isOn = digitalRead(pin);
        digitalWrite(pin, !isOn);
        AsyncResponseStream *response = request->beginResponseStream("application/json");
        DynamicJsonDocument json(1024);
        json["data"]["isOn"] = (bool)!isOn;
        serializeJson(json, *response);
        request->send(response); });

    server.onNotFound(notFound);

    server.begin();
}

void loop()
{
}