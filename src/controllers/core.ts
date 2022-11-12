import { Request, Response, NextFunction } from "express";
import { Promise } from "bluebird";
var pdf = require("html-pdf");
const path = require("path");

const home = async (req: Request, res: Response, next: NextFunction) => {
  return res.status(200).json("Hello from there. Go to /api to use the api");
};

const convertHtmlToPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get the data from req.body
  let bodyHtml: string = req.body.body_html;
  let headerHtml: string = req.body.header_html;
  let footerHtml: string = req.body.footer_html;
  let _config: string = req.body.config;
  let config: object = _config ? JSON.parse(_config) : {};

  var options = {
    format: "Letter",
    height: "1000px",
    width: "1200px",
    header: {
      height: headerHtml ? "90px" : "0px",
      contents: headerHtml,
    },
    footer: {
      height: footerHtml ? "70px" : "0px",
      contents: footerHtml,
    },
    phantomPath: path.resolve(
      process.cwd(),
      "node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs"
    ),
    ...config,
  };
  try {
    var createResult = pdf.create(bodyHtml, options);
    var pdfToBuffer = Promise.promisify(createResult.__proto__.toBuffer, {
      context: createResult,
    });
    let buffer = await pdfToBuffer();
    return res.status(200).json({
      pdf_data_base64: buffer.toString("base64"),
    });
  } catch (error) {
    console.log("Error", error);
  }
  return res.status(400).json("something went wrong");
};

export default { convertHtmlToPdf, home };
