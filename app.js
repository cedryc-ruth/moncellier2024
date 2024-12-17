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

//Sauvegarder la liste des users (avec leur id) pour l'affichage de leurs commentaires
endpoint = '/api/users';

fetch(API_URL + endpoint)
.then(response => response.json())
.then(data => { //console.log(data);
    localStorage.setItem('users', JSON.stringify(data));
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

                //Sauver le vin sélectionné pour les besoins ultérieurs (commentaires, notes perso...)
                localStorage.setItem('wine',JSON.stringify(wine));

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

//Récupération et affichage des commentaires
const commentsTab = document.getElementById('comments-tab');

commentsTab.addEventListener('click', function(e) {  console.log('Affichage des commentaires...');
    //TODO améliorer le gestionnaire d'événements en choisissant un event lié à l'affichage du panel (classes CSS 'active show')

    //Récupérer les commentaires du vin sélectionné
        //Récupérer l'id du vin sélectionné
    let wine = JSON.parse(localStorage.wine);       //console.log('vin sélectionné: ',wine);

    endpoint = '/api/wines/'+wine.id+'/comments';

    fetch(API_URL + endpoint)
    .then(response => response.json())
    .then(data => { //console.log(data);
        //Sauvegarder localement
        localStorage.setItem('comments', JSON.stringify(data));

        //Afficher les commentaires
        const wineComments = document.getElementById('wine-comments');

        data.forEach(comment => {
            //Récupérer le login du user qui a commenté sur base de son user_id
            const users = JSON.parse(localStorage.users);

            let result = users.filter(user => user.id === comment.user_id);
            let user = result[0];

            //Affichage
            let li = document.createElement('li');
            li.classList.add('list-group-item');

            let p = document.createElement('p');
            p.innerHTML = '<strong class="comment-author">'+user.login+'</strong>'

            let div = document.createElement('div');
            div.innerHTML = comment.content;

            li.appendChild(p);
            li.appendChild(div);

            wineComments.appendChild(li);
        });
    });
});