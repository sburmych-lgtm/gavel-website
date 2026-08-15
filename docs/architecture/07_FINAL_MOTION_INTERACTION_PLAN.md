# 07 · MOTION AND INTERACTION

Motion budget is small on purpose. The page has one job on first screen — read
as water and strength — and every extra moving thing spends attention the H1
needs.

```
--ease     cubic-bezier(0.22, 1, 0.36, 1)
--t-fast   180ms      hover, focus, button state
--t-base   340ms      nav background, accordion, overlay
--t-slow   500ms      section reveal
```

Only `opacity` and `transform` are animated. Never `width`, `height`, `top`,
`left`, or anything that triggers layout.

## Permitted

| Motion | Spec |
|---|---|
| Hero video loop | muted, looped, `playsinline`, autoplay, visible pause control |
| Section reveal | `opacity 0→1`, `translateY 10px→0`, 500ms, **once**, IntersectionObserver at `threshold: 0.15` |
| Hover | colour and opacity at 180ms. **No scale** — it causes shimmer and sub-pixel reflow |
| Nav background | fades in past 60% viewport height, 340ms |
| Mobile overlay | opacity + `translateY`, 340ms |
| Accordion | native `<details>`; height is not animated |
| Before/After handle | follows pointer with no easing — a lagging handle feels broken |
| Before/After sweep | sine 12–88%, omega 1.15 rad/s (~5.5s per pass); paused on drag, on focus, off-screen |
| Case switch | instant; the sweep restarts from the midpoint so a new case opens readable |
| Sound toggle | no motion; state shown by gold border and a changed label, not colour alone |

## Forbidden

Scrolljacking. Scroll-bound video scrubbing. Hero parallax. Particles. WebGL
water. `feTurbulence` caustics — tried in the previous prototype and removed
because the pattern read as camouflage rather than light through water. Staggered
per-letter reveals. Marquees. Any page intro or splash.

## The hero is not revealed

The hero has no entrance animation and is present at first paint. It is the LCP
region; animating it would delay the largest paint to satisfy a flourish. Reveals
begin at section 2.

## Video behaviour

Every decorative video is `muted loop playsinline autoplay preload="none"`, is
`aria-hidden`, and is out of the tab order.

An IntersectionObserver pauses playback when the element leaves the viewport —
there is no reason to decode frames nobody is looking at, and on a phone it is
battery the visitor did not agree to spend.

Each looping video carries a **visible pause control** because the loops run
longer than five seconds. The control is a real `<button>` with an accessible
name, not an icon glyph.

## Before/After slider — the mandatory interaction

Two identically sized images stacked. The top one is clipped with
`clip-path: inset(0 calc(100% - var(--pos)) 0 0)`. A vertical handle sits at
`--pos`.

Input, all three required:

- **Pointer** — `pointerdown` captures, `pointermove` updates, `pointerup`
  releases. Pointer Events cover mouse, touch and pen in one path.
- **Keyboard** — the handle is a `role="slider"` with `tabindex="0"`,
  `aria-valuemin/max/now` and `aria-label`. Arrow keys move 1%, Shift+Arrow 10%,
  Home and End jump to the ends.
- **Click anywhere on the frame** jumps the handle to that x.

`touch-action: none` on the handle so a horizontal drag does not become a page
scroll. Labels ДО and ПІСЛЯ are DOM text, never baked into the image.

**The handle sweeps on its own** so the comparison reads without anyone
touching it. A sine between 12% and 88% — never 0 or 100, because letting
either side vanish reads as a glitch rather than a comparison.

`syncPhase()` is the part that must survive a refactor: on release, on blur
and after a click-to-position, the wave restarts **from the position the user
left it at** rather than from where it would have been. Without it every
release snaps the handle sideways.

The sweep pauses while dragging, while the handle holds keyboard focus, and
while the section is off-screen. Under `prefers-reduced-motion` it does not
run at all — the slider rests at the midpoint and stays fully draggable,
because dragging is a deliberate user action rather than decoration.

`aria-valuenow` updates only while the user is driving; firing it every frame
would make a screen reader chatter at a control nobody is touching.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

Beyond suppressing transitions, **videos are not fetched at all** — the
component renders the poster as an `<img>` instead. That is the honest reading
of the preference: someone who has asked for less motion should not pay 3.7 MB
for a loop they will never see. Reveal elements render at their final state.

## Keyboard and focus

Skip link before the nav. Focus ring is `2px solid var(--caustic)` at `3px`
offset, never removed. Every interactive target is at least 44×44 CSS px. Tab
order follows the DOM. The mobile overlay traps focus while open and returns it
to the trigger on close.
