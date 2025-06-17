
const jornada = new JornadaDeTrabalho();

function retornaDataAtualMaisHorasEMinutosFornecidos(horas, minutos) {
            const now = new Date();

            const year = now.getFullYear();
            const month = (now.getMonth() + 1).toString().padStart(2, '0');
            const day = now.getDate().toString().padStart(2, '0');

           
            const hours = horas ? horas.padStart(2, '0') : now.getHours().toString().padStart(2, '0');
            const minutes = minutos ? minutos.padStart(2, '0') : now.getMinutes().toString().padStart(2, '0');

            
            const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
            return formattedDateTime;
        }

function iniciaCamposComDataTimePadrao(){
    const inicioJornada = document.querySelector("#input_inicio_jornada").value = retornaDataAtualMaisHorasEMinutosFornecidos("9","0");
    const inicioIntervaloObrigatorio = document.querySelector("#input_inicio_intervalo_obrigatorio").value = retornaDataAtualMaisHorasEMinutosFornecidos("12","0");
    const fimIntervaloObrigatorio = document.querySelector("#input_fim_intervalo_obrigatorio").value = retornaDataAtualMaisHorasEMinutosFornecidos("13","0");
    const fimJornada = document.querySelector("#input_fim_jornada").value = retornaDataAtualMaisHorasEMinutosFornecidos("18","0");
}

iniciaCamposComDataTimePadrao();

let qtddIntervalosAdicionais = 0;
function adicionaIntervaloAdicional() {
    qtddIntervalosAdicionais++;
    const row = document.createElement("div");
    const backgroundColor = qtddIntervalosAdicionais % 2 == 0 ? "bg-secondary" : "bg-body-tertiary"
    row.className = `row text-center p-3 ${backgroundColor}`;

    const colInicio = document.createElement("div");
    colInicio.className = "col-12 col-md-4";
    const labelInicio = document.createElement("label");
    labelInicio.textContent = `Início ${qtddIntervalosAdicionais}`;
    labelInicio.className = "form-label";
    const inputInicio = document.createElement('input');
    inputInicio.type = "datetime-local";
    inputInicio.id = "input_inicio_intervalo_adicional_" + qtddIntervalosAdicionais
    inputInicio.value = retornaDataAtualMaisHorasEMinutosFornecidos("0","0");
    inputInicio.setAttribute("data-inicio", "inicio");
    inputInicio.className = "form-control";
    const labelValidaInicio = document.createElement("label");
    labelValidaInicio.id = "valida_input_inicio_intervalo_adicional_" + qtddIntervalosAdicionais
    labelValidaInicio.className = "form-label text-danger d-none";
    labelValidaInicio.textContent = "Valida inicio"
    colInicio.appendChild(labelInicio);
    colInicio.appendChild(inputInicio);
    colInicio.appendChild(labelValidaInicio)

    const colFim = document.createElement("div");
    colFim.className = "col-12 col-md-4";
    const labelFim = document.createElement("label");
    labelFim.textContent = `Fim ${qtddIntervalosAdicionais}`;
    labelFim.className = "form-label";
    const inputFim = document.createElement("input");
    inputFim.type = "datetime-local";
    inputFim.id = "input_fim_intervalo_adicional_" + qtddIntervalosAdicionais
    inputFim.value = retornaDataAtualMaisHorasEMinutosFornecidos("0","0");
    inputFim.setAttribute("data-fim", "fim");
    inputFim.className = "form-control";
    const labelValidaFim = document.createElement("label");
    labelValidaFim.id = "valida_input_fim_intervalo_adicional_" + qtddIntervalosAdicionais
    labelValidaFim.textContent = "Valida fim"
    labelValidaFim.className = "form-label text-danger d-none";
    colFim.appendChild(labelFim);
    colFim.appendChild(inputFim);
    colFim.appendChild(labelValidaFim);

    const colBotaoRemover = document.createElement("div");
colBotaoRemover.className = "col-12 col-md-4";

const botaoRemover = document.createElement("button");
botaoRemover.className = "btn btn-danger w-100"; // adicionei w-100 pra igualar aos inputs
botaoRemover.textContent = "Remover";
botaoRemover.addEventListener("click", () => {
    row.remove();
    qtddIntervalosAdicionais--;
});

const divParaAlinhaBotaoComOsInputs = document.createElement("div");
divParaAlinhaBotaoComOsInputs.classList.add("d-flex", "h-100", "align-items-end");

divParaAlinhaBotaoComOsInputs.appendChild(botaoRemover);
colBotaoRemover.appendChild(divParaAlinhaBotaoComOsInputs);

    row.appendChild(colInicio);
    row.appendChild(colFim);
    row.appendChild(colBotaoRemover);
    document.querySelector("#div_horarios_adicionais").appendChild(row);
}

