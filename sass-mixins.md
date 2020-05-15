# SCSS Mixins

## Palette

To retrieve the exported color you can easily use the built-in `map-get`

```scss
$color-primary: map-get($colors, "primary");
```

## Typography & Components
You can generate css styles mapping the exported rules with css selector using the following mixins.

```scss
@mixin generate-rules-from-map($variablePrefix, $propertyList, $variableList) {
  @each $property in $propertyList {
    @if map-get($variableList, $variablePrefix+"-"+$property) {
      #{$property}: map-get($variableList, $variablePrefix+"-"+$property);
    }
  }
}

@mixin generate-rules($variableToClasses, $propertyList, $variableList, $breakpoints: $sketchVariablesBreakpoint) {
  @each $variablePrefix, $cssClasses in $variableToClasses {
    #{$cssClasses} {
      @each $breakpoint, $breakpointVariable in $breakpoints {
        @if($breakpoint == "default") {
          @include generate-rules-from-map($variablePrefix+"-"+$breakpointVariable, $propertyList, $variableList);
        } @else {
          @include mq($breakpoint) {
            @include generate-rules-from-map($variablePrefix+"-"+$breakpointVariable, $propertyList, $variableList);
          }
        }
      }
    }
  }
}
```

### Usage for typography variables
```scss
// Include the exported file in your main file
@import "./uikit";

// map figma node name with your css classes
$typographyVariablesToCSSClasses: (
  "h1": "h1, .Heading1",
  ...
);

// choose the rules you want generate
$typographyPropertyList: (
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  // "color",
  // "letter-spacing",
  // "text-transform",
);

@include generate-rules($typographyVariablesToCSSClasses, $typographyPropertyList, $typographyVariables);

```
The output will be:
```css

h1, .Heading1 {
  font-family: "Helvetica";
  font-size: 3rem;
  font-weight: 400;
  line-height: 3rem;
}

@media (min-width: 48em) {
  h1, .Heading1 {
    font-size: 3.5rem;
    line-height: 3.5rem;
  }
}
```

### Usage for components variables
```scss
// Include the exported file in your main file
@import "./uikit";

// and then in you component file..

// map figma node name with your css classes
$buttonsVariablesToCSSClasses: (
  "btn-primary-default": ".Button-primary",
  "btn-primary-hover": ".Button-primary:hover",
  "btn-primary-disabled": ".Button-primary:disabled",
);

// choose the rules you want generate
$buttonsPropertyList: (
  "background-color",
  "border-radius",
  "border",
  "color",
  // "padding"
);

@include generate-rules($buttonsVariablesToCSSClasses, $buttonsPropertyList, $componentsVariables);

```
The output will be:

```css
.Button-primary {
  background-color: #ed1d24;
  border-radius: 3.125rem;
  border: 2px solid #ed1d24;
  color: #ffffff;
}

.Button-primary:hover {
  background-color: #be1918;
  border: 2px solid #be1918;
}

.Button-primary:disabled {
  background-color: #d9d9d9;
  border: 1px solid #d9d9d9;
}
```