// VARIÁVEIS GLOBAIS
var Rm;
var alpha;

// RECUPERA OS DADOS INSERIDOS NA TABELA DE FILTROS
function tabelaFiltros() {
    let tempo = [];
    let tempo_fator = 1;
    let volume = [];
    let volume_fator = 1;

    var tabelinha = document.getElementById("dados_filtro");

    switch (document.getElementById("tempo_unit").value) {
        case 's': tempo_fator = 1; break;
        case 'min': tempo_fator = 60; break;
        case 'h': tempo_fator = 3600; break;
    };

    switch (document.getElementById("vol_filtrado_unit").value) {
        case 'm³': volume_fator = 1; break;
        case 'L': volume_fator = 1 / 1000; break;
        case 'ft³': volume_fator = Math.pow(0.3048, 3); break;
        case 'gal': volume_fator = 0.00378541178; break;
        case 'cm³': volume_fator = 1 / 1000000; break;
    };


    for (i = 1; i < tabelinha.rows.length; i++) {
        tempo.push(parseFloat(tabelinha.rows[i].cells[0].children[0].value.replace(",", ".") * tempo_fator));
        volume.push(parseFloat(tabelinha.rows[i].cells[1].children[0].value.replace(",", ".") * volume_fator));
    };

    return [tempo, volume];
}

// RECUPERA OS DADOS INSERIDOS NA TABELA DE FILTRO ROTATIVO
function tabelaFiltroRotativo() {
    let N = [];
    let N_fator = 1;
    let Q = [];
    let Q_fator = 1;

    var tabelinha = document.getElementById("dados_filtro");

    switch (document.getElementById("vel_ang_unit").value) {
        case '1/s': N_fator = 1; break;
        case '1/min': N_fator = 1/60; break;
        case '1/h': N_fator = 1/3600; break;
    };

    switch (document.getElementById("vazao_filtrado_unit").value) {
        case 'm³/s': Q_fator = 1; break;
        case 'm³/min': Q_fator = 1 / 60; break;
        case 'm³/h': Q_fator = 1 / 3600; break;
        case 'L/s': Q_fator = 1 / 1000; break;
        case 'L/min': Q_fator = 1 / 60000; break;
        case 'L/h': Q_fator = 1 / 3600000; break;
        case 'ft³/s': Q_fator = Math.pow(0.3048, 3); break;
        case 'ft³/min': Q_fator = Math.pow(0.3048, 3) / 60; break;
        case 'ft³/h': Q_fator = Math.pow(0.3048, 3) / 3600; break;
    }

    for (i = 1; i < tabelinha.rows.length; i++) {
        N.push(parseFloat(tabelinha.rows[i].cells[0].children[0].value.replace(",", ".") * N_fator));
        Q.push(parseFloat(tabelinha.rows[i].cells[1].children[0].value.replace(",", ".") * Q_fator));
    };

    return [N, Q];
}

