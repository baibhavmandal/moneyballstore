function replaceDigitsWithY(inputString) {
  // Use a regular expression to match digits
  const regex = /\d/g;

  // Replace all matched digits with "y"
  const resultString = inputString.replace(regex, "y");

  return resultString;
}

export { replaceDigitsWithY };
