# This is a python interface based on https://pythonhosted.org/sense-hat/api/
# It allows mapping with NodeJS without the need of rewriting the whole library for conveniency

# Imports
from sense_hat import SenseHat, ACTION_PRESSED, ACTION_HELD, ACTION_RELEASED
import os, sys, json

# Sense hat
sensehat = SenseHat()

def sense_dump(ledmatrix = False):
  return {
    "pixels":sensehat.get_pixels() if ledmatrix else None,
    "lowlight":sensehat.low_light,
    "gamma":sensehat.gamma if ledmatrix else None,
    "humidity":sensehat.get_humidity(),
    "pressure":sensehat.get_pressure(),
    "temperature":{
      "humidity":sensehat.get_temperature_from_humidity(),
      "pressure":sensehat.get_temperature_from_pressure(),
    },
    "orientation":{
      "degrees":sensehat.get_orientation_degrees(),
      "radians":sensehat.get_orientation_radians(),
    },
    "compass":{
      "value":sensehat.get_compass(),
      "raw":sensehat.get_compass_raw(),
    },
    "gyroscope":{
      "value":sensehat.get_gyroscope(),
      "raw":sensehat.get_gyroscope_raw(),
    },
    "accelerometer":{
      "value":sensehat.get_accelerometer(),
      "raw":sensehat.get_accelerometer_raw(),
    },
  }

def configure_ledmatrix(low_light = None, gamma = None):
  if low_light is not None:
    sensehat.low_light = low_light
  if gamma is not None:
    sensehat.gamma = gamma
  return {"low_light":sensehat.low_light, "gamma":sensehat.gamma}

def get_events():
  return sensehat.stick.get_events()

def wait_for_event(emptybuffer = None):
  return sensehat.stick.wait_for_event(emptybuffer)

def joystick_event(event):
  print(json.dumps({"event":"joystick", "result":event}))
  sys.stdout.flush()
sensehat.stick.direction_any = joystick_event

def set_pixel(x, y, r = 255, g = 255, b = 255):
  return sensehat.set_pixel(x, y, r, g, b)

def set_pixels(pixels):
  return sensehat.set_pixels(pixels)

# Main loop
stdin=' '
while stdin:
  # Read line
  sys.stdout.flush()
  sys.stderr.flush()
  stdin = sys.stdin.readline()
  # Load json
  call = uid = func = context = None
  try:
    call = json.loads(stdin)
    print(json.dumps({"debug":call}))
    uid = call.pop("uid")
    func = call.pop("func")
    context = call.pop("context", "sensehat")
  except Exception as error:
    print(json.dumps({"uid":uid, "error":str(error)}))
    continue
  # Call required function
  try:
    if context == "locals":
      print(json.dumps({"uid":uid, "error":None, "result":(locals()[func](**call))}))
    elif context == "sensehat":
      print(json.dumps({"uid":uid, "error":None, "result":(getattr(sensehat, func)(**call))}))
    else:
      print(json.dumps({"uid":uid, "error":"Invalid context {}".format(context), "result":None}))
  except Exception as error:
    print(json.dumps({"uid":uid, "error":str(error), "result":None}))
