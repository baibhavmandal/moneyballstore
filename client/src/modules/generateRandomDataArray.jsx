function getRandomColor() {
  const colors = ["red", "green", "violet", ""];
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

function getRandomIntAmount() {
  const numbers = [10, 20, 30, 50, 100, 200, 300, 500, 1000, 1500, 2000, 30000];
  const randomIndex = Math.floor(Math.random() * numbers.length);
  return numbers[randomIndex];
}

function generateRandomIntInRange(x, y) {
  if (x > y) {
    // Swap x and y if x is greater than y
    [x, y] = [y, x];
  }

  const min = Math.ceil(x);
  const max = Math.floor(y);

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomUUIDs() {
  const uuid = "xxxxxxxxxxxx".replace(/[x]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  return uuid;
}

function generateRandomUserDataArray() {
  const dataArrays = [];

  for (let i = 0; i < 50; i++) {
    const uuid = generateRandomUUIDs();
    const color = getRandomColor();
    const randomDigit = Math.floor(Math.random() * 10);
    const randomInt = getRandomIntAmount();

    dataArrays.push([uuid, color, randomDigit, randomInt]);
  }

  return dataArrays;
}

export default generateRandomUserDataArray;
