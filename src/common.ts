import { Writable, writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid"

export class Frame {
    uuid:   string;
    layout: boolean;
    ratio:  number;
    frames: Frame[]; // length must be 0 or 2 in stable
    tabs:   Tab[];   // only when frames.len == 0

    constructor(frames: Frame[], tabs: Tab[], stage: number = -1, layout: boolean = false){
        this.uuid = uuidv4();
        this.ratio = 0.5;
        this.frames = frames;
        this.layout = layout;
        this.tabs   = tabs;
    }

    removable(): boolean {
        return this.frames.length === 0 && this.tabs.length === 0;
    }

    emptyCheck(){
        if (this.frames.length === 2) {
            const fa = this.frames[0];
            const fb = this.frames[1];
            let fs: Frame; 
            if (fa.removable()) fs = fb;
            if (fb.removable()) fs = fa;
            if (fs) {
                this.uuid   = fs.uuid;
                this.frames = fs.frames;
                this.tabs   = fs.tabs;
                this.layout = fs.layout;
            }
        }
        for (let f of this.frames) f.emptyCheck()
    }

     activeCheck(){
        const t = this.tabs;
        const l = t.length;
        if(l > 0 &&!t.find(t => t.active)) t[l - 1].active = true;
        for (let f of this.frames) f.activeCheck()
    }

    findFrame(uuid: string): Frame {
        const stack = [this, ...this.frames];
        while(stack.length > 0){
            const f = stack.shift();
            if(f.uuid === uuid) return f;
            for (let c of f.frames) stack.push(c);
        };
        throw new Error("could not find uuid");
    }

    findTab(uuid: string) : Tab {
        const stack = [...this.frames];
        while(stack.length > 0){
            const f = stack.shift();
            for (let t of f.tabs) if (t.uuid === uuid) return t;
            for (let c of f.frames) stack.push(c);
        };
        throw new Error("could not find uuid");
    }
}

export class Tab {
    uuid: string;
    comp: string;
    active: boolean;
    parent: Frame;

    constructor(comp: string, parent: Frame){
        this.uuid = uuidv4();
        this.comp = comp;
        this.parent = parent;
        this.active = false;
    }
}

export class Comp{
    type: string;
    comp: object;
    constructor(type: string, comp: object){
        this.type = type;
        this.comp = comp;
    }
}

function gen_tree(){
    const {subscribe, set, update } = writable(new Frame([], []))
    return {
        subscribe,
        set, 
        update,
        init: (f: Frame) => update(root => {
            root = f;
            root.emptyCheck();
            root.activeCheck();
            return root;
        }),
        move_tab: (tid: string, fid_fr: string, fid_to: string) => update(root => {
            const fr: Frame = root.findFrame(fid_fr);
            const to: Frame = root.findFrame(fid_to);
            const tb: Tab   = root.findTab(tid);
            fr.tabs = fr.tabs.filter(t => t.uuid !== tid);
            to.tabs.forEach(t => t.active = false);
            to.tabs.push(tb);
            root.emptyCheck();
            root.activeCheck();
            return root;
        }),
        remove_tab: (tid: string, fid: string) => update(root => {
            const fr: Frame = root.findFrame(fid);
            fr.tabs = fr.tabs.filter(t => t.uuid !== tid);
            root.emptyCheck();
            root.activeCheck();
            return root;
        }),
        activate_tab: (tb: Tab, fr: Frame) => update(root => {
            fr.tabs.forEach(t => t.active = false);
            tb.active = true;
            return root;
        })
    }
}

export const root = gen_tree(); 
export const components: Writable<Comp[]> = writable([]);
export let debug = writable(false);

export const rndHex = () => {
    return '#' + [...Array(6)]
        .map(() => Math.floor(Math.random() * 16)
        .toString(16))
        .join('');
}