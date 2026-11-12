export const WORLD_WIDTH = 1600;
export const WORLD_HEIGHT = 4600;
export const SCREEN_WIDTH = 1024;
export const SCREEN_HEIGHT = 768;

export const SPEED_TRENCH = 320; // Velocidad máxima permitida en corriente limpia
export const SPEED_SILT = 140;   // Penalización de velocidad (< 160) en sedimento

export const PATH_POINTS = [
  { x: 800, y: 250 },
  { x: 520, y: 780 },
  { x: 1080, y: 1320 },
  { x: 480, y: 1860 },
  { x: 1120, y: 2400 },
  { x: 540, y: 2940 },
  { x: 1060, y: 3480 },
  { x: 650, y: 3980 },
  { x: 800, y: 4350 }
];

export const ENEMY_WAYPOINTS = [
  { y: 950, x1: 350, x2: 950 },
  { y: 1650, x1: 500, x2: 1200 },
  { y: 2350, x1: 450, x2: 1250 },
  { y: 3150, x1: 380, x2: 1050 },
  { y: 3850, x1: 500, x2: 1150 }
];