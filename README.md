# UIKIT to SCSS

This is a Figma Plugin that allows you to export a sass file with the styles of certain nodes, very useful for design systems and ui-kit.

![Preview](/preview.png)

You can easily setup the identifiers to retrieve the right nodes to be exported
as sass variables.
There are three types of groups:

* Palette: identify a color variable
* Typography: identify a text style
* Components: identify for example a button or an input component


Based on the configuration, the plugin will search nodes with name like **@uikit-typo-h1-mobile**, i.e. according the following format:

{BASE_PREFIX}{SEPARATOR}{GROUP_PREFIX}{SEPARATOR}{variable_name}{SEPARATOR}{mobile/tablet/desktop}

## Groups

### Palette
It represents all nodes that follow the name format and have the identifier you chose in the UIKIT tab under `Palette prefix group` as GROUP_PREFIX. 
e.g. **@uikit-palette-primary**

The plugin will export the first fill color of these nodes

### Typography

It represents all nodes that follow the name format and have the identifier you chose in the UIKIT tab under `Typography prefix group` as GROUP_PREFIX. 
e.g. **@uikit-typo-h1-mobile**

The plugin will export:
* `font-family`
* `font-size`
* `font-style`
* `font-weight`
* `line-height`
* `letter-spacing`
* `text-transform`
* `color`

### Components 

It represents all nodes that follow the name format and have the identifier you chose in the UIKIT tab under `Components group prefix` as GROUP_PREFIX. 
e.g. **@uikit-component-btn-primary-default-mobile**

The plugin will export: 
* `opacity`
* `padding`
* `border`
* `border-radius`
* `background-color`
* `color` (based on the first fill color of the first visible children)

#### Referenced child

If you deal with a styleless component (e.g. a node group), you can create a reference to a child node that you want to use as styles source.
For example:
```

- @uikit-component-button // Parent Node
  -- @uikit-ref           // Child node
```

## Export file

In the exported file, according to your figma file and the names you chose in the `SCSS` tab, you will have something like this:

```
// PALETTE 
$colors: (
  "black": #000000,
  ...
);

// TYPOS 
$typographyVariables: (
  "h1-mobile-color": map-get($colors, "black"),
  "h1-mobile-font-family": 'Helvetica',
  "h1-mobile-font-size": rem(48px),
  "h1-mobile-font-style": normal,
  "h1-mobile-font-weight": 700,
  "h1-mobile-letter-spacing": 0em,
  "h1-mobile-line-height": 1.2,
  "h1-mobile-text-transform": none,
  ....
);

// COMPONENTS 
$componentsVariables: (
  "btn-primary-default-mobile-background-color": map-get($colors, "primary"),
  "btn-primary-default-mobile-border": none,
  "btn-primary-default-mobile-border-radius": rem(8px),
  "btn-primary-default-mobile-color": map-get($colors, "black"),
  "btn-primary-default-mobile-opacity": 1,
  "btn-primary-default-mobile-padding": rem(16px),
  "btn-primary-disabled-mobile-background-color": map-get($colors, "primary-light-3"),
  "btn-primary-hover-mobile-background-color": map-get($colors, "primary-light-1"),
  ...
);
```

## SCSS

We use a mobile-first approach, so  duplicated rules will not be exported and we will generate only the necessary rules between states and breakpoints.

You can check how to use the exported file [here](/sass-mixins.md).

## Development

### Prerequisites

This plugin is based on [fika](https://github.com/mattdesl/fika), so you need to install it `npm install @mattdesl/fika -g`

### Environment
To start the dev environment you need to move to the plugin folder and use this command `fika uikit-to-scss`.

### Add plugin to figma

Once you've generated a ./dist folder, open a project in Figma Desktop, select Menu > Plugins > Development > New Plugin. Click "Choose a manifest.json" and find the manifest.json file in ./dist/uikit-to-scss/manifest.json. (notice dist not src).