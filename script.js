
const n = 50; 
const array = [];
const myCanvas = document.getElementById('myCanvas');
myCanvas.width = window.innerWidth * 0.8;
const ctx = myCanvas.getContext("2d");

let swaps = 0;
let comparisons = 0;


for (let i = 0; i < n; i++) {
  array[i] = Math.random();
}


class Column {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  draw(ctx) {
    ctx.fillStyle = '#';
    ctx.fillRect(this.x, this.y - this.height, this.width, this.height);
  }

  clear(ctx) {
    ctx.clearRect(this.x, this.y - this.height, this.width, this.height);
  }
}

// Draw the initial array
const spacing = myCanvas.width / n;
const cols = [];
for (let i = 0; i < array.length; i++) {
  const x = i * spacing;
  const y = myCanvas.height;
  const width = spacing;
  const height = myCanvas.height * array[i];
  cols[i] = new Column(x, y, width, height);
  cols[i].draw(ctx);
}

// Sorting Algorithms
async function bubbleSort() {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisons++;
      if (array[j] > array[j + 1]) {
        // Swap in array
        [array[j], array[j + 1]] = [array[j + 1], array[j]];
        swaps++;

        // Clear and redraw columns
        cols[j].clear(ctx);
        cols[j + 1].clear(ctx);

        cols[j].height = myCanvas.height * array[j];
        cols[j + 1].height = myCanvas.height * array[j + 1];

        cols[j].draw(ctx);
        cols[j + 1].draw(ctx);

        // Add a delay for visualization
        await new Promise(r => setTimeout(r, 50));
        updateMetrics();
      }
    }
  }
}

async function mergeSort(array, left, right) {
  if (left < right) {
    const mid = Math.floor((left + right) / 2);
    await mergeSort(array, left, mid);
    await mergeSort(array, mid + 1, right);
    await merge(array, left, mid, right);
  }
}

async function merge(array, left, mid, right) {
  const n1 = mid - left + 1;
  const n2 = right - mid;
  const L = new Array(n1);
  const R = new Array(n2);

  for (let i = 0; i < n1; i++) {
    L[i] = array[left + i];
  }
  for (let j = 0; j < n2; j++) {
    R[j] = array[mid + 1 + j];
  }

  let i = 0, j = 0, k = left;
  while (i < n1 && j < n2) {
    comparisons++;
    if (L[i] <= R[j]) {
      array[k] = L[i];
      i++;
    } else {
      array[k] = R[j];
      j++;
    }
    // Clear and redraw columns
    cols[k].clear(ctx);
    cols[k].height = myCanvas.height * array[k];
    cols[k].draw(ctx);

    await new Promise(r => setTimeout(r, 20));
    k++;
    updateMetrics();
  }

  while (i < n1) {
    array[k] = L[i];
    cols[k].clear(ctx);
    cols[k].height = myCanvas.height * array[k];
    cols[k].draw(ctx);
    await new Promise(r => setTimeout(r, 20));
    i++;
    k++;
    updateMetrics();
  }

  while (j < n2) {
    array[k] = R[j];
    cols[k].clear(ctx);
    cols[k].height = myCanvas.height * array[k];
    cols[k].draw(ctx);
    await new Promise(r => setTimeout(r, 20));
    j++;
    k++;
    updateMetrics();
  }
}

async function quickSort(array, low, high) {
  if (low < high) {
    const pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
  }
}

async function partition(array, low, high) {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j <= high - 1; j++) {
    comparisons++;
    if (array[j] < pivot) {
      i++;
      [array[i], array[j]] = [array[j], array[i]];

      // Clear and redraw columns
      cols[i].clear(ctx);
      cols[j].clear(ctx);

      cols[i].height = myCanvas.height * array[i];
      cols[j].height = myCanvas.height * array[j];

      cols[i].draw(ctx);
      cols[j].draw(ctx);

      await new Promise(r => setTimeout(r, 20));
      updateMetrics();
    }
  }

  [array[i + 1], array[high]] = [array[high], array[i + 1]];

  cols[i + 1].clear(ctx);
  cols[high].clear(ctx);

  cols[i + 1].height = myCanvas.height * array[i + 1];
  cols[high].height = myCanvas.height * array[high];

  cols[i + 1].draw(ctx);
  cols[high].draw(ctx);

  await new Promise(r => setTimeout(r, 20));
  updateMetrics();

  return i + 1;
}

function startSorting() {
  const algorithm = document.getElementById('algorithm').value;
  switch (algorithm) {
    case 'bubbleSort':
      bubbleSort();
      break;
    case 'mergeSort':
      mergeSort(array, 0, array.length - 1);
      break;
    case 'quickSort':
      quickSort(array, 0, array.length - 1);
      break;
    default:
      console.log('Invalid algorithm');
  }
}

function resetArray() {
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.random();
    cols[i].clear(ctx);
    cols[i].height = myCanvas.height * array[i];
    cols[i].draw(ctx);
  }
  swaps = 0;
  comparisons = 0;
  updateMetrics();
}

function updateMetrics() {
  document.getElementById('swaps').textContent = `Swaps: ${swaps}`;
  document.getElementById('comparisons').textContent = `Comparisons: ${comparisons}`;
}

function changeTheme(theme) {
  document.body.className = theme;
}
