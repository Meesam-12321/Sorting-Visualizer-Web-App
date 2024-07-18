document.getElementById('startButton').addEventListener('click', startVisualization);
document.getElementById('speedRange').addEventListener('input', updateSpeed);

let delay = 300;
let iterationCount = 0;
let chart;

function startVisualization() {
    const arrayInput = document.getElementById('arrayInput').value;
    const algorithm = document.getElementById('algorithmSelect').value;
    const chartType = document.getElementById('chartTypeSelect').value;
    const array = arrayInput.split(',').map(Number);

    iterationCount = 0; // Reset the counter
    updateCounter();
    updateVisualization(array, chartType);

    switch (algorithm) {
        case 'bubbleSort':
            bubbleSort(array, chartType);
            break;
        case 'selectionSort':
            selectionSort(array, chartType);
            break;
        case 'insertionSort':
            insertionSort(array, chartType);
            break;
        case 'heapSort':
            heapSort(array, chartType);
            break;
        case 'radixSort':
            radixSort(array, chartType);
            break;
        case 'bucketSort':
            bucketSort(array, chartType);
            break;
        case 'shellSort':
            shellSort(array, chartType);
            break;
        case 'combSort':
            combSort(array, chartType);
            break;
        case 'pigeonholeSort':
            pigeonholeSort(array, chartType);
            break;
        case 'cycleSort':
            cycleSort(array, chartType);
            break;
        case 'bitonicSort':
            bitonicSort(array, chartType);
            break;
        default:
            console.log('Algorithm not supported');
    }
}

function updateSpeed() {
    delay = document.getElementById('speedRange').value;
    document.getElementById('speedValue').textContent = `${delay}ms`;
}

function updateVisualization(array, chartType) {
    const ctx = document.getElementById('visualizationCanvas').getContext('2d');
    if (chart) chart.destroy();

    const config = {
        type: chartType,
        data: {
            labels: array.map((_, i) => i),
            datasets: [{
                label: 'Array Values',
                data: array,
                backgroundColor: array.map(() => getRandomColor()),
                borderColor: array.map(() => getRandomColor()),
                borderWidth: 1
            }]
        },
        options: {
            animation: {
                duration: delay
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    };

    chart = new Chart(ctx, config);
}

function updateCounter() {
    document.getElementById('iterationCounter').textContent = iterationCount;
}

async function bubbleSort(array, chartType) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            if (array[j] > array[j + 1]) {
                await swapElements(array, j, j + 1, chartType);
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
        }
    }
    updateVisualization(array, chartType);
}

async function selectionSort(array, chartType) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }
        if (minIdx !== i) {
            await swapElements(array, i, minIdx, chartType);
            iterationCount++;
            updateCounter();
            await sleep(delay);
        }
    }
    updateVisualization(array, chartType);
}

async function insertionSort(array, chartType) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            updateVisualization(array, chartType);
            await sleep(delay);
            j--;
            iterationCount++;
            updateCounter();
        }
        array[j + 1] = key;
    }
    updateVisualization(array, chartType);
}

async function quickSort(array, low, high, chartType) {
    if (low < high) {
        const pi = await partition(array, low, high, chartType);
        await quickSort(array, low, pi - 1, chartType);
        await quickSort(array, pi + 1, high, chartType);
    }
}

async function partition(array, low, high, chartType) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
        if (array[j] < pivot) {
            i++;
            await swapElements(array, i, j, chartType);
            iterationCount++;
            updateCounter();
            await sleep(delay);
        }
    }
    await swapElements(array, i + 1, high, chartType);
    iterationCount++;
    updateCounter();
    return i + 1;
}

async function mergeSort(array, left, right, chartType) {
    if (left < right) {
        const middle = Math.floor((left + right) / 2);
        await mergeSort(array, left, middle, chartType);
        await mergeSort(array, middle + 1, right, chartType);
        await merge(array, left, middle, right, chartType);
    }
}

async function merge(array, left, middle, right, chartType) {
    const n1 = middle - left + 1;
    const n2 = right - middle;
    const L = new Array(n1);
    const R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = array[left + i];
    for (let i = 0; i < n2; i++) R[i] = array[middle + 1 + i];

    let i = 0, j = 0, k = left;
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            array[k] = L[i];
            i++;
        } else {
            array[k] = R[j];
            j++;
        }
        updateVisualization(array, chartType);
        await sleep(delay);
        iterationCount++;
        updateCounter();
        k++;
    }

    while (i < n1) {
        array[k] = L[i];
        i++;
        k++;
        updateVisualization(array, chartType);
        await sleep(delay);
        iterationCount++;
        updateCounter();
    }

    while (j < n2) {
        array[k] = R[j];
        j++;
        k++;
        updateVisualization(array, chartType);
        await sleep(delay);
        iterationCount++;
        updateCounter();
    }
}

async function heapSort(array, chartType) {
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i, chartType);
    }

    for (let i = n - 1; i > 0; i--) {
        await swapElements(array, 0, i, chartType);
        await heapify(array, i, 0, chartType);
        iterationCount++;
        updateCounter();
        playSound();
        await sleep(delay);
    }
    updateVisualization(array, chartType);
}

async function heapify(array, n, i, chartType) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    iterationCount++;
    updateCounter();
    playSound();
    await sleep(delay);

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }

    iterationCount++;
    updateCounter();
    playSound();
    await sleep(delay);

    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        await swapElements(array, i, largest, chartType);
        await heapify(array, n, largest, chartType);
    }
}


