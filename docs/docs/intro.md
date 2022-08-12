---
sidebar_position: 1
---

# Getting Started

Let's discover **QTerminal in less than 5 minutes**.

## Install
```bash
npm install qterminal
```
## Usage
```typescript
import { createTerminal } from 'qterminal';
import 'qterminal/themes/default.css';

const term = createTerminal({});
```

## Fonts
To use the default font (Press Start 2P), you'll need to add the following stylesheet to your HTML file:
```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
```

To use a custom font add the following class to your css:
```css
.terminal-container {
  font-family: 'My Custom Font', cursive;
}
```

## Themes
Themes are a way to customize the look and feel of the terminal.
There are 3 built-in themes: default, 80s and cyber.

```typescript
import 'qterminal/themes/default.css';
```
```typescript
import 'qterminal/themes/80s.css';
```
```typescript
import 'qterminal/themes/cyber.css';
```

Get started by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.14 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Generate a new site

Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.
