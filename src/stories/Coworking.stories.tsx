
import { createGlobalStyle } from 'styled-components'

import FloorPlan from '../components/FloorPlan';

const GlobalStyle = createGlobalStyle`
* {
  font-family: 'Roboto', sans-serif;
}

:root {
  --background: #17072b;
  --a1: rgba(0 0 0 / 0.05);
  --a2: rgba(0 0 0 / 0.1);
  --foreground: rgb(28 28 29);
  --shadow: 0px 6px 20px rgb(0 0 0 / 20%);

  --unit: 8px;
}

html[data-theme-dark]:root {
  --background: rgb(28 28 29);
  --a1: rgb(53 53 54);
  --a2: rgba(255 255 255 / 0.1);
  --foreground: rgba(252 252 252 / 0.9);
  --shadow: rgb(0 0 0 / 50%) 0px 16px 70px;
}

html {
  background: var(--background);
  color: var(--foreground);
}
`

// More on default export: https://storybook.js.org/docs/react/writing-stories/introduction#default-export
export default {
  title: "Coworking/KitchenSink",
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as any;




// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: any = (args: any) => (
  <> 
    <GlobalStyle />
    <FloorPlan />
  </>
);

export const KitchenSink = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
KitchenSink.args = {
  primary: true,
  label: "Button",
};
