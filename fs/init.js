load('api_config.js');
load('api_arduino_ssd1306.js');
load('api_timer.js');
load('api_sys.js');
load('api_net.js');
load('api_config.js');
load('api_gpio.js');
load('api_pwm.js');
load('api_rpc.js');

let evs = '???';
let statusleft = "0";
let statusright = "0";

// FFI Wrappers
Adafruit_SSD1306._spl = ffi('void ssd1306_splash(void *, void *)');
Adafruit_SSD1306._proto.splash = function (data) { Adafruit_SSD1306._spl(this.ssd, data); };
Adafruit_SSD1306._dbm = ffi('void ssd1306_drawBitmap(void *, void *, int, int, int, int)');
Adafruit_SSD1306._proto.drawBitmap = function (data, x, y, w, h) { Adafruit_SSD1306._dbm(this.ssd, data, x, y, w, h); };
let free = ffi('void free(void *)');

// Polyfills
let atob = atob || function (str) { return ffi('void *atob(void *, int)')(str, str.length); };

// Display 
let d = Adafruit_SSD1306.create_i2c(Cfg.get('app.ssd1306_reset_pin'), Adafruit_SSD1306.RES_128_64);
d.begin(Adafruit_SSD1306.SWITCHCAPVCC, 0x3C, true);

let logo = atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAQAAAAI/AAAYBgAAAIAv7IMAAfjuP4IA3/8AAAH3///DgUH4/v/3/9//AAAB/+/Ph4P54Dx4///f/wAAAPnhw4eP+PA88HPnnecAAADh4cOPzxzwPPBzx5niAAAB4eHNj8ee8DzyM8eY4AAAAP/hzA/HnuA88wP/kOAAAAD/4fwf445gPPHz/4DgAAAA/+D8H+Oe4Lzz8/+B4AAAAOHh7B/jjuG48PnDgOAAAADhwO4d4551uPnxx4DgAAAA+cDsOPOe/7x/weeA4AAAAf/w4T/3vP84P8f/wOAAAAH78Pc///zDfD/D58HwAAABwCD/fv/4AE4OQwCA8AAAAYAA/8AQcAAAAAIAAOAAAAAAAAMAAAAAAAAAAACAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAABQwBAYQAABAAAgAAAAAAAD9v/9+/4AdwCB/cAAAAAAA/7/+/z8UH8PAf/AAAAAAAO+//v8+P4eH6f/wAAAAAAHnn884HP+Hj/3g4AAAAAAB8znGPBzxx54/wOAAAAAAAPsQwDweeee8H/DwAAAAAAD/AMD8HHnnvB/+YAAAAAAAfwDAfBw457wf/4AAAAAAAD8BwB4cOef8Pv/AAAAAAADHAMAeODjnPjwf4AAAAAAAwwHADhg55x48x+AAAAAAAOMAwA84Oeef+MHgAAAAAAD/AMAP8HvHB/jB4AAAAAAAfgHgD/B/z4Bg4eAAAAAAAHwB4APgf4nAAPPAAAAAAAAAAeABAAcAAAD/wAAAAAAAAAEAAAAAAAAA/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==");
let logo2 = atob("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/8AAAAAAAAf/+AAAAAAADwA8AAAAAAA8AA4AAAAAAHMAAwAAAAAA5gABgAAAAADMAADgAAAAB9gAAPwAAAA/kAADfwAAAfMRgAB3wAADgwMAAjHwAA4HBwADMHgAHAYNAACwHAAzBgmABjAOAHIGGYABOCcAZAYRgAC4E4DkBhCABjgJgMQGEIADGEHA5AYYgAmYMcBgBw+ABHAY4GADgAAScMTgcAHgAMngcOAwAHgAb4MZ4DgAH8D+AMHgHAAD/+AMI8AfAAAAAAIHwA+AAAAAEA+ABsAAAAAIP4AHcAAAAID3AAOcAAAAA+4AAc8AAAAfnAAA4fAAAPw4AAAwf/B/8PAAABwH//8DwAAABwAAAA+AAAAN4AAAfoAAAAj/AAf8wAAAGI///8RAAAARAH/4AkAAADMABYABYAAAJgAFAAGgAAAkAAcAAOAAAGgAD4AAeAAA8AAIgAB8AAHwAAiAAEQAAxAAD4AARgADEAAHAABkAAMwAAAAADwAAeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=");
let wifi_logo = atob("AAAAAAAAB+AcODAOB/AMGAHAA+AAAACAAYAAAAAAAAA=");
let mqtt_logo = atob("AAAAAAAAAAAAAAwYGjwxxiHCMcYeLAwYAAAAAAAAAAA=");
let mqtt_error = true;

