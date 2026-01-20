let hovering = false;
let currentLoopPromise: Promise<void> | null = null;

globalThis.startCursor = (g: SVGGElement) => {
  hovering = true;
  g.style.transitionTimingFunction = "linear";
  currentLoopPromise = loop(g);
};

const loop = async (g: SVGGElement) => {
  const steps = 48;
  const xRadiusMultiplier = 0.25;
  const yRadiusMultiplier = 0.75;

  let i = 16;
  while (hovering) {
    const progress = (i * 2 * Math.PI) / steps;

    const x = Math.round(
      (xRadiusMultiplier * (100 * Math.cos(progress) + 100)) / 2 +
        50 * (1 - xRadiusMultiplier),
    );
    const y = Math.round(
      (yRadiusMultiplier * (100 * Math.sin(progress) + 100)) / 2 +
        50 * (1 - yRadiusMultiplier),
    );

    g.style.transform = `translate(${x}%, ${y}%)`;

    await new Promise((resolve) => setTimeout(resolve, 100));
    i++;
    i %= steps;
  }
};

globalThis.stopCursor = async (g: SVGGElement) => {
  hovering = false;

  if (currentLoopPromise) await currentLoopPromise;

  g.style.transitionTimingFunction = "var(--ease-out)";
  g.style.transform = `translate(20%, 60%)`;
};
