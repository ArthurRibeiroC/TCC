// FUNÇÃO MESTRA
function velocidades_terminais() {
    if(d_particula.value == "" || rho_fluido.value == "" || viscosidade.value == "" || rho_particula.value == "" || n_iteracoes.value == "") {
            if(d_particula.value == "") {alert("O diâmetro da partícula não pode ficar em branco!");}
            else if(rho_fluido.value == "") {alert("A massa específica do fluido não pode ficar em branco!");}
            else if(viscosidade.value == "") {alert("A viscosidade do fluido não pode ficar em branco!");}
            else if(rho_particula.value == "") {alert("A massa específica da partícula não pode ficar em branco!");}
            else if(n_iteracoes.value == "") {alert("O número de iterações não pode ficar em branco!");}
        } else {
        regime_de_stokes();
        correlacoes();
        regime_de_newton();
        regime_turbulento();       
    }
    
}

function resultados_validos(correlacao) {
    var styles = 
    "." + correlacao + "{border: 2px solid #06ce06; background-color: #06ce06;}" +
    "." + correlacao + " h1 {color: white !important;}"

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
}

function resultados_invalidos(correlacao) {
    var styles = 
    "." + correlacao + "{border: 2px solid red; background-color: red;}" +
    "." + correlacao + " h1 {color: white !important;}"

    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles
    document.head.appendChild(styleSheet)
}

