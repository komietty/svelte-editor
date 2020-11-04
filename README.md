# Svelditor
Tab ui editor library for svelte.

## Usage

Import lib by npm.
```
npm i svelditor
```
then in your app, you can use like below.

```Svelte
<script>
import { root, Frame, Tab, components, Comp, FRM } from 'svelditor';

// import your components
import CompA from './CompA.svelte'
import CompB from './CompB.svelte'

// you will set your components here
components.set( [new Comp('CompA', CompA), new Comp('CompB', CompB)] );

// define root frame
const rootFrame = new Frame([], []);
rootFrame.tabs.push(new Tab('CompA', rootFrame.frames[0]));
root.init(rootFrame);
</script>

<!-- place tabs in absolute coordinate -->
<FRM x={0} y={0} w={720} h={480} bind:f={$root}/>
```

## License
[MIT](LICENSE)