import { type Request, type Response } from "express";
export declare const getMuebles: (req: Request, res: Response) => Promise<void>;
export declare const postMueble: (req: Request, res: Response) => Promise<void>;
export declare const updateMueble: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteMueble: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=mueble.d.ts.map