<script lang="ts">
import { root,
         components,
         debug,
         col_frame,
         col_tab_text,
         col_tab_dflt,
         col_tab_actv,
         Frame,
         Tab,
         Comp,
         FRM
} from 'svelditor';
// import your components
import CompA from './CompA.svelte'
import CompB from './CompB.svelte'
 
// you will set your components here
components.set( [new Comp('CompA', CompA), new Comp('CompB', CompB)] );
 
// define root frame
const rootFrame = new Frame([], [], false);
rootFrame.tabs.push(new Tab('CompA', rootFrame.frms[0]));
root.init(rootFrame);

// options
debug.set(false);
col_frame.set('clear');
col_tab_text.set('#333333');
col_tab_dflt.set('#c5c5c5');
col_tab_actv.set('#f5f5f5');
</script>
 
<!-- place tabs in absolute coordinate -->
<FRM x={0} y={0} w={document.body.clientWidth} h={document.body.clientHeight} bind:f={$root}/>