let wifi_connected = false;
let wifi_connecting = false;

// Main
function main() {
  d.clearDisplay();
  d.drawBitmap(logo2, 32, 0, 64, 64);
  d.setTextColor(Adafruit_SSD1306.WHITE);
  d.setTextSize(2);
  d.setCursor(104, 30)
  d.write(statusleft);
  d.setCursor(0, 30)
  d.write(statusright);

  if (evs === "CONNECTED") {
    d.drawBitmap(wifi_logo, 128 - 16, 0, 16, 16);
  }

  d.display();
}

// Init
function init() {
  d.clearDisplay();
  d.splash(logo);
  d.display();
  Timer.set(1000, true, main, null);
}

init();

let LED = 25;

//Stepper Motor Pin Variables
let motor_a_enable_pin = 21; //ENA
let motor_a_forward_pin = 13; //N1
let motor_a_reverse_pin = 12; //N2
let motor_b_enable_pin = 22; //ENB
let motor_b_forward_pin = 14; //N3
let motor_b_reverse_pin = 27; //N4

//PROG
let Motor = {

  init: function () {

    //Setup pins as output
    GPIO.set_mode(motor_a_enable_pin, GPIO.MODE_OUTPUT);
    GPIO.set_mode(motor_a_forward_pin, GPIO.MODE_OUTPUT);
    GPIO.set_mode(motor_a_reverse_pin, GPIO.MODE_OUTPUT);
    GPIO.set_mode(motor_b_enable_pin, GPIO.MODE_OUTPUT);
    GPIO.set_mode(motor_b_forward_pin, GPIO.MODE_OUTPUT);
    GPIO.set_mode(motor_b_reverse_pin, GPIO.MODE_OUTPUT);

    //Stop
    Motor.stopA();
    Motor.stopB();
  },

  forwardA: function (speed) {
    GPIO.write(motor_a_forward_pin, 1);
    GPIO.write(motor_a_reverse_pin, 0);
    PWM.set(motor_a_enable_pin, 500, speed / 100);
  },

  reverseA: function (speed) {
    GPIO.write(motor_a_forward_pin, 0);
    GPIO.write(motor_a_reverse_pin, 1);
    PWM.set(motor_a_enable_pin, 500, speed / 100);
  },

  forwardB: function (speed) {
    GPIO.write(motor_b_forward_pin, 1);
    GPIO.write(motor_b_reverse_pin, 0);
    PWM.set(motor_b_enable_pin, 500, speed / 100);
  },

  reverseB: function (speed) {
    GPIO.write(motor_b_forward_pin, 0);
    GPIO.write(motor_b_reverse_pin, 1);
    PWM.set(motor_b_enable_pin, 500, speed / 100);
  },

  stopA: function () {
    GPIO.write(motor_a_forward_pin, 0);
    GPIO.write(motor_a_reverse_pin, 0);
    PWM.set(motor_a_enable_pin, 0, 0.5);
  },

  stopB: function () {
    GPIO.write(motor_b_enable_pin, 0);
    GPIO.write(motor_b_forward_pin, 0);
    PWM.set(motor_b_enable_pin, 0, 0.5);
  },
};

Motor.init();
print("motor ok")

RPC.addHandler("Robot.cmd", function(args) {

  if (args.cmd === "motor") {

    statusleft = JSON.stringify(args.left);
    statusright = JSON.stringify(args.right);

    if (args.left < 0) {
      Motor.reverseA( -1 * args.left);
    }
    else if (args.left > 0) {
       Motor.forwardA( args.left);
    }
    else {
      Motor.stopA();
    }

      if (args.right < 0) {
      Motor.reverseB( -1 * args.right);
      }
    else if (args.right > 0) {
       Motor.forwardB( args.right);
    }
    else {
      Motor.stopB();
    }


    main();
  } 

  return {};
});

// Blink built-in LED every second
GPIO.set_mode(LED, GPIO.MODE_OUTPUT);

Timer.set(1000, true, function () {
  GPIO.toggle(LED);
}, null);

