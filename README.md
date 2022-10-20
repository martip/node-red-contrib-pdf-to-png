# node-red-contrib-pdf-to-png

A [Node-RED](https://nodered.org/) node that converts PDF pages to PNG images, using [PDF.js](https://mozilla.github.io/pdf.js/) and [node-canvas](https://github.com/Automattic/node-canvas).

## Install

Either use the `Node-RED Menu - Manage Palette - Install`, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install node-red-contrib-pdf-to-png

## Usage

You pass the PDF as a buffer in the `msg.payload`.

Various options can be set in the node configuration dialog:

* Pages (all, first, range)
* Zoom (10% to 1600%)
* PNG Compression level (0 to 9)
* PNG Resolution (dpi)