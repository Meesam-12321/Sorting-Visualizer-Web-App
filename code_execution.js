var editor = ace.edit("editor");
editor.setTheme("ace/theme/monokai");
editor.session.setMode("ace/mode/javascript");

document.getElementById('executeButton').addEventListener('click', function() {
    var userCode = editor.getValue();
    var wrappedCode = `
        var array = [64, 34, 25, 12, 22, 11, 90];
        ${userCode}
        visualizeSorting(array);
    `;
    try {
        eval(wrappedCode);
    } catch (e) {
        document.getElementById('output').textContent = e.message;
    }
});

function visualizeSorting(array) {
    const container = document.getElementById('visualizationContainer');
    container.innerHTML = '';
    array.forEach(value => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = value;
        cell.style.backgroundColor = getRandomColor();
        container.appendChild(cell);
    });
    updateChart(array);
}

function updateChart(array) {
    const ctx = document.getElementById('chartContainer').getContext('2d');
    if (window.myChart) {
        window.myChart.destroy();
    }
    window.myChart = new Chart(ctx, {
        type: 'bar',
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
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
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
