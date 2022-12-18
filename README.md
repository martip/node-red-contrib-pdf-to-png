# @martip/node-red-pdf-to-png

A [Node-RED](https://nodered.org/) node that converts PDF pages to PNG images, using [PDF.js](https://mozilla.github.io/pdf.js/) and [node-canvas](https://github.com/Automattic/node-canvas).

## Install

***N.B*** If you're on a Apple Mac running on Apple Silicon (M1, M2 etc.), please read below.

Either use the `Node-RED Menu - Manage Palette - Install`, or run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install @martip/node-red-pdf-to-png

### Apple Silicon

This node depends on [node-canvas](https://github.com/Automattic/node-canvas), for which an Apple Silicon (ARM Architecture) release is not available yet.

You can still use this node but you'll have to install it manually. Be sure to have [Homebrew](https://brew.sh/) installed on your Mac and follow these instructions:

~~~bash
> brew install pkg-config cairo pango libpng jpeg giflib librsvg
> git clone https://github.com/martip/node-red-pdf-to-png.git
> cd node-red-pdf-to-png
> cwd=$(pwd)
> npm install
> cd ~/.node-red
> npm install $cwd
> unset cwd
~~~

Restart Node-RED when done.

Node-RED will use the local version of this package, instead of the published one. (don't remove the `node-red-pdf-to-png` folder!).

## Usage

You pass the PDF as a buffer in the `msg.payload`.

Various options can be set in the node configuration dialog:

* Pages (all, first, range)
* Zoom (10% to 1600%)
* PNG Compression level (0 to 9)
* PNG Resolution (dpi)