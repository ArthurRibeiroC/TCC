function elutriador() {
    // Input do usuário
    let D_elutriador = potenciaDe10(document.getElementById("D_elutriador").value, document.getElementById("D_elutriador_fator").value);
    D_elutriador = converter_diametro(D_elutriador, document.getElementById("D_elutriador_unit").value);

    let velocidade = potenciaDe10(document.getElementById("velocidade").value, document.getElementById("velocidade_fator").value);
    velocidade = converter_velocidade(velocidade, document.getElementById("velocidade_unit").value);
    
    let velocidade2 = potenciaDe10(document.getElementById("velocidade2").value, document.getElementById("velocidade2_fator").value);
    velocidade2 = converter_velocidade(velocidade2, document.getElementById("velocidade2_unit").value);

    // Calcula a vazão de elutriação
    let area_elutriador = Math.PI * Math.pow(D_elutriador, 2) / 4;
    let vazao_elutriacao = velocidade * area_elutriador;

    
    // Calcula a razão entre os diâmetros
    let razao_diametros;
    razao_diametros = Math.pow(velocidade / velocidade2, 0.5);

    // Mostra os resultados
    document.getElementById("vazao_elutriacao").innerHTML = vazao_elutriacao.toExponential(4).split("e")[0] + "x10<sup>" + vazao_elutriacao.toExponential(4).split("e")[1] + "</sup> m³/s";
    document.getElementById("razao_diametros").innerHTML = razao_diametros.toFixed(4);
}