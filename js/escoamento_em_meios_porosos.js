function leito_fluidizado() {
    let d_particula = potenciaDe10(document.getElementById("d_particula").value, document.getElementById("d_particula_fator").value);
    d_particula = converter_diametro(d_particula, document.getElementById("d_particula_unit").value);
   
    let rho_fluido = potenciaDe10(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_fator").value);
    rho_fluido = converter_rho(rho_fluido, document.getElementById("rho_fluido_unit").value);
   
    let rho_particula = potenciaDe10(document.getElementById("rho_particula").value, document.getElementById("rho_particula_fator").value);
    rho_particula = converter_rho(rho_particula, document.getElementById("rho_particula_unit").value);
   
    let viscosidade = converter_viscosidade();

    // CALCULA O REYNOLDS DA PARTÍCULA NO MOMENTO DA FLUIDIZAÇÃO
    let Rep_mf = Math.pow(Math.pow(33.7, 2) + 0.0408 * Math.pow(d_particula, 3) * rho_fluido * (rho_particula - rho_fluido) * 9.81 / Math.pow(viscosidade, 2), 0.5) - 33.7;

    // CALCULA A VELOCIDADE DE FLUIDIZAÇÃO
    let q_mf = Rep_mf * viscosidade / (rho_fluido * d_particula);

    // IMPRIME OS RESULTADOS NA TELA
    document.getElementById("Rep_mf").innerHTML = Rep_mf.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf").innerHTML = q_mf.toExponential(4).split("e")[0] + "x10<sup>" + q_mf.toExponential(4).split("e")[1] + "</sup>" + " m/s";
}