function toggleDetails(id) {
  const details = document.getElementById(id);
  details.style.display = details.style.display === 'block' ? 'none' : 'block';
}

const { Engine, Render, Runner, Bodies, Composite, Body } = Matter;

const engine = Engine.create();
const world = engine.world;

const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: 'transparent'
  }
});

Render.run(render);
const runner = Runner.create();
Runner.run(runner, engine);

const width = window.innerWidth;
const height = window.innerHeight;

const ground = Bodies.rectangle(width / 2, height + 50, width * 2, 100, { isStatic: true });
const roof = Bodies.rectangle(width / 2, -50, width * 2, 100, { isStatic: true });
const leftWall = Bodies.rectangle(-50, height / 2, 100, height * 2, { isStatic: true });
const rightWall = Bodies.rectangle(width + 50, height / 2, 100, height * 2, { isStatic: true });

Composite.add(world, [ground, roof, leftWall, rightWall]);

const cubes = [];
const numCubes = 150;

for (let i = 0; i < numCubes; i++) {
  const size = 30 + Math.random() * 50;
  const x = Math.random() * width;
  const y = Math.random() * height;

  const newCube = Bodies.rectangle(
    x,
    y,
    size,
    size,
    {
      restitution: 0.7,
      friction: 0.1,
      density: 0.002,
      render: {
        fillStyle: `rgba(${Math.floor(Math.random() * 255)}, 0, 255, 0.5)`
      }
    }
  );

  cubes.push(newCube);
  Composite.add(world, newCube);
}

let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrollDelta = window.scrollY - lastScroll;
  lastScroll = window.scrollY;

  if (scrollDelta > 0) {
    cubes.forEach(cubo => {
      Body.applyForce(cubo, cubo.position, { x: 0, y: -scrollDelta * 0.5 });
      Body.setAngularVelocity(cubo, cubo.angularVelocity + scrollDelta * 0.02);
    });
  }
});

window.addEventListener('wheel', (event) => {
  const scrollDelta = event.deltaY;

  if (scrollDelta > 0) {
    cubes.forEach(cubo => {
      Body.applyForce(cubo, cubo.position, { x: 0, y: -scrollDelta * 0.002 });
      Body.setAngularVelocity(cubo, cubo.angularVelocity + scrollDelta * 0.001);
    });
  }
});

window.addEventListener('click', (event) => {
  const clickX = event.clientX;
  const clickY = event.clientY;

  cubes.forEach(cubo => {
    const dx = cubo.position.x - clickX;
    const dy = cubo.position.y - clickY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const explosionRadius = 200;

    if (distance < explosionRadius) {
      const forceMagnitude = (1 - distance / explosionRadius);

      let forceX = 0;
      let forceY = 0;

      if (distance !== 0) {
        forceX = (dx / distance) * forceMagnitude;
        forceY = (dy / distance) * forceMagnitude;
      } else {
        forceX = (Math.random() - 0.5) * forceMagnitude;
        forceY = (Math.random() - 0.5) * forceMagnitude;
      }

      Body.applyForce(cubo, cubo.position, { x: forceX, y: forceY });
    }
  });
});