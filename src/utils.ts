function generateUUID() {
  function getRandomHex(length: number) {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += Math.floor(Math.random() * 16).toString(16);
    }
    return result;
  }

  return (
    getRandomHex(8) + '-' +
    getRandomHex(4) + '-' +
    '4' + getRandomHex(3) + '-' +  // Версия 4 UUID
    ((Math.floor(Math.random() * 4) + 8).toString(16)) + getRandomHex(3) + '-' +  // Вариант UUID
    getRandomHex(12)
  );
}

export { generateUUID } 