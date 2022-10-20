const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');
const Canvas = require('canvas');

class NodeCanvas {

  constructor(width, height, compressionLevel, resolution) {
    if (width > 0 && height > 0) {
      this.canvas = Canvas.createCanvas(width, height);
      this.context = this.canvas.getContext('2d');
      this.compressionLevel = compressionLevel;
      this.resolution = resolution;
    }
  }

  getImage() {
    return this.canvas.toBuffer('image/png', {
      compressionLevel: this.compressionLevel,
      filters: Canvas.PNG_ALL_FILTERS,
      palette: undefined,
      backgroundIndex: 0,
      resolution: this.resolution
    });
  }
}

const convertPDFtoPNG = async (pdfData, pages, options) => {

  try {
    let images = [];
    const loadingTask = pdfjsLib.getDocument({ data: pdfData, verbosity: 0 });
    const pdfDocument = await loadingTask.promise;
    if (!pages) {
      pages = Array.from({length: pdfDocument.numPages}, (_, i) => i + 1);
    }
    for (let index = pages[0]; index <= Math.min(pages.slice(-1)[0], pdfDocument.numPages); index++) {
      const pdfPage = await pdfDocument.getPage(index);
      const viewport = pdfPage.getViewport({ scale: options.zoom || 2.0 });

      const canvas = new NodeCanvas(viewport.width, viewport.height, options.compression || 3, options.resolution || 150);
  
      const renderContext = {
        canvasContext: canvas.context,
        viewport
      };
  
      const renderTask = pdfPage.render(renderContext);
      await renderTask.promise;
      const image = canvas.getImage();
      images.push(image);
    }
    return images;
  } catch (error) {
    throw(error)
  }

};

module.exports = function(RED) {

  function ConvertPDF(config) {
    RED.nodes.createNode(this, config);

    this.pageMode = config.pagemode;
    this.pageFrom = parseInt(config.pagefrom);
    this.pageTo = parseInt(config.pageto);
    this.zoom = parseInt(config.zoom);
    this.compression = config.compression ? parseInt(config.compression) : null;
    this.resolution  = config.resolution ? parseInt(config.resolution) : null
   
    const node = this;

    this.on('input', async (msg, send, done) => {

      if (msg.hasOwnProperty('payload')) {
        try {
          const pdf = msg.payload;
          let pages = null;
          switch (node.pageMode) {
            case 'all':
              break;
            case 'first':
              pages = [1];
              break;
            case 'range':
              pages = Array.from({length: node.pageTo - node.pageFrom + 1}, (_, i) => i + node.pageFrom);
              break;
            default:
              break;
          }

          const options = {
            zoom: node.zoom,
            compression: node.compression,
            resolution: node.resolution
          };

          const result = await convertPDFtoPNG(pdf, pages, options);
          msg.payload = result;
          send(msg);

        } catch (error) {
          if (done) {
            done(error);
          } else {
            node.error(err, msg);
          }
        }
        if (done) {
          done();
        }
      }
    });

  }
  RED.nodes.registerType('pdf-to-png', ConvertPDF);
}
