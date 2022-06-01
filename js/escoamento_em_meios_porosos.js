function leito_fluidizado() {
    let d_particula = potenciaDe10(document.getElementById("d_particula").value, document.getElementById("d_particula_fator").value);
    d_particula = converter_diametro(d_particula, document.getElementById("d_particula_unit").value);
   
    let rho_fluido = potenciaDe10(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_fator").value);
    rho_fluido = converter_rho(rho_fluido, document.getElementById("rho_fluido_unit").value);
   
    let rho_particula = potenciaDe10(document.getElementById("rho_particula").value, document.getElementById("rho_particula_fator").value);
    rho_particula = converter_rho(rho_particula, document.getElementById("rho_particula_unit").value);
   
    let viscosidade = converter_viscosidade();

    let Arr = Math.pow(d_particula, 3) * rho_fluido * (rho_particula - rho_fluido) * 9.81 / Math.pow(viscosidade, 2);

    // SIMPLIFICAÇÃO DE WEN E YU
    let Rep_mf_Wen_Yu = Math.pow(Math.pow(33.7, 2) + 0.0408 * Arr, 0.5) - 33.7;
    let q_mf_Wen_Yu = Rep_mf_Wen_Yu * viscosidade / (rho_fluido * d_particula);

    document.getElementById("Rep_mf_Wen_Yu").innerHTML = Rep_mf_Wen_Yu.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Wen_Yu.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Wen_Yu").innerHTML = q_mf_Wen_Yu.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Wen_Yu.toExponential(4).split("e")[1] + "</sup>" + " m/s";

    // SIMPLIFICAÇÃO DE RICHARDSON
    let Rep_mf_Rich = Math.pow(Math.pow(25.7, 2) + 0.0365 * Arr, 0.5) - 25.7;
    let q_mf_Rich = Rep_mf_Rich * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_Rich").innerHTML = Rep_mf_Rich.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Rich.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Rich").innerHTML = q_mf_Rich.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Rich.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE SAXENA E VOGEL
    let Rep_mf_SV = Math.pow(Math.pow(25.3, 2) + 0.0571 * Arr, 0.5) - 25.3;
    let q_mf_SV = Rep_mf_SV * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_SV").innerHTML = Rep_mf_SV.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_SV.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_SV").innerHTML = q_mf_SV.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_SV.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE BABU ET AL
    let Rep_mf_Babu = Math.pow(Math.pow(25.3, 2) + 0.0651 * Arr, 0.5) - 25.3;
    let q_mf_Babu = Rep_mf_Babu * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_Babu").innerHTML = Rep_mf_Babu.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Babu.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Babu").innerHTML = q_mf_Babu.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Babu.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE GRACE
    let Rep_mf_Grace = Math.pow(Math.pow(27.2, 2) + 0.0408 * Arr, 0.5) - 27.2;
    let q_mf_Grace = Rep_mf_Grace * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_Grace").innerHTML = Rep_mf_Grace.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Grace.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Grace").innerHTML = q_mf_Grace.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Grace.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE CHITESTER ET AL
    let Rep_mf_Chi = Math.pow(Math.pow(28.7, 2) + 0.0494 * Arr, 0.5) - 28.7;
    let q_mf_Chi = Rep_mf_Chi * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_Chi").innerHTML = Rep_mf_Chi.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Chi.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Chi").innerHTML = q_mf_Chi.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Chi.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE PILLAI E RAJA RAO
    let Rep_mf_PRR = 0.00701 * Arr;
    let q_mf_PRR = Rep_mf_PRR * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_PRR").innerHTML = Rep_mf_PRR.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_PRR.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_PRR").innerHTML = q_mf_PRR.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_PRR.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE TANNOUS
    let Rep_mf_Tannous = 0.03 * Math.pow(Arr, 0.63);
    let q_mf_Tannous = Rep_mf_Tannous * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_Tannous").innerHTML = Rep_mf_Tannous.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Tannous.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Tannous").innerHTML = q_mf_Tannous.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Tannous.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE BARBOSA
    let Rep_mf_Barbosa = 0.0019 * Math.pow(Arr, 0.87);
    let q_mf_Barbosa = Rep_mf_Barbosa * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_Barbosa").innerHTML = Rep_mf_Barbosa.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_Barbosa.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_Barbosa").innerHTML = q_mf_Barbosa.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_Barbosa.toExponential(4).split("e")[1] + "</sup>" + " m/s";
    
    // SIMPLIFICAÇÃO DE SUBRAMANI, BARALIYYA E MIRANDA
    let Rep_mf_SBM = Arr / 1650;
    let q_mf_SBM = Rep_mf_SBM * viscosidade / (rho_fluido * d_particula);
    
    document.getElementById("Rep_mf_SBM").innerHTML = Rep_mf_SBM.toExponential(4).split("e")[0] + "x10<sup>" + Rep_mf_SBM.toExponential(4).split("e")[1] + "</sup>";
    document.getElementById("q_mf_SBM").innerHTML = q_mf_SBM.toExponential(4).split("e")[0] + "x10<sup>" + q_mf_SBM.toExponential(4).split("e")[1] + "</sup>" + " m/s";

}