// FUNÇÃO PARA DIMENSIONAR FILTRO ROTATIVO
function calcularFiltroRotativo() {
    let N = tabelaFiltroRotativo()[0];
    let Q = tabelaFiltroRotativo()[1];
    let I =  document.getElementById("angulo_imerso").value / 360;
    let t_V = [];
    let tf = [];
    let V = []

    // AS SEÇÕES ABAIXO SÃO TODAS DA REGRESSÃO LINEAR PARA UM FILTRO DE DELTA_P CTE

    // CALCULA O TEMPO DE FILTRAÇÃO PARA CADA VALOR
    for (let i = 0; i < N.length; i++) {
        tf.push(I / N[i]);
    }
    
    // CALCULA O VOLUME FILTRADO PARA CADA VALOR
    for (let i = 0; i < tf.length; i++) {
        V.push(Q[i] / N[i]);
    }

    // DIVIDE CADA VALOR DE T POR V
    for (let i = 0; i < tf.length; i++) {
        t_V.push(tf[i] / V[i]);
    }

    // CALCULA A MÉDIA DO VOLUME
    let avgVolume = sum_array(V) / V.length;

    // CALCULA A SOMA DOS ERROS QUADRÁTICOS
    let SSxx = [];

    for (let i = 0; i < V.length; i++) {
        SSxx.push(Math.pow(avgVolume - V[i], 2));
    }

    SSxx = sum_array(SSxx)

    // CALCULA A MÉDIA DE TV
    let avgt_V = sum_array(t_V) / t_V.length;

    // CALCULA A SSxy
    let SSxy = [];

    for (let i = 0; i < t_V.length; i++) {
        SSxy.push( (avgt_V - t_V[i]) * (avgVolume - V[i]));
    }

    SSxy = sum_array(SSxy);

    // CALCULA OS COEFICIENTES DA RETA
    let tgBeta = SSxy / SSxx;
    let b = avgt_V - tgBeta * avgVolume;

    // A PARTIR DAQUI SERÃO CALCULADOS OS PARÂMETROS COM BASE NOS INPUTS
    let area = potenciaDe10(document.getElementById("area_filtro").value, document.getElementById("area_filtro_fator").value)
    area = converter_area(area, document.getElementById("area_filtro_unit").value);

    let delta_P = potenciaDe10(document.getElementById("pressao").value, document.getElementById("pressao_fator").value)
    delta_P = converter_pressao(delta_P, document.getElementById("pressao_unit").value);

    let viscosidade = converter_viscosidade();

    let fracao_solidos = parseFloat(document.getElementById("fracao_solidos").value.replace(",", "."));

    let concentracao = potenciaDe10(document.getElementById("concentracao").value, document.getElementById("concentracao_fator").value);
    concentracao = converter_rho(concentracao, document.getElementById("concentracao_unit").value);

    concentracao = concentracao * fracao_solidos;

    // CALCULAR Rm
    Rm = b * area * delta_P / viscosidade;

    // CALCULAR alpha
    alpha = tgBeta * 2 * Math.pow(area, 2) * delta_P / (viscosidade * concentracao);
    
    // EXIBE OS RESULTADOS NA TELA
    let print_alpha = alpha.toExponential(4).split("e")[0] + "x10<sup>" + alpha.toExponential(4).split("e")[1] + "</sup>";
    let print_Rm = Rm.toExponential(4).split("e")[0] + "x10<sup>" + Rm.toExponential(4).split("e")[1] + "</sup>";
    
    document.getElementById("alpha").innerHTML = print_alpha;
    document.getElementById("Rm").innerHTML = print_Rm;

    let temp = V;
    V = organizarVetor(V, t_V)[0]
    t_V = organizarVetor(temp, t_V)[1]

    // FORMATA O EIXO X DO GRÁFICO
    for (i = 0; i < V.length; i++) {
        V[i] = V[i].toExponential(2); 
    }

    // PLOTA O GRÁFICO
    plotarGraficoFiltroPressaoCte(V, t_V);

    // ESCREVE A EQUAÇÃO NO GRÁFICO
    document.getElementById("equacao").style = "display: inline-block; background: white; padding: 10px 15px; border-radius: 50px; width: auto; margin: 10px 0px 15px 0px;";
    document.getElementById("eq:a").innerHTML = tgBeta.toExponential(2).split("e")[0] + "x10<sup>" + tgBeta.toExponential(2).split("e")[1] + "</sup>";
    document.getElementById("eq:b").innerHTML = b.toExponential(2).split("e")[0] + "x10<sup>" + b.toExponential(2).split("e")[1] + "</sup>";

    // MOSTRA OS CAMPOS PARA CÁLCULO DO FILTRO INDUSTRIAL
    document.getElementById("calculo_filtro_industrial").style = "display: block;";

}

