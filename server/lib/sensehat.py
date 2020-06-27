# Imports
from sense_hat import SenseHat
import os, sys, json

# Sense hat
sensehat = SenseHat()

# Main loop
stdin=' '
while stdin:
  # Read line
  sys.stdout.flush()
  stdin = sys.stdin.readline()
  # Load json
  call = uid = func = None
  try:
    call = json.loads(stdin)
    uid = call.pop("uid")
    func = call.pop("func")
    print(json.dumps({"debug":call}))
  except Exception as error:
    print(json.dumps({"uid":uid, "error":str(error)}))
    continue
  # Call required function
  try:
    print(json.dumps({"uid":uid, "error":None, "result":(getattr(sensehat, func)(**call))}))
  except Exception as error:
    print(json.dumps({"uid":uid, "error":str(error), "result":None}))
