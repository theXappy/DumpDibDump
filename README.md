# DumpDibDump
This project helps you dump graphics drawn by Windows applications which use the [DrawDibDraw API](https://learn.microsoft.com/en-us/windows/win32/api/vfw/nf-vfw-drawdibdraw).  
It uses Frida and Pymem to hook the method and dump the bitmap from memory.

# Installation
1. Install Frida
2. Install Pymem `pip install pymem`
3. Clone this repo

# Usage
1. Edit `invoke_frida.py`: Change `TARGET_PROCESS = "my_target.exe"`  to the name of your target.  
2. Run the python script.  
3. Interact with your target to make it draw the bitmap(s) you'd like to dump.

Images will be dumped to the CWD where you ran python.

Optional: If you app has a lot of small bitmaps (usually UI stuff: button, scroll bars...) you can set a size threshold to filter those out.
Uncomment this code in the .js file + change the threshold as your target requires:
```
    // ------------------------------------------------------------------------------
    // Uncomment to filter SMALL BITMAPS (change bytes limit as your target requires)
    // ------------------------------------------------------------------------------
    // Read raw bytes of BITMAPINFOHEADER structure
    // let biSizeImageAddress = new NativePointer(lpbi).add(20);
    // let biSizeImage = biSizeImageAddress.readInt();
    // if (biSizeImage < 29000 /* bytes */) {
    //  return;
    // }
```
