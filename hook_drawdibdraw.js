'use strict';

// Get the address of DrawDibDraw
const drawDibDrawAddr = Module.findExportByName(null, 'DrawDibDraw');
if (!drawDibDrawAddr) {
  console.error('DrawDibDraw not found');
  Process.exit(1);
}

// Create a JavaScript wrapper for DrawDibDraw
const drawDibDraw = new NativeFunction(drawDibDrawAddr, 'bool', ['pointer', 'pointer', 'int', 'int', 'int', 'int', 'pointer', 'pointer', 'int', 'int', 'int', 'int', 'uint32']);


Interceptor.attach(drawDibDrawAddr, {
  onEnter: function (args) {
    // Extract parameters
    const hdc = args[1].toInt32();
    const xDst = args[2].toInt32();
    const yDst = args[3].toInt32();
    const dxDst = args[4].toInt32();
    const dyDst = args[5].toInt32();
    const lpbi = args[6].toInt32();; // Pointer to BITMAPINFOHEADER
    const lpBits = args[7].toInt32(); // Pointer to bitmap data
    const xSrc = args[8].toInt32();
    const ySrc = args[9].toInt32();
    const dxSrc = args[10].toInt32();
    const dySrc = args[11].toInt32();
    const dwFlags = args[12].toInt32();

    // ------------------------------------------------------------------------------
    // Uncomment to filter SMALL BITMAPS (change bytes limit as your target requires)
    // ------------------------------------------------------------------------------
    // Read raw bytes of BITMAPINFOHEADER structure
    // let biSizeImageAddress = new NativePointer(lpbi).add(20);
    // let biSizeImage = biSizeImageAddress.readInt();
    // if (biSizeImage < 29000 /* bytes */) {
    //  return;
    // }

    // Send parameters to Python
    send({
      hdc: hdc,
      xDst: xDst,
      yDst: yDst,
      dxDst: dxDst,
      dyDst: dyDst,
      lpbi: lpbi,
      lpBits: lpBits,
      xSrc: xSrc,
      ySrc: ySrc,
      dxSrc: dxSrc,
      dySrc: dySrc,
      dwFlags: dwFlags,
      biSizeImage: biSizeImage
      // biHeaderBytes: biHeaderBytes,
    });
  }
});
