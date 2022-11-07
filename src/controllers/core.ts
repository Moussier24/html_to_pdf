import { Request, Response, NextFunction } from "express";
import { Promise } from "bluebird";
var pdf = require("html-pdf");

const convertHtmlToPdf = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // get the data from req.body
  let fileData: string | null = null;
  let bodyHtml: string = req.body.body_html;
  let headerHtml: string = req.body.header_html;
  let footerHtml: string = req.body.footer_html;

  var options = {
    format: "Letter",
    height: "650px",
    width: "800px",
    header: {
      height: "90px",
      contents: headerHtml,
    },
    footer: {
      height: "70px",
      contents: footerHtml,
    },
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

export default { convertHtmlToPdf };
