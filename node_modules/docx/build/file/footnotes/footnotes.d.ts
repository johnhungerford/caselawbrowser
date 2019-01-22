import { XmlComponent } from "../../file/xml-components";
import { Paragraph } from "../paragraph";
export declare class FootNotes extends XmlComponent {
    private currentId;
    constructor();
    createFootNote(paragraphs: Paragraph[]): void;
}
