# Different ways to handle size in css

## rem, vh, dvh, fr, em, %, px

### rem

Root EM, its relative to the font size of the html element, which by default is 16px.

So we have:

- 1rem = 16px
- 2rem = 32px
  -and so on...

Its used mainly on global spacing and sizes because it keeps consistency across the whole page.

```css
padding: 1rem;
margin: 2rem;
gap: 1.5rem;
border-radius: 0.5rem;
```

---

### vh and dvh

Viewport Height,
1vh = 1% of the screen height
It has problems specially in mobile since the web browser screen can have strange interactions with the web search bar
used on full screen websites

Dynamic viewport height,
its like a modern vh, which adapts dynamically when:

- the keyboard appears
- the web search bar changes
- the viewport changes

Used mostly on mobile. Its the safer option between the two.

---

### fr

Fraction, its only used on CSS Grid.
It represents a fraction of the available space.

Why its used on grids?
Because it was created for that purpose, before there was an issue with % where they had to do things like this:¿:

```css
grid-template-columns: 33.33% 33.33% 33.33%;
```

---

### %

Uses a percentage of its parent's container

---

### em

Unlike rem, em is relative to the font size of the parent/current element.
Usually used on buttons or components so the spacing scales with the text size.

---

### px

Absolute unit, 1px = 1 pixel. It doesn't scale with anything.
Best for things like borders and shadows where you want exact control.
