import { writeFile } from "fs";
import router, {Request, Response} from "express";
import asyncHandler from "express-async-handler";

const app = router();

// @ts-ignore
// app.put("", asyncHandler(async (request: Request, response: Response, next) => {
//     /*
//     {
//         "author": "StormHub",
//         "public": true,
//         "vehicle_name": "Empty",
//         "description": "a Block",
//         "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?><vehicle data_version=\"3\" bodies_id=\"60\"><authors/><bodies><body unique_id=\"60\"><components><c><o r=\"1,0,0,0,1,0,0,0,1\" sc=\"6\"/></c></components></body></bodies><logic_node_links/></vehicle>"
//     }
//     */
//     // request.body
// }));

export default app;