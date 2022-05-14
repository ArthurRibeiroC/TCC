// CONVERTER O DIÂMETRO
function converter_diametro(diametro, unidade) {
    // diametro = parseFloat(diametro.replace(",", "."));

    switch (unidade) {
        case 'm': diametro = diametro; break;
        case 'cm': diametro = diametro / 100; break;
        case 'mm': diametro = diametro / 1000; break;
        case 'microm': diametro = diametro / 1000000; break;
        case 'in': diametro = diametro * 0.0254; break;
        case 'ft': diametro = diametro * 0.3048; break;
    }

    return parseFloat(diametro);
}

// CONVERTER A VAZÃO DE ENTRADA
function converter_Vazao() {
    let Vazao = document.getElementById("vazao").value;
    // Vazao = Vazao.replace(",", ".");
    Vazao = potenciaDe10(Vazao, document.getElementById("vazao_fator").value)

    let Vazao_unit = document.getElementById("vazao_unit").value;

    switch (Vazao_unit) {
        case 'm³/s': Vazao = Vazao; break;
        case 'm³/min': Vazao = Vazao / 60; break;
        case 'm³/h': Vazao = Vazao / 3600; break;
        case 'L/s': Vazao = Vazao / 1000; break;
        case 'L/min': Vazao = Vazao / 60000; break;
        case 'L/h': Vazao = Vazao / 3600000; break;
        case 'ft³/s': Vazao = Vazao * Math.pow(0.3048, 3); break;
        case 'ft³/min': Vazao = Vazao * Math.pow(0.3048, 3) / 60; break;
        case 'ft³/h': Vazao = Vazao * Math.pow(0.3048, 3) / 3600; break;
    }

    return parseFloat(Vazao);
}

//  CONVERTER MASSAS ESPECÍFICAS
function converter_rho(rho, unidade) {
    // rho = parseFloat(rho.replace(",", "."));

    switch (unidade) {
        case 'kg/m³': rho = rho; break;
        case 'kg/L': rho = rho * 1000; break;
        case 'g/cm³': rho = rho * 1000; break;
    }

    return parseFloat(rho);
}

// CONVERTER A VISCOSIDADE DO FLUIDO
function converter_viscosidade() {
    let viscosidade = document.getElementById("viscosidade").value;
    // viscosidade = parseFloat(viscosidade.replace(",", "."));
    viscosidade = potenciaDe10(viscosidade, document.getElementById("viscosidade_fator").value)

    let viscosidade_unit = document.getElementById("viscosidade_unit").value;

    switch (viscosidade_unit) {
        case 'Pa.s': viscosidade = viscosidade; break;
        case 'Poise': viscosidade = viscosidade * 0.1; break;
        case 'Centipoise': viscosidade = viscosidade * 0.001; break;
    }

    return parseFloat(viscosidade);

}

// CONVERTER A VELOCIDADE
function converter_velocidade(velocidade, unidade) {
    // velocidade = velocidade.replace(",", ".");

    switch (unidade) {
        case 'm/s': velocidade = velocidade; break;
        case 'm/min': velocidade = velocidade/60; break;
        case 'm/h': velocidade = velocidade/3600; break;
        case 'ft/s': velocidade = velocidade*0.3048; break;
        case 'ft/min': velocidade = velocidade*0.3048/60; break;
        case 'ft/h': velocidade = velocidade*0.3048/3600; break;
    }

    return parseFloat(velocidade);
}

// CONVERTER MASSA
function converter_massa(massa, unidade) {
    // massa = massa.replace(",", ".");

    switch(unidade){
        case 'kg': massa = massa; break;
        case 'g': massa = massa / 1000; break;
        case 'ton': massa = massa * 1000; break;
        case 'mg': massa = massa / 1000000; break;
        case 'lb': massa = massa * 0.45359237; break;
    }

    return parseFloat(massa);
}

// CONVERTER AREA
function converter_area(area, unidade) {
    // area = area.replace(",", ".");

    switch(unidade){
        case 'm²': area = area; break;
        case 'cm²': area = area / 10000; break;
        case 'mm²': area = area / 1000000; break;
        case 'ft²': area = area * Math.pow(0.3048, 2); break;
    }

    return parseFloat(area);
}

// CONVERTER PRESSÃO
function converter_pressao(pressao, unidade) {
    // pressao = pressao.replace(",", ".");

    switch(unidade){
        case 'Pa': pressao = pressao; break;
        case 'atm': pressao = pressao * 101325; break;
        case 'bar': pressao = pressao * 100000; break;
        case 'mmHg': pressao = pressao * 133.322368; break;
        case 'psi': pressao = pressao * 6894.757293178; break;
        case 'kgf/cm²': pressao = pressao * 98066.5205; break;
    }

    return parseFloat(pressao);
}

// CONVERTER VOLUMES
function converter_volume(volume, unidade) {
    switch(unidade){
        case 'm³': volume = volume; break;
        case 'L': volume = volume / 1000; break;
        case 'cm³': volume = volume / 1000000; break;
        case 'ft³': volume = volume * Math.pow(0.3048, 3); break;
        case 'gal': volume = volume * 0.00378541178; break;
    }

    return parseFloat(volume);
}

// CONVERTER TEMPO
function converter_tempo(tempo, unidade) {
    switch (unidade) {
        case 's': tempo = tempo; break;
        case 'min': tempo = tempo * 60; break;
        case 'h': tempo = tempo* 3600; break;
    };

    return tempo;
}

// APLICAR POTENCIA DE 10
function potenciaDe10(parametro, potencia) {
    parametro = parseFloat(parametro.replace(",", "."));

    if (potencia == "" || potencia == null || potencia == undefined) {
        potencia = 0
    };

    return parametro * Math.pow(10, potencia);
}
