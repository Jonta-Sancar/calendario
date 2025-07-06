<?php
require_once __DIR__ . '/funcoes.php';

$dias_de_aula = $_GET['dias_aula'];

$data_inicio = $_GET['data_inicio'];

$semanas = retornarSemanas($data_inicio, $dias_de_aula);

echo json_encode($semanas, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);