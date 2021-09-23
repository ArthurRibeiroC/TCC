// CONVERTER O DIÂMETRO
function converter_diametro(diametro, unidade) {
    diametro = diametro.replace(",", ".");

    switch (unidade) {
        case 'm': diametro = diametro; break;
        case 'cm': diametro = diametro / 100; break;
        case 'mm': diametro = diametro / 1000; break;
        case 'microm': diametro = diametro / 1000000; break;
        case 'in': diametro = diametro * 0.0254; break;
        case 'ft': diametro = diametro * 0.3048; break;
    }

    return diametro;
}

// CONVERTER A VAZÃO DE ENTRADA
function converter_Vazao() {
    let Vazao = document.getElementById("vazao").value;
    Vazao = Vazao.replace(",", ".");
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

    return Vazao;
}

//  CONVERTER MASSAS ESPECÍFICAS
function converter_rho(rho, unidade) {
    rho = rho.replace(",", ".");

    switch (unidade) {
        case 'kg/m³': rho = rho; break;
        case 'kg/L': rho = rho * 1000; break;
        case 'g/cm³': rho = rho * 1000; break;
    }

    return rho;
}

// CONVERTER A VISCOSIDADE DO FLUIDO
function converter_viscosidade() {
    let viscosidade = document.getElementById("viscosidade").value;
    viscosidade = viscosidade.replace(",", ".");
    let viscosidade_unit = document.getElementById("viscosidade_unit").value;

    switch (viscosidade_unit) {
        case 'Pa.s': viscosidade = viscosidade; break;
        case 'Poise': viscosidade = viscosidade * 0.1; break;
        case 'Centipoise': viscosidade = viscosidade * 0.001; break;
    }

    return viscosidade;

}

// CONVERTER A VELOCIDADE
function converter_velocidade(velocidade, unidade) {
    velocidade = velocidade.replace(",", ".");

    switch (unidade) {
        case 'm/s': velocidade = velocidade; break;
        case 'm/min': velocidade = velocidade/60; break;
        case 'm/h': velocidade = velocidade/3600; break;
        case 'ft/s': velocidade = velocidade*0.3048; break;
        case 'ft/min': velocidade = velocidade*0.3048/60; break;
        case 'ft/h': velocidade = velocidade*0.3048/3600; break;
    }

    return velocidade;
}
