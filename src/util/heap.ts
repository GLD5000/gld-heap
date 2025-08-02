export function createHeap(props: { type: string; initValues: number[] }) {
  const { type, initValues } = props;
  const heapType = type || "min";
  const values: number[] = [];
  const heap = Object.freeze({
    insert: function (value: number) {
      values.push(value);
      heapifyUp();

      return values;
    },
    search: function (target) {
      for (let i = 0; i < values.length; i += 1) {
        if (values[i] === target) {
          return i;
        }
        return -1;
      }
    },
    removeRoot: function () {
      if (values.length === 0) return null;
      if (values.length === 1) return [] as number[];

      const rootValue = values[0];
      values[0] = values.pop() as number;

      heapifyDown();

      return rootValue;
    },

    root: function () {
      return values[0];
    },

    size: function () {
      return values.length;
    },
  });
  if (initValues) {
    initValues.forEach((value) => heap.insert(value));
  }

  return heap;
  function heapifyDown() {
    if (values.length > 0) {
      let currentIndex = 0;
      while (true) {
        const leftChild = getLeftChildIndex(currentIndex);
        const rightChild = getRightChildIndex(currentIndex);
        let smallestOrLargest = currentIndex;

        if (
          leftChild < values.length &&
          compare(values[leftChild], values[smallestOrLargest])
        ) {
          smallestOrLargest = leftChild;
        }

        if (
          rightChild < values.length &&
          compare(values[rightChild], values[smallestOrLargest])
        ) {
          smallestOrLargest = rightChild;
        }

        if (smallestOrLargest === currentIndex) break;

        swap(currentIndex, smallestOrLargest);
        currentIndex = smallestOrLargest;
      }
    }
  }

  function heapifyUp() {
    let currentIndex = values.length - 1;

    while (currentIndex > 0) {
      const parentIndex = getParentIndex(currentIndex);
      if (!compare(values[currentIndex], values[parentIndex])) {
        break;
      }
      swap(currentIndex, parentIndex);
      currentIndex = parentIndex;
    }
  }
  function getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  function getLeftChildIndex(parentIndex) {
    return 2 * parentIndex + 1;
  }
  function getRightChildIndex(parentIndex) {
    return 2 * parentIndex + 2;
  }
  function swap(index1, index2) {
    [values[index1], values[index2]] = [values[index2], values[index1]];
  }
  function compare(a, b) {
    return heapType === "min" ? a < b : a > b;
  }
}
