class JornadaDeTrabalho{
    constructor(
        horaInicioJornada,
        horaFimJornada,
        horaInicioIntervaloObrigatorio,
        horaFimIntervaloObrigatorio,
        listaDeIntervalosAdicionais = []
    ) {
        this.horaInicioJornada = horaInicioJornada;
        this.horaFimJornada = horaFimJornada;
        this.horaInicioIntervaloObrigatorio = horaInicioIntervaloObrigatorio;
        this.horaFimIntervaloObrigatorio = horaFimIntervaloObrigatorio;
        this.listaDeIntervalosAdicionais = listaDeIntervalosAdicionais;
    }

    dataParaTimestamp(dataRecebida){
        if(!dataRecebida){
            return 0;
        }
        const data = new Date(dataRecebida);
        return data.getTime();
    }

    diferencaEntreHorasEmMinutos(horaInicio, horaFim){ //hora no formato "ano-mes-diaThora:minuto:segundos". Exemplo: "2025-06-08T22:40:00"
        const timestampInicio = this.dataParaTimestamp(horaInicio);
        const timestampFim = this.dataParaTimestamp(horaFim);
        return (timestampFim - timestampInicio) / 1000 / 60;
    }

    caclulaTotalIntervalosAdicionais(){
        let total = 0;
        for(let intervalo of this.listaDeIntervalosAdicionais){
            total += this.diferencaEntreHorasEmMinutos(intervalo.inicio, intervalo.fim);
        }
        return total;
    }

    MinutosEmHoras(minutos){
        return `${ Math.floor(minutos / 60).toString().padStart(2,"0")}:${(minutos % 60).toString().padStart(2,"0")}`
    }

    obtemTotalIntervalosAdicionais(){
        let total = 0;
        this.listaDeIntervalosAdicionais.forEach(intervalo => {
            total += (new Date(intervalo.fim).getTime() - new Date(intervalo.inicio).getTime()) / 1000 / 60;
        });
        return total;
    }

    calculaJornada(){
        const totalJornada = this.diferencaEntreHorasEmMinutos(this.horaInicioJornada, this.horaFimJornada);
        const totalIntervaloObrigatorio = this.diferencaEntreHorasEmMinutos(this.horaInicioIntervaloObrigatorio, this.horaFimIntervaloObrigatorio);
        const totalIntervalosAdicionais = this.caclulaTotalIntervalosAdicionais();
        const minutosTrabalhados = (totalJornada - totalIntervaloObrigatorio - totalIntervalosAdicionais)
        return {
            horas: Math.floor(minutosTrabalhados / 60),
            minutos: minutosTrabalhados % 60
        }
    }
}