function obtemIntervalosAdicionais() {
    const divIntervalosAdicionais = document.querySelector("#div_horarios_adicionais");
    const inputsInicio = divIntervalosAdicionais.querySelectorAll("input[data-inicio]");
    const inputsFim = divIntervalosAdicionais.querySelectorAll("input[data-fim]");

    let listaDeIntervalosAdicionais = [];
    for (let i = 0; i < inputsInicio.length; i++) {
        listaDeIntervalosAdicionais.push({
            "inicio": inputsInicio[i].value,
            "fim": inputsFim[i].value
        });
    }
    return listaDeIntervalosAdicionais;
}

document.querySelector("#botao_adicionar_intervalo").addEventListener("click", () => {
    adicionaIntervaloAdicional()
})

function validaSeHorasValidas(inputsParaValidar, callback) {
    let horasSaoValidas = true;
    let inputAntecessorMenor = true;
    inputsParaValidar.forEach((input, index) => {
        input.classList.remove("is-invalid");
        const labelValida = document.querySelector(`#valida_${input.id}`)
        labelValida.classList.remove("d-inline");
        labelValida.classList.add("d-none");
        const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
        if (!regex.test(input.value)) {
            input.classList.add("is-invalid");
            labelValida.classList.remove("d-none");
            labelValida.classList.add("d-inline");
            labelValida.textContent = "Horário inválido!";
            horasSaoValidas = false;
        }

        if (callback && callback(index)) {
            const dataInputValidado = new Date(input.value);
            const dataInputAntecessor = new Date(inputsParaValidar[index - 1].value);
            if (dataInputValidado <= dataInputAntecessor) {
                input.classList.add("is-invalid");
                labelValida.classList.remove("d-none");
                labelValida.classList.add("d-inline");
                labelValida.textContent = "Horário não pode ser menor que o horário anterior!";
                inputAntecessorMenor = false;
            }

        }
    });
    return horasSaoValidas && inputAntecessorMenor;
}

function toggleClass(elemento, classe1, classe2){
    if(elemento.classList.contains(classe1)){
        elemento.classList.remove(classe1);
        elemento.classList.add(classe2);
    }else{
        elemento.classList.remove(classe2);
        elemento.classList.add(classe1);
    }
}

function validaSeHorasAdicionaisValidas() {
    const inputInicioIntervaloObrigatorio = document.querySelector("#input_inicio_intervalo_obrigatorio");
    const inputFimIntervaloObrigatorio = document.querySelector("#input_fim_intervalo_obrigatorio");
    const horaInicioIntervaloObrigatorio = new Date(inputInicioIntervaloObrigatorio.value).getTime()
    const horaFimIntervaloObrigatorio = new Date(inputFimIntervaloObrigatorio.value).getTime()
    const paresDeIntervalosAdicionais = obtemIntervalosAdicionais()
    let adicionalEstaForaObrigatorio = true; // -----------------------------------------------
    let fimAdicionalForaObrigatorio = true;  //  Usei essas viariaveis ao invés de usar return porque quero que valide todos os campos
    let obrigatioEstaForaAdicional = true;   //  todas as vezes. Assim já mostra para o usuário tudo que tá inválido de uma vez só.
    let inicioObrigatioForaAdicional = true; //-----------------------------------------------*/ 
    
    paresDeIntervalosAdicionais.forEach((intervaloAdicional, index) => {
        const labelValidaInicio = document.querySelector(`#valida_input_inicio_intervalo_adicional_${index + 1}`);
        const labelValidaFim = document.querySelector(`#valida_input_fim_intervalo_adicional_${index + 1}`);
        const inicioAdicional = new Date(intervaloAdicional.inicio).getTime();
        const fimAdicional = new Date(intervaloAdicional.fim).getTime();
        if (inicioAdicional >= horaInicioIntervaloObrigatorio && inicioAdicional <= horaFimIntervaloObrigatorio) {
            const input = document.querySelector(`#input_inicio_intervalo_adicional_${index + 1}`);
            input.classList.add("is-invalid");
            toggleClass(labelValidaInicio, "d-none", "d-inline");
            labelValidaInicio.textContent = "Hora início intervalo adicional não pode estar dentro do intervalo obrigatório!";
            adicionalEstaForaObrigatorio = false;
        }

        if (fimAdicional >= horaInicioIntervaloObrigatorio && fimAdicional <= horaFimIntervaloObrigatorio) {
           document.querySelector(`#input_inicio_intervalo_adicional_${index + 1}`).classList.add("is-invalid");
            toggleClass(labelValidaFim, "d-none", "d-inline");
            labelValidaFim.textContent = "Hora fim intervalo adicional está dentro intervalo obrigatório!";
            fimAdicionalForaObrigatorio = false;
        }

        if (inicioAdicional < horaInicioIntervaloObrigatorio && fimAdicional > horaFimIntervaloObrigatorio) {
            document.querySelector(`#input_inicio_intervalo_adicional_${index + 1}`).classList.add("is-invalid");
            toggleClass(labelValidaInicio, "d-none", "d-inline");
            toggleClass(labelValidaFim, "d-none", "d-inline");
            labelValidaInicio.textContent = "Intervalo obrigatório não pode estar dentro do intervalo adicional!";
            labelValidaFim.textContent = "Intervalo obrigatório não pode estar dentro do intervalo adicional!";
            obrigatioEstaForaAdicional = false;
        }

        if (inicioAdicional < horaInicioIntervaloObrigatorio && fimAdicional > horaInicioIntervaloObrigatorio &&  fimAdicional < horaFimIntervaloObrigatorio) {
           document.querySelector(`#input_inicio_intervalo_adicional_${index + 1}`).classList.add("is-invalid");
            toggleClass(labelValidaInicio, "d-none", "d-inline");
            labelValidaInicio.textContent = "Hora início intervalo obrigatório não pode estar dentro do intervalo adicional!";
            inicioObrigatioForaAdicional = false;
        }
    });

    return adicionalEstaForaObrigatorio && fimAdicionalForaObrigatorio && obrigatioEstaForaAdicional && inicioObrigatioForaAdicional

}

