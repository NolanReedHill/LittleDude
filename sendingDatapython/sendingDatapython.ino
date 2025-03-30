#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <ArduinoJson.h>
#include <EEPROM.h>

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_RESET -1
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

#define X_PIN A0 // Accelerometer X-axis
#define Y_PIN A1 // Accelerometer Y-axis

#define ZERO_G_VOLTAGE 3.3
#define VOLTS_PER_G 0.3
#define STEP_THRESHOLD 0.5

#define BUTTON_PIN 2 // Button pin
#define STEP_LENGTH 0.75 // Average step length

int stepCount = 0;  // Initialize to 0
float prevMagnitude = 0;
float distance = 0.0;  // Initialize to 0
int buttonPressCount = 0;
bool blankScreen = false;
String jsonString = "";

void setup() {
    Serial.begin(9600);
    Wire.begin();
    
    if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) {
        Serial.println(F("SSD1306 allocation failed"));
        for (;;);
    }
    display.clearDisplay();
    display.setTextSize(2);
    display.setTextColor(WHITE);

    // Initialize the step count and distance to 0 at startup
    stepCount = 0;
    distance = 0.0;
    buttonPressCount = 0;
    blankScreen = false;

    pinMode(BUTTON_PIN, INPUT_PULLUP);
    updateDisplay();
}

void loop() {
    // Button press logic
    if (digitalRead(BUTTON_PIN) == LOW) { 
        delay(200); // Debounce
        buttonPressCount++;

        if (buttonPressCount == 3) {
            // Reset counters immediately before disconnecting
            int tempSteps;
            EEPROM.get(0,tempSteps);
            EEPROM.put(0, stepCount);  // Store temperature at address 0
            Serial.println(tempSteps);
            char jsonBuffer[50];  // Adjust size as needed
            sprintf(jsonBuffer, "{\"steps\":%d\"}", 
            tempSteps);

            Serial.println(jsonBuffer);  // Send JSON string
            resetTracker();
            showLevelUpMessage();
            waitForReconnect();
            updateDisplay();
        } else {
            blankScreen = !blankScreen; // Toggle screen state
            if (blankScreen) {
          display.clearDisplay();

          if(Serial.available()) {
            delay(500);
            jsonString = Serial.readStringUntil('\n');
            StaticJsonDocument<30> doc;
            DeserializationError error = deserializeJson(doc, jsonString);
          }
            display.println(jsonString.substring(10,jsonString.length()-2));
            display.display();
        }
        }
    }

    if (!blankScreen) {
        // Read accelerometer values
        int xRaw = analogRead(X_PIN);
        int yRaw = analogRead(Y_PIN);

        float xVoltage = (xRaw / 1023.0) * 5.0;
        float yVoltage = (yRaw / 1023.0) * 5.0;

        float xAccel = (xVoltage - ZERO_G_VOLTAGE) / VOLTS_PER_G;
        float yAccel = (yVoltage - ZERO_G_VOLTAGE) / VOLTS_PER_G;

        float magnitude = sqrt(xAccel * xAccel + yAccel * yAccel);

        if (abs(magnitude - prevMagnitude) > STEP_THRESHOLD) {
            stepCount++;
            distance = stepCount * STEP_LENGTH;
            updateDisplay();
        }

        prevMagnitude = magnitude;
        delay(50);
    }
}

void updateDisplay() {
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(25, 20);
    display.print("Steps:");
    display.print(stepCount - 1);  // Subtract 1 from step count for initial display

    display.setCursor(25, 40);
    display.print("Dist:");
    display.print(distance - STEP_LENGTH);  // Subtract 0.75 from distance for initial display
    display.print("m");
    display.display();
}

void showLevelUpMessage() {
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(10, 20);
    display.print("Plug Arduino into");
    display.setCursor(10, 35);
    display.print("the computer");
    display.setCursor(10, 50);
    display.print("Ready to level up");
    display.display();
}

void waitForReconnect() {
    delay(20000);  // Give time for the user to disconnect
    while (!Serial) {} // Wait until Serial is reconnected
}

void sendStepCount() {
  
}

void resetTracker() {
    // Reset step count and distance to 0
    stepCount = 0;
    distance = 0.0;
    buttonPressCount = 0;
    blankScreen = false;
    updateDisplay();
}