// FUNÇÃO PARA CALCULAR A CAPACIDADE DO FILTRO ROTATIVO
function calcularCapacidadeFiltroRotativo() {
    let area = potenciaDe10(document.getElementById("area_filtro2").value, document.getElementById("area_filtro2_fator").value)
    area = converter_area(area, document.getElementById("area_filtro2_unit").value);

    let delta_P = potenciaDe10(document.getElementById("pressao2").value, document.getElementById("pressao2_fator").value)
    delta_P = converter_pressao(delta_P, document.getElementById("pressao2_unit").value);

    let viscosidade = document.getElementById("viscosidade2").value;
    viscosidade = potenciaDe10(viscosidade, document.getElementById("viscosidade2_fator").value)

    let viscosidade_unit = document.getElementById("viscosidade2_unit").value;

    switch (viscosidade_unit) {
        case 'Pa.s': viscosidade = viscosidade; break;
        case 'Poise': viscosidade = viscosidade * 0.1; break;
        case 'Centipoise': viscosidade = viscosidade * 0.001; break;
    }

    let fracao_solidos = parseFloat(document.getElementById("fracao_solidos2").value.replace(",", "."));

    let concentracao = potenciaDe10(document.getElementById("concentracao2").value, document.getElementById("concentracao2_fator").value);
    concentracao = converter_rho(concentracao, document.getElementById("concentracao2_unit").value);

    concentracao = concentracao * fracao_solidos;

    let I =  document.getElementById("angulo_imerso2").value.replace(",", ".") / 360;
    
    let vel_ang2 =  parseFloat(document.getElementById("vel_ang2").value.replace(",", "."));

    switch (document.getElementById("vel_ang2_unit").value) {
        case '1/s': vel_ang2 = vel_ang2; break;
        case '1/min': vel_ang2 = vel_ang2 / 60; break;
        case '1/h': vel_ang2 = vel_ang2 / 3600; break;
    };

    // CALCULA OS COEFICIENTES DA EQUAÇÃO DE SEGUNDO GRAU
    let a = alpha * concentracao * viscosidade / (2 * Math.pow(area, 2) * delta_P * vel_ang2);
    let b = viscosidade * Rm / (area * delta_P);

    let Q1 = (-b + Math.sqrt(Math.pow(b, 2) + 4 * a * I)) / (2 * a);
    let Q2 = -(b + Math.sqrt(Math.pow(b, 2) + 4 * a * I)) / (2 * a);

    if (Q1 > 0) {
        capacidade_filtro = Q1;
    } else if (Q2 > 0) {
        capacidade_filtro = Q2;
    };

    // RETORNA A CAPACIDADE DO FILTRO ROTATIVO
    document.getElementById("capacidade_filtro").innerHTML = capacidade_filtro.toExponential(4).split("e")[0] + "x10<sup>" + capacidade_filtro.toExponential(4).split("e")[1] + "</sup> m³/s";
    document.getElementById("resultados_filtro2").style = "display: block;";
}

// FUNÇÃO PARA ORGANIZAR VETOR
function organizarVetor(x_, y_) {
    let x = x_;
    let y = y_;
    let temp = {};

    for (let i = 0; i < x.length; i++) {
        temp[x[i]] = y[i];
    }

    x = x.sort();

    for (let i = 0; i < x.length; i++) {
        y[i] = temp[x[i]];
    }

    return [x, y];
}

