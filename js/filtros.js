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

    let concentracao = potenciaDe10(document.getElementById("concentracao").value, document.getElementById("concentracao_fator").value);
    concentracao = converter_rho(concentracao, document.getElementById("concentracao_unit").value);

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
