function areaSedimentador() {
    // PEGA OS VALORES DOS PARÂMETROS FORNECIDOS PELO USUÁRIO
    let vazao = converter_Vazao();

    let c_solido_alim = potenciaDe10(document.getElementById("c_solido_alim").value, document.getElementById("c_solido_alim_fator").value);
    c_solido_alim = converter_rho(c_solido_alim, document.getElementById("c_solido_alim_unit").value);
    
    let c_solido_lama = potenciaDe10(document.getElementById("c_solido_lama").value, document.getElementById("c_solido_lama_fator").value);
    c_solido_lama = converter_rho(c_solido_lama, document.getElementById("c_solido_lama_unit").value);
    
    let rho_solido = potenciaDe10(document.getElementById("rho_solido").value, document.getElementById("rho_solido_fator").value);
    rho_solido = converter_rho(rho_solido, document.getElementById("rho_solido_unit").value);

    let z0_lama = potenciaDe10(document.getElementById("z0_lama").value, document.getElementById("z0_lama_fator").value);
    z0_lama = converter_diametro(z0_lama, document.getElementById("z0_lama_unit").value);

    let tempo_sedimentacao = potenciaDe10(document.getElementById("tempo_sedimentacao").value, document.getElementById("tempo_sedimentacao_fator").value); 
    tempo_sedimentacao = converter_tempo(tempo_sedimentacao, document.getElementById("tempo_sedimentacao_unit").value);

    let expoente = document.getElementById("expoente").value.replace(",", ".");
    expoente = (-1) * Math.abs(expoente)

    switch (document.getElementById("expoente_unit").value) {
        case '1/s': expoente = expoente; break;
        case '1/min': expoente = expoente / 60; break;
        case '1/h': expoente = expoente / 3600; break;
    };

    // GERA UM ARRAY COM OS TEMPOS DE SEDIMENTAÇÃO USADOS PARA O CÁLCULO
    let tempos = linspace(tempo_sedimentacao);

    // CALCULA AS ALTURAS DE DECAIMENTO
    let alturas = [];

    for(let i = 0; i < tempos.length; i++) {
        alturas.push(z0_lama * Math.exp(expoente * tempos[i]))
    };

    // CALCULA AS VELOCIDADES INSTANTÂNEAS DE SEDIMENTAÇÃO
    let velocidades = [];

    for(let i = tempos.length - 1; i >= 0; i--){
        if (i != 0) {
            velocidades[i] = (alturas[i-1] - alturas[i]) / (tempos[i-1] - tempos[i]);
        } else {
            velocidades[0] = velocidades[1];
        }
    };

    // CALCULA OS Zi
    let zis = [];

    for(let i = 0; i < tempos.length; i++) {
        zis.push(alturas[i] + tempos[i] * Math.abs(velocidades[i]));
    };

    // CALCULA OUTROS PARÂMETROS DA SEDIMENTAÇÃO
    let c0 = c_solido_alim / rho_solido;
    let ce = c_solido_lama / rho_solido;

    // CALCULA OS ci
    let cis = [];

    for(let i = 0; i < tempos.length; i++) {
        cis.push(c0 * z0_lama / zis[i]);
    };

    // CALCULA AS ÁREAS DE SEDIMENTAÇÃO
    let areas = [];

    for(let i = 0; i < tempos.length; i++) {
        areas.push((vazao * c0 / Math.abs(velocidades[i])) * (1/cis[i] - 1/ce));
    };

    // ACHA A ÁREA DO SEDIMENTADOR
    let maior_area = 0;

    for(let i = 0; i < areas.length; i++) {
        if (areas[i] > maior_area) {
            maior_area = areas[i];
        }
    };

    // RETORNA OS VALORES
    let diametro_sedimentador = Math.pow(maior_area * 4 / Math.PI, 0.5);

    document.getElementById("area_sedimentador").innerHTML = maior_area.toFixed(2) + " m²";
    document.getElementById("diametro_sedimentador").innerHTML = diametro_sedimentador.toFixed(2) + " m";
    
}

