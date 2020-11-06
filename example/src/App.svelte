<script lang="ts">
import { root, Frame, Tab, components, Comp, FRM } from 'svelditor';
// import your components
import CompA from './CompA.svelte'
import CompB from './CompB.svelte'
 
// you will set your components here
components.set( [new Comp('CompA', CompA), new Comp('CompB', CompB)] );
 
// define root frame
const rootFrame = new Frame([], [], false);
rootFrame.tabs.push(new Tab('CompA', rootFrame.frames[0]));
root.init(rootFrame);
</script>
 
<!-- place tabs in absolute coordinate -->
<FRM x={0} y={0} w={1080} h={640} bind:f={$root}/>