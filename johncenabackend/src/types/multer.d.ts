// src/types/multer.d.ts

import { Request } from 'express';

export interface MulterFile {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    destination: string;
    filename: string;
    path: string;
    size: number;
}

export interface RequestWithFiles extends Request {
    files: {
        [key: string]: MulterFile[];
    };
}
