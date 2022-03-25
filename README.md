# Pathfinding-Algorithms
[Click Here!](https://phinziegler.github.io/Pathfinding-Algorithms/)

WIP -- visualizer for search algorithms. 3/22/2022

This project allow the user to visualize various search algorithms on a grid.
The user will be able to paint walls, startpoints and endpoints, control the animation speed, view area, and more.

## TODO
<ol>
  <li>Implement search algorithms.
    <ul>
      <li>Breadth First (Done)
      <li>(Clamped) Depth First
      <li>Greedy Best First
      <li>A* Search
      <li>Beam Search
      <li>etc
    </ul>
  <li>Animate search. (Done)
  <li>Ability to move camera while animation occurs.(Done)
  <li>Make default offset such that the screen is in the middle of the board. (Done)
  <li>Control animation speed. (Done)
  <li>When starting a new animation, stop animating any previous animations.
  <li>Use Set.has() instead of Array.includes() for visited check in BFS, O(1) vs O(n).
  <li>When painting with mouse, interpolate points to paint between mousemove event locations.
  <li>Tutorial/info page.
