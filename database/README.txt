On propose d'utiliser une table "article" composée :

- D'une colonne id auto généré par mongo (string)
- D'une colonne resume de type string
- D'une colonne content de type string
- D'une colonne author de type string
- D'une colonne date de type date
- D'une colonne comments de type tableau d'objets

Exemple au format JSON :

{
    "_id": "54d8ds14w5ax98",
    "title": "Le titre",
    "resume": "Le resumé",
    "content": "Le contenu",
    "author": "Toto T.",
    "date": "2018-31-05",
    "comments": [
        {
            "author": "Toto",
            "content": "Super !"
        }
    ]
}