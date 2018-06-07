## Démarrer la base de données

Avant toute chose, s'assurer d'avoir bien lancé la base de données via la commande :

> systemctl start mongod

## Installer les dépendances

> npm install

## Lancer l'application

On peut lancer l'application via la commande suivante :

> npm run start

Application disponible par navigateur web sur le port 8000: http://localhost:8000

## Générer des données/nettoyer la base

Le script suivant permet la génération de données aléatoires (attention, réinitialisation de la base de données) :

> npm run data

## Lancer les tests

Pour lancer l'exécution automatique des tests end to end, veuillez exécuter la commande suivante :

> npm run test

Attention, veiller à bien avoir coupé le serveur principal auparavant (conflit de ports).

## Conception

L'application est divisée en deux couches logiques différentes :

- Une API REST permettant des actions de type CRUD sur les articles du blog (/api/xxx).
- Une application web proposant différentes pages web permettant la consulation et l'administration de différents articles, cette application permet la gestion des articles en utilisant elle même l'API.

## Auteur

Jules JAYET <jules.jayet@gmail.com>