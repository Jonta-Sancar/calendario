window.semanas      = null;
window.quantos_dias = null;

window.addEventListener('DOMContentLoaded', windowLoaded);

const feriados = [ // feira de santana - ba
    '01/01', // ano novo
    '18/04', // sexta santa
    '21/04', // tiradentes
    '01/05', // dia do trabalho
    '19/06', // corpus christi
    '24/06', // são joão
    '02/07', // independência da bahia
    '26/07', // padroeira
    '07/09', // independência do brasil
    '18/09', // aniversário da cidade
    '12/10', // nossa senhora aparecida
    '02/11', // finados
    '15/11', // proclamação da república
    '20/11', // consciência negra
    '25/12' // natal
]

function windowLoaded(){
    invalidarFormulario();
    prepararEditaveis();

    document.querySelector('input[type="button"]').addEventListener('click', pegarInformacoesTurmas);
}

function montarCronograma(){
    resetarTds();
    const tbodys = document.querySelectorAll('tbody.datas');

    let tds = [];

    for(let tbody of tbodys){
        let __tds = tbody.querySelectorAll('td[data-order]');

        __tds = reordenarTds(__tds);
        
        tds.push(...__tds);
    }

    preencherTds(tds);

    prepararEditaveis();

    ajustarVisualizacao();
}

async function pegarInformacoesTurmas(){
    let url = `/back/processo.php`;

    const params = pegarParametrosFormulario();

    if(params === false){
        alert('Preencha todos os campos corretamente.');
        return false;
    }

    url += `?${params}`;
    
    const semanas_json  = await fetch(url);
    window.semanas      = await semanas_json.json();
    window.quantos_dias = semanas[0].length;

    montarCronograma();
    return {semanas, quantos_dias};
}

function pegarParametrosFormulario(){
    const turma       = document.querySelector('input[name="turma"]').value;
    const data_inicio = document.querySelector('input[name="dataInicio"]').value;

    let dias_aula = document.querySelectorAll('select[name="dias[]"] > option:checked');
    dias_aula = dias_aula.length > 0 ? Array.from(dias_aula).map(option => option.value) : [];

    if(turma === '' || data_inicio === '' || dias_aula.length === 0){
        return false;
    }

    document.querySelector('#nome-turma').innerText = turma;

    const params = retornarParametrosURL({
        turma,
        data_inicio,
        dias_aula
    });

    return params;
}

function retornarParametrosURL(params){
    let arr = [];

    for(let key in params){
        if(params[key] === '' || params[key] === null || params[key] === undefined){
            continue;
        }

        if(Array.isArray(params[key])){
            for(let i in params[key]){
                arr.push(`${key}[]=${encodeURIComponent(params[key][i])}`);
            }
        } else {
            arr.push(`${key}=${encodeURIComponent(params[key])}`);
        }
    }

    return arr.join('&');
}

function reordenarTds(tds){
    tds = Array.from(tds);

    tds.sort((a, b) => {
        const orderA = parseInt(a.getAttribute('data-order'));
        const orderB = parseInt(b.getAttribute('data-order'));

        return orderA - orderB;
    });

    return tds;
}

function preencherTds(tds){
    for(let i in window.semanas){
        const variacao = window.quantos_dias == 1 ? 1 : 0;
        let td_i = (i * (2 * 2)) + variacao;
        
        for(let _i in window.semanas[i]){
            td_i += parseInt(_i);

            const data = window.semanas[i][_i];
            tds[td_i].innerText = data;
            tds[td_i].dataset.date = ajusteFormatoData(data);
            tds[td_i].dataset.modyfied = true;

            const data_sem_ano = data.split('/').slice(0, 2).join('/');
            if(feriados.includes(data_sem_ano)){
                tds[td_i+2].classList.add('yellow');
                tds[td_i+2].classList.add('editavel');
            } else {
                tds[td_i+2].classList.remove('yellow');
                tds[td_i+2].classList.remove('editavel');
            }
        }
    }
}

function ajusteFormatoData(data){
    const data_arr = data.split('/');
    data_arr.reverse();

    return data_arr.join('-');
}

function resetarTds(){
    const tds = document.querySelectorAll('td[data-order]');

    for(let td of tds){
        if(td.dataset.modyfied == true){
            td.innerText = '--/--/----';
        } else {
            td.innerText = '';
        }

        td.dataset.date = '';
        td.dataset.modyfied = false;
        td.classList.remove('green', 'gray', 'red', 'yellow');
    }
}

function ajustarVisualizacao(){
    const data_hoje = parseInt(new Date().toISOString().slice(0, 10).split('-').join('')); // YYYYmmdd
    
    const tds = document.querySelectorAll('td[data-modyfied="true"]');
    for(let td of tds){
        const data_td_sem_ano = td.dataset.date.split('-').slice(1).reverse().join('/'); // dd/mm
        const data_td = parseInt(td.dataset.date.split('-').join('')); // YYYYmmdd

        if(feriados.includes(data_td_sem_ano)){
            td.classList.add('red');
        } else {
            td.classList.remove('red');
        }

        if(data_td < data_hoje){
            td.classList.add('green');
            td.classList.remove('gray', 'red');
        } else if(data_td === data_hoje){
            td.classList.add('gray');
            td.classList.remove('green', 'red');
        } else {
            td.classList.remove('gray');
        }
    }
}

////////////////////////////////////////////
function invalidarFormulario(){
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
    });
}

function prepararEditaveis(){
    const editaveis = document.querySelectorAll('.editavel');
    for(let editavel of editaveis){
        editavel.addEventListener('dblclick', (e) => {
            const td = e.target;
            const input = document.createElement('input');
            input.type = 'text';
            input.value = td.innerText;
            input.addEventListener('blur', () => {
                td.innerText = input.value;
                td.classList.remove('editavel');
                td.removeEventListener('click', arguments.callee);
            });
            td.innerText = '';
            td.appendChild(input);
            input.focus();
            td.classList.add('editavel');
        });
    }
}