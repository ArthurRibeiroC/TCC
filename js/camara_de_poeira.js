function camara_de_poeira() {
    // Input do usuário
    let vazao = converter_Vazao();
   
    let rho_fluido = potenciaDe10(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_fator").value);
    rho_fluido = converter_rho(rho_fluido, document.getElementById("rho_fluido_unit").value);
   
    let rho_particula = potenciaDe10(document.getElementById("rho_particula").value, document.getElementById("rho_particula_fator").value);
    rho_particula = converter_rho(rho_particula, document.getElementById("rho_particula_unit").value);
   
    let viscosidade = converter_viscosidade();
  
    let B_camara = potenciaDe10(document.getElementById("B_camara").value, document.getElementById("B_camara_fator").value);
    B_camara = converter_diametro(B_camara, document.getElementById("B_camara_unit").value);

    let L_camara = potenciaDe10(document.getElementById("L_camara").value, document.getElementById("L_camara_fator").value);
    L_camara = converter_diametro(L_camara, document.getElementById("L_camara_unit").value);

    // Calcular o diâmetro máximo retido
    let d_maximo = Math.pow(18 * viscosidade * vazao / ((rho_particula - rho_fluido) * 9.81 * L_camara * B_camara), 0.5);

    // Mostra os resultados
    document.getElementById("d_maximo").innerHTML = d_maximo.toExponential(4).split("e")[0] + "x10<sup>" + d_maximo.toExponential(4).split("e")[1] + "</sup> m";

}