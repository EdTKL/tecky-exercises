import { Request } from "express";
import { Fields, Files } from "formidable";
import IncomingForm from "formidable/Formidable";

export function formParse(form: IncomingForm, req: Request) {
    return new Promise<{ fields: Fields; files: Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          reject(err);
        } else {
          resolve({ fields, files });
        }
      });
    });
  }