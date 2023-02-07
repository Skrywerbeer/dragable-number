# dragable-number

## Adding
Firstly add as a submodule 
`git submodule add https://github.com/Skrywerbeer/sparkline`.
Then add to your markup.

```html
<script src="path/to/sparkline/sparkline.js"></script>
<sparkline></sparkline>
```

## Attributes
- `initial` The value the element will hold when connected.
- `min` The minimum value to which can be dragged.
- `max` The maximum value.
- `step` The amount by which the value will be incremented or decremented.
- `threshold` The number of pixels the cursor needs to move before stepping the value
- `state` This attribute should not be written. It is set by the element itself.

## Styling
Styling is done by making use of the `state` attribute.
```css
dragable-number[state="minClamped"] {}
dragable-number[state="maxClamped"] {}
dragable-number[state="inRange"] {}
```
