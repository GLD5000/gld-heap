type Entry<T> = [number, T];

type PriorityNode<T> = {
  priority: number;
  value: T;
  seq: number;
};

type PriorityHeap<T> = {
  push: (entry: Entry<T>) => void;
  pop: () => Entry<T> | undefined;
  peek: () => Entry<T> | undefined;
  size: () => number;
  isEmpty: () => boolean;
  clear: () => void;
  toArray: () => Entry<T>[];
  fromArray: (entries: Entry<T>[]) => void;
  replace: (entry: Entry<T>) => Entry<T> | undefined;
  removeIf: (pred: (e: Entry<T>) => boolean) => boolean;
};

/**
 * Create a priority heap.
 * @param isMax - if true, creates a max-heap (larger priority = higher priority)
 */
function createPriorityHeap<T>(isMax = false): PriorityHeap<T> {
  const data: PriorityNode<T>[] = [];
  let seqCounter = 0;

  const parent = (i: number) => Math.floor((i - 1) / 2);
  const left = (i: number) => 2 * i + 1;
  const right = (i: number) => 2 * i + 2;

  function cmp(a: PriorityNode<T>, b: PriorityNode<T>) {
    // For min-heap (isMax = false): smaller priority first.
    // For max-heap (isMax = true): larger priority first.
    if (a.priority < b.priority) return isMax ? 1 : -1;
    if (a.priority > b.priority) return isMax ? -1 : 1;
    // tie-breaker: earlier seq (smaller seq) comes first for stability
    return a.seq - b.seq;
  }

  function swap(i: number, j: number) {
    const tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;
  }

  function siftUp(idx: number) {
    let i = idx;
    while (i > 0) {
      const p = parent(i);
      if (cmp(data[i], data[p]) < 0) {
        swap(i, p);
        i = p;
      } else break;
    }
  }

  function siftDown(idx: number) {
    let i = idx;
    const n = data.length;
    while (true) {
      const l = left(i);
      const r = right(i);
      let best = i;
      if (l < n && cmp(data[l], data[best]) < 0) best = l;
      if (r < n && cmp(data[r], data[best]) < 0) best = r;
      if (best !== i) {
        swap(i, best);
        i = best;
      } else break;
    }
  }

  function heapify(nodes: PriorityNode<T>[]) {
    data.length = 0;
    data.push(...nodes);
    for (let i = Math.floor(data.length / 2); i >= 0; i--) siftDown(i);
  }

  return {
    push(entry) {
      const [priority, value] = entry;
      data.push({ priority, value, seq: seqCounter++ });
      siftUp(data.length - 1);
    },

    pop() {
      if (data.length === 0) return undefined;
      if (data.length === 1) {
        const n = data.pop()!;
        return [n.priority, n.value] as Entry<T>;
      }
      const top = data[0];
      data[0] = data.pop()!;
      siftDown(0);
      return [top.priority, top.value] as Entry<T>;
    },

    peek() {
      if (data.length === 0) return undefined;
      const n = data[0];
      return [n.priority, n.value] as Entry<T>;
    },

    size() {
      return data.length;
    },

    isEmpty() {
      return data.length === 0;
    },

    clear() {
      data.length = 0;
    },

    toArray() {
      return data.map((n) => [n.priority, n.value] as Entry<T>);
    },

    fromArray(entries) {
      const nodes = entries.map(([priority, value]) => ({
        priority,
        value,
        seq: seqCounter++,
      }));
      heapify(nodes);
    },

    replace(entry) {
      const [priority, value] = entry;
      if (data.length === 0) {
        data.push({ priority, value, seq: seqCounter++ });
        return undefined;
      }
      const old = data[0];
      data[0] = { priority, value, seq: seqCounter++ };
      siftDown(0);
      return [old.priority, old.value] as Entry<T>;
    },

    removeIf(pred) {
      const idx = data.findIndex((n) => pred([n.priority, n.value]));
      if (idx === -1) return false;
      const last = data.pop()!;
      if (idx < data.length) {
        data[idx] = last;
        siftDown(idx);
        siftUp(idx);
      }
      return true;
    },
  };
}

const minHeap = createPriorityHeap();

minHeap.fromArray([[3, 'three'], [56, 'large'], [89, 'largest'], [4, 'four'], [2, 'two'], [1, 'smallest'], [5, 'middling']])

console.log(minHeap.peek());

const maxHeap = createPriorityHeap(true);

maxHeap.fromArray([[3, 'three'], [56, 'large'], [89, 'largest'], [4, 'four'], [2, 'two'], [1, 'smallest'], [5, 'middling']])

console.log(maxHeap.peek());