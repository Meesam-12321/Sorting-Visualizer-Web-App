document.getElementById('startButton').addEventListener('click', startVisualization);
document.getElementById('speedRange').addEventListener('input', updateSpeed);

let delay = 300;
let iterationCount = 0;

function startVisualization() {
    const arrayInput = document.getElementById('arrayInput').value;
    const algorithm = document.getElementById('algorithmSelect').value;
    const array = arrayInput.split(',').map(Number);

    iterationCount = 0; // Reset the counter
    updateCounter();
    updateVisualization(array);

    switch (algorithm) {
        case 'bubbleSort':
            bubbleSort(array);
            break;
        case 'selectionSort':
            selectionSort(array);
            break;
        case 'insertionSort':
            insertionSort(array);
            break;
        case 'mergeSort':
            mergeSort(array, 0, array.length - 1);
            break;
        case 'quickSort':
            quickSort(array, 0, array.length - 1);
            break;
        case 'heapSort':
            heapSort(array);
            break;
        case 'radixSort':
            radixSort(array);
            break;
        case 'countingSort':
            countingSort(array);
            break;
        case 'bucketSort':
            bucketSort(array);
            break;
        case 'shellSort':
            shellSort(array);
            break;
        case 'cocktailSort':
            cocktailSort(array);
            break;
        case 'combSort':
            combSort(array);
            break;
    }
}

function updateSpeed() {
    delay = document.getElementById('speedRange').value;
    document.getElementById('speedValue').textContent = `${delay}ms`;
}

function updateVisualization(array) {
    const container = document.getElementById('visualizationContainer');
    container.innerHTML = '';
    array.forEach((value, index) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = value;
        cell.style.backgroundColor = getRandomColor();
        container.appendChild(cell);
    });
}

function updateCounter() {
    document.getElementById('iterationCounter').textContent = iterationCount;
}

async function swapElements(array, i, j) {
    const container = document.getElementById('visualizationContainer');
    const cells = Array.from(container.children);
    const cell1 = cells[i];
    const cell2 = cells[j];

    // Swap values in the array
    [array[i], array[j]] = [array[j], array[i]];

    // Swap the cells in the DOM
    cell1.style.transform = `translateX(${cell2.offsetLeft - cell1.offsetLeft}px)`;
    cell2.style.transform = `translateX(${cell1.offsetLeft - cell2.offsetLeft}px)`;

    await sleep(delay);

    // Reset transform and swap elements in the DOM
    cell1.style.transform = '';
    cell2.style.transform = '';

    if (cell1.nextSibling === cell2) {
        container.insertBefore(cell2, cell1);
    } else {
        container.insertBefore(cell1, cell2);
        container.insertBefore(cell2, cell1);
    }

    // Update visualization
    updateVisualization(array);
}

function highlightCells(index1, index2) {
    const cells = document.getElementsByClassName('cell');
    cells[index1].classList.add('highlight');
    cells[index2].classList.add('highlight');
}

function unhighlightCells(index1, index2) {
    const cells = document.getElementsByClassName('cell');
    cells[index1].classList.remove('highlight');
    cells[index2].classList.remove('highlight');
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

function playSound() {
    const sound = document.getElementById('iterationSound');
    sound.play();
}

// Sorting algorithms

async function bubbleSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - 1 - i; j++) {
            highlightCells(j, j + 1);
            playSound();
            if (array[j] > array[j + 1]) {
                await swapElements(array, j, j + 1);
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
            unhighlightCells(j, j + 1);
        }
    }
    updateVisualization(array);
}

async function selectionSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            highlightCells(j, minIdx);
            playSound();
            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
            unhighlightCells(j, minIdx);
        }
        if (minIdx !== i) {
            await swapElements(array, i, minIdx);
            iterationCount++;
            updateCounter();
            await sleep(delay);
        }
    }
    updateVisualization(array);
}

async function insertionSort(array) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            highlightCells(j, j + 1);
            array[j + 1] = array[j];
            await swapElements(array, j, j + 1);
            await sleep(delay);
            unhighlightCells(j, j + 1);
            j--;
            iterationCount++;
            updateCounter();
            playSound();
        }
        array[j + 1] = key;
        updateVisualization(array); // Update visualization after inserting the key
    }
    updateVisualization(array);
}