function exibeHorasTrabalhadas(totalJornadaEmMinutos, totalIntervaloObrigatorioEmMinutos){
    const divResultado = document.querySelector("#resultado");
    divResultado.classList.add("text-danger");
    if(totalJornadaEmMinutos > 250 && totalJornadaEmMinutos < 370 && totalIntervaloObrigatorioEmMinutos < 15){
        divResultado.textContent = `Você trabalhou ${jornada.MinutosEmHoras(totalJornadaEmMinutos)}, portanto deveria ter feito pelo menos 15 minutos de intervalo!`;
    }else if(totalJornadaEmMinutos > 370 && totalIntervaloObrigatorioEmMinutos < 60){
        divResultado.textContent = `Você trabalhou ${jornada.MinutosEmHoras(totalJornadaEmMinutos)}, portanto deveria ter feito pelo menos 60 minutos de intervalo!`;
    }else{
        divResultado.classList.remove("text-danger");
        divResultado.textContent = `${jornada.MinutosEmHoras(totalJornadaEmMinutos)} horas trabalhadas`;
    }
}

function calcula() {
    const inputsHorariosPrincipais = new Array(
        document.querySelector("#input_inicio_jornada"),
        document.querySelector("#input_inicio_intervalo_obrigatorio"),
        document.querySelector("#input_fim_intervalo_obrigatorio"),
        document.querySelector("#input_fim_jornada")
    )
    const validacao1 = validaSeHorasValidas(
        inputsHorariosPrincipais,
        (index) => {
            return index > 0
        }
    );

    const divHorariosAdicionais = document.querySelector("#div_horarios_adicionais");
    const inputsHorariosAdicionais = divHorariosAdicionais.querySelectorAll("input");
    const validacao2 = validaSeHorasValidas(
        inputsHorariosAdicionais,
        (index) => {
            return (index > 0 && index % 2 != 0)
        }
    );

    const validacao3 = validaSeHorasAdicionaisValidas();   
    if(validacao1 && validacao2 && validacao3){
        jornada.horaInicioJornada = inputsHorariosPrincipais[0].value;
        jornada.horaInicioIntervaloObrigatorio  = inputsHorariosPrincipais[1].value;
        jornada.horaFimIntervaloObrigatorio  = inputsHorariosPrincipais[2].value;
        jornada.horaFimJornada  = inputsHorariosPrincipais[3].value;
        jornada.listaDeIntervalosAdicionais = obtemIntervalosAdicionais();
        const totalJornada = jornada.diferencaEntreHorasEmMinutos(jornada.horaInicioJornada, jornada.horaFimJornada);
        const totalIntervaloObrigatorio = jornada.diferencaEntreHorasEmMinutos(jornada.horaInicioIntervaloObrigatorio, jornada.horaFimIntervaloObrigatorio);
        exibeHorasTrabalhadas(totalJornada, totalIntervaloObrigatorio)
    }
}

const botaoCalcularJornada = document.querySelector("#calcular_jornada");

if (botaoCalcularJornada) {
    botaoCalcularJornada.addEventListener("click", () => {
        calcula()
    })
}


/*Falta impedir adicionar intervalo adicional repetido
*/
