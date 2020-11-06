import type { Writable } from "svelte/store";

declare class Frame {
    uuid:   string;
    layout: boolean;
    ratio:  number;
    frames: Frame[];
    tabs:   Tab[];

    constructor(frames: Frame[], tabs: Tab[], layout: boolean);
    removable(): boolean;
    emptyCheck(): void;
     activeCheck(): void;
    findFrame(uuid: string): Frame;
    findTab(uuid: string): Tab;
}

declare class Tab {
    uuid: string;
    comp: string;
    active: boolean;
    parent: Frame;

    constructor(comp: string, parent: Frame);
}

declare class Comp {
    type: string;
    comp: object;
    constructor(type: string, comp: object);
}

declare function gen_tree();

export declare const root: any;
export declare const components: Writable<Comp[]>;
export declare let debug: Writable<boolean>;
export declare function rndHex(): string;
