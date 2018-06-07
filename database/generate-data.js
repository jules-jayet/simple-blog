var MongoClient = require("mongodb");
var tools = require("../tools");

// Database config.
var url = process.env.URL || "mongodb://localhost:27017/simpleblog";
var dbName = process.env.DBNAME || "simpleblog";

// Data.
var titles = [
	"Qu'est-ce qu'une crampe ?",
	"Parler est-il vraiment impossible pour les chimpanzés ?",
	"Le fléau Xylella arrive en France",
	"Faut-il être fou pour être génial ?",
	"L'humanité entière serait menacée par... le rhume"
];
var resumes = [
	"Que l'on soit entraînés ou pas, une crampe peut survenir au beau milieu d'une prestation sportive : les fibres musculaires se retrouvent comme figées en position contractée.",
	"On a longtemps cru que les grands singes étaient incapables de parler comme nous parce que l'anatomie de leur larynx ne le permettait pas. Or, des chercheurs ont récemment montré qu'il n'en est rien.",
	"L'Italie, l'Espagne... et maintenant la Corse. Xylella, une bactérie originaire d'Amérique, s'attaque à la France, après avoir décimé en 5 ans plus de 10 millions d'oliviers en Europe, sans compter les vignes, les fruitiers, les plantes sauvages... Une véritable hécatombe, contre laquelle il n'existe pas de remède.",
	"Michel-Ange, Victor Hugo, Mozart, Nietzsche, Einstein... combien de personnalités ayant bouleversé la conception du monde de leurs contemporains ont frôlé le gouffre de la folie, quand ils n'ont pas basculé dedans ?",
	"Contrairement aux idées reçues, la prochaine pandémie mondiale pourrait être le fait des virus du rhume ou des affections respiratoires légères. Telle est la conclusion d'une étude qui tire la sonnette d'alarme."
];
var contents = [
	"Oh, ce coup de poignard en plein mollet ! La crampe apparaît brutalement après un effort trop intense ou trop long. Au cours de l'exercice, la contraction permet aux articulations de réaliser des mouvements. Quand le signal nerveux arrive du cerveau pour commander un mouvement, les fibres musculaires coulissent et le muscle raccourcit de 30 % à 50 %, puis revient en position normale. Mais, s'il est en manque d'oxygène et d'oligoéléments comme le potassium, le sodium ou le calcium, éliminés par la sueur, les fibres restent alors en position raccourcie et le muscle ne se détend pas : c'est la crampe. Boire beaucoup d'eau en prévention Plusieurs facteurs peuvent entrer en jeu : la déshydratation, le manque de préparation ou la production d'acide lactique. La douleur peut durer plusieurs minutes, mais est vite soulagée par des étirements et une bonne réhydratation.",
	"On a longtemps cru que les grands singes étaient incapables de parler comme nous parce que l'anatomie de leur larynx ne le permettait pas. Or, des chercheurs ont récemment montré qu'il n'en est rien. Ce qui fait défaut à nos cousins comme les chimpanzés, ce ne sont pas tant les organes de la phonation. Mais plutôt les bons câblages neuronaux en lien avec les capacités cognitives qui permettent d'articuler des sons de façon intentionnelle. Cela dit, les grands singes ne sont pas pour autant dénués de langage. Ainsi, un chimpanzé lève le bras pour demander à un congénère de l'épouiller, lui donne une tape pour l'inviter à jouer, lui tend la main pour se réconcilier, etc. Et il y a mieux. De récentes études suggèrent que les cris des chimpanzés, des orangs-outans et des bonobos seraient une forme de langage destiné à influer sur le comportement de leurs congénères. La preuve ? Les bonobos qui trouvent de la nourriture émettent des séquences comprenant cinq formes de cris, selon la qualité des aliments. Il ne reste plus qu'à décoder cette forme élémentaire de syntaxe !",
	"L'Italie, l'Espagne... et maintenant la Corse. Xylella, une bactérie originaire d'Amérique, s'attaque à la France, après avoir décimé en 5 ans plus de 10 millions d'oliviers en Europe, sans compter les vignes, les fruitiers, les plantes sauvages... Une véritable hécatombe, contre laquelle il n'existe pas de remède. Cette fois, c'est sûr : la bactérie s'est installée en France. Les résultats de l'analyse menée par un laboratoire de l'Inra ont été communiqués début avril : des oliviers de deux ronds-points du Grand Ajaccio, ainsi que des spécimens sauvages, des myrtes et des chênes verts prélevés à Ventiseri, sur la côte est de la Corse, ont été infectés par Xylella fastidiosa. Un premier foyer avait été détecté en juillet 2015 à Propriano, en Corse-du-Sud, ainsi qu'en Provence-Alpes-Côte d'Azur. Mais seules les plantes ornementales étaient jusqu'ici touchées. Or voilà que le fléau se déplace dorénavant en pleine nature. Présente dans toute l'Amérique, des vignes californiennes aux forêts amazoniennes, cette bactérie végétale est considérée comme l'une des plus dangereuses du monde. La bactérie importée avec des caféiers venus d'Amérique Transmise par des insectes suceurs de sève, elle peut s'attaquer à plus de 200 espèces d'arbres et de plantes. Oliviers, vignes, amandiers, cerisiers, pruniers... elle se développe dans leurs vaisseaux et provoque leur dessèchement rapide en y bloquant la circulation de l'eau. C'est en octobre 2013, dans la péninsule du Salento, le talon de la botte italienne, que Xylella fastidiosa a été officiellement détectée pour la première fois en Europe. Elle y aurait été importée quatre ans auparavant avec des plants de caféiers ornementaux en provenance du Costa Rica. Antonio, 54 ans, gestionnaire d'un terrain situé à Surbo, dans le Salento, n'en revient toujours pas.",
	"Michel-Ange, Victor Hugo, Mozart, Nietzsche, Einstein... combien de personnalités ayant bouleversé la conception du monde de leurs contemporains ont frôlé le gouffre de la folie, quand ils n'ont pas basculé dedans ? Désordre de l'esprit et génie sont si souvent associés qu'on se demande parfois si l'un n'est pas le pendant de l'autre, si la souffrance psychique n'est pas le prix à payer pour connaître un destin d'exception. Cette hypothèse ne date pas d'hier. Au XIXe siècle, on traquait déjà le malade caché sous le créateur, la dégénérescence sous le chef-d'œuvre : Chateaubriand est diagnostiqué 'épuisé précoce', Musset 'dégénéré supérieur', Balzac 'maniaque ambulatoire' et Flaubert 'hystéro-épileptique'. Des jugements que les données scientifiques viennent aujourd'hui nuancer : 'Il ne suffit pas de souffrir de troubles affectifs pour être génial, encore faut-il avoir des aptitudes cognitives et des idées sortant du rang, explique le psychiatre Jean Cottraux. Et s'il est vrai que l'analyse du destin de grands créateurs fait souvent apparaître un lien frappant avec des troubles affectifs, on ne peut pas expliquer une œuvre singulière par la seule maladie mentale de son auteur, ni même le génie par la neurologie.'",
	"Contrairement aux idées reçues, la prochaine pandémie mondiale pourrait être le fait des virus du rhume ou des affections respiratoires légères. Telle est la conclusion d'une étude qui tire la sonnette d'alarme. Une nouvelle étude sur le risque de pandémie globale, menée par le Johns Hopkins Center for Health Security (Baltimore), est arrivée à une étrange conclusion : c'est le rhume - et toutes ces maladies virales peu mortifères s'attaquant au système respiratoire - qui pourrait avoir raison de notre civilisation. A force de se focaliser sur les virus à haut taux de mortalité comme Ebola ou Zika, pointe le rapport, on risque de passer à côté du véritable danger présenté par ces pathologies « secondaires » mais potentiellement pandémiques (à la faveur de quelques mutations). Le diable niche dans les détails... Pandémiques et peu mortels En substance, le rapport casse l'idée reçue que le risque pandémique serait le fait de virus à haut taux de mortalité : outre que leur apparition déclenche en général un branle-bas de combat sanitaire, leur taux de mortalité élevé joue contre eux, conduisant naturellement à l'extinction avant le stade pandémique (par la mort des hôtes). Au contraire, dit le rapport, les virus qui nous assaillent en hiver (rhinovirus, entérovirus, virus respiratoire syncytial) présentent un potentiel pandémique inouï, même s'ils sont très peu mortels. L'exemple de la grippe espagnole Les auteurs soulignent en effet que pour déstabiliser les gouvernements, l'économie, les sociétés, etc., la mortalité importe moins qu'un taux très élevé de personnes malades en même temps. De plus, un virus peu mortel mais extrêmement contagieux, notamment par la voie des airs, peut au final provoquer une hécatombe. La preuve : la grippe espagnole (H1N1) qui a sévi entre 1918 et 1919 n'avait un taux de mortalité que de 2,5 %. Néanmoins sa « volatilité » a permis la contagion de centaines de millions d'individus dans le monde, conduisant à plus de 50 millions de morts. Portrait-robot du microbe à pandémie Pour arriver à cette conclusion sur les virus de type rhume, les chercheurs ont consulté quelque 120 spécialistes mondiaux et épluché l'ensemble des publications médicales sur les micro-organismes potentiellement pathogènes : bactéries, champignons, prions, virus, protozoaires, etc. Ils ont alors dressé le profil-type d'un futur microbe à pandémie. Ainsi, outre sa capacité à se transmettre par l'air, il doit d'abord être contagieux pendant une période d'incubation asymptomatique ou avec des symptômes légers, et peut avoir un taux de mortalité faible (mais significatif). Ensuite, les humains ne doivent pas être immunisés contre lui (en majorité) et il ne doit pas exister de traitement (direct) ni de méthode de prévention. Enfin, ce doit être un micro-organisme qui mute facilement, pour acquérir sa capacité pandémique. Ce profil est le portrait-robot des virus à ARN dont font partie ceux du rhume, des affections respiratoires et de la grippe... Changer de stratégie au plus vite ! Le rapport attire surtout l'attention sur une erreur de stratégie dans la lutte contre les épidémies : la focalisation des autorités sur quelques virus à ARN « vedettes » ayant déjà provoqué des crises dans le passé (SRAS, mais aussi grippe saisonnière) sans s'intéresser à ceux qui ne se sont pas fait remarquer outre-mesure. Ils préconisent ainsi d'étendre les efforts en recherche et en santé publique faits pour la grippe à l'ensemble de ces autres virus... au risque sinon d'être pris au dépourvu quand toute la Planète s'enrhumera."
];
var authors = [
	"Lise Gougis",
	"Pierre-Yves Bocquet ",
	"Stéphanie Laudron",
	"Philippe Testard-Vaillant",
	"Roman Ikonicoff"
]
var dates = [
	new Date("2018-05-28"),
	new Date("2018-05-27"),
	new Date("2018-05-22"),
	new Date("2018-05-19"),
	new Date("2018-05-17")
];
var comments = [
	{
		author: "Jean-Louis",
		content: "Super !!",
		date: new Date("2018-05-29")
	},
	{
		author: "toto69",
		content: "Très intéressant",
		date: new Date("2018-05-30")
	},
	{
		author: "jack",
		content: "Bof bof",
		date: new Date("2018-05-31")
	},
	{
		author: "Loulou",
		content: "Cet article est merveilleux",
		date: new Date("2018-06-01")
	},
	{
		author: "titi21",
		content: "Cet article est scandaleux",
		date: new Date("2018-06-02")
	}
];

