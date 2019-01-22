import { Paragraph } from "file/paragraph";
import { XmlComponent } from "file/xml-components";

import { FootnoteAttributes } from "./footnote-attributes";
import { FootnoteRefRun } from "./run/footnote-ref-run";

export enum FootnoteType {
    SEPERATOR = "separator",
    CONTINUATION_SEPERATOR = "continuationSeparator",
}

export class Footnote extends XmlComponent {
    constructor(id: number, type?: FootnoteType) {
        super("w:footnote");
        this.root.push(
            new FootnoteAttributes({
                type: type,
                id: id,
            }),
        );
    }

    public addParagraphs(paragraphs: Paragraph[]): void {
        paragraphs[0].addRunToFront(new FootnoteRefRun());
        for(let i = 0; i < paragraphs.length; i++) {
            this.root.push(paragraphs[i]);
        }
    }
}
