const os = require('os')
const Chart = require('Chart.js');

const MAX_CHART_SIZE = 30;

var prevUse = null;
var prevAll = null;
var chart;

const getMemoryUse = function () {
    const memoryInfo = process.getSystemMemoryInfo();
    return (memoryInfo.total - memoryInfo.free) / memoryInfo.total * 100;
};

const getCpuUse = function () {
    const cpus = os.cpus();
    var use = 0;
    var all = 0;
    cpus.forEach(element => {
        const times = element.times;
        let temp = times.user + times.nice + times.sys + times.irq;
        use += temp;
        all += temp + times.idle;
    });
    let cpuUse = 0;
    if (!!prevUse) {
        cpuUse = (use - prevUse) / (all - prevAll) * 100;
    }
    prevUse = use;
    prevAll = all;
    return cpuUse;
};

const update = function () {
    if (chart.data.labels.length < MAX_CHART_SIZE) {
        chart.data.labels.push('');
    }
    updateValue(chart.data.datasets[0], getMemoryUse());
    updateValue(chart.data.datasets[1], getCpuUse());
    chart.update();
}

const updateValue = function (dataset, value) {
    dataset.data.push(value);
    if (dataset.data.length > MAX_CHART_SIZE) {
        dataset.data.shift();
    }
}

setInterval("update()", 1000);

const ctx = document.getElementById('chart').getContext('2d');
chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [''],
        datasets: [
            {
                label: 'Memory',
                data: [getMemoryUse()],
                borderColor: 'rgb(255, 0, 0)',
            },
            {
                label: 'CPU',
                data: [getCpuUse()],
                borderColor: 'rgb(0, 0, 255)',
            }
        ]
    }
});