# LittleDude
# CREDITS:
# Nolan Hill [GitHub](https://github.com/NolanReedHill) [LinkedIn](https://www.linkedin.com/in/nolanreedhill/)
# Aislinn Jones [GitHub](https://github.com/amjams22) [LinkedIn](https://www.linkedin.com/in/aislinn-jones-4259961b6/)
# Chris Cheng [GitHub](https://github.com/ChrisC005) [LinkedIn](https://www.linkedin.com/in/christopher-c-422936268/)
UVA Hackathon 2025, 3/29-3/30 12pm-12-pm
----------------------------------------
# Are you bored or looking for a friend?
# Do you like customizable characters?
# Are you fun and outdoorsy?
Try LittleDude,
Where a friend becomes forever!

# Inspiration:
We always wanted a Tamagotchi growing up that was more than just feeding. By making the system more interactive and customizable, it enhances the user experience of a virtual pet simulator. Having the choice to customize your pet makes you feel closer to it in the end.

# What it does:
The LittleDude virtual pet starts off with a screen that allows you to log in and create an account. This allows the LittleDude to recognize your name and allocates you to draw your LittleDude in a custom paint studio. Once the LittleDude is drawn, they are turned into one of the three types of LittleDudes based on the recognition of the closest drawn to the type. These types are the Ooze, Biped, and Quadriped. From there, you get to choose its personality! Ooze creatures come from the blob/slime family. Bipeds look similar to humans, and Quadripeds are like the bipeds, but with four legs. Personalities include barbaric, which is similar to talking to a war-driven caveman, hater, shy, bubbly, stoic, and wise. Having the option to customize the LittleDude's personality is important because of the chatbot feature, allowing you to communicate with your new friend. You may talk to your virtual friend, give it food when hungry, play with it, and take it for a walk. To play with your friend, there are objects in the habitat that can be thrown towards the LittleDude. The little guy can also be thrown around by being clicked and dragged. When hungry, the LittleDude will announce to you as such. You can then throw food onto the LittleDude to keep him fed. If you don't feed him enough times, the LittleDude retires (dies) and you must start over with a new virtual pet friend. The option to take the LittleDude for a walk allows the user to go mobile with their friend and get more connected through exercise. An Arduino-pedometer system with an LCD screen was created to allow for this experience. There is a button on the device that allows you to switch from the picture of the LittleDude to the steps and distance counter for the pedometer. This allows you to make sure your LittleDude is still there while you take it for a walk. All of these features together allow the user to have an enhanced Tamagotchi-esque experience with the ability to take their virtual friend around the town like the Tamagotchi.

# Setup:
Starting with the Arduino-pedometer system, C++, ArduinoIDE, Python via VSCode, a GY-61 accelerometer, and a .96in LCD screen were all connected. The system is configured in a way that it fits in a custom portable cardboard box. The Arduino system allows that when a button is pressed, the image of the LittleDude appears. At first, the Arduino-pedometer system is plugged into the computer, where you go through the steps of making the LittleDude, as mentioned before. The Python script allows a JSON data file with the LittleDude image to be sent to the Arduino through the serial communicator port on the Arduino. The accelerometer is used for x and y acceleration and their magnitude. Through this, the steps and distance are calculated. The average person walks .75m with each step, and that is how the steps were calculated. Then the Arduino is disconnected. Arduino has memory, so it stores the pedometer code with the JSON file on it. The Arduino needs to be powered, so a 9V battery is hooked up to the Arduino. Through the custom cardboard box, there is a hole in the bottom that allows for the battery to be easily taken out, if wished.

# Outside sources / inspiration link:
[arduino pedometer code](https://www.engineersgarage.com/arduino-based-walking-steps-distance-calculator-adxl345/)

# Contributions:
Aislinn Jones - Arduino-pedometer system creation, C++, python-arduino connections

Nolan Hill - troubleshooting, routing, page setup, interaction with Gemini API, login stuff, setting up database records

Chris Cheng - creation of the habitat with physics, modeling the LittleDudes and drawing them, as well as interaction such as feeding and playing with them

