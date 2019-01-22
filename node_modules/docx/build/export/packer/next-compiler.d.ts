import * as JSZip from "jszip";
import { File } from "../../file";
export declare class Compiler {
    private readonly formatter;
    private readonly imageReplacer;
    constructor();
    compile(file: File): JSZip;
    private xmlifyFile;
}
