function integrateGravity(initialSpeed, time, gravity) {
  return initialSpeed + gravity * time;
}

function integrateGravityVel(initialPos, speed, time) {
  return initialPos + speed * time;
}
