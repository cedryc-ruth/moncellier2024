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
        strListe += '<li class="list-group-item" data-id="'+wine.id+'">'+wine.name+'</li>';
    });
    
    wineListUL.innerHTML = strListe;

    //Ajouter la gestion du clic
    const allLIWines = document.querySelectorAll('#wine-list > li');

    allLIWines.forEach(function(li) {
        li.addEventListener('click', function() {
            console.log(this);
            console.log(this.dataset.id);

            //Rechercher dans localStorage le vin sélectionné
            let result = JSON.parse(localStorage.wines).filter( wine => wine.id==this.dataset.id );

            if(result.length>0) {
                let wine = result[0];

                const wineDetails = document.querySelector('#wine-details');
                const badge = wineDetails.querySelector('#wine-details span.badge');
                badge.innerHTML = '#'+wine.id;

                const wineName = wineDetails.querySelector('#wine-details span.wine-name');
                wineName.innerHTML = wine.name;

                const wineCountry = wineDetails.querySelector('span.wine-country');
                wineCountry.innerHTML = wine.country;

                const wineRegion = wineDetails.querySelector('span.wine-region');
                wineRegion.innerHTML = wine.region;

                const wineYear = wineDetails.querySelector('span.wine-year');
                wineYear.innerHTML = wine.year;

                const wineCapacity = wineDetails.querySelector('span.wine-capacity');
                wineCapacity.innerHTML = Math.floor(wine.capacity) + ' cl';

                const wineColor = wineDetails.querySelector('span.wine-color');
                let couleur;
                
                switch(wine.color) {
                    case 'red': couleur = 'Rouge'; break;
                    case 'white': couleur = 'Blanc'; break;
                    case 'pink': couleur = 'Rosé'; break;
                }

                wineColor.innerHTML = couleur;

                const winePrice = wineDetails.querySelector('span.wine-price');
                winePrice.innerHTML = String(wine.price).replace('.',',') + ' €';

                const countryCodes = {
                    /*
                    'Argentina':{
                        '2D':'AR',
                        '3D':'ARG',
                        'fr':'Argentine',
                    },
                    */
                    'Argentina':'AR',
                    'Austria':'AT',
                    'Belgium':'BE',
                    'France':'FR',
                    'Germany':'DE',
                    'Hungary':'HU',
                    'Italy':'IT',
                    'Portugal':'PT',
                    'Spain':'ES',
                    'USA':'US',
                };

                let countryCode = countryCodes[wine.country];

                const imgCountryflag = wineDetails.querySelector('span.country-flag img');
                imgCountryflag.src = 'https://flagsapi.com/'+countryCode+'/flat/64.png';

                const wineDescription = document.querySelector('#description');
                wineDescription.innerHTML = wine.description;
            }
            //TODO Afficher le détail dans la zone de droite
        });
    });
}
