// TEM O CICLONE E A ANÁLISE GRANULOMÉTRICA
function tem_o_ciclone() {
    // Input do usuário
    let D_ciclone = potenciaDe10(document.getElementById("D_ciclone").value, document.getElementById("D_ciclone_fator").value);
    D_ciclone = converter_diametro(D_ciclone, document.getElementById("D_ciclone_unit").value);
   
    let vazao = converter_Vazao();
   
    let rho_fluido = potenciaDe10(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_fator").value);
    rho_fluido = converter_rho(rho_fluido, document.getElementById("rho_fluido_unit").value);
   
    let rho_particula = potenciaDe10(document.getElementById("rho_particula").value, document.getElementById("rho_particula_fator").value);
    rho_particula = converter_rho(rho_particula, document.getElementById("rho_particula_unit").value);
   
    let viscosidade = converter_viscosidade();
  
    let dp = analise_granulometrica()[0];  
    let perc = analise_granulometrica()[1];

    // Calculado
    let a = D_ciclone / 2;
    let b = D_ciclone / 4;
    let u = vazao / (a * b)
    let D_corte = Math.pow(viscosidade * D_ciclone / (vazao * (rho_particula - rho_fluido)), 1 / 2) * 0.095 * D_ciclone;
    let perda_de_carga = 4 * rho_fluido * Math.pow(u, 2);

    // Calcular eficiência global
    let faixa_eficiencias = [];

    for (i = 0; i < dp.length; i++) {
        faixa_eficiencias.push(Math.pow(Math.pow(1.25 / (dp[i] / D_corte), 2.64) + 1, -2 / 3))
    }

    let eficiencia_global;

    if (dp.length == 1) {
        eficiencia_global = faixa_eficiencias[0];
    } else if (dp.length > 1) {
        eficiencia_global = 0;
        for (i = 0; i < dp.length - 1; i++) {
            eficiencia_global += (faixa_eficiencias[i] + faixa_eficiencias[i + 1]) * (perc[i] - perc[i + 1]) / 2
        }
    }

    // Calcular composição de topo
    let perc_topo = [];

    for (i = 0; i < dp.length; i++) {
        perc_topo.push(1 - faixa_eficiencias[i]);
    }

    // Calcular as análises granulométricas de fundo

    let retido_fundo = multiplicar_vetores(nao_acumuladas(perc), faixa_eficiencias);

    let sum_retido_fundo = sum_array(retido_fundo);

    let an_gran_fundo = [];

    for (i = 0; i < retido_fundo.length; i++) {
        an_gran_fundo.push(retido_fundo[i] / sum_retido_fundo);
    }

    an_gran_fundo = somar_composicoes(an_gran_fundo);

    // Calcular as análises granulométricas de topo

    let retido_topo = multiplicar_vetores(nao_acumuladas(perc), perc_topo);

    let sum_retido_topo = sum_array(retido_topo);

    let an_gran_topo = [];

    for (i = 0; i < retido_topo.length; i++) {
        an_gran_topo.push(retido_topo[i] / sum_retido_topo);
    }

    an_gran_topo = somar_composicoes(an_gran_topo);

    // Inserir todos os valores na página
    document.getElementById("eficiencia_ciclone").innerHTML = Math.round(eficiencia_global * 10000) / 100 + "%";
    document.getElementById("perda_de_carga").innerHTML = Math.round(perda_de_carga * 100) / 100 + " Pa";
    document.getElementById("composicao_fundo").innerHTML = makeTableHTML("fundo", [analise_granulometrica()[0], an_gran_fundo]);
    document.getElementById("composicao_topo").innerHTML = makeTableHTML("topo", [analise_granulometrica()[0], an_gran_topo]);

    // Alertas
    if (u < 6) {
        alert("A vazão inserida é muito baixa para um ciclone tipo Lapple com o diâmetro fornecido. Considere usar um ciclone menor para aumentar a eficiência.");
    } else if (u > 21) {
        alert("A vazão inserida é muito grande para um ciclone tipo Lapple com o diâmetro fornecido. Considere realizar uma associação com os ciclones disponíveis em paralelo, divindo a vazão total entre eles.");
    }

    if (perda_de_carga > 2490.82) {
        alert("A perda de carga obtida é maior do que a normalmente permitida para esse tipo de equipamento (2490.82 Pa). Considere realizar uma associação com os ciclones disponíveis em paralelo, divindo a vazão total entre eles, ou trocar o fluido.");
    }

    if (dp[0] == 0) {
        alert("Insira pelo menos um diâmetro de partícula!");
    } else if (dp.length == 1) {
        document.getElementById("dp_perc").rows[1].cells[1].children[0].value = 100;
    }

}

// NÃO TEM O CICLONE
function nao_tem_o_ciclone() {

    // Input do usuário
    let D_particula = potenciaDe10(document.getElementById("D_particula").value, document.getElementById("D_particula_fator").value);
    D_particula = converter_diametro(D_particula, document.getElementById("D_particula_unit").value);
    
    let eficiencia_desejada = document.getElementById("eficiencia_desejada").value.replace(",", ".");
    
    let u = potenciaDe10(document.getElementById("velocidade").value, document.getElementById("velocidade_fator").value);
    u = converter_velocidade(u, document.getElementById("velocidade_unit").value);
   
    let rho_fluido = potenciaDe10(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_fator").value);
    rho_fluido = converter_rho(rho_fluido, document.getElementById("rho_fluido_unit").value);
   
    let rho_particula = potenciaDe10(document.getElementById("rho_particula").value, document.getElementById("rho_particula_fator").value);
    rho_particula = converter_rho(rho_particula, document.getElementById("rho_particula_unit").value);
  
    let viscosidade = converter_viscosidade();
  
  
    let dp = analise_granulometrica()[0];
    let perc = analise_granulometrica()[1];

    if (eficiencia_desejada <= 0 || eficiencia_desejada > 1) {
        alert("Eficiência inválida! A eficiência deve estar entre 0 e 1.");
        erase();
    }

    if (dp[0] == 0) {
        document.getElementById("dp_perc").rows[1].cells[0].children[0].value = document.getElementById("D_particula").value;
        document.getElementById("dp_unit").value = document.getElementById("D_particula_unit").value;
        document.getElementById("dp_perc").rows[1].cells[1].children[0].value = 100;
    } else if (dp.length == 1) {
        document.getElementById("dp_perc").rows[1].cells[1].children[0].value = 100;
    }

    // Calculado
    let D_corte = Math.pow(Math.pow(eficiencia_desejada, -3 / 2) - 1, 1 / 2.64) * D_particula / 1.25;
    let D_ciclone = u * Math.pow(D_corte, 2) * (rho_particula - rho_fluido) / (0.0722 * viscosidade);
    let a = D_ciclone / 2;
    let b = D_ciclone / 4;
    let vazao = u * a * b;
    let perda_de_carga = 4 * rho_fluido * Math.pow(u, 2);
    let dimensoes = [["Dc", "a", "b", "S", "De", "h", "H", "B"], [D_ciclone, D_ciclone / 2, D_ciclone / 4, D_ciclone / 1.6, D_ciclone / 2, D_ciclone * 2, D_ciclone * 4, D_ciclone / 4]]; // Dc, a, b, S, De, h, H, B

    // Calcular eficiência global
    let faixa_eficiencias = [];

    for (i = 0; i < dp.length; i++) {
        faixa_eficiencias.push(Math.pow(Math.pow(1.25 / (dp[i] / D_corte), 2.64) + 1, -2 / 3))
    }

    let eficiencia_global;

    if (dp.length == 1) {
        eficiencia_global = eficiencia_desejada;
    } else if (dp.length > 1) {
        eficiencia_global = 0;
        for (i = 0; i < dp.length - 1; i++) {
            eficiencia_global += (faixa_eficiencias[i] + faixa_eficiencias[i + 1]) * (perc[i] - perc[i + 1]) / 2
        }
    }

    // Calcular composição de topo
    let perc_topo = [];

    for (i = 0; i < dp.length; i++) {
        perc_topo.push(1 - faixa_eficiencias[i]);
    }

    // Calcular as análises granulométricas de fundo

    let retido_fundo = multiplicar_vetores(nao_acumuladas(perc), faixa_eficiencias);

    let sum_retido_fundo = sum_array(retido_fundo);

    let an_gran_fundo = [];

    for (i = 0; i < retido_fundo.length; i++) {
        an_gran_fundo.push(retido_fundo[i] / sum_retido_fundo);
    }

    an_gran_fundo = somar_composicoes(an_gran_fundo);

    // Calcular as análises granulométricas de topo

    let retido_topo = multiplicar_vetores(nao_acumuladas(perc), perc_topo);

    let sum_retido_topo = sum_array(retido_topo);

    let an_gran_topo = [];

    for (i = 0; i < retido_topo.length; i++) {
        an_gran_topo.push(retido_topo[i] / sum_retido_topo);
    }

    an_gran_topo = somar_composicoes(an_gran_topo);

    // Inserir todos os valores na página
    document.getElementById("eficiencia_ciclone").innerHTML = Math.round(eficiencia_global * 10000) / 100 + "%";
    document.getElementById("perda_de_carga").innerHTML = Math.round(perda_de_carga * 100) / 100 + " Pa";
    document.getElementById("vazao_calc").innerHTML = Math.round(vazao * 10000) / 10000 + " m³/s";
    document.getElementById("dimensoes").innerHTML = dimensoes_ciclone(dimensoes);
    document.getElementById("composicao_fundo").innerHTML = makeTableHTML("fundo", [analise_granulometrica()[0], an_gran_fundo]);
    document.getElementById("composicao_topo").innerHTML = makeTableHTML("topo", [analise_granulometrica()[0], an_gran_topo]);

    // Alertas
    if (u < 6) {
        alert("A velocidade inserida é muito baixa para um ciclone tipo Lapple (deve estar entre 6 e 21 m/s). Considere aumentar a velocidade de admissão ou mudar de ciclone.");
    } else if (u > 21) {
        alert("A velocidade inserida é muito grande para um ciclone tipo Lapple (deve estar entre 6 e 21 m/s). Considere diminuir a velocidade de admissão ou mudar de ciclone.");
    }

    if (perda_de_carga > 2490.82) {
        alert("A perda de carga obtida é maior do que a normalmente permitida para esse tipo de equipamento (2490.82 Pa). Considere realizar uma associação com os ciclones disponíveis em paralelo, divindo a vazão total entre eles.");
    }

}
// CALCULAR COMPOSICOES NAO ACUMULADAS
function nao_acumuladas(array) {
    let faixas_ef = [];
    for (i = 0; i < array.length - 1; i++) {
        faixas_ef[i] = Math.abs(array[i] - array[i + 1]);
    }
    faixas_ef.push(array[array.length - 1]);
    return faixas_ef;
}

// MULTIPLICAR VETORES
function multiplicar_vetores(array1, array2) {
    let resultado = [];
    if (array1.length == array2.length) {
        for (i = 0; i < array1.length; i++) {
            resultado[i] = array1[i] * array2[i];
        }
    }

    return resultado;
}

// SOMAR COMPOSIÇÕES
function somar_composicoes(composicao) {
    let an_gram = [];
    let index = 0;
    for (i = 0; i < composicao.length; i++) {
        let soma = 0;
        for (j = index; j < composicao.length; j++) {
            soma += composicao[j];
        }
        an_gram.push(Math.round(soma * 10000) / 100 + "%");
        index++;
    }

    return an_gram;
}
// SOMAR VETORES
function sum_array(array) {
    let sum_array = 0;

    for (i = 0; i < array.length; i++) {
        sum_array += array[i];
    }

    return sum_array;
}

// MULTIPLICAR VETOR POR CONSTANTE
function mult_array(array, cte) {
    for (i = 0; i < array.length; i++) {
        array[i] *= cte;
    }

    return array;
}


// CRIAR TABELA
function makeTableHTML(comp, myArray) {
    var result = "<table border=0>";
    result += "<tr> <th colspan='2'> Distribuição Granulométrica de " + comp + "</th> </tr>";
    result += "<td> Diâmetro da Partícula (m) </td>";
    result += "<td> % Acumulada > Dp </td>";

    for (var j = 0; j < myArray[0].length; j++) {
        result += "<tr>";
        result += "<td>" + myArray[0][j] + "</td>";
        result += "<td>" + myArray[1][j] + "</td>";
        result += "</tr>";
    }

    result += "</table>";

    return result;
}

// DIMENSÕES DO CICLONE
function dimensoes_ciclone(array) {
    var result = "<table border=0>";
    result += "<tr> <th colspan='2'> Dimensões do ciclone </th> </tr>";
    result += "<td> Dimensão </td>";
    result += "<td> Valor (m) </td>";

    for (var j = 0; j < array[0].length; j++) {
        result += "<tr>";
        result += "<td>" + array[0][j] + "</td>";
        result += "<td>" + Math.round(array[1][j] * 10000) / 10000 + "</td>";
        result += "</tr>";
    }

    result += "</table>";

    return result;
}

// ANÁLISE GRANULOMÉTRICA - RECUPERAR E CONVERTER VALORES
function analise_granulometrica() {
    let dp = [];
    let dp_fator = 1;
    let perc = [];
    let temp = {};

    var tabelinha = document.getElementById("dp_perc");

    switch (document.getElementById("dp_unit").value) {
        case 'm': dp_fator = 1; break;
        case 'mm': dp_fator = 1000; break;
        case 'microm': dp_fator = 1000000; break;
    }

    for (i = 1; i < tabelinha.rows.length; i++) {
        dp.push(tabelinha.rows[i].cells[0].children[0].value.replace(",", ".") / dp_fator);
        perc.push(tabelinha.rows[i].cells[1].children[0].value.replace(",", ".") / 100);
    }

    for (i = 0; i < dp.length; i++) {
        temp[dp[i]] = perc[i];
    }

    dp = dp.sort();

    for ( i = 0; i < dp.length; i++) {
        perc[i] = temp[dp[i]];
    }

    return [dp, perc];
}

// ANÁLISE GRANULOMÉTRICA - ADICIONAR OU REMOVER LINHAS
function inserirLinhaTabela(tabela) {
    var table = document.getElementById(tabela);
    var numOfRows = table.rows.length;
    var numOfCols = table.rows[numOfRows - 1].cells.length;
    var newRow = table.insertRow(numOfRows);

    for (var j = 0; j < numOfCols; j++) {
        newCell = newRow.insertCell(j);
        newCell.innerHTML = "<input type='number'>";
    }

}

function RemoverLinhaTabela(tabela) {
    var table = document.getElementById(tabela);
    var numOfRows = table.rows.length;

    if (numOfRows > 2) {
        table.deleteRow(numOfRows - 1);
    } else {
        alert("A tabela deve conter pelo menos uma linha!");
    }

}

// APAGA TUDO
function erase() {
    // Checa se a variável existe
    if (document.getElementById("D_particula")) {
        document.getElementById("D_particula").value = null;
        document.getElementById("D_particula_unit").value = "microm";
    }

    if (document.getElementById("eficiencia_desejada")) {
        document.getElementById("eficiencia_desejada").value = null;
    }

    if (document.getElementById("velocidade")) {
        document.getElementById("velocidade").value = null;
        document.getElementById("velocidade_unit").value = "m/s";
    }

    if (document.getElementById("D_ciclone")) {
        document.getElementById("D_ciclone").value = null;
        document.getElementById("D_ciclone_unit").value = "m";
    }

    if (document.getElementById("vazao")) {
        document.getElementById("vazao").value = null;
        document.getElementById("vazao_unit").value = "m³/s";
    }

    if (document.getElementById("dimensoes")) {
        document.getElementById("dimensoes").innerHTML = null;
    }

    if (document.getElementById("vazao_calc")) {
        document.getElementById("vazao_calc").innerHTML = null;
    }

    // Inputs
    document.getElementById("rho_fluido").value =
        document.getElementById("viscosidade").value =
        document.getElementById("rho_particula").value =
        document.getElementById("eficiencia_ciclone").innerHTML =
        document.getElementById("perda_de_carga").innerHTML =
        document.getElementById("composicao_fundo").innerHTML =
        document.getElementById("dp_perc").rows[1].cells[0].children[0].value =
        document.getElementById("dp_perc").rows[1].cells[1].children[0].value =
        document.getElementById("composicao_topo").innerHTML = null;

    // Unidades
    document.getElementById("rho_fluido_unit").value = "kg/m³";
    document.getElementById("viscosidade_unit").value = "Pa.s";
    document.getElementById("rho_particula_unit").value = "kg/m³";
    document.getElementById("dp_unit").value = "microm";

    // Remover tabela dp_perc
    var numOfRows = document.getElementById("dp_perc").rows.length;

    for (i = 0; i < numOfRows - 2; i++) {
        RemoverLinhaTabela();
    }

}



