## Overview

This is the source code for the blog article on [Medium](https://medium.com/@wills_15862/i-built-a-robot-35ca67e7b811)

It runs a robot that has an embedded web server that allows control by any connected gamepad, such as the Xbox One controller gamepad.  The software is all written in Javascript, with React used for the website and HTML5 gamepad control, and using mongoose Javascript for the Internet of Things (IOT) Mongoose Operating System for a $10-$20 ESP32 device.   

So it's doesnt require the Arduino workbench, nor a Raspberry Pi, just the ESP32 development board itself.

We used a ESP32 Heltec WifiKit and have also tested it on the ESP32 Heltec Lora with OLED.   It should work with other IOT boards connected to a SSD1306 LCD display over I2C by changing the `mos.yml` config settings.

It programs a L298N (a motor controller commonly used with Arduinos) to move the floor robot.  The  Xbox 360 or Xbox One controller connects to a desktop browser via bluetooth or a cable, and the browser connects to the ESP32 via WiFi.

The instructions below are if you want to recreate the device image and flash on an ESP32 development board.

## 1. Install MOS on development machine

``` bash
curl -fsSL https://mongoose-os.com/downloads/mos/install.sh | /bin/bash
~/.mos/bin/mos --help      
~/.mos/bin/mos
```

## 2. Reset default firmware on ESP32 (optional)

Press and hold the firmware reset button (some devices)

``` bash
mos flash esp32 --esp-erase-chip
```

## 3. Install to MOS application folder

``` bash
cd ~/.mos/apps.2.0
git clone https://github.com/HeadlightStudios/robot-gamepad.git
cd robot-gamepad
mos build --platform esp32 && mos flash && mos console
```

## 5. Update the WIFI network and password

Create a new standalone device and get the device ID

Create an access key and secret using the security menu (replace variables or set in environment)

``` bash
mos wifi NETWORK_NAME WPA2_NETWORK_PASSWORD
```

## 6. Connect Xbox Controller to desktop

Connect xbox controller using wire and built in Windows drivers or Mac Driver [360Controller](https://github.com/360Controller/360Controller/releases).

In a Chrome or Edge browser, navigate to http://robot-?????.local where ????? is the unique id of the ESP32 (see mos console if unsure what it is).

You should see something like:

![Xbox One Controller](https://github.com/willscreate/robot-gamepad/raw/master/preview.gif "Responsive Preview")

Move the left joystick to move the robot.


### License

Apache 2.0