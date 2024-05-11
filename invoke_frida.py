import frida
import struct
from pymem import Pymem
import hashlib

TARGET_PROCESS = "my_target.exe"

dumped_hashes = []
index = 0

def on_message(message, data):
    global index
    if message['type'] == "error":
        print("Error: ", message)
    elif 'payload' in message:
        # Extract parameters from the message payload
        params = message['payload']
        lpbi = params['lpbi']
        lpBits = params['lpBits']

        bmih = pm.read_bytes(lpbi, 40)
        biSizeImage, = struct.unpack("<I", bmih[20:24])
        print("biSizeImage: ", biSizeImage)

        pixels_lines = pm.read_bytes(lpBits, biSizeImage)
        m = hashlib.sha256()
        m.update(pixels_lines)
        hash_val = m.digest().hex()
        if hash_val in dumped_hashes:
            print(f"Already dumped hash {hash_val}")
            return
        print(f"New hash! {hash_val}")
        dumped_hashes.append(hash_val)

        # Prepare bitmap header
        magic = b"BM"
        bfSize = struct.pack("<I", biSizeImage + 54)
        rest_of_bmfh = b"\x00\x00\x00\x00\x36\x00\x00\x00"

        # Write BMP to file
        index += 1
        fd = open(f"{index}_{hash_val}.bmp", "wb")
        fd.write(magic + bfSize + rest_of_bmfh)
        fd.write(bmih)
        fd.write(pixels_lines)
        fd.close()

# Attach to the target process
session = frida.attach(TARGET_PROCESS)
pm = Pymem(TARGET_PROCESS)

# Load the JavaScript code
with open("hook_drawdibdraw.js", "r") as f:
    script_code = f.read()

# Create the script
script = session.create_script(script_code)
script.on('message', on_message)

# Load and run the script
script.load()
script.post({"type": "start"})
# Resume the process
session.resume()

# Keep the script running
input("Press Enter to exit...")