async function mergeSort(array, left, right) {
    if (left >= right) {
        return;
    }
    const mid = Math.floor((left + right) / 2);
    await mergeSort(array, left, mid);
    await mergeSort(array, mid + 1, right);
    await merge(array, left, mid, right);
    updateVisualization(array);
}

async function merge(array, left, mid, right) {
    let i = left, j = mid + 1, k = 0;
    const temp = new Array(right - left + 1);
    const container = document.getElementById('visualizationContainer');
    const cells = Array.from(container.children);

    while (i <= mid && j <= right) {
        highlightCells(i, j);
        playSound();
        if (array[i] <= array[j]) {
            temp[k++] = array[i++];
        } else {
            temp[k++] = array[j++];
        }
        unhighlightCells(i, j);
        iterationCount++;
        updateCounter();
        await sleep(delay);
    }

    while (i <= mid) {
        temp[k++] = array[i++];
    }
    while (j <= right) {
        temp[k++] = array[j++];
    }

    for (let i = left, k = 0; i <= right; i++, k++) {
        array[i] = temp[k];

        // Physically move the DOM elements to match the array's state
        const cell = cells[i];
        const tempCell = document.createElement('div');
        tempCell.className = 'cell';
        tempCell.textContent = array[i];
        tempCell.style.backgroundColor = getRandomColor();
        container.replaceChild(tempCell, cell);
    }
    updateVisualization(array);
}

async function quickSort(array, low, high) {
    if (low < high) {
        const pi = await partition(array, low, high);
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    }
    updateVisualization(array);
}

async function partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;
    for (let j = low; j <= high - 1; j++) {
        highlightCells(j, high);
        playSound();
        if (array[j] < pivot) {
            i++;
            await swapElements(array, i, j);
            iterationCount++;
            updateCounter();
            await sleep(delay);
        }
        unhighlightCells(j, high);
    }
    await swapElements(array, i + 1, high);
    return i + 1;
}

async function heapSort(array) {
    const n = array.length;
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
    }
    for (let i = n - 1; i > 0; i--) {
        await swapElements(array, 0, i);
        await heapify(array, i, 0);
        iterationCount++;
        updateCounter();
        await sleep(delay);
    }
    updateVisualization(array);
}

async function heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }
    if (largest !== i) {
        await swapElements(array, i, largest);
        await heapify(array, n, largest);
    }
}

async function radixSort(array) {
    const max = Math.max(...array);
    let exp = 1;
    while (Math.floor(max / exp) > 0) {
        await countingSortByDigit(array, exp);
        exp *= 10;
    }
    updateVisualization(array);
}

async function countingSortByDigit(array, exp) {
    const n = array.length;
    const output = Array(n).fill(0);
    const count = Array(10).fill(0);

    // Store count of occurrences in count[]
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
    }

    // Change count[i] so that count[i] now contains the actual
    // position of this digit in output[]
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Build the output array
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
    }

    // Copy the output array to the original array, and perform the physical swapping
    for (let i = 0; i < n; i++) {
        const currentIndex = array.indexOf(output[i]);
        if (currentIndex !== i) {
            await swapElements(array, currentIndex, i);
        }
        array[i] = output[i];
        iterationCount++;
        updateCounter();
        playSound();
        await sleep(delay);
    }
    updateVisualization(array);
}


async function countingSort(array) {
    const max = Math.max(...array);
    const min = Math.min(...array);
    const range = max - min + 1;
    const count = Array(range).fill(0);
    const output = Array(array.length).fill(0);

    // Count occurrences of each element
    for (let i = 0; i < array.length; i++) {
        count[array[i] - min]++;
        iterationCount++;
        updateCounter();
        playSound();
    }

    // Update count array to contain actual positions
    for (let i = 1; i < count.length; i++) {
        count[i] += count[i - 1];
    }

    // Build the output array and swap elements physically
    for (let i = array.length - 1; i >= 0; i--) {
        output[count[array[i] - min] - 1] = array[i];
        count[array[i] - min]--;
    }

    for (let i = 0; i < array.length; i++) {
        const targetIndex = output.indexOf(array[i]);
        if (i !== targetIndex) {
            await swapElements(array, i, targetIndex);
        }
        array[i] = output[i];
        iterationCount++;
        updateCounter();
        playSound();
        await sleep(delay);
    }
    updateVisualization(array);
}