// Connect database.
MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {

	// Logs.
	if (err) {
		console.log("Unable to connect to mongo database :", err);
		throw err;
	}
	else console.log("Successfully connected to database...");

	// Get schema.
	var db = client.db(dbName);

	// Get articles collection.
	var articlesCollection = db.collection('articles');

	// Delete current database.
	articlesCollection.remove({}, function(err, result) {
		if (err) throw err;
	});

	// Insert data.
	var insertedTitles = [];
	var insertedResumes = [];
	var insertedContents = [];
	var insertedAuthors = [];
	var insertedDates = [];
	for(var i=0; i<5; i++) {

		// Get random title.
		var title = tools.getRandomValue(titles);
		// While already inserted -> get a new one.
		while(insertedTitles.indexOf(title) != -1) {
			title = tools.getRandomValue(titles);
		}
		insertedTitles.push(title);

		// Get random resume.
		var resume = tools.getRandomValue(resumes);
		while(insertedResumes.indexOf(resume) != -1) {
			resume = tools.getRandomValue(resumes);
		}
		insertedResumes.push(resume);

		// Get random content.
		var content = tools.getRandomValue(contents);
		while(insertedContents.indexOf(content) != -1) {
			content = tools.getRandomValue(contents);
		}
		insertedContents.push(content);

		// Get random author.
		var author = tools.getRandomValue(authors);
		while(insertedAuthors.indexOf(author) != -1) {
			author = tools.getRandomValue(authors);
		}
		insertedAuthors.push(author);

		// Get random date.
		var date = tools.getRandomValue(dates);
		while(insertedDates.indexOf(date) != -1) {
			date = tools.getRandomValue(dates);
		}
		insertedDates.push(date);

		// Get random comments.
		var articleComments = [];
		var commentsNumber = tools.getRandomInt(0, 3);
		for(var j=0; j<commentsNumber; j++) {
			articleComments.push(tools.getRandomValue(comments));
		}

		// Insert a random article.
		articlesCollection.insert(
			{
				title: title,
				resume: resume,
				content: content,
				author: author,
				date: date,
				comments: articleComments
			}
		);

	}

	// Test if data has been inserted.
	articlesCollection.find({}).toArray(function(err, result) {
		if (err) throw err;
		console.log(result.length + ' articles have been successfully inserted.');
		client.close();
	});


});