function linspace(stopValue) {
    var arr = [];
    var startValue = 0;
    var cardinality = 1001;
    var step = (stopValue - startValue) / (cardinality - 1);

    for (var i = 0; i < cardinality; i++) {
      arr.push(startValue + (step * i));
    }
    return arr;
  }



function calcularSedimentadorComDados() {
    // PEGA OS VALORES DOS PARÂMETROS FORNECIDOS PELO USUÁRIO
    let vazao = converter_Vazao();

    let c_solido_alim = potenciaDe10(document.getElementById("c_solido_alim").value, document.getElementById("c_solido_alim_fator").value);
    c_solido_alim = converter_rho(c_solido_alim, document.getElementById("c_solido_alim_unit").value);

    let c_solido_lama = potenciaDe10(document.getElementById("c_solido_lama").value, document.getElementById("c_solido_lama_fator").value);
    c_solido_lama = converter_rho(c_solido_lama, document.getElementById("c_solido_lama_unit").value);

    let rho_solido = potenciaDe10(document.getElementById("rho_solido").value, document.getElementById("rho_solido_fator").value);
    rho_solido = converter_rho(rho_solido, document.getElementById("rho_solido_unit").value);

    let tempos = tabelaSedimentador()[0];
    let alturas = tabelaSedimentador()[1];

    // CALCULA AS VELOCIDADES INSTANTÂNEAS DE SEDIMENTAÇÃO
    let velocidades = [];

    for(let i = tempos.length - 1; i >= 0; i--){
        if (i != 0) {
            velocidades[i] = (alturas[i-1] - alturas[i]) / (tempos[i-1] - tempos[i]);
        } else {
            velocidades[0] = velocidades[1];
        }
    };

    // CALCULA OS Zi
    let zis = [];

    for(let i = 0; i < tempos.length; i++) {
        zis.push(alturas[i] + tempos[i] * Math.abs(velocidades[i]));
    };

    // CALCULA OUTROS PARÂMETROS DA SEDIMENTAÇÃO
    let c0 = c_solido_alim / rho_solido;
    let ce = c_solido_lama / rho_solido;

    // CALCULA OS ci
    let cis = [];

    for(let i = 0; i < tempos.length; i++) {
        cis.push(c0 * alturas[0] / zis[i]);
    };

    // CALCULA AS ÁREAS DE SEDIMENTAÇÃO
    let areas = [];

    for(let i = 0; i < tempos.length; i++) {
        areas.push((vazao * c0 / Math.abs(velocidades[i])) * (1/cis[i] - 1/ce));
    };

    // ACHA A ÁREA DO SEDIMENTADOR
    let maior_area = 0;

    for(let i = 0; i < areas.length; i++) {
        if (areas[i] > maior_area) {
            maior_area = areas[i];
        }
    };

    // RETORNA OS VALORES
    let diametro_sedimentador = Math.pow(maior_area * 4 / Math.PI, 0.5);

    document.getElementById("area_sedimentador").innerHTML = maior_area.toFixed(2) + " m²";
    document.getElementById("diametro_sedimentador").innerHTML = diametro_sedimentador.toFixed(2) + " m";

  }

  // RECUPERA OS DADOS INSERIDOS NA TABELA DE FILTRO ROTATIVO
function tabelaSedimentador() {
    let t = [];
    let t_fator = 1;
    let z = [];
    let z_fator = 1;

    var tabelinha = document.getElementById("dados_sedimentador");

    switch (document.getElementById("tempo_unit").value) {
        case 's': t_fator = 1; break;
        case 'min': t_fator = 1 * 60; break;
        case 'h': t_fator = 1 * 3600; break;
    };

    switch (document.getElementById("altura_interface_unit").value) {
        case 'm': z_fator = 1; break;
        case 'cm': z_fator = 1 / 100; break;
        case 'mm': z_fator = 1 / 1000; break;
        case 'in': z_fator = 0.0254; break;
        case 'ft': z_fator = 0.3048; break;
    }

    for (i = 1; i < tabelinha.rows.length; i++) {
        t.push(parseFloat(tabelinha.rows[i].cells[0].children[0].value.replace(",", ".") * t_fator));
        z.push(parseFloat(tabelinha.rows[i].cells[1].children[0].value.replace(",", ".") * z_fator));
    };

    return [t, z];
}