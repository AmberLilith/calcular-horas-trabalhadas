const jornada = new JornadaDeTrabalho();
let qtddIntervalosAdicionais = 0;

function adicionaIntervaloAdicional() {
    qtddIntervalosAdicionais++;
    const row = document.createElement("div");
    row.className = "row mb-3 align-items-center"; 
    
    const colInicio = document.createElement("div");
    colInicio.className = "col-12 col-md-4"; 
    const labelInicio = document.createElement("label");
    labelInicio.textContent = `Início ${qtddIntervalosAdicionais}`;
    labelInicio.className = "form-label";
    const inputInicio = document.createElement('input');
    inputInicio.type = "time";
    inputInicio.setAttribute("data-inicio", "inicio");
    inputInicio.className = "form-control"; 
    colInicio.appendChild(labelInicio);
    colInicio.appendChild(inputInicio);

    const colFim = document.createElement("div");
    colFim.className = "col-12 col-md-4"; 
    const labelFim = document.createElement("label");
    labelFim.textContent = `Fim ${qtddIntervalosAdicionais}`;
    labelFim.className = "form-label"; 
    const inputFim = document.createElement("input");
    inputFim.type = "time";
    inputFim.setAttribute("data-final", "final");
    inputFim.className = "form-control"; 
    colFim.appendChild(labelFim);
    colFim.appendChild(inputFim);

    const colBotaoRemover = document.createElement("div");
    colBotaoRemover.className = "col-12 col-md-4 d-flex align-items-end mt-2 mt-md-0"; 
    const botaoRemover = document.createElement("button");
    botaoRemover.className = "btn btn-danger w-100"; 
    botaoRemover.textContent = "Remover";
    botaoRemover.addEventListener("click", () => {
        row.remove(); 
        qtddIntervalosAdicionais--; 
    });
    colBotaoRemover.appendChild(botaoRemover);

    row.appendChild(colInicio);
    row.appendChild(colFim);
    row.appendChild(colBotaoRemover);
    document.querySelector("#horarios_adicionais").appendChild(row);
}

function obtemIntervalosAdicionais() {
    const tabelaIntervalosAdicionais = document.querySelector("#horarios_adicionais");
    const inputsInicio = tabelaIntervalosAdicionais.querySelectorAll("input[data-inicio]");
    const inputsFinal = tabelaIntervalosAdicionais.querySelectorAll("input[data-final]");
    
    let listaDeIntervalosAdicionais = [];
    for (let i = 0; i < inputsInicio.length; i++) {
        listaDeIntervalosAdicionais.push({ 
            "inicio": inputsInicio[i].value || "00:00", 
            "final": inputsFinal[i].value || "00:00" 
        });
    }
    return listaDeIntervalosAdicionais;
}

