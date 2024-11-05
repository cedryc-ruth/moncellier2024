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
        wineListUL.innerHTML = '';
        let strListe = '';

        data.forEach(wine => {
            strListe += '<li class="list-group-item">'+wine.name+'</li>';
        });
        
        wineListUL.innerHTML = strListe;
    });

const btSearch = document.getElementById('frmSearch');

btSearch.addEventListener('click', function(e) {  
    console.log('Lancement de la recherche...');
});

