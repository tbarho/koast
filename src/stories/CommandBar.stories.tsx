import React from "react";
import { createGlobalStyle } from 'styled-components'
import { ComponentStory, ComponentMeta } from "@storybook/react";
import {
  KBarProvider
} from "kbar";

import CommandBar from '../components/CommandBar';

const GlobalStyle = createGlobalStyle`
* {
  font-family: 'Roboto', sans-serif;
}

:root {
  --background: rgb(252 252 252);
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
  title: "Koast/CommandBar",
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {
    backgroundColor: { control: "color" },
  },
} as any;

function HomeIcon() {
  return (
    <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="m19.681 10.406-7.09-6.179a.924.924 0 0 0-1.214.002l-7.06 6.179c-.642.561-.244 1.618.608 1.618.51 0 .924.414.924.924v5.395c0 .51.414.923.923.923h3.236V14.54c0-.289.234-.522.522-.522h2.94c.288 0 .522.233.522.522v4.728h3.073c.51 0 .924-.413.924-.923V12.95c0-.51.413-.924.923-.924h.163c.853 0 1.25-1.059.606-1.62Z"
        fill="rgba(255,255,255,0.5)"
      />
    </svg>
  );
}

const actions = [
  {
    id: "blog",
    name: "Blog",
    // subtitle: "Read the latest news",
    shortcut: ['Meta+b'],
    keywords: "writing words",
    icon: <HomeIcon />,
    perform: () => console.log('blog'),
  },
  {
    id: "post",
    name: "New Post",
    // subtitle: "Create a new post",
    shortcut: ['Meta+p'],
    keywords: "writing words post",
    parent: 'blog',
    icon: <HomeIcon />,
    perform: () => console.log('post'),
  },
  {
    id: "contact",
    name: "Contact",
    shortcut: ["c"],
    keywords: "email",
    icon: <HomeIcon />,
    perform: () => console.log('contact'),
  },
];

/*


*/

// More on component templates: https://storybook.js.org/docs/react/writing-stories/introduction#using-args
const Template: any = (args: any) => (
  <> 
    <GlobalStyle />
    <KBarProvider actions={actions}>
      <CommandBar />
    </KBarProvider>
  </>
);

export const KitchenSink = Template.bind({});
// More on args: https://storybook.js.org/docs/react/writing-stories/args
KitchenSink.args = {
  primary: true,
  label: "Button",
};
