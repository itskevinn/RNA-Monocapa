let inputs = [];
let outputs = [];
let patterns = [];
let inputs_qty;
let patterns_qty;
let maxAllowedError = [];
let outputs_qty;
let real_outputs = [];
let lineal_errors = [];
let weights = [];
let iterations = [];
let iterations_num = 100;
let sum_result_array = [];
let max_allowed_error = 0.01;
let learning_rate = 1;
let total_iterations_error_array = [];
let layers = [];
let networkType = '';
let neuronType = '';
let patternsErrors = [];
let thresholds = [];
let actFunc = '';
let X0 = 1;

class Layer {
    index = 0;
    neuron_qty = 0;
    layer_type = "";
    neurons = [];
    act_function = "";
    initalizate_neurons = () => {
        for (let i = 0; i < neuron_qty; i++) {
            this.neurons.push(new Neuron());
        }
    };
    sigmoid = (value) => {
    };
    gausian = (value) => {
    };
    hyperbolic_tan = (value) => {
    };
    linear = (value) => {
    };
}

class Neuron {
    value = 0;
}

function printValues() {
    create_chart_errors().then(r => console.log(r));
    let iterations_counted = document.getElementById("iterations_counted");
    iterations_counted.innerText = iterations.length.toString();
    let iterations_errors = document.getElementById("iterations_errors");
    iterations_errors.innerText = total_iterations_error_array.length.toString();
}

let start = () => {
    total_iterations_error_array = [];
    maxAllowedError = [];
    iterations = [];
    this.initialize_weights();
    this.fill_weights_values(1.01, -1);
    this.initializeThresholds();
    this.fillThresholdsValues(1.01, -1);
    this.start_training(iterations_num);
    printValues();

};

function add_layer() {
    let layer;
    layer = new Layer();
    layer.act_function = document.getElementById("layer_act_function");
    layer.neuron_qty = document.getElementById("layer_neuron_qty");
    layer.initalizate_neurons();

    layers.push(layer);
}

function createWeightsFile() {
    let data = [];
    let aux;
    for (let index = 0; index < weights.length; index++) {
        const element = weights[index];
        for (let index = 0; index < element.length; index++) {
            aux = "";
            if (index === element.length - 1) {
                aux += element[index].toString() + "\n"
            } else {
                aux += element[index].toString() + ";";
            }
            data.push(aux);
        }
    }
    let blob =
        new Blob([...data, JSON.stringify('Umbrales: ') + "\n", thresholds], {type: "text/plain;charset=utf-8"})
    let fileName = "Pesos y umbrales";
    downloadFile(blob, fileName);
}

let downloadFile = (function () {
    let a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    return function (blob, fileName) {
        let url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
    };
}());

function start_training() {
    let aux = 2;
    for (let i = 0; i < iterations_num; i++) {
        if (aux <= Number(max_allowed_error)) {
            createWeightsFile("Pesos ideales");
            i = iterations_num;
            return;
        } else {
            aux = 0;
            iterations.push((iterations.length + 1).toString());
            maxAllowedError.push(max_allowed_error.toString());
            for (let j = 0; j < patterns_qty; j++) {
                patternError(j);
                adjust_weights(j);
            }
            aux = iterationError(patternsErrors);
            total_iterations_error_array.push(aux);
            patternsErrors = [];
        }
    }
}

function iterationError(data) {
    let aux = 0;
    let eI;
    for (let i = 0; i < data.length; i++) {
        aux += data[i];
    }
    eI = Number((aux / patterns_qty).toFixed(2));
    return eI;
}

function networkOutput(pattern) {
    let yR = [];
    let s = sum(pattern);
    for (let i = 0; i < outputs_qty; i++) {
        if (actFunc === "lineal") {
            yR.push(s[i]);
        } else if (actFunc === "escalon") {
            yR.push(s[i] >= 0 ? 1 : 0);
        }
    }
    return yR;
}

function linealError(pattern) {
    let eL = [];
    let yR = networkOutput(pattern);
    for (let i = 0; i < outputs_qty; i++) {
        let aux = Number((outputs[pattern][i] - yR[i]).toFixed(2));
        eL.push(aux);
    }
    return eL;
}

function patternError(pattern) {
    let eP;
    let aux = 0;
    let eL = linealError(pattern);
    for (let i = 0; i < outputs_qty; i++) {
        aux += Math.abs(eL[i]);
    }
    eP = aux / outputs_qty;
    patternsErrors.push(eP);
}


Array.prototype.equals = function (getArray) {
    if (length != getArray.length) return false;

    for (var i = 0; i < getArray.length; i++) {
        if (this[i] instanceof Array && getArray[i] instanceof Array) {
            if (!this[i].equals(getArray[i])) return false;
        } else if (this[i] != getArray[i]) {
            return false;
        }
    }
    return true;
};

