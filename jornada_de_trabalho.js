class JornadaDeTrabalho {
    constructor(
        horaInicioJornada,
        horaFimJornada,
        horaInicioIntervaloPrincipal,
        horaFimIntervaloPrincipal,
        listaDeIntervalosAdicionais = []
    ) {
        this.horaInicioJornada = horaInicioJornada;
        this.horaFimJornada = horaFimJornada;
        this.horaInicioIntervaloPrincipal = horaInicioIntervaloPrincipal;
        this.horaFimIntervaloPrincipal = horaFimIntervaloPrincipal;
        this.listaDeIntervalosAdicionais = listaDeIntervalosAdicionais;
    }

    static _horaParaMinutos(horaStr) {
        const [h, m] = horaStr.split(':').map(Number);
        return h * 60 + m;
    }

    static minutosParaHora(horaEmMinutos) {
    const horas = Math.floor(horaEmMinutos / 60); 
    const minutos = horaEmMinutos % 60;          

    const horasFormatadas = String(horas).padStart(2, '0');
    const minutosFormatados = String(minutos).padStart(2, '0');
    
    return `${horasFormatadas}:${minutosFormatados}`;
}

    static _diferencaEmMinutos(horaInicio, horaFim) {
        let minutosInicio = JornadaDeTrabalho._horaParaMinutos(horaInicio);
        let minutosFim = JornadaDeTrabalho._horaParaMinutos(horaFim);

        if (minutosFim < minutosInicio) {
            minutosFim += 24 * 60; 
        }
        return minutosFim - minutosInicio;
    }

    _totalMinutosDeIntervalo() {
        let total = JornadaDeTrabalho._diferencaEmMinutos(
            this.horaInicioIntervaloPrincipal,
            this.horaFimIntervaloPrincipal
        );

        for (const intervalo of this.listaDeIntervalosAdicionais) {
            total += JornadaDeTrabalho._diferencaEmMinutos(intervalo.inicio, intervalo.final);
        }

        return total;
    }

    calcularHorasTrabalhadas() {
        const minutosJornada = JornadaDeTrabalho._diferencaEmMinutos(
            this.horaInicioJornada,
            this.horaFimJornada
        );

        const minutosIntervalo = this._totalMinutosDeIntervalo();
        const minutosTrabalhados = minutosJornada - minutosIntervalo;

        
        if (minutosTrabalhados < 0) {
            return { horas: 0, minutos: 0 };
        }

        return {
            horas: Math.floor(minutosTrabalhados / 60),
            minutos: minutosTrabalhados % 60
        };
    }

    exibeHorasTrabalhadas(elementoParaExibirHorasTrabalhadas){
        
    }
}