// FUNÇÃO PARA DIMENSIONAR FILTRO PRENSA SOB PRESSÃO CONSTANTE
function calcularFiltroPressaoCte() {
    let tempo = tabelaFiltros()[0];
    let volume = tabelaFiltros()[1];
    let t_V = [];

    // AS SEÇÕES ABAIXO SÃO TODAS DA REGRESSÃO LINEAR PARA UM FILTRO DE DELTA_P CTE

    // DIVIDE CADA VALOR DE T POR V
    for (i = 0; i < tempo.length; i++) {
        t_V.push(tempo[i] / volume[i]);
    }

    // CALCULA A MÉDIA DO VOLUME
    let avgVolume = sum_array(volume) / volume.length;

    // CALCULA A SOMA DOS ERROS QUADRÁTICOS
    let SSxx = [];

    for (i = 0; i < volume.length; i++) {
        SSxx.push(Math.pow(avgVolume - volume[i], 2));
    }

    SSxx = sum_array(SSxx)

    // CALCULA A MÉDIA DE TV
    let avgt_V = sum_array(t_V) / t_V.length;

    // CALCULA A SSxy
    let SSxy = [];

    for (i = 0; i < t_V.length; i++) {
        SSxy.push( (avgt_V - t_V[i]) * (avgVolume - volume[i]));
    }

    SSxy = sum_array(SSxy);

    // CALCULA OS COEFICIENTES DA RETA
    let tgBeta = SSxy / SSxx;
    let b = avgt_V - tgBeta * avgVolume;

    // A PARTIR DAQUI SERÃO CALCULADOS OS PARÂMETROS COM BASE NOS INPUTS
    let area = potenciaDe10(document.getElementById("area_filtro").value, document.getElementById("area_filtro_fator").value)
    area = converter_area(area, document.getElementById("area_filtro_unit").value);

    let delta_P = potenciaDe10(document.getElementById("pressao").value, document.getElementById("pressao_fator").value)
    delta_P = converter_pressao(delta_P, document.getElementById("pressao_unit").value);

    let viscosidade = converter_viscosidade();

    let fracao_solidos = parseFloat(document.getElementById("fracao_solidos").value.replace(",", "."));

    let concentracao = potenciaDe10(document.getElementById("concentracao").value, document.getElementById("concentracao_fator").value);
    concentracao = converter_rho(concentracao, document.getElementById("concentracao_unit").value);

    concentracao = concentracao * fracao_solidos;
    
    // CALCULAR Rm
    Rm = b * area * delta_P / viscosidade;

    // CALCULAR alpha
    alpha = tgBeta * 2 * Math.pow(area, 2) * delta_P / (viscosidade * concentracao);
    
    // EXIBE OS RESULTADOS NA TELA
    let print_alpha = alpha.toExponential(4).split("e")[0] + "x10<sup>" + alpha.toExponential(4).split("e")[1] + "</sup>";
    let print_Rm = Rm.toExponential(4).split("e")[0] + "x10<sup>" + Rm.toExponential(4).split("e")[1] + "</sup>";
    
    document.getElementById("alpha").innerHTML = print_alpha;
    document.getElementById("Rm").innerHTML = print_Rm;

    // FORMATA O EIXO X DO GRÁFICO
    for (i = 0; i < volume.length; i++) {
        volume[i] = volume[i].toExponential(2); 
    }
    
    // PLOTA O GRÁFICO
    plotarGraficoFiltroPressaoCte(volume, t_V);

    // ESCREVE A EQUAÇÃO NO GRÁFICO
    document.getElementById("equacao").style = "display: inline-block; background: white; padding: 10px 15px; border-radius: 50px; width: auto; margin: 10px 0px 15px 0px;";
    document.getElementById("eq:a").innerHTML = tgBeta.toExponential(2).split("e")[0] + "x10<sup>" + tgBeta.toExponential(2).split("e")[1] + "</sup>";
    document.getElementById("eq:b").innerHTML = b.toExponential(2).split("e")[0] + "x10<sup>" + b.toExponential(2).split("e")[1] + "</sup>";

    // MOSTRA OS CAMPOS PARA CÁLCULO DO FILTRO INDUSTRIAL
    document.getElementById("calculo_filtro_industrial").style = "display: block;";

}

