# express-tissea

## Pré-requis 
Avant de lancer le projet, assurez-vous d'avoir installé les éléments suivants sur votre ordinateur :
- Node.js
- MongoDB
- MongoDB Compass

## Démarrage du projet
1. Installer les nodes_modules et les dépendances nécessaires :
```
npm install mongoose bcryptjs dotenv express-async-handler jsonwebtoken
```
2. Lancement du seeder pour la création du jeu de données fictif :
```
npm run seed
```
3. Lancement du serveur
```
npm run server
```

# Documentation de l'API
## 📌 Introduction
Cette API est dédiée à la gestion d'un réseau de lignes de transport publics. Elle permet d'accéder aux informations essentielles telles que le détail de chacune des lignes, des
itinéraires et de leurs distances. Elle offre les fonctionnalités suivantes :
- Inscription d'un utilisateur
- Connexion d'un utilisateur (JWT)
- Récupération de toutes les lignes associées à une catégorie de transport (bus, métro et tram)
- Afficher les détails d'une ligne et ses arrêts associés
- Retourner la liste détaillée des arrêts d'une ligne par ordre d'apparition sur la ligne donnée
- Ajouter un arrêt sur une ligne
- Supprimer un arrêt
- Modifier les détails d'une ligne
- Calculer et retourner la distance en kilomètre entre deux arrêts
- Calculer et retourner la distance en kilomètre d'une ligne entière

## 📂 Structure des données
L'API repose sur une base de données contenant plusieurs entités :
- Categorie : possède un nom.
- Ligne : possède un nom, une catégorie de transport (bus, métro, tram), une date de création, l'heure de début d'activité et l'heure de fin d'activité.
- Arrêt : possède un nom, une ligne de transport, un ordre sur la ligne, une latitude et une longitude.
- Utilisateur : possède un nom d’utilisateur, un mot de passe et une adresse email.

Un jeu de données initial est généré grâce à un script (seed.js) pour faciliter le développement et le test de l’API.

## 🏷️ 1. Exemple d'Endpoints de l'API
Cette documentation présente les différents endpoints de cette API.

### 🔹 1.1. Retourne la liste de toutes les lignes de la catégorie de transport précisée par :id
- URL : /api/categories/:idCategory/lines
- Méthode : GET
- Réponse attendue (200 OK) :
```
{
    "success": true,
    "category": {
        "type": "bus"
    },
    "count": "Il y a 1 ligne(s) dans la catégorie bus",
    "data": [
        {
            "_id": "67c83d4b169db31ee2c5ebec",
            "name": "L1",
            "categoryType": "67c83d4b169db31ee2c5ebe6",
            "startTime": "05:30",
            "endTime": "00:30",
            "createdAt": "2025-03-05T12:02:19.923Z",
            "updatedAt": "2025-03-05T12:18:25.736Z",
            "__v": 0
        }
    ]
}
```

### 🔹 1.2. Retourne les détails de la ligne précisée par :id
- URL : /api/categories/:idCategory/lines/:idLine
- Méthode : GET
- Réponse attendue (201 OK) :
```
{
    "success": true,
    "line": {
        "name": "Nom de la ligne : L1",
        "createdAt": "Date de création de la ligne : Wed Mar 05 2025 13:02:19 GMT+0100 (heure normale d’Europe centrale)",
        "startTime": "Début d'activité : 05:30",
        "endTime": "Fin d'activité : 00:30"
    },
    "stop": [
        "Fonsegrives Entiore",
        "Jean Jaurès",
        "Sept Deniers - Salvador Dali"
    ]
}
```

### 🔹 1.3. Retourne la liste détaillée des arrêts d'une ligne précisée par :id
- URL : /api/categories/:idCategory/lines/:idLine/stops
- Méthode : GET
- Réponse attendue (201 OK) :
```
{
    "stops": [
        {
            "_id": "67c83d4b169db31ee2c5ebf2",
            "name": "Fonsegrives Entiore",
            "order": 1,
            "longitude": 1.5106573,
            "latitude": 43.5796845
        },
        {
            "_id": "67c83d4b169db31ee2c5ebf3",
            "name": "Jean Jaurès",
            "order": 2,
            "longitude": 1.4486752,
            "latitude": 43.6057316
        },
        {
            "_id": "67c83d4b169db31ee2c5ebf4",
            "name": "Sept Deniers - Salvador Dali",
            "order": 3,
            "longitude": 1.4109335,
            "latitude": 43.6143591
        }
    ]
}
```

