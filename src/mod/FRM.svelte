<script lang='ts'>
import { root,
         debug,
         components,
         col_frame,
         col_tab_text,
         rndHex,
         Frame,
         Tab
} from "../common.js";
import TAB from "./TAB.svelte";
export let x: number, 
           y: number,
           w: number,
           h: number,
           f: Frame; 
$: xa = f.layout ? x       : x;
$: ya = f.layout ? y       : y;
$: wa = f.layout ? bar     : w;
$: ha = f.layout ? h : bar    ;
$: xb = f.layout ? x + bar : x;
$: yb = f.layout ? y : y + bar;
$: wb = f.layout ? w - bar : w;
$: hb = f.layout ? h : h - bar;

let col:   string = rndHex();
let ratio: number = 0.5;
$: len = f.layout ? w : h;
$: bar = ratio * len;

const drag_bgn = (e: DragEvent) => {
    e.dataTransfer.setDragImage(new Image(), 0, 0)
    ratio = (f.layout ? e.pageX - x : e.pageY - y) / len;
}

const drag_ing = (e: DragEvent) => {
    const to = f.layout ? e.pageX - x : e.pageY - y;
    if(Math.abs(to - bar) < 30) ratio = to / len;
}

const drag_fin = (e: DragEvent) => {
    ratio = (f.layout ? e.pageX - x : e.pageY - y) / len;
}

const split = (tid: string, 
               fid: string,
               fnew: Frame,
               fold: Frame,
               is_new_first: boolean,
               horizontal: boolean): void => {
    f.tabs = [];
    f.frms = is_new_first? [fnew, fold] : [fold, fnew];
    f.layout = horizontal;
    root.move_tab(tid, fid, fnew.uuid);
    root.remove_tab(tid, fold.uuid);
}

const drop_tab = (e: DragEvent): void  => {
    const tid = e.dataTransfer.getData("tid");
    const ffr = e.dataTransfer.getData("fid_fr");
    const nx = (e.pageX - x) / w, ny = (e.pageY - y) / h;
    const x1 = nx > 0.2, x2 = nx < 0.8,
          y1 = ny > 0.2, y2 = ny < 0.8; 

    if(!tid) return;
    if(x1 && x2 && y1 && y2) { root.move_tab(tid, ffr, f.uuid); }
    else {
        const fn = new Frame([], [], false),
              fo = new Frame([], [...f.tabs], false);
        if(x1 && x2){
            if(!y1) split(tid, ffr, fn, fo, true,  false); // top
            if(!y2) split(tid, ffr, fn, fo, false, false); // btm
        }
        if(y1 && y2){
            if(!x1) split(tid, ffr, fn, fo, true,  true);  // lft
            if(!x2) split(tid, ffr, fn, fo, false, true);  // rgt
        }
    }
}

const create_tab = (): void => {
    f.tabs = [...f.tabs, new Tab($components[0].type, f)];
}

</script>

<div id="f"
    class:h={f.layout}
    class:v={!f.layout}
    style='--w:{w}px; --h:{h}px; --bgc:{$col_frame}; --text:{$col_tab_text}'
    on:dragover={e => e.preventDefault()}
    on:drop|preventDefault|stopPropagation={drop_tab}>
    {#if $debug}
        <span style="position:absolute; right:35px; top:5px; color:{col};">{f.tabs.length}</span>
        <span style="position:absolute; right:55px; top:5px; color:{col};">{f.uuid.slice(0, 5)}</span>
    {/if}
    {#if f.frms.length == 2}
        {#if f.layout}
            <svelte:self x={xa} y={ya} w={wa - 3} h={ha} f={f.frms[0]}/>
            {#if f.frms.length === 2}
            <div id="bh" draggable="true" on:dragstart={drag_bgn} on:drag={drag_ing} on:dragend={drag_fin}/> 
            {/if}
            <svelte:self x={xb} y={yb} w={wb - 3} h={hb} f={f.frms[1]}/>
        {:else}
            <svelte:self x={xa} y={ya} w={wa} h={ha - 3} f={f.frms[0]}/>
            {#if f.frms.length === 2}
            <div id="bv" draggable="true" on:dragstart={drag_bgn} on:drag={drag_ing} on:dragend={drag_fin}/>
            {/if}
            <svelte:self x= {xb} y={yb} w={wb} h={hb - 3} f={f.frms[1]}/>
        {/if}
    {:else if f.frms.length == 0}
        {#each f.tabs as t, i  (t.uuid)}
            <TAB f={f} t={t} o={i}/>
        {/each}
        <span id="create" on:click={create_tab}>+</span>
    {/if}
</div>

<style>
#f {
    --w: 10px;
    --h: 10px;
    position: relative;
    display: block;
    width: var(--w);
    height: var(--h);
    background-color: var(--bgc);
    overflow: hidden;
}
#f.h {
    display: flex;
}
#f.h #bh {
    cursor: ew-resize;
    width: 6px;
    height: 100%;
}
#f.v {
    display: block;
}
#f.v #bv {
    cursor: ns-resize;
    width: 100%;
    height: 6px;
}
#f #create {
    color: var(--text);
    cursor: pointer;
    position: absolute;
    top: 1px;
    right: 10px;
    font-size: 20px;
}
</style>