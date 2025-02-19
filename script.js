const targetEl = document.querySelector('.target');
let epoch_id = 1


// form elements
const form = document.getElementById('myForm');
const nextBtn = document.getElementById('nextBtn');
const submitBtn = document.getElementById('submitBtn');
const outputElement = document.getElementById('output');
const header_count = document.getElementById('plot_header');

// initial state of the buttons
nextBtn.disabled = false;
submitBtn.disabled = true;

const EPOCH_START_ID = 1
const EPOCH_END_ID = 20

console.log('epoch id = ', epoch_id)

function changeIframeSrc(iframeId, newSrc) {
  const iframe = document.getElementById(iframeId);
  iframe.src = newSrc;
}
const loadSnippet = number => {
    fetch(`./new-data/snippet-${number}.html`)
    .then(res => {
        if (res.ok) {
            console.log(res.text())
            return res.text();
        }
        else {
            throw Error(res.statusText);
        }
    })
    .then(htmlSnippet => {
        targetEl.innerHTML = htmlSnippet;
    });
    changeIframeSrc('plotly-id', `./epoch-data/epoch-${number}.html`);
};


const loadPlotly = direction => {
    if (direction == 'previous'  && epoch_id > EPOCH_START_ID) {
        epoch_id = epoch_id - 1
        console.log(epoch_id)
        changeIframeSrc('plotly-id', `./epoch_data/epoch-${epoch_id}.html`);

    } else if (direction == 'next' && epoch_id < EPOCH_END_ID) {
        console.log('inside next = ', epoch_id)
        if (epoch_id == EPOCH_END_ID - 1) {
            submitBtn.disabled = false;
            nextBtn.disabled = true;
        }
        epoch_id = epoch_id + 1
        console.log(epoch_id)
        changeIframeSrc('plotly-id', `./epoch_data/epoch-${epoch_id}.html`);
    }
}


let data = [];


form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newData = {};

    formData.forEach((value, key) => {
        newData[key] = value;
    });

    data.push(newData);

    const csvData = convertToCSV(data);
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-data.csv';
    document.body.appendChild(a);
    a.click();

    window.URL.revokeObjectURL(url);

    form.reset();
    data = [];

});
nextBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const newData = {};

    formData.forEach((value, key) => {
    newData[key] = value;
    });

    data.push(newData);

    loadPlotly('next')
    header_count.textContent = `plot number = ${epoch_id}`
    form.reset();
    outputElement.textContent = 'Data appended!';
});

function convertToCSV(data) {
    const headers = Object.keys(data[0]);
    let csv = headers.join(',') + '\n';

    data.forEach((row) => {
      const values = headers.map((header) => row[header]);
      csv += values.join(',') + '\n';
    });

    return csv;
    }