### 🔹 1.4. Calcule et retourne la distance en kilomètre entre les deux arrêts donnés précisée par :id/:id
- URL: api/stats/distance/stops/:idStop1/:idStop2
- Méthode : GET
- Réponse attendue (201 OK) :
```
{
    "distance": "La distance entre l'arrêt Fonsegrives Entiore et Jean Jaurès est de 5.7 km"
}
```

### 🔹 1.5. Calcule et retourne la distance en kilomètre entre les deux arrêts donnés précisée par :id/:id
- URL: api/stats/distance/lines/idLine
- Méthode : GET
- Réponse attendue (201 OK) :
```
{
    "distance": "La distance totale de la ligne Ligne T1 est de 7.5 km"
}
```

### 🔹 1.6. Ajout d'un arrêt pour la ligne précisée par :id
- URL: /api/categories/:idCategory/lines/:idLine/stops
- Méthode : POST
- Corps de la requête (JSON) :
```
{
    "name": "Argoulets",
    "order": 2,
    "longitude": 1.4768223,
    "latitude": 43.6243714
}
```
- Réponse attendue (201 OK) :
```
{
    "newStop": {
        "name": "Argoulets",
        "line": "67c83d4b169db31ee2c5ebec",
        "order": 2,
        "longitude": 1.4768223,
        "latitude": 43.6243714,
        "_id": "67c858b17906444a45dd77fe",
        "createdAt": "2025-03-05T13:59:13.482Z",
        "updatedAt": "2025-03-05T13:59:13.482Z",
        "__v": 0
    }
}
```

### 🔹 1.7. Modification des détails de la ligne précisée par :id
- URL: /api/categories/:id/lines/:idLine
- Méthode : PUT
- Corps de la requête (JSON) :
```
{
    "name": "L1",
    "startTime": "05:30",
    "endTime": "00:30"
}
```
Réponse attendue (200 OK) :
```
{
    "_id": "67c83d4b169db31ee2c5ebec",
    "name": "L1",
    "categoryType": "67c83d4b169db31ee2c5ebe6",
    "startTime": "05:30",
    "endTime": "00:30",
    "createdAt": "2025-03-05T12:02:19.923Z",
    "updatedAt": "2025-03-05T14:02:43.511Z",
    "__v": 0
}
```

### 🔹 1.8. Suppression d'un arrêt sur une ligne
- URL: /api/categories/:id/lines/:idLine/stops/:id
- Méthode : DELETE
- Réponse attendue (200 OK) :
```
{
    "success": true,
    "message": "L'arrêt Fonsegrives Entiore a été supprimé"
}
```

### 🔹 1.9. Inscription d'un utilisateur
- URL : api/users/signup
- Méthode : POST
- Corps de la requête (JSON) :
```
{
    "username": "John Doe",
    "email": "john.doe@gmail.com",
    "password": "1f5D8on28!"
}
```
- Réponse attendue (200 OK) :
```
{
    "_id": "67c85b427906444a45dd780a",
    "username": "John Doe",
    "email": "john.doe@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg1YjQyNzkwNjQ0NGE0NWRkNzgwYSIsImlhdCI6MTc0MTE4MzgxMCwiZXhwIjoxNzQzNzc1ODEwfQ.IDT1QKuHu9WR7yi3UPRhhYsSE2i2-2TPwOkNsrAD1L4"
}
```

### 🔹 1.10. Connexion d'un utilisateur (JWT)
- URL : api/users/login
- Méthode : POST
- Corps de la requête (JSON) :
```
{
    "email": "john.doe@gmail.com",
    "password": "1f5D8on28!"
}
```
- Réponse attendue (200 OK) :
```
{
    "_id": "67c85b427906444a45dd780a",
    "username": "John Doe",
    "email": "john.doe@gmail.com",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3Yzg1YjQyNzkwNjQ0NGE0NWRkNzgwYSIsImlhdCI6MTc0MTE4Mzk5NiwiZXhwIjoxNzQzNzc1OTk2fQ.EVbspSYs_eeOryrKwNFilljtVFv4jSgsFXWtVeohltM"
}
```