async function bucketSort(array) {
    const max = Math.max(...array);
    const min = Math.min(...array);
    const bucketSize = Math.floor((max - min) / array.length) + 1;
    const buckets = Array.from({ length: bucketSize }, () => []);

    // Place array elements in different buckets
    for (let i = 0; i < array.length; i++) {
        const bucketIndex = Math.floor((array[i] - min) / array.length);
        buckets[bucketIndex].push(array[i]);
    }

    // Sort individual buckets and concatenate results
    let sortedArray = [];
    for (let i = 0; i < buckets.length; i++) {
        await insertionSort(buckets[i]);
        for (let j = 0; j < buckets[i].length; j++) {
            const targetIndex = sortedArray.length;
            sortedArray.push(buckets[i][j]);
            if (array[targetIndex] !== buckets[i][j]) {
                await swapElements(array, targetIndex, array.indexOf(buckets[i][j]));
            }
            iterationCount++;
            updateCounter();
            playSound();
            await sleep(delay);
        }
    }

    // Update the original array and visualization
    for (let i = 0; i < array.length; i++) {
        array[i] = sortedArray[i];
    }
    updateVisualization(array);
}

async function insertionSort(array) {
    const n = array.length;
    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            highlightCells(j, j + 1);
            await swapElements(array, j, j + 1); // Perform the swap physically
            await sleep(delay);
            unhighlightCells(j, j + 1);
            j--;
            iterationCount++;
            updateCounter();
            playSound();
        }
        array[j + 1] = key;
        updateVisualization(array); // Update visualization after inserting the key
    }
    updateVisualization(array);
}

async function shellSort(array) {
    const n = array.length;
    let gap = Math.floor(n / 2);
    while (gap > 0) {
        for (let i = gap; i < n; i++) {
            let temp = array[i];
            let j = i;
            while (j >= gap && array[j - gap] > temp) {
                highlightCells(j, j - gap);
                await swapElements(array, j, j - gap); // Perform the swap physically
                await sleep(delay);
                unhighlightCells(j, j - gap);
                j -= gap;
                iterationCount++;
                updateCounter();
                playSound();
            }
            array[j] = temp;
        }
        gap = Math.floor(gap / 2);
    }
    updateVisualization(array);
}

async function cocktailSort(array) {
    const n = array.length;
    let swapped = true;
    let start = 0;
    let end = n - 1;

    while (swapped) {
        swapped = false;
        for (let i = start; i < end; ++i) {
            highlightCells(i, i + 1);
            playSound();
            if (array[i] > array[i + 1]) {
                await swapElements(array, i, i + 1);
                swapped = true;
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
            unhighlightCells(i, i + 1);
        }
        if (!swapped) break;

        swapped = false;
        end--;
        for (let i = end - 1; i >= start; --i) {
            highlightCells(i, i + 1);
            playSound();
            if (array[i] > array[i + 1]) {
                await swapElements(array, i, i + 1);
                swapped = true;
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
            unhighlightCells(i, i + 1);
        }
        start++;
    }
    updateVisualization(array);
}

async function combSort(array) {
    const n = array.length;
    let gap = n;
    let swapped = true;

    while (gap !== 1 || swapped) {
        gap = Math.floor(gap / 1.3);
        if (gap < 1) gap = 1;

        swapped = false;
        for (let i = 0; i < n - gap; i++) {
            highlightCells(i, i + gap);
            playSound();
            if (array[i] > array[i + gap]) {
                await swapElements(array, i, i + gap);
                swapped = true;
                iterationCount++;
                updateCounter();
                await sleep(delay);
            }
            unhighlightCells(i, i + gap);
        }
    }
    updateVisualization(array);
}
