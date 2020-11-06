<script lang='ts'>
import { root,
         debug,
         components,
         col_tab_text,
         col_tab_dflt,
         col_tab_actv,
         rndHex,
         Frame,
         Tab,
         Comp
} from "../common.js";
export let t: Tab;
export let f: Frame;
export let o: number;

let col: string = rndHex();
let tgt: Comp = $components.find(c => c.type === t.comp);

const drag_str = (e: DragEvent) => {
    t.comp = tgt.type;
    e.dataTransfer.setDragImage(new Image(), 0, 0)
    e.dataTransfer.setData("tid", t.uuid);
    e.dataTransfer.setData("fid_fr", f.uuid);
}

const close    = (): void => root.remove_tab(t.uuid, f.uuid);
const activate = (): void => root.activate_tab(t, f);
</script>

<div id="tab"
     style="--l:{o * 150}px;
            --debug:{col};
            --actv:{$col_tab_actv};
            --dflt:{$col_tab_dflt};
            --text:{$col_tab_text};"
    >
    <div id="ear" on:click={activate} class:a={t.active}>
        {#if $debug}
            <span id='name' class="debug">{t.uuid.slice(0, 5)}</span>
        {:else}
            {#if t.active}
            <select bind:value={tgt} class="a">
            {#each $components as c}
            <option value="{c}">{c.type}</option>
            {/each}
            </select>
            {:else}
            <span id='name'>{tgt.type}</span>
            {/if}
        {/if}
        <span id='close' on:click={close}>-</span>
    </div>
    <div id="inn" draggable="true" on:dragstart|stopPropagation={drag_str} class:a={t.active}>
        <svelte:component this={tgt.comp}/>
    </div>
</div>

<style>
#tab {
    --rad1: 6px;
    --rad2: 3px;
    --hgt: 30px;
    --wdt: 150px;
    --pad: 5px;
}
#tab #inn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - var(--pad) * 2);
    height: calc(100% - var(--hgt) - var(--pad) * 2);
    border-top-right-radius: var(--rad1);
    border-bottom-left-radius: var(--rad1);
    border-bottom-right-radius: var(--rad1);
    background-color: var(--dflt);
    overflow: hidden;
    padding: var(--pad);
    color: var(--text);
    visibility: hidden;
}
#tab #inn.a {
    background-color: var(--actv);
    visibility: visible;
}
#tab #ear {
    position: absolute;
    top: 1px;
    left: calc(var(--l));
    width: calc(var(--wdt) - 2px);
    height: calc(var(--hgt) - 1px);
    background-color: var(--dflt);
    border-top-left-radius: var(--rad2);
    border-top-right-radius: var(--rad2);
}
#tab #ear.a {
    background-color: var(--actv);
}
#tab #ear select {
    width: calc(var(--wdt) - 30px);
    height: 25px;
    position: absolute;
    cursor: pointer;
    top: 2px;
    left: 4px;
    font-size: 12px;
    border: none;
    outline: none;
    color: var(--text);
    background-color: var(--dflt);
    box-shadow: none;
    -webkit-appearance: none;
    appearance: none;
}
#tab #ear select.a {
    background-color: var(--actv);
}
#tab #ear #name {
    position: absolute;
    top: 6px;
    left: 8px;
    font-size: 12px;
    color: var(--text);
}
#tab #ear #name.debug {
    color: var(--debug);
}
#tab #ear #close {
    color: var(--text);
    position: absolute;
    cursor: pointer;
    top: 0;
    right: 8px;
    font-size: 20px;
}
</style>