const API_URL = 'https://cruth.phpnet.org/epfc/caviste/public/index.php';
let endpoint = '/api/wines';

const wineListUL = document.getElementById('wine-list');

console.log('ok');
//Récupérer tous les vins sur l'api Rest

fetch(API_URL + endpoint)
    .then(response => response.json())
    .then(data => { //console.log(data);
        //Sauvegarder la liste des vins localement
        localStorage.wines = JSON.stringify(data);

        //Afficher le nom des vins dans la liste ul d'id wine-list
        showWines(data);

        //Générer la liste des années
        const allYears = [];

        JSON.parse(localStorage.wines).forEach(wine => {
            if(!allYears.includes(wine.year)) {
                allYears.push(wine.year);
            }
        });

        allYears.forEach(year => {
            frmFilter.year.innerHTML += '<option>'+year+'</option>';
        });
    });

//Générer le formulaire de filtre
fetch(API_URL + '/api/wines/countries')
    .then(response => response.json())
    .then(data => {
        console.log(data);

        data.forEach(info => {  //console.log(info.country);
            frmFilter.country.innerHTML += '<option>'+info.country+'</option>';
        });
/*
        for(let info of data) { //console.log(info.country);
            frmFilter.country.innerHTML += '<option>'+info.country+'</option>';
        }
*/
    });

//Fonctionnalités
const frmSearch = document.getElementById('frmSearch');

frmSearch.addEventListener('submit', function(e) {  console.log('Lancement de la recherche...');
    e.preventDefault();

    let wines = JSON.parse(localStorage.wines);
    let keyword = this.keyword.value;

    wines = wines.filter(wine => wine.name.search(new RegExp(keyword,'i'))!=-1);
    console.log(wines);

    //Afficher le nom des vins dans la liste ul d'id wine-list
    showWines(wines);
});

const frmFilter = document.getElementById('frmFilter');

frmFilter.addEventListener('submit', (e)=> {    console.log('Lancement du filtre...');
    e.preventDefault();

    let selectedCountry = frmFilter.country.value;
    let selectedYear = frmFilter.year.value;

    let wines = JSON.parse(localStorage.wines);
    let result = wines;

    if(selectedCountry!='') {  //Filtre par pays
        result = result.filter(wine => wine.country == selectedCountry);
    }

    if(selectedYear!='') {  //Filtre par année
        result = result.filter(wine => wine.year == selectedYear);
    }

    console.log(result);
});


function showWines(wines) {
    //Vider la liste HTML
    wineListUL.innerHTML = '';
    let strListe = '';

    wines.forEach(wine => {
        strListe += '<li class="list-group-item">'+wine.name+'</li>';
    });
    
    wineListUL.innerHTML = strListe;

    //Ajouter la gestion du clic
    const allLIWines = document.querySelectorAll('#wine-list > li');

    for(let i=0; i<allLIWines.length ;i++) {
        allLIWines[i].addEventListener('click', function() {
            console.log(this);

            //TODO Afficher le détail dans la zone de droite
        });
    }
}