function regime_de_stokes() {
    let d_particula = converter_diametro(document.getElementById("d_particula").value, document.getElementById("d_particula_unit").value);
    let rho_fluido = converter_rho(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_unit").value);
    let viscosidade = converter_rho(document.getElementById("viscosidade").value, document.getElementById("viscosidade_unit").value);
    let rho_particula = converter_rho(document.getElementById("rho_particula").value, document.getElementById("rho_particula_unit").value);
    
    let vt_stokes =  Math.pow(d_particula, 2)*(rho_particula - rho_fluido)*9.81/(18*viscosidade);
    let reynolds_stokes = rho_fluido*d_particula*vt_stokes/viscosidade;

    if (reynolds_stokes >= 0 && reynolds_stokes < 1) {
        document.getElementById("vt_stokes").innerHTML = Math.round(vt_stokes*10000)/10000 + " m/s <a class='valido'>Velocidade válida!</a>";
        document.getElementById("reynolds_stokes").innerHTML = Math.round(reynolds_stokes*100)/100 + "<a class='valido'>Reynolds na faixa correta!</a>";
        resultados_validos("stokes");
    } else {
        document.getElementById("vt_stokes").innerHTML = Math.round(vt_stokes*10000)/10000 + " m/s <a class='invalido'>Velocidade inválida!</a>";
        document.getElementById("reynolds_stokes").innerHTML = Math.round(reynolds_stokes*100)/100 + "<a class='invalido'>Reynolds fora da faixa!</a>";
        resultados_invalidos("stokes");
    }

    return vt_stokes;
}

function correlacoes() {
    let d_particula = converter_diametro(document.getElementById("d_particula").value, document.getElementById("d_particula_unit").value);
    let rho_fluido = converter_rho(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_unit").value);
    let viscosidade = converter_rho(document.getElementById("viscosidade").value, document.getElementById("viscosidade_unit").value);
    let rho_particula = converter_rho(document.getElementById("rho_particula").value, document.getElementById("rho_particula_unit").value);
    let n_iteracoes = document.getElementById("n_iteracoes").value;

    let volume_particula = (4/3)*Math.PI*Math.pow(d_particula/2, 3);
    let area_particula = Math.PI*Math.pow(d_particula/2, 2);

    let vt_zero = regime_de_stokes();
    
    // CORRELAÇÃO DE ALLEN    
    let reynolds_allen = rho_fluido*d_particula*vt_zero/viscosidade;
    for(let i = 0; i < n_iteracoes; i++) {
        let cd_allen = 18.5/Math.pow(reynolds_allen, 0.6);
        var vt_allen = Math.pow(2*volume_particula*(rho_particula - rho_fluido)*9.81/(rho_fluido*area_particula*cd_allen), 0.5);
        reynolds_allen = rho_fluido*d_particula*vt_allen/viscosidade;
    }

    
    if (reynolds_allen >= 1 && reynolds_allen < 500) {
        document.getElementById("vt_allen").innerHTML = Math.round(vt_allen*10000)/10000 +  " m/s <a class='valido'>Velocidade válida!</a>";
        document.getElementById("reynolds_allen").innerHTML = Math.round(reynolds_allen*100)/100 + "<a class='valido'>Reynolds na faixa correta!</a>";
        resultados_validos("allen");
    } else {
        document.getElementById("vt_allen").innerHTML = Math.round(vt_allen*10000)/10000 + " m/s <a class='invalido'>Velocidade inválida!</a>";
        document.getElementById("reynolds_allen").innerHTML = Math.round(reynolds_allen*100)/100 + "<a class='invalido'>Reynolds fora da faixa!</a>";
        resultados_invalidos("allen");
    }
    
    // CORRELAÇÃO DE KLYACHKO
    let reynolds_klyachko = rho_fluido*d_particula*vt_zero/viscosidade;
    for(let i = 0; i < n_iteracoes; i++) {
        let cd_klyachko = 24/reynolds_klyachko + 4*Math.pow(reynolds_klyachko, -1/3);
        var vt_klyachko = Math.pow(2*volume_particula*(rho_particula - rho_fluido)*9.81/(rho_fluido*area_particula*cd_klyachko), 0.5);
        reynolds_klyachko = rho_fluido*d_particula*vt_klyachko/viscosidade;
    }
    
    
    if (reynolds_klyachko >= 3 && reynolds_klyachko <= 400) {
        document.getElementById("vt_klyachko").innerHTML = Math.round(vt_klyachko*10000)/10000 + " m/s <a class='valido'>Velocidade válida!</a>";
        document.getElementById("reynolds_klyachko").innerHTML = Math.round(reynolds_klyachko*100)/100 + "<a class='valido'>Reynolds na faixa correta!</a>";
        resultados_validos("klyachko");
    } else {
        document.getElementById("vt_klyachko").innerHTML = Math.round(vt_klyachko*10000)/10000 + " m/s <a class='invalido'>Velocidade inválida!</a>";
        document.getElementById("reynolds_klyachko").innerHTML = Math.round(reynolds_klyachko*100)/100 + "<a class='invalido'>Reynolds fora da faixa!</a>";
        resultados_invalidos("klyachko");
    }
    
    // CORRELAÇÃO DE LANGMUIR-BLODGETT
    let reynolds_langmuir_blodgett = rho_fluido*d_particula*vt_zero/viscosidade;
    for(let i = 0; i < n_iteracoes; i++) {
        let cd_langmuir_blodgett = (24/reynolds_langmuir_blodgett)*(1 + 0.197*Math.pow(reynolds_langmuir_blodgett, 0.63) + 0.0026*Math.pow(reynolds_langmuir_blodgett, 1.39));
        var vt_langmuir_blodgett = Math.pow(2*volume_particula*(rho_particula - rho_fluido)*9.81/(rho_fluido*area_particula*cd_langmuir_blodgett), 0.5);
        reynolds_langmuir_blodgett = rho_fluido*d_particula*vt_langmuir_blodgett/viscosidade;
    }
    
    
    if (reynolds_langmuir_blodgett >= 1 && reynolds_langmuir_blodgett <= 100) {
        document.getElementById("vt_langmuir_blodgett").innerHTML = Math.round(vt_langmuir_blodgett*10000)/10000 + " m/s <a class='valido'>Velocidade válida!</a>";
        document.getElementById("reynolds_langmuir_blodgett").innerHTML = Math.round(reynolds_langmuir_blodgett*100)/100 + "<a class='valido'>Reynolds na faixa correta!</a>";
        resultados_validos("langmuir_blodgett");
    } else {
        document.getElementById("vt_langmuir_blodgett").innerHTML = Math.round(vt_langmuir_blodgett*10000)/10000 + " m/s <a class='invalido'>Velocidade inválida!</a>";
        document.getElementById("reynolds_langmuir_blodgett").innerHTML = Math.round(reynolds_langmuir_blodgett*100)/100 + "<a class='invalido'>Reynolds fora da faixa!</a>";
        resultados_invalidos("langmuir_blodgett");
    }
}

function regime_de_newton() {
    let d_particula = converter_diametro(document.getElementById("d_particula").value, document.getElementById("d_particula_unit").value);
    let rho_fluido = converter_rho(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_unit").value);
    let viscosidade = converter_rho(document.getElementById("viscosidade").value, document.getElementById("viscosidade_unit").value);
    let rho_particula = converter_rho(document.getElementById("rho_particula").value, document.getElementById("rho_particula_unit").value);
    
    let vt_newton = Math.pow(3*d_particula*(rho_particula - rho_fluido)*9.81/rho_fluido, 0.5);
    let reynolds_newton = rho_fluido*d_particula*vt_newton/viscosidade;
    
    
    if (reynolds_newton >= 500 && reynolds_newton <= 2*Math.pow(10, 5)) {
        document.getElementById("vt_newton").innerHTML = Math.round(vt_newton*10000)/10000 + " m/s <a class='valido'>Velocidade válida!</a>";
        document.getElementById("reynolds_newton").innerHTML = Math.round(reynolds_newton*100)/100 + "<a class='valido'>Reynolds na faixa correta!</a>";
        resultados_validos("newton");
    } else {
        document.getElementById("vt_newton").innerHTML = Math.round(vt_newton*10000)/10000 + " m/s <a class='invalido'>Velocidade inválida!</a>";
        document.getElementById("reynolds_newton").innerHTML = Math.round(reynolds_newton*100)/100 + "<a class='invalido'>Reynolds fora da faixa!</a>";
        resultados_invalidos("newton");
    }
}

function regime_turbulento() {
    let d_particula = converter_diametro(document.getElementById("d_particula").value, document.getElementById("d_particula_unit").value);
    let rho_fluido = converter_rho(document.getElementById("rho_fluido").value, document.getElementById("rho_fluido_unit").value);
    let viscosidade = converter_rho(document.getElementById("viscosidade").value, document.getElementById("viscosidade_unit").value);
    let rho_particula = converter_rho(document.getElementById("rho_particula").value, document.getElementById("rho_particula_unit").value);
    
    let vt_turbulento = 2.58*Math.pow(d_particula*(rho_particula - rho_fluido)*9.81/rho_fluido, 0.5);
    let reynolds_turbulento = rho_fluido*d_particula*vt_turbulento/viscosidade;
    
    
    if (reynolds_turbulento > 2*Math.pow(10, 5)) {
        document.getElementById("vt_turbulento").innerHTML = Math.round(vt_turbulento*10000)/10000 + " m/s <a class='valido'>Velocidade válida!</a>";
        document.getElementById("reynolds_turbulento").innerHTML = Math.round(reynolds_turbulento*100)/100 + "<a class='valido'>Reynolds na faixa correta!</a>";
        resultados_validos("turbulento");
    } else {
        document.getElementById("vt_turbulento").innerHTML = Math.round(vt_turbulento*10000)/10000 + " m/s <a class='invalido'>Velocidade inválida!</a>";
        document.getElementById("reynolds_turbulento").innerHTML = Math.round(reynolds_turbulento*100)/100 + "<a class='invalido'>Reynolds fora da faixa!</a>";
        resultados_invalidos("turbulento");
    }
}