function existeCampoValorInvalido() {
    const horaInicioJornada = document.querySelector("#inicio_jornada");
    const horaInicioIntervaloPrincipal = document.querySelector("#inicio_intervalo_principal");
    const horaFinalIntervaloPrincipal = document.querySelector("#final_intervalo_principal");
    const horaFinalJornada = document.querySelector("#fim_jornada");

    const listaDeCamposParaValidar = [
        horaInicioJornada,
        horaInicioIntervaloPrincipal,
        horaFinalIntervaloPrincipal,
        horaFinalJornada,
    ];

    let temCampoInvalido = false
     
    listaDeCamposParaValidar.forEach((campo) => {
        const labelValidaCampoJaExistente = document.querySelector("#" + "valida_" + campo.id)
         labelValidaCampoJaExistente.textContent = "" 
           labelValidaCampoJaExistente.style.display = "none" 
    }); 

    const inicioJornadaEmMinutos = JornadaDeTrabalho._horaParaMinutos(horaInicioJornada.value || "00:00")
    const inicioIntervaloPrincipalEmMinutos = JornadaDeTrabalho._horaParaMinutos(horaInicioIntervaloPrincipal.value || "00:00")
    const finalIntervaloPrincipalEmMinutos = JornadaDeTrabalho._horaParaMinutos(horaFinalIntervaloPrincipal.value || "00:00")
    const finalJornadaEmMinutos = JornadaDeTrabalho._horaParaMinutos(horaFinalJornada.value || "00:00")

     if(inicioIntervaloPrincipalEmMinutos > 0 && inicioIntervaloPrincipalEmMinutos <= inicioJornadaEmMinutos){
        const label = document.querySelector("#valida_" + horaInicioIntervaloPrincipal.id)
        label.textContent = "Se houve intervalo, a hora início intervalo tem que ser maior que hora início da jornada!"
        label.style.display = "inline"
        temCampoInvalido = true
    }

    if(inicioIntervaloPrincipalEmMinutos > 0 && finalIntervaloPrincipalEmMinutos == 0){
        const label = document.querySelector("#valida_" + horaFinalIntervaloPrincipal.id)
        label.textContent = "Se houve intervalo, a hora final do intervalo precisa ser informada e tem que ser maior que hora início da jornada!"
        label.style.display = "inline"
        temCampoInvalido = true
    }

    if(finalIntervaloPrincipalEmMinutos > 0 && inicioIntervaloPrincipalEmMinutos == 0){
        const label = document.querySelector("#valida_" + horaInicioIntervaloPrincipal.id)
        label.textContent = "Se houve intervalo, a hora início do intervalo precisa ser informada e tem que ser maior que hora início da jornada!!"
        label.style.display = "inline"
        temCampoInvalido = true
    }
        
    if(finalIntervaloPrincipalEmMinutos > 0 && finalIntervaloPrincipalEmMinutos <= inicioIntervaloPrincipalEmMinutos){
        const label = document.querySelector("#valida_" + horaFinalIntervaloPrincipal.id)
        label.textContent = "Se houve intervalo, a hora final intervalo tem que ser maior que hora início intervalo!"
        label.style.display = "inline"
        temCampoInvalido = true
    }

    if(finalIntervaloPrincipalEmMinutos > 0 && finalJornadaEmMinutos <= finalIntervaloPrincipalEmMinutos){
        const label = document.querySelector("#valida_" + horaFinalJornada.id)
        label.textContent = "Hora final da jornada tem que ser maior que hora final intervalo!"
        label.style.display = "inline"
        temCampoInvalido = true
    }
    
    if(finalJornadaEmMinutos <= inicioJornadaEmMinutos){
        const label = document.querySelector("#valida_" + horaFinalJornada.id)
        label.textContent = "Hora final da jornada tem que ser maior que hora início da jornada!"
        label.style.display = "inline"
        temCampoInvalido = true
    }

    const totalMinutosIntervaloPrincipal = jornada._totalMinutosDeIntervalo()
    const horasEMinutosTrabalhadas = jornada.calcularHorasTrabalhadas()
    const totalMinutosTrabalhados = JornadaDeTrabalho._horaParaMinutos(horasEMinutosTrabalhadas.horas + ":" + horasEMinutosTrabalhadas.minutos)
    const resultado = document.querySelector("#resultado")
    const minutosEmHoras = JornadaDeTrabalho.minutosParaHora(totalMinutosTrabalhados)
    if(totalMinutosTrabalhados > 251 && totalMinutosTrabalhados < 371 && totalMinutosIntervaloPrincipal < 15){
        resultado.textContent = "Você trabalhou " + minutosEmHoras + " minutos, portanto precisa fazer pelo menos 15 minutos de intervalo!"
        temCampoInvalido = true
    }else if(totalMinutosTrabalhados >= 371 && totalMinutosIntervaloPrincipal < 60){
        resultado.textContent = "Você trabalhou " + minutosEmHoras + " minutos, portanto previsa fazer pelo menos 60 minutos de intervalo!"
        temCampoInvalido = true
    }



    return temCampoInvalido; 
}

document.addEventListener('DOMContentLoaded', () => {
    console.log("carregado")
    const botaoAdicionarIntervalo = document.querySelector("#botao_adicionar_intervalo");
    if (botaoAdicionarIntervalo) {
        botaoAdicionarIntervalo.addEventListener("click", adicionaIntervaloAdicional);
    }

    const botaoCalcular = document.querySelector("#calcular_jornada");
    if (botaoCalcular) {
        botaoCalcular.addEventListener('click', () => {
            jornada.horaInicioJornada = document.querySelector("#inicio_jornada").value;
            jornada.horaFimJornada = document.querySelector("#fim_jornada").value;
            jornada.horaInicioIntervaloPrincipal = document.querySelector("#inicio_intervalo_principal").value || "00:00";
            jornada.horaFimIntervaloPrincipal = document.querySelector("#final_intervalo_principal").value || "00:00";;
            jornada.listaDeIntervalosAdicionais = obtemIntervalosAdicionais();
            const resultado = document.querySelector("#resultado")
            resultado.innerHTML = ""
            if (existeCampoValorInvalido()) {
                return; 
            }

            

            const calculo = jornada.calcularHorasTrabalhadas();
            console.log(calculo)
            resultado.innerHTML = `${calculo.horas}h ${calculo.minutos}m`;
        });
    }
});