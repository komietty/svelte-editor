import { writable } from "svelte/store";
import { v4 as uuidv4 } from "uuid"

export class Frame {
    uuid;
    frms; // length must be 0 or 2 in stable
    tabs; // only when frms.len == 0
    layout;
    ratio;
    constructor(frms, tabs, layout){
        this.uuid = uuidv4();
        this.frms = frms;
        this.tabs = tabs;
        this.ratio = 0.5;
        this.layout = layout;
    }

    removable(){
        return this.frms.length === 0 && this.tabs.length === 0;
    }

    emptyCheck(){
        if (this.frms.length === 2) {
            const fa = this.frms[0];
            const fb = this.frms[1];
            let fs; 
            if (fa.removable()) fs = fb;
            if (fb.removable()) fs = fa;
            if (fs) {
                this.uuid = fs.uuid;
                this.frms = fs.frms;
                this.tabs = fs.tabs;
                this.layout = fs.layout;
            }
        }
        for (let f of this.frms) f.emptyCheck()
    }

     activeCheck(){
        const t = this.tabs;
        const l = t.length;
        if(l > 0 &&!t.find(t => t.active)) t[l - 1].active = true;
        for (let f of this.frms) f.activeCheck()
    }

    findFrm(uuid){
        const stack = [this, ...this.frms];
        while(stack.length > 0){
            const f = stack.shift();
            if(f.uuid === uuid) return f;
            for (let c of f.frms) stack.push(c);
        };
        throw new Error("could not find uuid");
    }

    findTab(uuid){
        const stack = [...this.frms];
        while(stack.length > 0){
            const f = stack.shift();
            for (let t of f.tabs) if (t.uuid === uuid) return t;
            for (let c of f.frms) stack.push(c);
        };
        throw new Error("could not find uuid");
    }
}

export class Tab {
    uuid;
    comp;
    active;
    parent;
    constructor(comp, parent){
        this.uuid = uuidv4();
        this.comp = comp;
        this.parent = parent;
        this.active = false;
    }
}

export class Comp {
    type;
    comp;
    constructor(type, comp){
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
        init: (f) => update(root => {
            root = f;
            root.emptyCheck();
            root.activeCheck();
            return root;
        }),
        move_tab: (tid, fid_fr, fid_to) => update(root => {
            const fr = root.findFrm(fid_fr);
            const to = root.findFrm(fid_to);
            const tb = root.findTab(tid);
            fr.tabs = fr.tabs.filter(t => t.uuid !== tid);
            to.tabs.forEach(t => t.active = false);
            to.tabs.push(tb);
            root.emptyCheck();
            root.activeCheck();
            return root;
        }),
        remove_tab: (tid, fid) => update(root => {
            const fr = root.findFrm(fid);
            fr.tabs = fr.tabs.filter(t => t.uuid !== tid);
            root.emptyCheck();
            root.activeCheck();
            return root;
        }),
        activate_tab: (tb, fr) => update(root => {
            fr.tabs.forEach(t => t.active = false);
            tb.active = true;
            return root;
        })
    }
}

export const root = gen_tree(); 
export const components = writable([]);
export let debug = writable(false);
export let col_frame = writable('#1f1f1f');
export let col_tab_text = writable('#ffffff');
export let col_tab_dflt = writable('#3f3f3f');
export let col_tab_actv = writable('#2f2f2f');
export function rndHex(){ return '#' + [...Array(6)] .map(() => Math.floor(Math.random() * 16) .toString(16)) .join(''); }