// this function will provide the handle to the uploading of the file
function uploadFile(files) {
    let file = files[0];
    if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
            let content = e.target.result;
            initialize_data(content);
            weights = initialize_weights();
            thresholds = initializeThresholds();
            fillThresholdsValues(1, -1);
            fill_weights_values(1, -1);
        };
        reader.readAsText(file);
    } else {
        alert("No se seleccionó ningún archivo.");
    }
}

function fillThresholdsValues(max, min) {
    for (let i = 0; i < thresholds.length; i++) {
        thresholds[i] = Math.random() * (max - min) + min;
    }
}

function initializeThresholds() {
    return new Array(outputs_qty);
}

function initialize_real_ouputs() {
    real_outputs = new Array(patterns_qty);
    for (var i = 0; i < outputs_qty; i++) {
        real_outputs[i] = new Array(outputs_qty);
    }
}

function getNeuronType() {
    neuronType = document.getElementById('neuron_type').value;
    if (neuronType == 'perceptron') {
        actFunc = 'escalon';
        return;
    }
    if (neuronType == 'adaline') {
        actFunc = 'lineal';
    }
}

function getNetworkType() {
    networkType = Number.parseInt(document.getElementById('network_type').value);
}

function get_inputs(headers) {
    return headers.filter((el) => el.includes("X") > 0);
}

function get_outputs(headers) {
    return headers.filter((el) => el.includes("YD") > 0);
}

function initialize_data_variable_definitions(content) {
    inputs = [];
    outputs = [];
    let input_pattern = [];
    let output_pattern = [];
    let rows = content.split("\n");
    let headers = rows[0].split(";");
    let inputs_file = get_inputs(headers);
    get_outputs(headers);
    const data = createDataArray(rows);
    return {input_pattern, output_pattern, inputs_file, data};
}

// this function will initializate the data into the input_pattern and output_pattern
let initialize_data = (content) => {
    let {input_pattern, output_pattern, inputs_file, data} = initialize_data_variable_definitions(content);
    for (let i = 0; i < data.length; i++) {
        input_pattern = [];
        output_pattern = [];
        for (let j = 0; j < data[i].length; j++) {
            if (j < inputs_file.length) {
                input_pattern.push(data[i][j]);
            } else {
                output_pattern.push(data[i][j]);
            }
        }
        inputs.push(input_pattern);
        outputs.push(output_pattern);
    }

    inputs_qty = inputs[0].length ? inputs[0].length : 1;
    outputs_qty = outputs[0].length ? outputs[0].length : 1;
    patterns_qty = inputs.length;
    show_counts();
};

// this function will get the iterations quantity given by the user
let get_iterations_qty = () => {
    let iterations_qty = document.getElementById("iterations_qty").value;
    if (!iterations_qty) {
        alert("Ingrese un valor válido en la cantidad de iteraciones");
        return;
    }
    iterations_num = iterations_qty;
};

// this function will get the initial weights given by the user
let get_initial_weights = () => {
    let initial_weights = document.getElementById("initial_weights").value;
    if (!initial_weights) {
        return null;
    }
    weights = JSON.parse(initial_weights);
    return weights;
};

// this function will get the learning rate given by the user
function get_learning_rate() {
    let learning_rat = document.getElementById("learning_rate").value;
    if (!learning_rat && !learning_rate_valid(learning_rat)) {
        alert("Por favor, ingrese un valor válido en la rata de aprendizaje");
        return;
    }
    learning_rate = Number(learning_rat);
}

// this function will vlaidate if the learning rate is valid
function learning_rate_valid(learning_rate) {
    return learning_rate > 0 && learning_rate <= 1;
}

// this function will get the max allowed error given by the user
function get_max_allowed_errors() {
    let max_allowed_err = document.getElementById("max_allowed_error").value;
    if (!max_allowed_err) {
        alert("Por favor, ingrese un valor válido en el error máximo permitido");
        return;
    }
    max_allowed_error = Number(max_allowed_err);
}

// this function wil show te count of the quantity of inputs, outputs and patterns that
// were in the file
let show_counts = () => {
    document.getElementById("inputs_qty").innerText = inputs_qty.toString();
    document.getElementById("outputs_qty").innerText = outputs_qty.toString();
    document.getElementById("patterns_qty").innerText = patterns_qty.toString();
};

// this function will create the array of data
// it receives the content of the file and returns the array
let createDataArray = (content) => {
    let patterns = [];
    for (let i = 1; i < content.length; i++) {
        let values = [];
        if (content[i]) {
            const row = content[i].split(";");
            for (let j = 0; j < row.length; j++) {
                values.push(Number(row[j]));
            }
            patterns.push(values);
        }
    }
    return patterns;
};

