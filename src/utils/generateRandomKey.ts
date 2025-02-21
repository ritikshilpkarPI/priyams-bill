function getRandomNumber() {
    return String.fromCharCode(Math.floor(Math.random() * 10) + 48);
}

function getRandomLetter() {
    const isUpperCase = Math.random() < 0.5;
    return String.fromCharCode(
        isUpperCase
            ? Math.floor(Math.random() * 26) + 65
            : Math.floor(Math.random() * 26) + 97
    );
}

export function generateRandomKey(length:number) {
  let password = '';
  const availableMethods = [getRandomLetter, getRandomNumber];
  for (let i = 0; i < length; i++) {
    const randomKey =
      availableMethods[Math.floor(Math.random() * availableMethods.length)];
    password += randomKey();
  }
  return password;
}
