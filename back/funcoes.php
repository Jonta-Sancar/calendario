<?php

function retornarSemanas($data_inicio, $dias_de_aula, $semanas = 36, $semana_que_antecede_apresentacao = 28){
    $dias_de_aula = retornarDiasEmIndex($dias_de_aula);

    $data_inicio = retornarDataDeInicio($data_inicio, $dias_de_aula[0]);

    $datas_semanas = retornarDiasDeAulaPorSemana($data_inicio, $dias_de_aula, $semanas, $semana_que_antecede_apresentacao);

    $datas_semanas = retornarDiasDeAulaPorSemanaDataNormal($datas_semanas);

    return $datas_semanas;
}

function retornarDiasEmIndex($dias_de_aula){
    $dias_semana = [
        'Domingo',
        'Segunda-feira',
        'Terça-feira',
        'Quarta-feira',
        'Quinta-feira',
        'Sexta-feira',
        'Sábado',
    ];

    $dias_de_aula_i = [];

    foreach ($dias_de_aula as $value) {
        $i = array_search($value, $dias_semana);
        array_push($dias_de_aula_i, $i);
    }
    
    sort($dias_de_aula_i);

    return $dias_de_aula_i;
}

function retornarDataDeInicio($data_inicio, $primeiro_dia_semana){
    $dia_data_inicial = (int)date('w', strtotime($data_inicio));

    if($dia_data_inicial !== $primeiro_dia_semana){
        if($dia_data_inicial < $primeiro_dia_semana){
            $diferenca = $primeiro_dia_semana - $dia_data_inicial;

            $data_inicio = date('Y-m-d', strtotime($data_inicio . " +$diferenca days"));
        } else {
            $diferenca = 6  - $dia_data_inicial;
            $dias = $diferenca + $primeiro_dia_semana + 1;

            $data_inicio = date('Y-m-d', strtotime($data_inicio . " +$dias days"));
        }
    }

    return $data_inicio;
}

function retornarDiasDeAulaPorSemana($data_inicio, $dias_de_aula, $semanas, $semana_que_antecede_apresentacao){
    $datas_semanas = [];

    $primeiro_dia_semana = $data_inicio;
    for($i = 0; $i <  $semanas; $i++){

        $datas_semana = [$primeiro_dia_semana];
        $dia_inicial = $dias_de_aula[0];
        foreach($dias_de_aula as $k => $v){
            if($k === 0){ continue; }

            $diferenca = $v - $dia_inicial;

            $prox_dia = date('Y-m-d', strtotime($primeiro_dia_semana . " +$diferenca days"));
            $datas_semana[] = $prox_dia;
        }

        array_push($datas_semanas, $datas_semana);
        $primeiro_dia_semana = date('Y-m-d', strtotime($primeiro_dia_semana . '+7 days'));
    }

    return $datas_semanas;
}

function retornarDiasDeAulaPorSemanaDataNormal($datas_semanas){
    $novo_datas_semanas = array_map(function($datas_semana){
        return array_map(function($data_semana){
            return date('d/m/Y', strtotime($data_semana));
        }, $datas_semana);
    }, $datas_semanas);

    return $novo_datas_semanas;
}