//this function returns the sum of the inputs multiplied by the weights
function sum(pattern) {
    let sumOutputs = [];
    let aux = 0;
    for (let i = 0; i < outputs_qty; i++) {
        aux = 0;
        for (let j = 0; j < inputs_qty; j++) {
            aux = aux + (Number(inputs[pattern][j]) * Number(weights[j][i]));
        }
        aux = aux - Number(thresholds[i]);
        sumOutputs.push(Number(aux.toFixed(2)))
    }
    return sumOutputs;
}

// this function creates the weights matrix
// the weights matrix size will be the number of inputs x outputs
function initialize_weights() {
    let weights = new Array(inputs_qty);
    for (let i = 0; i < weights.length; i++) {
        weights[i] = new Array(outputs_qty);
    }
    return weights;
}

// this function will fill the weights array with random numbers
function fill_weights_values(max, min) {
    for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights[i].length; j++) {
            weights[i][j] = Math.random() * (max - min) + min;
        }
    }
}

/**
 * Función lineal para adaline
 *
 * */

function lineal(sum_result) {
    return sum_result;
}

// escalation function will return 1 if
// the sum functions returns a value greater than zero
// and 0 if the sum functions returns a value less than zero
function escalation(sum_result) {
    let yr;
    if (sum_result > 0) {
        yr = 1;
    }
    if (sum_result <= 0) {
        yr = 0;
    }
    return yr;
}

// this function will adjust the weights matrix so we can
// get a better result
function adjust_weights(pattern) {
    let aux = 0;
    let auxUm = 0;
    let eL = linealError(pattern);
    let mat = weights;
    let vec = thresholds;
    let auxTr;
    for (let i = 0; i < outputs_qty; i++) {
        for (let j = 0; j < inputs_qty; j++) {
            aux = 0;
            aux = weights[j][i] + (Number(learning_rate) * eL[i] * inputs[pattern][j]);
            mat[j][i] = Number(aux.toFixed(2));
        }
        auxTr = 0;
        auxTr = thresholds[i] + (Number(learning_rate) * eL[i] * X0);
        vec[i] = Number(auxUm.toFixed(2));
    }
    thresholds = [...vec];
    weights = [...mat];
    return mat;
}

function get_simulation_values() {
    let input_1 = 0, input_2 = 0, input_3 = 0, input_4 = 0;
    let values = [];
    input_1 = document.getElementById("input_1").value != "" ? Number.parseFloat(document.getElementById("input_1").value) : undefined;
    input_2 = document.getElementById("input_2").value != "" ? Number.parseFloat(document.getElementById("input_2").value) : undefined;
    input_3 = document.getElementById("input_3").value != "" ? Number.parseFloat(document.getElementById("input_3").value) : undefined;
    input_4 = document.getElementById("input_4").value != "" ? Number.parseFloat(document.getElementById("input_4").value) : undefined;
    values = [input_1, input_2, input_3, input_4];
    values = remove_undefined_values(values);
    return values;
}

function remove_undefined_values(array) {
    array = array.filter(function (data) {
        return data != undefined;
    });
    return array;
}

//this function will allow us to simulate the neuron
function simulate() {
    let sum_result = 0;
    let output = 0;
    const simulation_pattern = get_simulation_values();
    sum_result = sum(simulation_pattern, weights);
    // we use the escalation function because
    // the values of the input patterns are not equal
    output = escalation(sum_result);
    return output;
}

function print_simulation_results() {
    document.getElementById("simulation_results").value = simulate();
}

/*DummyCode
let soma = (pattern) => {
  let sum = 0;
  threshold = 1;
  for (let i = 0; i < pattern.length; i++) {
    sum += pattern[i] * weights[i];
  }
  sum = sum - threshold;
  return sum;
}

let get_threshold = () => {
  let thrshld = document.getElementById("threshold").value;
  if (!thrshld) {
    alert('Ingrese un valor válido en el umbral');
    return;
  }
  threshold = Number(thrshld);
}

let train = (index) => {
  let currently_weight = [];
  for (let i = 0; i < weights.length; i++) {
    currently_weight = weights[i];
    weights[i] = currently_weight + (learning_rate * lineal_errors[index] * inputs[index][i]);
  }
  const currently_threshold = threshold;
  threshold = currently_threshold + (learning_rate * lineal_errors[index] * X0);
}

let activation_function = (act_function) => {
  if (!act_function) {
    alert("Por favor, seleccione una función de activación");
    return;
  }

  switch (act_function) {
    case 'escalation':
      escalation();
      break;
    case 'ramp':
      ramp();
      break;
  }

}

*/