// FUNÇÃO PARA CALCULAR FILTROS BATELADA
function calcularFiltroBatelada() {
    let tempo = tabelaFiltros()[0];
    let volume = tabelaFiltros()[1];
    let t_V = [];

    // AS SEÇÕES ABAIXO SÃO TODAS DA REGRESSÃO LINEAR PARA UM FILTRO DE DELTA_P CTE

    // DIVIDE CADA VALOR DE T POR V
    for (i = 0; i < tempo.length; i++) {
        t_V.push(tempo[i] / volume[i]);
    }

    // CALCULA A MÉDIA DO VOLUME
    let avgVolume = sum_array(volume) / volume.length;

    // CALCULA A SOMA DOS ERROS QUADRÁTICOS
    let SSxx = [];

    for (i = 0; i < volume.length; i++) {
        SSxx.push(Math.pow(avgVolume - volume[i], 2));
    }

    SSxx = sum_array(SSxx)

    // CALCULA A MÉDIA DE TV
    let avgt_V = sum_array(t_V) / t_V.length;

    // CALCULA A SSxy
    let SSxy = [];

    for (i = 0; i < t_V.length; i++) {
        SSxy.push( (avgt_V - t_V[i]) * (avgVolume - volume[i]));
    }

    SSxy = sum_array(SSxy);

    // CALCULA OS COEFICIENTES DA RETA
    let tgBeta = SSxy / SSxx;
    let b = avgt_V - tgBeta * avgVolume;

    // FORMATA O EIXO X DO GRÁFICO
    for (i = 0; i < volume.length; i++) {
        volume[i] = volume[i].toExponential(2); 
    }
    
    // PLOTA O GRÁFICO
    plotarGraficoFiltroPressaoCte(volume, t_V);

    // ESCREVE A EQUAÇÃO NO GRÁFICO
    document.getElementById("equacao").style = "display: inline-block; background: white; padding: 10px 15px; border-radius: 50px; width: auto; margin: 10px 0px 15px 0px;";
    document.getElementById("eq:a").innerHTML = tgBeta.toExponential(2).split("e")[0] + "x10<sup>" + tgBeta.toExponential(2).split("e")[1] + "</sup>";
    document.getElementById("eq:b").innerHTML = b.toExponential(2).split("e")[0] + "x10<sup>" + b.toExponential(2).split("e")[1] + "</sup>";

    // MOSTRA OS CAMPOS PARA CÁLCULO DO FILTRO INDUSTRIAL
    document.getElementById("calculo_filtro_industrial").style = "display: block;";

    // MOSTRA OS RESULTADOS
    let tempo_desmontagem = potenciaDe10(document.getElementById("tempo_desmontagem").value, document.getElementById("tempo_desmontagem_fator").value); 
    tempo_desmontagem = converter_tempo(tempo_desmontagem, document.getElementById("tempo_desmontagem_unit").value)

    let V_otimo = Math.pow(tempo_desmontagem / tgBeta, 0.5);
    let W_otimo = V_otimo / (2 * tempo_desmontagem + b * V_otimo);
    let tempo_otimo = tgBeta * Math.pow(V_otimo, 2) + b * V_otimo;

    document.getElementById("volume_otimo").innerHTML = V_otimo.toExponential(2) + " m³.";
    document.getElementById("tempo_otimo").innerHTML = tempo_otimo.toFixed(0) + " segundos (" + (tempo_otimo / 3600).toFixed(2) + " horas).";
    document.getElementById("producao_otima").innerHTML = W_otimo.toExponential(2) + " m³/s.";
}

// FUNÇÃO PARA CALCULAR O TEMPO DE FILTRAÇÃO
function calcularTempoDeFiltro() {
    let delta_P = potenciaDe10(document.getElementById("pressao").value, document.getElementById("pressao_fator").value)
    delta_P = converter_pressao(delta_P, document.getElementById("pressao_unit").value);

    let viscosidade = converter_viscosidade();

    let concentracao = potenciaDe10(document.getElementById("concentracao").value, document.getElementById("concentracao_fator").value);
    concentracao = converter_rho(concentracao, document.getElementById("concentracao_unit").value);

    let area = potenciaDe10(document.getElementById("area_filtro2").value, document.getElementById("area_filtro_fator2").value)
    area = converter_area(area, document.getElementById("area_filtro_unit2").value);

    let volume_filtrado = potenciaDe10(document.getElementById("volume_filtrado").value, document.getElementById("volume_filtrado_fator").value)
    volume_filtrado = converter_volume(volume_filtrado, document.getElementById("volume_filtrado_unit").value);

    let tempo_filtracao = viscosidade * alpha * concentracao * Math.pow(volume_filtrado, 2) / (2 * area * area * delta_P) + viscosidade * Rm * volume_filtrado / (area * delta_P);

    document.getElementById("tempo_filtracao").innerHTML = tempo_filtracao.toFixed(0) + " segundos (" + (tempo_filtracao / 3600).toFixed(2) + " horas)";
    document.getElementById("resultados_filtro2").style = "display: block;";

}

// FUNÇÃO PARA PLOTAR O GRÁFICO
function plotarGraficoFiltroPressaoCte(x, y){
    const ctx = document.getElementById('t/V_V').getContext('2d');
    const myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: x,
        datasets: [{
            data: y,
            showLine: false,
            pointBackgroundColor: "#000",
            trendlineLinear: {
                style: "rgb(43 ,66 ,255, 0.3)",
                lineStyle: "dotted",
                width: 2
            }
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 't/V [s/m³]',
                    font: {
                        weight: "bold",
                        size: "16px"
                    }
                  }
            },
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'V [m³]',
                    font: {
                        weight: "bold",
                        size: "16px"
                    }
                  }
            },
        },
        plugins: {
            legend: {
              display: false
            },
        },
        responsive: true,
    }
    });
}
