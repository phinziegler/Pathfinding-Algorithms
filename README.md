# Pathfinding-Algorithms
[Click Here!](https://phinziegler.github.io/Pathfinding-Algorithms/)

This project allow the user to visualize various search algorithms on a grid, and allow them to paint their own start and end points, as well as walls to complicate the search.

## TODO
<ol>
  <li>Implement search algorithms.
    <ul>
      <li>Breadth First (Done)
      <li>Depth First (Done)
      <li>Best First
      <li>A* Search
      <li>Beam Search
      <li>etc
    </ul>
  <li>Animate search. (Done)
  <li>Ability to move camera while animation occurs.(Done)
  <li>Make default offset such that the screen is in the middle of the board. (Done)
  <li>Control animation speed. (Done)
  <li>When starting a new animation, stop animating any previous animations. (Done)
  <li>Use Set.has() instead of Array.includes() for visited check in BFS, O(1) vs O(n). (Done)
  <li>When painting with mouse, interpolate points to paint between mousemove event locations. (Done)
  <li>Can change animation speed in the middle of an animation. (Done)
  <li>Add a way to select between search algorithms.
  <li>Tutorial/info page.
  <li>Zoom/unzoom should be bound to the center of the window, not the center of the board.
  <li>Optimize: namely, changing forEach into for loops.