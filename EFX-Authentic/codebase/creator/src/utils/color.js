export const randomInt = (fr, to) => {
  return Math.round(fr + Math.random() * to);
};

export const generateRGBColors = (count = 1) => {
  return Array.apply(null, new Array(count)).map(() => {
    return {
      r: randomInt(0, 255),
      g: randomInt(0, 255),
      b: randomInt(0, 255),
    };
  });
};

export default {
  randomInt,
  generateRGBColors,
};
