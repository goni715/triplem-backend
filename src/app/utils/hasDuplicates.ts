

function hasDuplicates(arr: string[]) {
  return new Set(arr).size !== arr.length;
}

export default hasDuplicates;