async function radixSort(array, chartType) {
    const max = Math.max(...array);
    let exp = 1;
    while (Math.floor(max / exp) > 0) {
        await countSort(array, exp, chartType);
        exp *= 10;
    }
    updateVisualization(array, chartType);
}

async function countSort(array, exp, chartType) {
    const n = array.length;
    const output = new Array(n).fill(0);
    const count = new Array(10).fill(0);

    for (let i = 0; i < n; i++) count[Math.floor(array[i] / exp) % 10]++;

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = n - 1; i >= 0; i--) {
        output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
        count[Math.floor(array[i] / exp) % 10]--;
    }

    for (let i = 0; i < n; i++) array[i] = output[i];
    updateVisualization(array, chartType);
    await sleep(delay);
    iterationCount++;
    updateCounter();
}

async function bucketSort(array, chartType) {
    const n = array.length;
    if (n <= 0) return;

    const bucket = new Array(n);

    for (let i = 0; i < n; i++) {
        bucket[i] = [];
    }

    const max = Math.max(...array);
    for (let i = 0; i < n; i++) {
        const index = Math.floor(array[i] * n / (max + 1));
        bucket[index].push(array[i]);
    }

    for (let i = 0; i < n; i++) {
        bucket[i].sort((a, b) => a - b);
    }

    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < bucket[i].length; j++) {
            array[index++] = bucket[i][j];
            updateVisualization(array, chartType);
            await sleep(delay);
            iterationCount++;
            updateCounter();
        }
    }
    updateVisualization(array, chartType);
}

async function shellSort(array, chartType) {
    const n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
                updateVisualization(array, chartType);
                await sleep(delay);
                iterationCount++;
                updateCounter();
            }
            array[j] = temp;
            updateVisualization(array, chartType);
            await sleep(delay);
            iterationCount++;
            updateCounter();
        }
    }
    updateVisualization(array, chartType);
}

async function combSort(array, chartType) {
    const n = array.length;
    let gap = n;
    let swapped = true;

    while (gap !== 1 || swapped) {
        gap = getNextGap(gap);
        swapped = false;

        for (let i = 0; i < n - gap; i++) {
            if (array[i] > array[i + gap]) {
                await swapElements(array, i, i + gap, chartType);
                swapped = true;
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
        }
    }
    updateVisualization(array, chartType);
}

function getNextGap(gap) {
    gap = Math.floor((gap * 10) / 13);
    return gap < 1 ? 1 : gap;
}

async function pigeonholeSort(array, chartType) {
    const min = Math.min(...array);
    const max = Math.max(...array);
    const range = max - min + 1;

    const pigeonholes = new Array(range).fill(0);

    for (let i = 0; i < array.length; i++) {
        pigeonholes[array[i] - min]++;
    }

    let index = 0;
    for (let i = 0; i < range; i++) {
        while (pigeonholes[i]-- > 0) {
            array[index++] = i + min;
            updateVisualization(array, chartType);
            await sleep(delay);
            iterationCount++;
            updateCounter();
        }
    }
    updateVisualization(array, chartType);
}

async function cycleSort(array, chartType) {
    const n = array.length;
    for (let cycle_start = 0; cycle_start <= n - 2; cycle_start++) {
        let item = array[cycle_start];
        let pos = cycle_start;

        for (let i = cycle_start + 1; i < n; i++) {
            if (array[i] < item) pos++;
        }

        if (pos === cycle_start) continue;

        while (item === array[pos]) pos += 1;
        if (pos !== cycle_start) {
            [array[pos], item] = [item, array[pos]];
            updateVisualization(array, chartType);
            await sleep(delay);
            iterationCount++;
            updateCounter();
        }

        while (pos !== cycle_start) {
            pos = cycle_start;
            for (let i = cycle_start + 1; i < n; i++) {
                if (array[i] < item) pos += 1;
            }

            while (item === array[pos]) pos += 1;
            if (item !== array[pos]) {
                [array[pos], item] = [item, array[pos]];
                updateVisualization(array, chartType);
                await sleep(delay);
                iterationCount++;
                updateCounter();
            }
        }
    }
    updateVisualization(array, chartType);
}

async function bitonicSort(array, chartType) {
    await bitonicSortHelper(array, 0, array.length, 1, chartType);
    updateVisualization(array, chartType);
}

async function bitonicSortHelper(array, low, cnt, dir, chartType) {
    if (cnt > 1) {
        const k = Math.floor(cnt / 2);
        await bitonicSortHelper(array, low, k, 1, chartType);
        await bitonicSortHelper(array, low + k, k, 0, chartType);
        await bitonicMerge(array, low, cnt, dir, chartType);
    }
}

async function bitonicMerge(array, low, cnt, dir, chartType) {
    if (cnt > 1) {
        const k = Math.floor(cnt / 2);
        for (let i = low; i < low + k; i++) {
            if (dir === (array[i] > array[i + k])) {
                await swapElements(array, i, i + k, chartType);
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
        }
        await bitonicMerge(array, low, k, dir, chartType);
        await bitonicMerge(array, low + k, k, dir, chartType);
    }
}

async function swapElements(array, i, j, chartType) {
    [array[i], array[j]] = [array[j], array[i]];
    updateVisualization(array, chartType);
    await sleep(delay);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
