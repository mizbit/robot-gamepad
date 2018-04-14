## Overview

This is a Mongoose OS app for the ESP32 Heltec WifiKit or ESP32 Heltec Lora with OLED.   It should work with other IOT boards connected to a SSD1306 over I2C by changing the `mos.yml` config settings.

It programs an L298N to move a floor robot with an Xbox 360 or Xbox One controller connected to a browser on the same wifi network.

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

![Xbox One Controller](https://github.com/willscreate/robot-gamepad/raw/master/robotgamepad.png "Responsive Preview")

Move the left joystick to move the robot.


### License

Apache 2.0