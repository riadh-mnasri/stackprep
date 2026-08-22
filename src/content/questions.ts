export type TopicId =
  | "java-core"
  | "spring-boot"
  | "jpa-hibernate"
  | "sql"
  | "angular"
  | "claude"
  | "kubernetes"
  | "gcp"
  | "kafka"
  | "kotlin"
  | "copilot"
  | "aws"
  | "azure"
  | "docker"
  | "terraform"
  | "spark";

export type Difficulty = "easy" | "medium" | "hard";

export interface LocalizedText {
  fr: string;
  en: string;
}

export interface CodeExample {
  lang: string;
  snippet: string;
}

export interface Question {
  id: string;
  topicId: TopicId;
  difficulty: Difficulty;
  question: LocalizedText;
  answer: LocalizedText;
  pitfall: LocalizedText;
  code?: CodeExample;
  tags: string[];
}

export const questions: Question[] = [
  // Java Core
  {
    id: "java-equals-vs-double-equals",
    topicId: "java-core",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre == et equals() en Java ?",
      en: "What is the difference between == and equals() in Java ?",
    },
    answer: {
      fr: "== compare les références pour les objets (l'adresse en mémoire) et les valeurs pour les types primitifs. equals() est une méthode qui compare le contenu logique de deux objets, et son comportement par défaut dans Object revient à ==, sauf si la classe la surcharge (comme String ou les classes wrapper). Pour comparer le contenu de deux objets métier, il faut donc toujours surcharger equals() dans la classe elle-même.",
      en: "== compares references for objects (the memory address) and values for primitive types. equals() is a method that compares the logical content of two objects, and its default behavior in Object falls back to ==, unless the class overrides it (like String or the wrapper classes). To compare the content of two business objects, you always need to override equals() in the class itself.",
    },
    pitfall: {
      fr: "Le piège classique est de comparer deux String avec == : ça fonctionne parfois par hasard grâce au string pool, mais ça casse dès qu'une des deux chaînes vient de new String(...) ou d'une concaténation dynamique.",
      en: "The classic trap is comparing two Strings with ==: it sometimes appears to work by accident thanks to the string pool, but it breaks as soon as one of the strings comes from new String(...) or dynamic concatenation.",
    },
    tags: ["equality", "objects", "strings"],
  },
  {
    id: "java-hashcode-equals-contract",
    topicId: "java-core",
    difficulty: "medium",
    question: {
      fr: "Pourquoi faut-il toujours surcharger hashCode() quand on surcharge equals() ?",
      en: "Why should you always override hashCode() when you override equals() ?",
    },
    answer: {
      fr: "Le contrat Java impose que deux objets égaux au sens de equals() aient le même hashCode(). Les structures basées sur le hachage, comme HashMap ou HashSet, utilisent d'abord hashCode() pour trouver le bon compartiment, puis equals() pour départager les collisions. Si on ne surcharge que equals(), deux objets logiquement égaux peuvent tomber dans des compartiments différents et ne jamais être considérés comme le même élément dans un HashSet.",
      en: "The Java contract requires that two objects equal according to equals() must have the same hashCode(). Hash-based structures like HashMap or HashSet first use hashCode() to find the right bucket, then equals() to resolve collisions. If you only override equals(), two logically equal objects can land in different buckets and never be recognized as the same element in a HashSet.",
    },
    pitfall: {
      fr: "Beaucoup de candidats savent qu'il faut les surcharger ensemble mais ne savent pas expliquer pourquoi, ni citer l'exemple concret d'un objet qui disparaît silencieusement d'un HashSet à cause de ce contrat rompu.",
      en: "Many candidates know they should override both together but can't explain why, or give the concrete example of an object silently disappearing from a HashSet because this contract was broken.",
    },
    tags: ["equality", "hashcode", "collections"],
  },
  {
    id: "java-checked-vs-unchecked-exceptions",
    topicId: "java-core",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre une exception checked et une exception unchecked ?",
      en: "What is the difference between a checked and an unchecked exception ?",
    },
    answer: {
      fr: "Une exception checked (comme IOException) hérite d'Exception mais pas de RuntimeException, et le compilateur oblige à la traiter, soit avec un try/catch, soit en la déclarant dans la signature avec throws. Une exception unchecked hérite de RuntimeException, et le compilateur ne force rien : c'est au développeur de décider si elle doit être capturée. Les erreurs de programmation (NullPointerException, IllegalArgumentException) sont en général unchecked, tandis que les échecs prévisibles liés à l'environnement (fichier absent, réseau coupé) sont souvent checked.",
      en: "A checked exception (like IOException) extends Exception but not RuntimeException, and the compiler forces you to handle it, either with a try/catch or by declaring it in the method signature with throws. An unchecked exception extends RuntimeException, and the compiler enforces nothing: it's up to the developer to decide whether to catch it. Programming errors (NullPointerException, IllegalArgumentException) are generally unchecked, while predictable failures tied to the environment (missing file, network down) are often checked.",
    },
    pitfall: {
      fr: "Le piège est de croire que toute RuntimeException est forcément une erreur de bug non récupérable : dans une API REST par exemple, on capture très bien des exceptions unchecked métier pour renvoyer un code d'erreur propre.",
      en: "The trap is assuming every RuntimeException is necessarily an unrecoverable bug: in a REST API, for instance, it's completely normal to catch business unchecked exceptions to return a clean error response.",
    },
    tags: ["exceptions", "error-handling"],
  },
  {
    id: "java-string-immutability",
    topicId: "java-core",
    difficulty: "medium",
    question: {
      fr: "Pourquoi la classe String est-elle immuable en Java, et quel est l'intérêt du string pool ?",
      en: "Why is the String class immutable in Java, and what's the point of the string pool ?",
    },
    answer: {
      fr: "String est immuable pour plusieurs raisons : la sécurité (une chaîne utilisée comme clé de connexion ou nom de fichier ne peut pas être modifiée après coup par un autre bout de code), la thread-safety (aucune synchronisation nécessaire puisqu'un objet immuable ne change jamais d'état), et la possibilité de mettre en cache les chaînes dans le string pool. Le string pool permet à la JVM de réutiliser la même instance pour deux littéraux identiques plutôt que d'allouer un nouvel objet à chaque fois, ce qui économise de la mémoire.",
      en: "String is immutable for several reasons: security (a string used as a connection key or file name can't be altered later by another piece of code), thread safety (no synchronization is needed since an immutable object never changes state), and it enables caching strings in the string pool. The string pool lets the JVM reuse the same instance for two identical literals instead of allocating a new object each time, saving memory.",
    },
    pitfall: {
      fr: "Beaucoup de candidats confondent immuabilité de l'objet et impossibilité de réassigner la variable : String s = \"a\"; s = s + \"b\"; ne modifie pas la chaîne \"a\", elle crée une nouvelle chaîne et réaffecte la référence s.",
      en: "Many candidates confuse the immutability of the object with the impossibility of reassigning the variable: String s = \"a\"; s = s + \"b\"; doesn't modify the string \"a\", it creates a new string and reassigns the reference s.",
    },
    tags: ["strings", "immutability", "memory"],
  },
  {
    id: "java-arraylist-vs-linkedlist",
    topicId: "java-core",
    difficulty: "easy",
    question: {
      fr: "Quand choisir une ArrayList plutôt qu'une LinkedList, et inversement ?",
      en: "When should you choose an ArrayList over a LinkedList, and vice versa ?",
    },
    answer: {
      fr: "ArrayList repose sur un tableau redimensionnable : l'accès par index est en O(1), mais une insertion ou une suppression au milieu implique de décaler des éléments, donc O(n). LinkedList repose sur une liste doublement chaînée : l'insertion ou la suppression est en O(1) une fois qu'on a la référence du nœud, mais l'accès par index est en O(n) car il faut parcourir la liste. En pratique, ArrayList est le choix par défaut pour la grande majorité des cas, car les accès en lecture et le parcours séquentiel sont bien plus fréquents que les insertions au milieu.",
      en: "ArrayList is backed by a resizable array: index access is O(1), but inserting or removing in the middle requires shifting elements, so it's O(n). LinkedList is backed by a doubly linked list: insertion or removal is O(1) once you already have the node reference, but index access is O(n) since it has to walk the list. In practice, ArrayList is the default choice for most use cases, because reads and sequential iteration are far more common than mid-list insertions.",
    },
    pitfall: {
      fr: "Le piège classique est de penser que LinkedList est toujours plus rapide pour insérer, alors que dans la pratique, insérer au milieu d'une LinkedList demande d'abord de parcourir la liste en O(n) pour atteindre la position, ce qui annule l'avantage théorique.",
      en: "The classic trap is assuming LinkedList is always faster for insertions, when in practice inserting in the middle of a LinkedList first requires an O(n) walk to reach the position, which cancels out the theoretical advantage.",
    },
    tags: ["collections", "performance", "data-structures"],
  },
  {
    id: "java-stream-lazy-evaluation",
    topicId: "java-core",
    difficulty: "medium",
    question: {
      fr: "Que veut-on dire quand on parle d'évaluation paresseuse (lazy) dans l'API Stream ?",
      en: "What does lazy evaluation mean in the Stream API ?",
    },
    answer: {
      fr: "Les opérations intermédiaires d'un Stream, comme map() ou filter(), ne sont pas exécutées au moment où on les écrit : elles construisent un pipeline de traitement qui reste inerte tant qu'aucune opération terminale, comme collect(), forEach() ou count(), n'est appelée. Une fois l'opération terminale déclenchée, le stream traite chaque élément un par un à travers tout le pipeline, plutôt que d'appliquer chaque étape à toute la collection avant de passer à la suivante. Ça permet des optimisations comme le court-circuit avec findFirst() ou anyMatch(), qui peuvent arrêter le traitement dès qu'un résultat est trouvé.",
      en: "Intermediate operations on a Stream, like map() or filter(), aren't executed when you write them: they build a processing pipeline that stays inert until a terminal operation, like collect(), forEach() or count(), is called. Once the terminal operation triggers, the stream processes each element one at a time through the whole pipeline, rather than applying each step to the entire collection before moving to the next. This enables optimizations like short-circuiting with findFirst() or anyMatch(), which can stop processing as soon as a result is found.",
    },
    pitfall: {
      fr: "Un piège fréquent est d'oublier qu'un stream sans opération terminale ne fait strictement rien, ce qui donne l'impression d'un bug silencieux quand on s'attend à un effet de bord dans un map() jamais consommé.",
      en: "A frequent trap is forgetting that a stream with no terminal operation does strictly nothing, which looks like a silent bug when you expect a side effect inside a map() that's never consumed.",
    },
    tags: ["streams", "functional", "performance"],
  },
  {
    id: "java-generics-type-erasure",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que l'effacement de type (type erasure) pour les génériques Java, et quelles limitations ça impose ?",
      en: "What is type erasure for Java generics, and what limitations does it impose ?",
    },
    answer: {
      fr: "Les génériques Java n'existent qu'à la compilation : le compilateur vérifie la cohérence des types puis remplace les paramètres génériques par leur borne (Object par défaut, ou la borne explicite avec extends) dans le bytecode généré. À l'exécution, une List<String> et une List<Integer> ont exactement la même classe List, ce qui explique pourquoi on ne peut pas écrire list instanceof List<String>, ni créer un tableau générique directement avec new T[10], ni surcharger deux méthodes qui ne diffèrent que par leur paramètre générique.",
      en: "Java generics only exist at compile time: the compiler checks type consistency and then replaces generic parameters with their bound (Object by default, or the explicit bound with extends) in the generated bytecode. At runtime, a List<String> and a List<Integer> have exactly the same List class, which is why you can't write list instanceof List<String>, can't create a generic array directly with new T[10], and can't overload two methods that only differ by their generic parameter.",
    },
    pitfall: {
      fr: "Les candidats confondent souvent effacement de type et absence totale d'information sur les génériques : la réflexion peut encore récupérer certaines informations de type via les signatures génériques conservées dans le bytecode pour les champs et méthodes, ce n'est pas un effacement total.",
      en: "Candidates often confuse type erasure with a total loss of generic information: reflection can still retrieve some type information through the generic signatures kept in the bytecode for fields and methods, it's not a complete erasure.",
    },
    tags: ["generics", "jvm", "compilation"],
  },
  {
    id: "java-garbage-collector-basics",
    topicId: "java-core",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne le ramasse-miettes (garbage collector) en Java, dans les grandes lignes ?",
      en: "How does the garbage collector work in Java, broadly speaking ?",
    },
    answer: {
      fr: "La JVM organise le tas en générations : la jeune génération (Eden et deux zones survivor) pour les objets récemment créés, et la vieille génération pour les objets qui ont survécu à plusieurs cycles de collecte. La plupart des objets meurent jeunes, donc les collectes mineures sur la jeune génération sont fréquentes et rapides. Un objet est considéré éligible à la collecte dès qu'il n'est plus accessible depuis les racines du programme (variables locales actives, champs statiques, threads), et le GC libère alors la mémoire correspondante sans intervention du développeur.",
      en: "The JVM organizes the heap into generations: the young generation (Eden and two survivor spaces) for recently created objects, and the old generation for objects that survived several collection cycles. Most objects die young, so minor collections on the young generation are frequent and fast. An object becomes eligible for collection as soon as it's no longer reachable from the program's roots (active local variables, static fields, threads), and the GC then reclaims that memory without any developer intervention.",
    },
    pitfall: {
      fr: "Le piège est de croire que System.gc() force une collecte immédiate : ce n'est qu'une suggestion à la JVM, qui reste libre de l'ignorer, et s'appuyer dessus dans du code de production est un signal d'alarme en entretien.",
      en: "The trap is believing System.gc() forces an immediate collection: it's only a suggestion to the JVM, which remains free to ignore it, and relying on it in production code is a red flag in an interview.",
    },
    tags: ["gc", "memory", "jvm"],
  },
  {
    id: "java-synchronized-vs-concurrent-collections",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre une collection synchronisée (Collections.synchronizedList) et une collection concurrente comme ConcurrentHashMap ?",
      en: "What is the difference between a synchronized collection (Collections.synchronizedList) and a concurrent collection like ConcurrentHashMap ?",
    },
    answer: {
      fr: "Une collection synchronisée enveloppe chaque méthode dans un bloc synchronized sur un verrou unique global, ce qui garantit la cohérence mais bloque tous les threads sur ce seul verrou, y compris pour des opérations qui n'entrent pas en conflit. ConcurrentHashMap découpe les verrous par segment ou par bucket selon la version de Java, ce qui permet à plusieurs threads de lire et écrire simultanément sur des parties différentes de la map sans se bloquer mutuellement. Il faut aussi retenir qu'itérer sur une collection synchronisée nécessite un bloc synchronized manuel autour de la boucle, alors que ConcurrentHashMap fournit un itérateur faiblement cohérent qui ne lève jamais ConcurrentModificationException.",
      en: "A synchronized collection wraps every method in a synchronized block on a single global lock, which guarantees consistency but blocks all threads on that one lock, even for operations that don't actually conflict. ConcurrentHashMap splits locking by segment or bucket depending on the Java version, allowing multiple threads to read and write different parts of the map simultaneously without blocking each other. It's also worth remembering that iterating over a synchronized collection needs a manual synchronized block around the loop, while ConcurrentHashMap provides a weakly consistent iterator that never throws ConcurrentModificationException.",
    },
    pitfall: {
      fr: "Un piège classique en entretien est d'oublier que même avec une collection synchronisée, itérer dessus sans bloc synchronized manuel expose à une ConcurrentModificationException si un autre thread modifie la collection pendant le parcours.",
      en: "A classic interview trap is forgetting that even with a synchronized collection, iterating without a manual synchronized block leaves you exposed to a ConcurrentModificationException if another thread modifies the collection during the iteration.",
    },
    tags: ["concurrency", "collections", "thread-safety"],
  },
  {
    id: "java-records-vs-classes",
    topicId: "java-core",
    difficulty: "medium",
    question: {
      fr: "Qu'apportent les records par rapport à une classe classique, et quand faut-il les utiliser ?",
      en: "What do records bring compared to a regular class, and when should you use them ?",
    },
    answer: {
      fr: "Un record est une classe immuable spécialisée pour porter des données : en déclarant les composants dans l'en-tête, le compilateur génère automatiquement le constructeur, les accesseurs, equals(), hashCode() et toString() cohérents entre eux. C'est un excellent choix pour les DTO, les objets valeur ou les réponses d'API, là où on veut un porteur de données sans logique métier complexe et sans mutabilité. Un record peut quand même avoir des méthodes additionnelles, des méthodes statiques, et un constructeur compact pour valider les données à la création.",
      en: "A record is a specialized immutable class for carrying data: by declaring the components in the header, the compiler automatically generates the constructor, accessors, and mutually consistent equals(), hashCode() and toString(). It's an excellent choice for DTOs, value objects or API responses, wherever you want a data carrier without complex business logic and without mutability. A record can still have additional methods, static methods, and a compact constructor to validate data on creation.",
    },
    pitfall: {
      fr: "Le piège est de vouloir utiliser un record pour une entité JPA ou tout objet dont l'état doit changer après création : un record est immuable par nature, et forcer de la mutabilité dessus va à l'encontre de son intention.",
      en: "The trap is trying to use a record for a JPA entity or any object whose state needs to change after creation: a record is immutable by nature, and forcing mutability onto it defeats its purpose.",
    },
    tags: ["records", "immutability", "language-features"],
  },

  // Spring Boot
  {
    id: "spring-dependency-injection-types",
    topicId: "spring-boot",
    difficulty: "easy",
    question: {
      fr: "Quels sont les différents types d'injection de dépendances dans Spring, et lequel est recommandé ?",
      en: "What are the different types of dependency injection in Spring, and which one is recommended ?",
    },
    answer: {
      fr: "Spring propose trois formes d'injection : par constructeur, par setter, et par champ (avec @Autowired directement sur l'attribut). L'injection par constructeur est recommandée, car elle rend les dépendances explicites et obligatoires, permet de déclarer les champs en final, et facilite les tests unitaires puisqu'on peut instancier la classe sans démarrer le contexte Spring. L'injection par champ, bien que compacte, cache les dépendances et complique les tests, c'est pourquoi elle est généralement déconseillée dans du code de production.",
      en: "Spring offers three forms of injection: constructor injection, setter injection, and field injection (with @Autowired directly on the attribute). Constructor injection is recommended, because it makes dependencies explicit and mandatory, allows fields to be declared final, and makes unit testing easier since you can instantiate the class without starting the Spring context. Field injection, while compact, hides dependencies and complicates testing, which is why it's generally discouraged in production code.",
    },
    pitfall: {
      fr: "Beaucoup de candidats citent l'injection par champ comme la plus simple sans mentionner ses inconvénients pour les tests et la lisibilité, ce qui est un mauvais signal si le poste implique du code de production maintenable.",
      en: "Many candidates cite field injection as the simplest option without mentioning its downsides for testing and readability, which is a bad signal if the role involves maintainable production code.",
    },
    tags: ["dependency-injection", "spring-core"],
  },
  {
    id: "spring-bean-scopes",
    topicId: "spring-boot",
    difficulty: "medium",
    question: {
      fr: "Quels sont les principaux scopes de bean Spring, et quand utiliser un scope prototype ?",
      en: "What are the main Spring bean scopes, and when should you use prototype scope ?",
    },
    answer: {
      fr: "Le scope par défaut est singleton : une seule instance du bean est créée pour tout le contexte applicatif et partagée partout où elle est injectée. Le scope prototype crée une nouvelle instance à chaque demande d'injection, ce qui est utile pour des beans qui portent un état mutable propre à chaque utilisation, comme un objet de traitement temporaire. Il existe aussi des scopes liés au web comme request et session, qui créent une instance par requête HTTP ou par session utilisateur.",
      en: "The default scope is singleton: a single instance of the bean is created for the whole application context and shared everywhere it's injected. Prototype scope creates a new instance on every injection request, which is useful for beans carrying mutable state specific to each use, like a temporary processing object. There are also web-related scopes like request and session, which create one instance per HTTP request or per user session.",
    },
    pitfall: {
      fr: "Le piège classique est d'injecter un bean prototype dans un bean singleton avec une simple injection par constructeur : Spring ne crée l'instance prototype qu'une seule fois, au moment de l'injection, et pas à chaque appel, ce qui casse l'effet attendu. Il faut passer par un ObjectProvider ou un proxy scoped pour obtenir une nouvelle instance à chaque usage.",
      en: "The classic trap is injecting a prototype bean into a singleton bean with a plain constructor injection: Spring only creates the prototype instance once, at injection time, not on every call, which breaks the expected behavior. You need an ObjectProvider or a scoped proxy to get a fresh instance on every use.",
    },
    tags: ["beans", "scopes", "spring-core"],
  },
  {
    id: "spring-boot-autoconfiguration",
    topicId: "spring-boot",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne l'auto-configuration de Spring Boot ?",
      en: "How does Spring Boot auto-configuration work ?",
    },
    answer: {
      fr: "Spring Boot scanne au démarrage les classes annotées @AutoConfiguration déclarées dans le fichier META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports des jars présents dans le classpath. Chaque configuration est conditionnelle : des annotations comme @ConditionalOnClass, @ConditionalOnMissingBean ou @ConditionalOnProperty déterminent si elle doit s'appliquer selon ce qui est déjà présent sur le classpath ou dans le contexte. C'est ce mécanisme qui permet, par exemple, qu'ajouter la dépendance spring-boot-starter-data-jpa configure automatiquement un DataSource et un EntityManagerFactory sans configuration XML.",
      en: "Spring Boot scans, at startup, the classes annotated @AutoConfiguration declared in the META-INF/spring/org.springframework.boot.autoconfigure.AutoConfiguration.imports file of the jars present on the classpath. Each configuration is conditional: annotations like @ConditionalOnClass, @ConditionalOnMissingBean or @ConditionalOnProperty determine whether it should apply based on what's already present on the classpath or in the context. This is the mechanism that lets adding the spring-boot-starter-data-jpa dependency, for example, automatically configure a DataSource and an EntityManagerFactory with no XML configuration.",
    },
    pitfall: {
      fr: "Un piège fréquent est de croire que l'auto-configuration écrase toujours la configuration manuelle : au contraire, @ConditionalOnMissingBean fait que dès qu'on déclare son propre bean d'un type donné, l'auto-configuration correspondante s'efface au profit de la configuration explicite.",
      en: "A frequent trap is believing auto-configuration always overrides manual configuration: on the contrary, @ConditionalOnMissingBean means that as soon as you declare your own bean of a given type, the matching auto-configuration steps aside in favor of your explicit configuration.",
    },
    tags: ["autoconfiguration", "spring-boot"],
  },
  {
    id: "spring-rest-exception-handling",
    topicId: "spring-boot",
    difficulty: "medium",
    question: {
      fr: "Comment gérer proprement les exceptions dans une API REST Spring Boot ?",
      en: "How do you properly handle exceptions in a Spring Boot REST API ?",
    },
    answer: {
      fr: "La bonne pratique est de centraliser la gestion des erreurs avec une classe annotée @RestControllerAdvice, qui contient des méthodes annotées @ExceptionHandler pour chaque type d'exception à traiter. Chaque handler retourne une réponse structurée, en général au format ProblemDetail depuis Spring 6, avec un code HTTP cohérent, un message clair et éventuellement des détails de validation. Ça évite de dupliquer des blocs try/catch dans chaque contrôleur et garantit un format d'erreur homogène sur toute l'API.",
      en: "The good practice is to centralize error handling with a class annotated @RestControllerAdvice, containing methods annotated @ExceptionHandler for each exception type to handle. Each handler returns a structured response, typically in ProblemDetail format since Spring 6, with a consistent HTTP status, a clear message and optionally validation details. This avoids duplicating try/catch blocks in every controller and guarantees a uniform error format across the whole API.",
    },
    pitfall: {
      fr: "Le piège est de laisser les exceptions techniques remonter telles quelles jusqu'au client, avec la stack trace complète dans la réponse JSON : c'est une fuite d'information en production, en plus d'être illisible pour le consommateur de l'API.",
      en: "The trap is letting technical exceptions bubble up as-is to the client, with the full stack trace in the JSON response: that's an information leak in production, on top of being unreadable for the API consumer.",
    },
    tags: ["rest", "exception-handling", "api-design"],
  },
  {
    id: "spring-transactional-pitfalls",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Pourquoi @Transactional ne fonctionne-t-il pas toujours quand on appelle une méthode annotée depuis une autre méthode de la même classe ?",
      en: "Why doesn't @Transactional always work when calling an annotated method from another method in the same class ?",
    },
    answer: {
      fr: "Spring implémente @Transactional avec un proxy généré autour du bean : quand on appelle une méthode transactionnelle depuis l'extérieur, l'appel passe par ce proxy, qui ouvre la transaction avant de déléguer à la vraie méthode. Mais quand une méthode appelle une autre méthode transactionnelle de la même classe via this, l'appel se fait directement sur l'objet réel, sans repasser par le proxy, donc l'annotation @Transactional de la méthode appelée est tout simplement ignorée. C'est ce qu'on appelle le problème d'auto-invocation (self-invocation).",
      en: "Spring implements @Transactional using a proxy generated around the bean: when a transactional method is called from outside, the call goes through this proxy, which opens the transaction before delegating to the real method. But when a method calls another transactional method on the same class via this, the call happens directly on the real object, bypassing the proxy, so the @Transactional annotation on the called method is simply ignored. This is known as the self-invocation problem.",
    },
    pitfall: {
      fr: "C'est une question qui piège beaucoup de développeurs expérimentés eux-mêmes, car le code compile et fonctionne en apparence : le bug ne se révèle que quand une erreur survient et que le rollback attendu n'a pas lieu. La solution habituelle est d'extraire la méthode transactionnelle dans un autre bean, ou de s'auto-injecter le proxy.",
      en: "This is a question that trips up many experienced developers themselves, since the code compiles and appears to work: the bug only shows up when an error occurs and the expected rollback doesn't happen. The usual fix is to extract the transactional method into another bean, or to self-inject the proxy.",
    },
    tags: ["transactions", "proxies", "spring-core"],
  },
  {
    id: "spring-security-basics",
    topicId: "spring-boot",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne la chaîne de filtres de Spring Security, dans les grandes lignes ?",
      en: "How does the Spring Security filter chain work, broadly speaking ?",
    },
    answer: {
      fr: "Chaque requête HTTP traverse une chaîne de filtres servlet avant d'atteindre le contrôleur : des filtres dédiés s'occupent successivement de l'authentification (vérifier qui fait la requête, via un token JWT, une session ou du basic auth), puis de l'autorisation (vérifier que cet utilisateur authentifié a le droit d'accéder à la ressource demandée). Le résultat de l'authentification est stocké dans le SecurityContext, généralement lié au thread courant, et c'est ce contexte que les contrôleurs et les vérifications d'autorisation consultent ensuite. Spring Security distingue donc clairement l'authentification, qui répond à qui es-tu, de l'autorisation, qui répond à as-tu le droit.",
      en: "Every HTTP request travels through a chain of servlet filters before reaching the controller: dedicated filters handle authentication first (verifying who is making the request, via a JWT token, a session or basic auth), then authorization (checking that this authenticated user is allowed to access the requested resource). The result of authentication is stored in the SecurityContext, generally bound to the current thread, and that's the context controllers and authorization checks consult afterward. Spring Security therefore clearly separates authentication, which answers who are you, from authorization, which answers are you allowed to.",
    },
    pitfall: {
      fr: "Le piège fréquent est de confondre une erreur 401 (non authentifié) et une erreur 403 (authentifié mais non autorisé) : les deux traversent la même chaîne de filtres mais à des étapes différentes, et un candidat qui les confond révèle une compréhension superficielle du mécanisme.",
      en: "A frequent trap is confusing a 401 error (not authenticated) with a 403 error (authenticated but not authorized): both travel through the same filter chain but at different stages, and a candidate who mixes them up reveals a shallow understanding of the mechanism.",
    },
    tags: ["security", "authentication", "authorization"],
  },
  {
    id: "spring-boot-test-slices",
    topicId: "spring-boot",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre @WebMvcTest, @DataJpaTest et @SpringBootTest ?",
      en: "What is the difference between @WebMvcTest, @DataJpaTest and @SpringBootTest ?",
    },
    answer: {
      fr: "@SpringBootTest charge le contexte Spring complet, avec tous les beans de l'application, ce qui donne le test le plus proche de la réalité mais aussi le plus lent à démarrer. @WebMvcTest ne charge que la couche web : les contrôleurs, les filtres et la configuration MVC, sans les beans de service ou de persistance, qu'il faut alors mocker avec @MockBean. @DataJpaTest se concentre sur la couche de persistance, configure une base embarquée par défaut et fait automatiquement un rollback après chaque test, ce qui en fait un choix rapide et isolé pour tester les repositories.",
      en: "@SpringBootTest loads the full Spring context, with every bean of the application, giving the most realistic test but also the slowest to start. @WebMvcTest only loads the web layer: controllers, filters and MVC configuration, without service or persistence beans, which then need to be mocked with @MockBean. @DataJpaTest focuses on the persistence layer, configures an embedded database by default and automatically rolls back after each test, making it a fast, isolated choice for testing repositories.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser @SpringBootTest par défaut pour tout, y compris des tests unitaires simples, ce qui ralentit énormément la suite de tests : le bon réflexe est de choisir le slice de test le plus étroit possible pour ce qu'on veut réellement vérifier.",
      en: "The trap is defaulting to @SpringBootTest for everything, including simple unit tests, which drastically slows down the test suite: the right instinct is to pick the narrowest test slice that actually covers what you want to verify.",
    },
    tags: ["testing", "spring-boot-test"],
  },
  {
    id: "spring-actuator-purpose",
    topicId: "spring-boot",
    difficulty: "easy",
    question: {
      fr: "À quoi sert Spring Boot Actuator ?",
      en: "What is Spring Boot Actuator for ?",
    },
    answer: {
      fr: "Actuator expose des endpoints prêts à l'emploi pour surveiller et gérer une application en production, comme /actuator/health pour l'état de santé, /actuator/metrics pour des métriques applicatives et JVM, ou /actuator/info pour des informations de build. Il s'intègre naturellement avec des outils de supervision comme Prometheus ou avec les sondes de liveness et readiness d'un orchestrateur comme Kubernetes. Par défaut, seuls quelques endpoints sont exposés publiquement, les autres doivent être activés explicitement dans la configuration.",
      en: "Actuator exposes ready-to-use endpoints for monitoring and managing an application in production, like /actuator/health for health status, /actuator/metrics for application and JVM metrics, or /actuator/info for build information. It integrates naturally with monitoring tools like Prometheus or with the liveness and readiness probes of an orchestrator like Kubernetes. By default, only a few endpoints are publicly exposed, the others need to be explicitly enabled in the configuration.",
    },
    pitfall: {
      fr: "Un piège de sécurité classique est d'exposer tous les endpoints Actuator sans authentification en production, y compris /actuator/env ou /actuator/heapdump, qui peuvent révéler des secrets de configuration ou l'état mémoire complet de l'application.",
      en: "A classic security trap is exposing every Actuator endpoint without authentication in production, including /actuator/env or /actuator/heapdump, which can leak configuration secrets or the full memory state of the application.",
    },
    tags: ["actuator", "monitoring", "production"],
  },
  {
    id: "spring-profiles-configuration",
    topicId: "spring-boot",
    difficulty: "easy",
    question: {
      fr: "Comment fonctionnent les profils Spring, et pourquoi les utiliser ?",
      en: "How do Spring profiles work, and why use them ?",
    },
    answer: {
      fr: "Un profil permet de faire varier la configuration ou les beans actifs selon l'environnement d'exécution, comme dev, test ou prod. On définit un fichier application-{profil}.yml pour chaque environnement, qui vient compléter ou surcharger le fichier application.yml commun, et on active le profil voulu via une variable d'environnement ou un argument au lancement. On peut aussi restreindre un bean entier à un profil donné avec l'annotation @Profile, par exemple pour ne charger un client de test qu'en profil dev.",
      en: "A profile lets you vary configuration or active beans depending on the runtime environment, such as dev, test or prod. You define an application-{profile}.yml file for each environment, which complements or overrides the common application.yml file, and you activate the desired profile through an environment variable or a launch argument. You can also restrict an entire bean to a given profile with the @Profile annotation, for example to only load a test client in the dev profile.",
    },
    pitfall: {
      fr: "Le piège est d'oublier qu'aucun profil actif ne signifie que seul le fichier application.yml par défaut s'applique : un candidat qui suppose qu'un profil de secours s'active toujours automatiquement se trompe si ce n'est pas explicitement configuré.",
      en: "The trap is forgetting that having no active profile means only the default application.yml applies: a candidate who assumes a fallback profile always kicks in automatically is wrong unless that's explicitly configured.",
    },
    tags: ["configuration", "profiles"],
  },
  {
    id: "spring-circular-dependency",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Que se passe-t-il quand deux beans Spring dépendent l'un de l'autre, et comment résoudre le problème ?",
      en: "What happens when two Spring beans depend on each other, and how do you fix it ?",
    },
    answer: {
      fr: "Avec l'injection par constructeur, une dépendance circulaire entre deux beans empêche Spring de terminer la construction de l'un sans avoir déjà terminé l'autre, ce qui provoque une BeanCurrentlyInCreationException au démarrage. Avec l'injection par setter ou par champ, Spring peut parfois s'en sortir en créant d'abord les instances à moitié initialisées puis en résolvant les dépendances ensuite, mais c'est un signe que la conception a un problème. La vraie solution n'est presque jamais une astuce technique comme @Lazy, mais de revoir la conception pour casser le cycle, souvent en extrayant la logique partagée dans un troisième bean dont dépendent les deux premiers.",
      en: "With constructor injection, a circular dependency between two beans prevents Spring from finishing the construction of one without having already finished the other, causing a BeanCurrentlyInCreationException at startup. With setter or field injection, Spring can sometimes work around it by creating half-initialized instances first and resolving dependencies afterward, but that's a sign the design has a problem. The real fix is almost never a technical trick like @Lazy, but rethinking the design to break the cycle, often by extracting the shared logic into a third bean that both original beans depend on.",
    },
    pitfall: {
      fr: "Beaucoup de candidats proposent @Lazy comme solution définitive sans mentionner que ça masque un problème de conception plutôt que de le résoudre, ce qui est un signal que la réponse est apprise par cœur plutôt que comprise.",
      en: "Many candidates suggest @Lazy as the definitive fix without mentioning that it papers over a design problem instead of solving it, which signals a memorized answer rather than real understanding.",
    },
    tags: ["dependency-injection", "architecture", "spring-core"],
  },

  // JPA & Hibernate
  {
    id: "jpa-entity-mapping-basics",
    topicId: "jpa-hibernate",
    difficulty: "easy",
    question: {
      fr: "Quelles sont les annotations de base pour mapper une entité JPA à une table ?",
      en: "What are the basic annotations to map a JPA entity to a table ?",
    },
    answer: {
      fr: "@Entity marque une classe comme entité persistante, et @Table permet de préciser le nom de la table si elle diffère du nom de la classe. @Id désigne le champ qui sert de clé primaire, souvent combiné avec @GeneratedValue pour déléguer la génération de l'identifiant à la base de données ou à une séquence. @Column permet ensuite de personnaliser le mapping d'un champ, par exemple son nom en base, sa nullabilité ou sa longueur maximale, quand la convention par défaut ne convient pas.",
      en: "@Entity marks a class as a persistent entity, and @Table lets you specify the table name when it differs from the class name. @Id designates the field that acts as the primary key, often combined with @GeneratedValue to delegate identifier generation to the database or to a sequence. @Column then lets you customize a field's mapping, for example its column name, nullability or maximum length, when the default convention doesn't fit.",
    },
    pitfall: {
      fr: "Un piège pour les débutants est d'oublier qu'une entité JPA doit avoir un constructeur sans argument, requis par le fournisseur de persistance pour instancier l'objet par réflexion avant de le remplir avec les données lues en base.",
      en: "A beginner trap is forgetting that a JPA entity needs a no-argument constructor, required by the persistence provider to instantiate the object through reflection before filling it with data read from the database.",
    },
    tags: ["entities", "mapping", "annotations"],
  },
  {
    id: "jpa-onetomany-manytomany",
    topicId: "jpa-hibernate",
    difficulty: "medium",
    question: {
      fr: "Comment mapper une relation OneToMany bidirectionnelle correctement, et à quoi sert mappedBy ?",
      en: "How do you correctly map a bidirectional OneToMany relationship, and what is mappedBy for ?",
    },
    answer: {
      fr: "Dans une relation bidirectionnelle, un des deux côtés doit être désigné comme propriétaire de la relation, c'est-à-dire celui qui possède la colonne de clé étrangère en base : c'est généralement le côté ManyToOne. L'autre côté, en général le OneToMany, utilise l'attribut mappedBy pour indiquer qu'il ne fait que refléter la relation déjà définie côté propriétaire, sans créer de colonne ou de table de jointure supplémentaire. Il faut aussi veiller à maintenir la cohérence des deux côtés en mémoire manuellement, par exemple avec des méthodes utilitaires addChild()/removeChild(), car JPA ne synchronise pas automatiquement les deux collections quand on modifie seulement un côté.",
      en: "In a bidirectional relationship, one side must be designated as the owner of the relationship, meaning the one holding the foreign key column in the database: this is generally the ManyToOne side. The other side, usually the OneToMany, uses the mappedBy attribute to indicate it only mirrors the relationship already defined on the owning side, without creating an extra column or join table. You also need to manually keep both in-memory sides consistent, for example with utility methods like addChild()/removeChild(), since JPA doesn't automatically synchronize both collections when only one side is modified.",
    },
    pitfall: {
      fr: "Le piège fréquent est de modifier uniquement la collection côté OneToMany en pensant que ça suffit à persister la relation : comme ce côté n'est pas propriétaire, Hibernate ignore ce changement tant que le côté ManyToOne n'est pas mis à jour.",
      en: "A frequent trap is modifying only the OneToMany collection and assuming that's enough to persist the relationship: since that side isn't the owner, Hibernate ignores that change unless the ManyToOne side is also updated.",
    },
    tags: ["relations", "mapping", "bidirectional"],
  },
  {
    id: "jpa-lazy-vs-eager-loading",
    topicId: "jpa-hibernate",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre le chargement lazy et eager, et quel est le comportement par défaut selon le type de relation ?",
      en: "What is the difference between lazy and eager loading, and what's the default behavior depending on the relationship type ?",
    },
    answer: {
      fr: "En chargement eager, l'entité associée est récupérée immédiatement en même temps que l'entité principale, dans la même requête ou dans une requête supplémentaire déclenchée aussitôt. En chargement lazy, l'entité associée n'est chargée que lorsqu'on y accède réellement dans le code, via un proxy qui déclenche la requête à ce moment-là. Par défaut, JPA charge les relations ToOne (OneToOne, ManyToOne) en eager, et les relations ToMany (OneToMany, ManyToMany) en lazy, mais il est courant et recommandé de forcer explicitement le lazy sur les relations ToOne aussi pour éviter de charger des graphes d'objets trop larges.",
      en: "With eager loading, the associated entity is fetched immediately along with the main entity, either in the same query or in an extra query triggered right away. With lazy loading, the associated entity is only loaded when it's actually accessed in the code, through a proxy that triggers the query at that point. By default, JPA loads ToOne relationships (OneToOne, ManyToOne) eagerly, and ToMany relationships (OneToMany, ManyToMany) lazily, but it's common and recommended to explicitly force lazy loading on ToOne relationships too, to avoid loading overly large object graphs.",
    },
    pitfall: {
      fr: "Le piège classique est d'accéder à une collection lazy après la fermeture de la session Hibernate, par exemple dans la couche de présentation : ça déclenche une LazyInitializationException, car le proxy n'a plus de session active pour aller chercher les données.",
      en: "The classic trap is accessing a lazy collection after the Hibernate session has closed, for example in the presentation layer: that throws a LazyInitializationException, since the proxy no longer has an active session to fetch the data.",
    },
    tags: ["lazy-loading", "performance", "proxies"],
  },
  {
    id: "jpa-n-plus-one-problem",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que le problème N+1 en JPA/Hibernate, et comment le corriger ?",
      en: "What is the N+1 problem in JPA/Hibernate, and how do you fix it ?",
    },
    answer: {
      fr: "Le problème N+1 survient quand une requête initiale récupère N entités, puis qu'Hibernate exécute une requête supplémentaire par entité pour charger une relation lazy associée, soit N requêtes de plus en plus de la requête initiale. Par exemple, charger 50 commandes puis accéder à leurs lignes une par une déclenche 1 requête pour les commandes et 50 requêtes supplémentaires pour les lignes, au lieu d'une seule requête bien construite. On corrige ça en utilisant un JOIN FETCH dans la requête JPQL pour charger la relation en une seule requête, ou une @EntityGraph pour définir explicitement le graphe à charger, ou encore le batch fetching qui regroupe les chargements en quelques requêtes au lieu d'une par entité.",
      en: "The N+1 problem happens when an initial query fetches N entities, and Hibernate then runs one extra query per entity to load an associated lazy relationship, meaning N additional queries on top of the initial one. For example, loading 50 orders and then accessing their lines one by one triggers 1 query for the orders and 50 extra queries for the lines, instead of a single well-built query. You fix it by using a JOIN FETCH in the JPQL query to load the relationship in one query, an @EntityGraph to explicitly define the graph to load, or batch fetching, which groups loads into a few queries instead of one per entity.",
    },
    pitfall: {
      fr: "Le piège en entretien est de savoir citer JOIN FETCH sans expliquer pourquoi le problème existe en premier lieu, ni comment le détecter en pratique, par exemple en activant les logs SQL ou un outil comme p6spy pour repérer un nombre anormal de requêtes.",
      en: "The interview trap is knowing to name JOIN FETCH without explaining why the problem exists in the first place, or how to detect it in practice, for example by enabling SQL logging or a tool like p6spy to spot an abnormal number of queries.",
    },
    tags: ["n-plus-one", "performance", "queries"],
  },
  {
    id: "jpa-first-second-level-cache",
    topicId: "jpa-hibernate",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre le cache de premier niveau et le cache de second niveau dans Hibernate ?",
      en: "What is the difference between first-level cache and second-level cache in Hibernate ?",
    },
    answer: {
      fr: "Le cache de premier niveau est lié à la session Hibernate : à l'intérieur d'une même session, charger deux fois la même entité par son identifiant ne déclenche qu'une seule requête SQL, la deuxième récupération renvoie l'objet déjà en mémoire. Il est activé par défaut et ne peut pas être désactivé. Le cache de second niveau est partagé entre plusieurs sessions, au niveau de la SessionFactory, et doit être explicitement configuré avec un fournisseur externe comme Ehcache ou Caffeine, en marquant les entités concernées avec @Cacheable.",
      en: "First-level cache is tied to the Hibernate session: within the same session, loading the same entity twice by its identifier only triggers one SQL query, the second fetch returns the object already in memory. It's enabled by default and can't be turned off. Second-level cache is shared across multiple sessions, at the SessionFactory level, and must be explicitly configured with an external provider like Ehcache or Caffeine, by marking the relevant entities with @Cacheable.",
    },
    pitfall: {
      fr: "Le piège est de considérer le cache de second niveau comme une solution automatique et sans risque : mal configuré, il peut servir des données périmées à travers plusieurs sessions, en particulier dans une application avec plusieurs instances qui écrivent en base sans invalidation coordonnée du cache.",
      en: "The trap is treating second-level cache as an automatic, risk-free solution: misconfigured, it can serve stale data across multiple sessions, especially in an application with several instances writing to the database without coordinated cache invalidation.",
    },
    tags: ["caching", "performance", "sessions"],
  },
  {
    id: "jpa-entity-lifecycle",
    topicId: "jpa-hibernate",
    difficulty: "medium",
    question: {
      fr: "Quels sont les différents états d'une entité JPA au cours de son cycle de vie ?",
      en: "What are the different states of a JPA entity throughout its lifecycle ?",
    },
    answer: {
      fr: "Une entité passe par quatre états : transient, un simple objet Java créé avec new, pas encore connu du contexte de persistance ; managed, une fois persisté ou chargé, où toute modification de ses champs est automatiquement détectée et synchronisée en base au commit ; detached, quand la session qui la gérait s'est fermée, l'objet existe encore mais ses modifications ne sont plus suivies automatiquement ; et removed, marquée pour suppression, effectivement supprimée en base au commit de la transaction. Comprendre ces états explique pourquoi certaines opérations comme merge() sont nécessaires pour réattacher une entité détachée.",
      en: "An entity goes through four states: transient, a plain Java object created with new, not yet known to the persistence context; managed, once persisted or loaded, where any change to its fields is automatically detected and synced to the database at commit; detached, once the session that managed it has closed, the object still exists but its changes are no longer tracked automatically; and removed, marked for deletion, effectively deleted from the database at transaction commit. Understanding these states explains why operations like merge() are needed to reattach a detached entity.",
    },
    pitfall: {
      fr: "Un piège fréquent est de modifier une entité detached en pensant que ça suffit à la persister : sans appeler merge() explicitement, ou sans être dans une nouvelle transaction qui la recharge, les modifications restent en mémoire et ne sont jamais écrites en base.",
      en: "A frequent trap is modifying a detached entity and assuming that's enough to persist it: without an explicit merge() call, or without a new transaction that reloads it, the changes stay in memory and are never written to the database.",
    },
    tags: ["lifecycle", "entities", "persistence-context"],
  },
  {
    id: "jpa-jpql-vs-criteria-api",
    topicId: "jpa-hibernate",
    difficulty: "medium",
    question: {
      fr: "Quand préférer JPQL à la Criteria API, et inversement ?",
      en: "When should you prefer JPQL over the Criteria API, and vice versa ?",
    },
    answer: {
      fr: "JPQL est un langage de requête textuel proche de SQL mais orienté objet, lisible et rapide à écrire pour des requêtes fixes connues à l'avance, comme celles définies avec @Query dans un repository Spring Data. La Criteria API construit les requêtes de façon programmatique avec des objets Java, ce qui la rend plus verbeuse mais type-safe à la compilation et particulièrement adaptée pour construire dynamiquement une requête dont les critères varient selon les paramètres reçus, comme un filtre de recherche avec plusieurs champs optionnels. En pratique, beaucoup d'équipes utilisent JPQL pour la majorité des cas et réservent la Criteria API, ou une alternative comme les Specifications de Spring Data, aux requêtes vraiment dynamiques.",
      en: "JPQL is a text-based query language close to SQL but object-oriented, readable and quick to write for fixed queries known in advance, like those defined with @Query in a Spring Data repository. The Criteria API builds queries programmatically with Java objects, making it more verbose but type-safe at compile time and particularly well suited for dynamically building a query whose criteria vary based on received parameters, like a search filter with several optional fields. In practice, many teams use JPQL for most cases and reserve the Criteria API, or an alternative like Spring Data Specifications, for genuinely dynamic queries.",
    },
    pitfall: {
      fr: "Le piège est de construire des requêtes JPQL dynamiques par concaténation de chaînes selon des conditions, ce qui ouvre la porte à des injections SQL et devient vite illisible : c'est exactement le cas d'usage que la Criteria API ou les Specifications sont censées éviter.",
      en: "The trap is building dynamic JPQL queries through string concatenation based on conditions, which opens the door to SQL injection and quickly becomes unreadable: that's exactly the use case the Criteria API or Specifications are meant to avoid.",
    },
    tags: ["jpql", "criteria-api", "queries"],
  },
  {
    id: "jpa-optimistic-locking",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre le verrouillage optimiste et le verrouillage pessimiste, et comment @Version fonctionne ?",
      en: "What is the difference between optimistic and pessimistic locking, and how does @Version work ?",
    },
    answer: {
      fr: "Le verrouillage pessimiste bloque la ligne en base dès la lecture, empêchant tout autre transaction de la modifier tant que la première n'a pas terminé, ce qui garantit la cohérence mais peut créer des blocages et nuire à la concurrence sous forte charge. Le verrouillage optimiste part du principe que les conflits sont rares : chaque entité porte un champ annoté @Version, incrémenté à chaque mise à jour, et Hibernate ajoute une condition WHERE version = ancienne_valeur lors de l'UPDATE. Si aucune ligne n'est affectée parce que la version a changé entre-temps, Hibernate lève une OptimisticLockException, signalant qu'une autre transaction a modifié la donnée en parallèle.",
      en: "Pessimistic locking locks the database row as soon as it's read, preventing any other transaction from modifying it until the first one finishes, which guarantees consistency but can create blocking and hurt concurrency under heavy load. Optimistic locking assumes conflicts are rare: every entity carries a field annotated @Version, incremented on every update, and Hibernate adds a WHERE version = old_value condition on the UPDATE. If no row is affected because the version changed in the meantime, Hibernate throws an OptimisticLockException, signaling that another transaction modified the data concurrently.",
    },
    pitfall: {
      fr: "Le piège est de croire que le verrouillage optimiste empêche les conflits : il ne fait que les détecter après coup, c'est à l'application de décider quoi faire de l'OptimisticLockException, par exemple réessayer l'opération ou demander à l'utilisateur de rafraîchir ses données.",
      en: "The trap is assuming optimistic locking prevents conflicts: it only detects them after the fact, and it's up to the application to decide what to do with the OptimisticLockException, for example retrying the operation or asking the user to refresh their data.",
    },
    tags: ["locking", "concurrency", "versioning"],
  },

  // SQL
  {
    id: "sql-inner-vs-left-join",
    topicId: "sql",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre un INNER JOIN et un LEFT JOIN ?",
      en: "What is the difference between an INNER JOIN and a LEFT JOIN ?",
    },
    answer: {
      fr: "Un INNER JOIN ne renvoie que les lignes pour lesquelles il existe une correspondance dans les deux tables jointes : si une ligne de la table de gauche n'a pas de correspondance dans la table de droite, elle est exclue du résultat. Un LEFT JOIN conserve toutes les lignes de la table de gauche, même sans correspondance dans la table de droite, en remplissant les colonnes de droite avec NULL dans ce cas. Le LEFT JOIN est donc utile quand on veut par exemple lister tous les clients, y compris ceux qui n'ont encore jamais passé de commande.",
      en: "An INNER JOIN only returns rows that have a match in both joined tables: if a row in the left table has no match in the right table, it's excluded from the result. A LEFT JOIN keeps every row from the left table, even without a match in the right table, filling the right-side columns with NULL in that case. LEFT JOIN is therefore useful when you want, for example, to list every customer, including those who have never placed an order yet.",
    },
    pitfall: {
      fr: "Le piège classique est d'ajouter une condition sur une colonne de la table de droite dans la clause WHERE plutôt que dans la clause ON d'un LEFT JOIN : ça filtre les lignes après la jointure et transforme silencieusement le LEFT JOIN en comportement équivalent à un INNER JOIN.",
      en: "The classic trap is adding a condition on a right-table column in the WHERE clause instead of the ON clause of a LEFT JOIN: that filters rows after the join and silently turns the LEFT JOIN into behavior equivalent to an INNER JOIN.",
    },
    tags: ["joins", "queries"],
  },
  {
    id: "sql-index-performance",
    topicId: "sql",
    difficulty: "medium",
    question: {
      fr: "Comment un index accélère-t-il une requête, et quand peut-il au contraire nuire aux performances ?",
      en: "How does an index speed up a query, and when can it actually hurt performance ?",
    },
    answer: {
      fr: "Un index est une structure de données, en général un B-tree, construite sur une ou plusieurs colonnes, qui permet à la base de trouver les lignes correspondant à une condition sans parcourir la table entière, un peu comme l'index d'un livre. Il accélère les lectures filtrées, les jointures et les tris sur les colonnes indexées, mais chaque écriture (INSERT, UPDATE, DELETE) doit aussi mettre à jour tous les index concernés, ce qui ralentit les écritures et consomme de l'espace disque supplémentaire. Sur une table à forte volumétrie d'écriture avec beaucoup d'index inutiles, on peut donc dégrader les performances globales plus qu'on ne les améliore.",
      en: "An index is a data structure, generally a B-tree, built on one or more columns, that lets the database find rows matching a condition without scanning the whole table, a bit like a book's index. It speeds up filtered reads, joins and sorts on indexed columns, but every write (INSERT, UPDATE, DELETE) must also update every relevant index, which slows down writes and consumes extra disk space. On a table with heavy write volume and lots of unnecessary indexes, you can therefore degrade overall performance more than you improve it.",
    },
    pitfall: {
      fr: "Le piège est de penser qu'ajouter un index règle systématiquement un problème de lenteur : sans regarder le plan d'exécution, on peut ajouter un index qui n'est jamais utilisé, par exemple parce qu'une fonction est appliquée sur la colonne dans la clause WHERE, ce qui empêche la base de l'exploiter.",
      en: "The trap is assuming adding an index always fixes a slowness problem: without checking the execution plan, you can add an index that's never actually used, for example because a function is applied to the column in the WHERE clause, which prevents the database from using it.",
    },
    tags: ["indexes", "performance"],
  },
  {
    id: "sql-transaction-isolation-levels",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Quels sont les principaux niveaux d'isolation des transactions, et quels problèmes chacun résout-il ?",
      en: "What are the main transaction isolation levels, and what problems does each one solve ?",
    },
    answer: {
      fr: "Read Uncommitted permet de lire des données non validées par une autre transaction (dirty read), c'est le niveau le plus permissif et le moins utilisé en pratique. Read Committed, souvent le défaut, empêche les dirty reads mais permet le non-repeatable read, où relire la même ligne deux fois dans la même transaction peut donner des valeurs différentes si une autre transaction l'a modifiée entre-temps. Repeatable Read empêche aussi ce problème mais laisse subsister le phantom read, où une nouvelle requête avec les mêmes critères peut faire apparaître de nouvelles lignes insérées par une autre transaction. Serializable est le niveau le plus strict, il empêche tous ces problèmes en garantissant un comportement équivalent à une exécution strictement séquentielle des transactions, au prix d'une concurrence réduite.",
      en: "Read Uncommitted allows reading data not yet committed by another transaction (dirty read), it's the most permissive level and the least used in practice. Read Committed, often the default, prevents dirty reads but allows non-repeatable reads, where reading the same row twice in the same transaction can return different values if another transaction modified it in between. Repeatable Read also prevents that but still allows phantom reads, where a new query with the same criteria can surface new rows inserted by another transaction. Serializable is the strictest level, preventing all of these problems by guaranteeing behavior equivalent to a strictly sequential execution of transactions, at the cost of reduced concurrency.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de confondre non-repeatable read et phantom read : le premier concerne une ligne existante dont la valeur change, le second concerne l'apparition de nouvelles lignes, et Repeatable Read ne résout que le premier des deux.",
      en: "The classic interview trap is confusing non-repeatable read with phantom read: the first is about an existing row whose value changes, the second is about new rows appearing, and Repeatable Read only solves the first of the two.",
    },
    tags: ["transactions", "isolation", "concurrency"],
  },
  {
    id: "sql-subquery-vs-join",
    topicId: "sql",
    difficulty: "medium",
    question: {
      fr: "Quand préférer une sous-requête à une jointure, et inversement ?",
      en: "When should you prefer a subquery over a join, and vice versa ?",
    },
    answer: {
      fr: "Une jointure combine les colonnes de plusieurs tables dans un seul jeu de résultats et est en général le choix le plus performant quand on a besoin de données des deux tables en sortie, car l'optimiseur de requêtes peut choisir la meilleure stratégie d'exécution. Une sous-requête est utile quand on n'a besoin de vérifier qu'une condition d'existence ou d'appartenance, par exemple avec EXISTS ou IN, sans avoir besoin d'afficher de colonnes de la table secondaire. En pratique, sur les moteurs modernes, l'optimiseur réécrit souvent une sous-requête EXISTS en jointure en interne, donc la différence de performance est moins marquée qu'avant, mais la lisibilité et l'intention du code restent un critère de choix important.",
      en: "A join combines columns from several tables into a single result set and is generally the most performant choice when you need data from both tables in the output, since the query optimizer can pick the best execution strategy. A subquery is useful when you only need to check an existence or membership condition, for example with EXISTS or IN, without needing to display columns from the secondary table. In practice, on modern engines, the optimizer often internally rewrites an EXISTS subquery into a join, so the performance gap is smaller than it used to be, but readability and the intent of the code remain an important factor in the choice.",
    },
    pitfall: {
      fr: "Un piège fréquent est d'utiliser NOT IN avec une sous-requête qui peut renvoyer des valeurs NULL : si la sous-requête renvoie ne serait-ce qu'une seule ligne NULL, la requête principale ne renvoie plus aucune ligne, un comportement contre-intuitif souvent oublié en entretien.",
      en: "A frequent trap is using NOT IN with a subquery that can return NULL values: if the subquery returns even a single NULL row, the main query returns no rows at all, a counterintuitive behavior often forgotten in interviews.",
    },
    tags: ["subqueries", "joins", "queries"],
  },
  {
    id: "sql-group-by-having",
    topicId: "sql",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre les clauses WHERE et HAVING ?",
      en: "What is the difference between the WHERE and HAVING clauses ?",
    },
    answer: {
      fr: "WHERE filtre les lignes individuelles avant qu'elles soient regroupées par GROUP BY, et ne peut donc pas faire référence à une fonction d'agrégation comme COUNT() ou SUM(). HAVING filtre les groupes après leur constitution par GROUP BY, et sert justement à appliquer une condition sur le résultat d'une agrégation, par exemple ne garder que les clients ayant passé plus de cinq commandes. Dans l'ordre logique d'exécution d'une requête SQL, WHERE agit avant le regroupement et HAVING après.",
      en: "WHERE filters individual rows before they're grouped by GROUP BY, and can't reference an aggregate function like COUNT() or SUM(). HAVING filters groups after they're formed by GROUP BY, and is precisely meant to apply a condition on the result of an aggregation, for example only keeping customers who placed more than five orders. In the logical execution order of a SQL query, WHERE acts before grouping and HAVING after.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser HAVING pour une condition qui pourrait être exprimée avec WHERE : ça marche, mais c'est moins performant, car ça oblige la base à regrouper toutes les lignes avant de filtrer, alors qu'un WHERE aurait réduit le volume de données dès le départ.",
      en: "The trap is using HAVING for a condition that could be expressed with WHERE: it works, but it's less performant, since it forces the database to group all rows before filtering, whereas a WHERE clause would have reduced the data volume from the start.",
    },
    tags: ["group-by", "aggregation", "queries"],
  },
  {
    id: "sql-integrity-constraints",
    topicId: "sql",
    difficulty: "easy",
    question: {
      fr: "Quels sont les principaux types de contraintes d'intégrité en SQL, et à quoi servent-elles ?",
      en: "What are the main types of integrity constraints in SQL, and what are they for ?",
    },
    answer: {
      fr: "La contrainte PRIMARY KEY garantit qu'une colonne, ou combinaison de colonnes, identifie de façon unique chaque ligne et ne peut jamais être NULL. La contrainte FOREIGN KEY garantit qu'une valeur dans une table fait bien référence à une ligne existante dans une autre table, empêchant par exemple de créer une commande liée à un client qui n'existe pas. UNIQUE garantit l'unicité d'une colonne sans en faire la clé primaire, et CHECK impose une règle métier sur les valeurs acceptées, comme un âge qui doit être positif. Ensemble, ces contraintes déplacent une partie de la validation des données au niveau de la base, en garantie de dernier recours même si le code applicatif a un bug.",
      en: "The PRIMARY KEY constraint guarantees that a column, or combination of columns, uniquely identifies each row and can never be NULL. The FOREIGN KEY constraint guarantees that a value in one table actually references an existing row in another table, preventing, for example, creating an order linked to a customer that doesn't exist. UNIQUE guarantees a column's uniqueness without making it the primary key, and CHECK enforces a business rule on accepted values, like an age that must be positive. Together, these constraints move part of data validation to the database level, as a last line of defense even if the application code has a bug.",
    },
    pitfall: {
      fr: "Le piège est de croire que la validation côté application suffit et que les contraintes en base sont redondantes : en réalité, elles protègent contre les accès concurrents, les bugs applicatifs et les scripts d'import direct qui contournent complètement la couche applicative.",
      en: "The trap is assuming application-side validation is enough and database constraints are redundant: in reality, they protect against concurrent access, application bugs and direct import scripts that bypass the application layer entirely.",
    },
    tags: ["constraints", "data-integrity"],
  },
  {
    id: "sql-normalization-basics",
    topicId: "sql",
    difficulty: "medium",
    question: {
      fr: "Que signifient les trois premières formes normales, à un niveau pratique ?",
      en: "What do the first three normal forms mean, at a practical level ?",
    },
    answer: {
      fr: "La première forme normale (1NF) impose que chaque colonne contienne une valeur atomique, sans liste ni structure répétée dans une même cellule, par exemple pas de colonne qui stocke plusieurs numéros de téléphone séparés par des virgules. La deuxième forme normale (2NF) impose, en plus de la 1NF, que chaque colonne non-clé dépende de la totalité de la clé primaire et pas seulement d'une partie, ce qui concerne surtout les tables à clé primaire composite. La troisième forme normale (3NF) impose en plus qu'il n'y ait pas de dépendance transitive, c'est-à-dire qu'une colonne non-clé ne dépende pas d'une autre colonne non-clé plutôt que directement de la clé primaire.",
      en: "The first normal form (1NF) requires every column to hold an atomic value, with no list or repeating structure inside a single cell, for example no column storing several phone numbers separated by commas. The second normal form (2NF) requires, on top of 1NF, that every non-key column depend on the entire primary key and not just part of it, which mostly concerns tables with a composite primary key. The third normal form (3NF) additionally requires no transitive dependency, meaning a non-key column shouldn't depend on another non-key column rather than directly on the primary key.",
    },
    pitfall: {
      fr: "Le piège est de considérer la normalisation comme toujours souhaitable au maximum : en pratique, on dénormalise volontairement certaines tables pour des raisons de performance en lecture, en acceptant une redondance contrôlée plutôt que des jointures coûteuses répétées.",
      en: "The trap is treating normalization as always desirable to the maximum degree: in practice, some tables are deliberately denormalized for read performance reasons, accepting controlled redundancy rather than repeated costly joins.",
    },
    tags: ["normalization", "database-design"],
  },
  {
    id: "sql-window-functions",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Que permettent les fonctions de fenêtrage (window functions) comme ROW_NUMBER() OVER (PARTITION BY ...) ?",
      en: "What do window functions like ROW_NUMBER() OVER (PARTITION BY ...) allow you to do ?",
    },
    answer: {
      fr: "Une fonction de fenêtrage calcule une valeur, comme un rang, une somme cumulée ou une moyenne mobile, sur un ensemble de lignes liées à la ligne courante, sans regrouper ni réduire le nombre de lignes du résultat comme le ferait GROUP BY. La clause PARTITION BY découpe les données en groupes logiques, par exemple par client, et la clause OVER définit la fenêtre sur laquelle le calcul s'applique pour chaque ligne individuellement. C'est particulièrement utile pour des besoins comme classer les commandes par client par ordre de date sans perdre le détail de chaque commande dans le résultat, ce qu'un simple GROUP BY ne permettrait pas de faire en une seule requête.",
      en: "A window function computes a value, like a rank, a running total or a moving average, over a set of rows related to the current row, without grouping or reducing the number of rows in the result the way GROUP BY would. The PARTITION BY clause splits the data into logical groups, for example by customer, and the OVER clause defines the window the calculation applies to for each individual row. This is particularly useful for needs like ranking orders per customer by date without losing the detail of each order in the result, which a plain GROUP BY couldn't achieve in a single query.",
    },
    pitfall: {
      fr: "Le piège est de confondre PARTITION BY avec GROUP BY : PARTITION BY ne réduit jamais le nombre de lignes du résultat, chaque ligne d'origine reste présente avec sa valeur calculée en colonne supplémentaire, contrairement à GROUP BY qui fusionne les lignes d'un même groupe.",
      en: "The trap is confusing PARTITION BY with GROUP BY: PARTITION BY never reduces the number of rows in the result, every original row remains present with its computed value as an extra column, unlike GROUP BY which merges rows of the same group.",
    },
    tags: ["window-functions", "advanced-queries"],
  },

  // Angular
  {
    id: "angular-change-detection-basics",
    topicId: "angular",
    difficulty: "easy",
    question: {
      fr: "Comment fonctionne la détection de changements (change detection) dans Angular, dans les grandes lignes ?",
      en: "How does change detection work in Angular, broadly speaking ?",
    },
    answer: {
      fr: "Angular maintient un arbre de composants, et à chaque cycle de détection de changements, il parcourt cet arbre pour comparer la valeur actuelle des propriétés liées au template avec leur valeur précédente, et met à jour le DOM si une différence est détectée. Historiquement, ce cycle est déclenché par Zone.js, qui intercepte les événements asynchrones du navigateur (clics, timers, requêtes HTTP) pour savoir quand relancer une passe de détection sur toute l'application. Avec les versions récentes d'Angular et les signals, une partie de cette détection devient plus fine et ciblée, sans dépendre uniquement de Zone.js.",
      en: "Angular maintains a tree of components, and on every change detection cycle, it walks that tree to compare the current value of template-bound properties against their previous value, updating the DOM if a difference is detected. Historically, this cycle is triggered by Zone.js, which intercepts the browser's asynchronous events (clicks, timers, HTTP requests) to know when to run a detection pass across the whole application. With recent Angular versions and signals, part of this detection becomes finer-grained and targeted, without relying solely on Zone.js.",
    },
    pitfall: {
      fr: "Le piège est de croire que la détection de changements ne se déclenche que sur une action utilisateur directe : un setTimeout, une promesse résolue ou une réponse HTTP déclenchent tout autant un cycle de détection, ce qui explique certains comportements de performance inattendus.",
      en: "The trap is believing change detection only triggers on a direct user action: a setTimeout, a resolved promise or an HTTP response trigger a detection cycle just as much, which explains some unexpected performance behaviors.",
    },
    tags: ["change-detection", "zone-js"],
  },
  {
    id: "angular-onpush-strategy",
    topicId: "angular",
    difficulty: "medium",
    question: {
      fr: "Que fait la stratégie ChangeDetectionStrategy.OnPush, et quelles conditions doit-on respecter pour qu'elle fonctionne correctement ?",
      en: "What does the ChangeDetectionStrategy.OnPush strategy do, and what conditions must be respected for it to work correctly ?",
    },
    answer: {
      fr: "Avec OnPush, un composant n'est réévalué par la détection de changements que dans des cas précis : une de ses input properties a reçu une nouvelle référence d'objet, un événement s'est déclenché dans le template du composant lui-même, ou un Observable auquel il est abonné via le pipe async a émis une nouvelle valeur. Ça réduit considérablement le nombre de vérifications inutiles dans une grande application, en particulier quand beaucoup de composants n'ont en réalité pas changé à chaque cycle. Pour que ça fonctionne, il faut traiter les données comme immuables : muter un objet ou un tableau en place ne change pas sa référence, donc Angular ne détecte rien, il faut systématiquement créer une nouvelle référence (spread operator, nouvel objet) pour signaler le changement.",
      en: "With OnPush, a component is only re-evaluated by change detection in specific cases: one of its input properties received a new object reference, an event fired inside the component's own template, or an Observable it's subscribed to through the async pipe emitted a new value. This considerably reduces the number of unnecessary checks in a large application, especially when many components haven't actually changed on a given cycle. For it to work, data must be treated as immutable: mutating an object or array in place doesn't change its reference, so Angular detects nothing, you must systematically create a new reference (spread operator, new object) to signal the change.",
    },
    pitfall: {
      fr: "Le piège classique est de continuer à muter directement un objet passé en input avec OnPush activé, par exemple this.item.name = 'x', et de ne pas comprendre pourquoi le template ne se met pas à jour alors que la donnée a bien changé en mémoire.",
      en: "The classic trap is continuing to mutate an input object directly with OnPush enabled, for example this.item.name = 'x', and not understanding why the template doesn't update even though the data did change in memory.",
    },
    tags: ["change-detection", "performance", "onpush"],
  },
  {
    id: "angular-rxjs-observable-vs-promise",
    topicId: "angular",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre un Observable RxJS et une Promise ?",
      en: "What is the difference between an RxJS Observable and a Promise ?",
    },
    answer: {
      fr: "Une Promise représente une seule valeur future, résolue ou rejetée une fois pour toutes, et elle commence à s'exécuter dès sa création, qu'on y souscrive ou non. Un Observable peut émettre zéro, une ou plusieurs valeurs dans le temps, il est paresseux, c'est-à-dire qu'il ne commence à s'exécuter que lorsqu'on s'y abonne avec subscribe(), et il peut être annulé en cours de route via unsubscribe(). RxJS fournit aussi tout un écosystème d'opérateurs (map, filter, switchMap, debounceTime...) pour composer et transformer des flux de données, ce qui rend les Observables beaucoup plus adaptés que les Promises pour modéliser des événements répétés comme la saisie utilisateur ou un flux WebSocket.",
      en: "A Promise represents a single future value, resolved or rejected once and for all, and it starts executing as soon as it's created, whether or not something subscribes to it. An Observable can emit zero, one or multiple values over time, it's lazy, meaning it only starts executing once you subscribe to it with subscribe(), and it can be cancelled midway through via unsubscribe(). RxJS also provides a whole ecosystem of operators (map, filter, switchMap, debounceTime...) to compose and transform data streams, which makes Observables much better suited than Promises for modeling repeated events like user input or a WebSocket stream.",
    },
    pitfall: {
      fr: "Un piège fréquent est de croire qu'un Observable se comporte comme une Promise et s'exécute dès sa déclaration : tant qu'on ne l'a pas explicitement souscrit, ou utilisé le pipe async dans le template, rien ne se passe, la requête HTTP par exemple ne part jamais.",
      en: "A frequent trap is assuming an Observable behaves like a Promise and executes as soon as it's declared: until it's explicitly subscribed to, or used with the async pipe in the template, nothing happens, the HTTP request for instance never fires.",
    },
    tags: ["rxjs", "observables", "async"],
  },
  {
    id: "angular-dependency-injection-hierarchy",
    topicId: "angular",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre providedIn: 'root' et fournir un service au niveau d'un composant ?",
      en: "What is the difference between providedIn: 'root' and providing a service at the component level ?",
    },
    answer: {
      fr: "Avec providedIn: 'root', Angular crée une seule instance du service partagée par toute l'application, injectée dans l'injecteur racine, et le service est disponible partout sans configuration supplémentaire. Déclarer le service dans le tableau providers d'un composant crée une nouvelle instance propre à ce composant et à ses descendants, isolée du reste de l'application, ce qui est utile pour un état qui ne doit exister que pendant la durée de vie de ce composant, par exemple un formulaire multi-étapes. L'injection de dépendances Angular suit une hiérarchie d'injecteurs qui reflète l'arbre des composants, et une demande d'injection remonte cette hiérarchie jusqu'à trouver un provider disponible.",
      en: "With providedIn: 'root', Angular creates a single instance of the service shared across the whole application, injected in the root injector, and the service is available everywhere with no extra configuration. Declaring the service in a component's providers array creates a new instance specific to that component and its descendants, isolated from the rest of the application, which is useful for state that should only exist for the lifetime of that component, for example a multi-step form. Angular dependency injection follows a hierarchy of injectors that mirrors the component tree, and an injection request walks up that hierarchy until it finds an available provider.",
    },
    pitfall: {
      fr: "Le piège est de déclarer un service dans les providers d'un composant réutilisé plusieurs fois dans la même vue sans réaliser que chaque instance du composant obtient sa propre instance du service, ce qui casse le partage d'état qu'on pensait avoir avec un simple singleton global.",
      en: "The trap is declaring a service in the providers of a component used multiple times in the same view without realizing each component instance gets its own service instance, which breaks the shared state you thought you had with a simple global singleton.",
    },
    tags: ["dependency-injection", "services", "providers"],
  },
  {
    id: "angular-component-lifecycle-hooks",
    topicId: "angular",
    difficulty: "easy",
    question: {
      fr: "À quoi servent ngOnInit, ngOnChanges et ngOnDestroy, et dans quel ordre s'exécutent-ils ?",
      en: "What are ngOnInit, ngOnChanges and ngOnDestroy for, and in what order do they run ?",
    },
    answer: {
      fr: "ngOnChanges s'exécute en premier, avant ngOnInit, à chaque fois qu'une input property change de valeur, y compris lors de l'initialisation, et reçoit un objet SimpleChanges décrivant l'ancienne et la nouvelle valeur. ngOnInit s'exécute une seule fois, juste après le premier ngOnChanges, et c'est l'endroit recommandé pour initialiser le composant, par exemple lancer un appel HTTP initial, plutôt que dans le constructeur qui ne devrait servir qu'à l'injection de dépendances. ngOnDestroy s'exécute juste avant que le composant soit retiré du DOM, et c'est l'endroit où on doit nettoyer les abonnements manuels, les timers ou les écouteurs d'événements pour éviter les fuites mémoire.",
      en: "ngOnChanges runs first, before ngOnInit, every time an input property's value changes, including during initialization, and receives a SimpleChanges object describing the old and new value. ngOnInit runs only once, right after the first ngOnChanges, and it's the recommended place to initialize the component, for example firing an initial HTTP call, rather than in the constructor which should only be used for dependency injection. ngOnDestroy runs right before the component is removed from the DOM, and it's where manual subscriptions, timers or event listeners should be cleaned up to avoid memory leaks.",
    },
    pitfall: {
      fr: "Le piège est de mettre de la logique métier lourde dans le constructeur plutôt que dans ngOnInit : à ce stade, les input properties ne sont pas encore garanties d'être définies, ce qui peut provoquer des erreurs difficiles à déboguer.",
      en: "The trap is putting heavy business logic in the constructor instead of ngOnInit: at that stage, input properties aren't guaranteed to be set yet, which can cause hard-to-debug errors.",
    },
    tags: ["lifecycle", "hooks", "components"],
  },
  {
    id: "angular-reactive-vs-template-forms",
    topicId: "angular",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre les formulaires réactifs (Reactive Forms) et les formulaires pilotés par le template (Template-driven Forms) ?",
      en: "What is the difference between Reactive Forms and Template-driven Forms ?",
    },
    answer: {
      fr: "Avec les Reactive Forms, la structure du formulaire (FormGroup, FormControl, validateurs) est définie explicitement dans le code TypeScript du composant, ce qui rend le formulaire facilement testable unitairement, prévisible, et adapté aux formulaires complexes avec une logique de validation avancée ou des champs dynamiques. Avec les Template-driven Forms, la structure est définie implicitement dans le template HTML via des directives comme ngModel, ce qui est plus rapide à écrire pour des formulaires simples mais plus difficile à tester et moins flexible pour des cas complexes. En pratique, les Reactive Forms sont généralement recommandées dans une application de taille moyenne à grande, dès que le formulaire a plus qu'une poignée de champs simples.",
      en: "With Reactive Forms, the form structure (FormGroup, FormControl, validators) is explicitly defined in the component's TypeScript code, which makes the form easily unit-testable, predictable, and well suited for complex forms with advanced validation logic or dynamic fields. With Template-driven Forms, the structure is implicitly defined in the HTML template through directives like ngModel, which is quicker to write for simple forms but harder to test and less flexible for complex cases. In practice, Reactive Forms are generally recommended in a medium to large application, as soon as the form has more than a handful of simple fields.",
    },
    pitfall: {
      fr: "Le piège est de mélanger les deux approches dans le même formulaire, par exemple utiliser ngModel sur un champ à l'intérieur d'un formGroup géré en Reactive Forms, ce qui crée des comportements incohérents et rarement voulus entre les deux sources de vérité.",
      en: "The trap is mixing both approaches in the same form, for example using ngModel on a field inside a formGroup managed with Reactive Forms, which creates inconsistent and rarely intended behavior between the two sources of truth.",
    },
    tags: ["forms", "reactive-forms", "validation"],
  },
  {
    id: "angular-router-guards",
    topicId: "angular",
    difficulty: "medium",
    question: {
      fr: "À quoi servent les guards de routage comme CanActivate, et comment fonctionnent-ils ?",
      en: "What are routing guards like CanActivate for, and how do they work ?",
    },
    answer: {
      fr: "Un guard est une fonction, ou historiquement une classe, associée à une route, qui détermine si la navigation vers cette route doit être autorisée, redirigée ou bloquée. CanActivate s'exécute avant d'entrer sur une route, typiquement pour vérifier qu'un utilisateur est authentifié avant d'accéder à une page protégée, et renvoie un booléen, une redirection, ou un Observable/Promise résolvant vers l'un de ces cas. CanDeactivate s'exécute au moment de quitter une route, ce qui est utile pour demander confirmation avant de quitter un formulaire avec des modifications non enregistrées.",
      en: "A guard is a function, or historically a class, associated with a route, which determines whether navigation to that route should be allowed, redirected or blocked. CanActivate runs before entering a route, typically to check that a user is authenticated before accessing a protected page, and returns a boolean, a redirect, or an Observable/Promise resolving to one of those. CanDeactivate runs when leaving a route, which is useful for asking for confirmation before leaving a form with unsaved changes.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'un guard côté client suffit à sécuriser une page : c'est une protection d'expérience utilisateur, pas une mesure de sécurité, puisqu'un utilisateur peut toujours appeler directement l'API sous-jacente, la vraie sécurité doit être appliquée côté serveur.",
      en: "The trap is believing a client-side guard is enough to secure a page: it's a user experience protection, not a security measure, since a user can always call the underlying API directly, real security must be enforced server-side.",
    },
    tags: ["routing", "guards", "navigation"],
  },
  {
    id: "angular-signals-basics",
    topicId: "angular",
    difficulty: "medium",
    question: {
      fr: "Que sont les signals en Angular, et en quoi changent-ils la gestion d'état par rapport à RxJS ?",
      en: "What are signals in Angular, and how do they change state management compared to RxJS ?",
    },
    answer: {
      fr: "Un signal est un conteneur de valeur réactif : on le lit en l'appelant comme une fonction, signal(), et on le met à jour avec set() ou update(), et Angular sait automatiquement quels endroits du template ou quels calculs dépendent de ce signal pour ne recalculer que ce qui est nécessaire. computed() crée un signal dérivé qui se recalcule automatiquement quand un de ses signals sources change, et effect() permet d'exécuter du code en réaction à un changement de signal, par exemple pour synchroniser avec une API externe. Contrairement à un Observable RxJS, un signal a toujours une valeur courante accessible de façon synchrone, pas besoin de s'abonner pour la lire, ce qui simplifie beaucoup de cas d'usage de gestion d'état local par rapport à RxJS.",
      en: "A signal is a reactive value container: you read it by calling it like a function, signal(), and update it with set() or update(), and Angular automatically knows which parts of the template or which computations depend on that signal so it only recomputes what's necessary. computed() creates a derived signal that automatically recalculates when one of its source signals changes, and effect() lets you run code in reaction to a signal change, for example to sync with an external API. Unlike an RxJS Observable, a signal always has a current value accessible synchronously, no need to subscribe to read it, which simplifies many local state management use cases compared to RxJS.",
    },
    pitfall: {
      fr: "Le piège est de croire que les signals remplacent entièrement RxJS : les signals sont excellents pour de l'état synchrone local, mais RxJS reste plus adapté pour composer des flux asynchrones complexes, comme des requêtes HTTP enchaînées ou du debounce sur une saisie utilisateur, Angular fournit d'ailleurs des fonctions d'interopérabilité entre les deux.",
      en: "The trap is assuming signals fully replace RxJS: signals are excellent for local synchronous state, but RxJS remains better suited for composing complex asynchronous flows, like chained HTTP requests or debouncing user input, Angular actually provides interop functions between the two.",
    },
    tags: ["signals", "state-management", "reactivity"],
  },
  {
    id: "angular-standalone-components",
    topicId: "angular",
    difficulty: "easy",
    question: {
      fr: "Que sont les composants standalone, et pourquoi Angular s'oriente-t-il vers cette approche ?",
      en: "What are standalone components, and why is Angular moving toward this approach ?",
    },
    answer: {
      fr: "Un composant standalone déclare directement ses propres dépendances, comme les autres composants, directives ou pipes qu'il utilise, via la propriété imports, sans avoir besoin d'être déclaré dans un NgModule. Ça simplifie la structure d'une application, réduit le code de configuration nécessaire, et rend les dépendances de chaque composant plus explicites et locales plutôt que dispersées dans des modules parfois difficiles à suivre. Depuis Angular 17, standalone est devenu le comportement par défaut pour les nouveaux composants générés par le CLI, même si les NgModules restent supportés pour les applications existantes.",
      en: "A standalone component directly declares its own dependencies, like the other components, directives or pipes it uses, through the imports property, without needing to be declared in an NgModule. This simplifies an application's structure, reduces the necessary configuration code, and makes each component's dependencies more explicit and local rather than scattered across modules that can be hard to follow. Since Angular 17, standalone has become the default behavior for new components generated by the CLI, even though NgModules remain supported for existing applications.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'une application standalone n'a plus du tout besoin de bootstrap explicite : il faut toujours démarrer l'application avec bootstrapApplication() en fournissant la configuration globale, comme les providers du routeur, qui remplace l'ancien AppModule.",
      en: "The trap is assuming a standalone application no longer needs any explicit bootstrap: you still need to start the application with bootstrapApplication(), providing the global configuration, like the router providers, which replaces the old AppModule.",
    },
    tags: ["standalone", "components", "modules"],
  },
  {
    id: "angular-memory-leaks-subscriptions",
    topicId: "angular",
    difficulty: "hard",
    question: {
      fr: "Comment des abonnements RxJS non nettoyés peuvent-ils provoquer une fuite mémoire dans une application Angular, et comment l'éviter ?",
      en: "How can uncleaned RxJS subscriptions cause a memory leak in an Angular application, and how do you avoid it ?",
    },
    answer: {
      fr: "Quand un composant s'abonne manuellement à un Observable avec subscribe() et que ce composant est détruit sans que l'abonnement soit explicitement annulé, l'Observable continue d'exister et de retenir une référence vers le composant détruit tant que la source continue d'émettre, ce qui empêche le garbage collector de libérer sa mémoire et peut, si le composant modifie encore l'état ou le DOM, provoquer des erreurs après destruction. Le pipe async dans le template gère automatiquement l'abonnement et le désabonnement selon le cycle de vie du composant, c'est donc l'approche la plus sûre par défaut. Quand un abonnement manuel est vraiment nécessaire, les approches courantes sont de stocker la Subscription et d'appeler unsubscribe() dans ngOnDestroy, ou d'utiliser l'opérateur takeUntilDestroyed() introduit dans les versions récentes d'Angular.",
      en: "When a component manually subscribes to an Observable with subscribe() and that component is destroyed without explicitly cancelling the subscription, the Observable keeps existing and holding a reference to the destroyed component as long as the source keeps emitting, which prevents the garbage collector from freeing its memory and can, if the component still modifies state or the DOM, cause errors after destruction. The async pipe in the template automatically handles subscribing and unsubscribing based on the component's lifecycle, making it the safest default approach. When a manual subscription is genuinely needed, common approaches are storing the Subscription and calling unsubscribe() in ngOnDestroy, or using the takeUntilDestroyed() operator introduced in recent Angular versions.",
    },
    pitfall: {
      fr: "Le piège en entretien est de citer takeUntil(this.destroy$) comme unique bonne pratique sans mentionner le pipe async, qui reste la solution la plus simple et la moins sujette à l'erreur dès que c'est possible, la gestion manuelle devant rester l'exception plutôt que la règle.",
      en: "The interview trap is citing takeUntil(this.destroy$) as the one true best practice without mentioning the async pipe, which remains the simplest and least error-prone solution whenever possible, manual management should stay the exception rather than the rule.",
    },
    tags: ["memory-leaks", "rxjs", "subscriptions"],
  },

  // Claude & LLM
  {
    id: "claude-prompt-engineering-basics",
    topicId: "claude",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre un system prompt et un message utilisateur, et pourquoi cette distinction compte ?",
      en: "What is the difference between a system prompt and a user message, and why does that distinction matter ?",
    },
    answer: {
      fr: "Le system prompt définit le cadre général de la conversation : le rôle du modèle, le ton attendu, les règles à respecter, et il reste stable sur toute la session. Les messages utilisateur, eux, portent la demande concrète à chaque tour d'échange et peuvent varier librement. Séparer les deux permet de fixer un comportement cohérent et difficile à contourner par l'utilisateur final, plutôt que de tout mélanger dans un seul prompt où les instructions système et la demande de l'utilisateur ont le même poids.",
      en: "The system prompt sets the overall frame of the conversation: the model's role, the expected tone, the rules to follow, and it stays stable across the whole session. User messages carry the concrete request at each turn and can vary freely. Separating the two lets you fix a consistent behavior that's harder for the end user to override, rather than mixing everything into a single prompt where system instructions and the user's request carry the same weight.",
    },
    pitfall: {
      fr: "Le piège est de croire que le system prompt rend l'application totalement à l'abri des tentatives de contournement : c'est une couche de cadrage forte, pas une garantie absolue, d'où l'intérêt de valider aussi les sorties du modèle côté application pour les cas sensibles.",
      en: "The trap is believing the system prompt makes the application completely immune to override attempts: it's a strong framing layer, not an absolute guarantee, which is why validating the model's output on the application side still matters for sensitive cases.",
    },
    tags: ["prompting", "system-prompt", "llm-basics"],
  },
  {
    id: "claude-context-window-management",
    topicId: "claude",
    difficulty: "medium",
    question: {
      fr: "Comment gérer une conversation qui dépasse la fenêtre de contexte d'un modèle comme Claude ?",
      en: "How do you handle a conversation that exceeds a model's context window, like Claude's ?",
    },
    answer: {
      fr: "La fenêtre de contexte est la quantité maximale de tokens, entrée et sortie confondues, que le modèle peut traiter en une seule requête. Quand une conversation longue approche cette limite, les stratégies courantes sont de résumer les échanges les plus anciens en un condensé plus court, de ne garder que les derniers tours pertinents, ou d'externaliser l'information importante dans une mémoire structurée récupérée à la demande plutôt que de tout garder dans le fil de discussion. Le choix dépend du cas d'usage : un résumé perd du détail, une troncature brute peut perdre du contexte important si mal placée.",
      en: "The context window is the maximum amount of tokens, input and output combined, that the model can process in a single request. When a long conversation approaches that limit, common strategies are summarizing the oldest exchanges into a shorter digest, keeping only the most recent relevant turns, or externalizing important information into a structured memory retrieved on demand rather than keeping everything in the conversation thread. The choice depends on the use case: a summary loses detail, raw truncation can lose important context if done carelessly.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer le coût et la latence d'une fenêtre de contexte très large utilisée systématiquement à son maximum : plus de tokens envoyés à chaque appel, c'est plus cher et plus lent, la bonne gestion du contexte est aussi un sujet de performance et de coût, pas seulement de capacité technique.",
      en: "The trap is underestimating the cost and latency of a very large context window used at its maximum on every call: more tokens sent per call means more expensive and slower requests, good context management is also a performance and cost concern, not just a technical capacity question.",
    },
    tags: ["context-window", "conversation-management", "performance"],
  },
  {
    id: "claude-tool-use-function-calling",
    topicId: "claude",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne le tool use (function calling) avec un modèle comme Claude ?",
      en: "How does tool use (function calling) work with a model like Claude ?",
    },
    answer: {
      fr: "On décrit à l'API les outils disponibles, chacun avec un nom, une description et un schéma des paramètres attendus, en général au format JSON Schema. Le modèle ne peut pas exécuter le code lui-même : quand il juge qu'un outil est nécessaire, il renvoie une réponse structurée indiquant quel outil appeler et avec quels arguments, à charge pour l'application d'exécuter réellement cet appel et de renvoyer le résultat au modèle dans un tour suivant. Le modèle peut alors continuer son raisonnement avec cette nouvelle information, éventuellement en enchaînant plusieurs appels d'outils avant de produire une réponse finale.",
      en: "You describe the available tools to the API, each with a name, a description and a schema of the expected parameters, typically in JSON Schema format. The model can't execute code itself: when it decides a tool is needed, it returns a structured response indicating which tool to call and with what arguments, and it's up to the application to actually execute that call and feed the result back to the model on a following turn. The model can then continue reasoning with this new information, possibly chaining several tool calls before producing a final answer.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que le modèle ne fait que proposer l'appel : c'est le code applicatif qui reste responsable de valider les arguments reçus avant de les exécuter, en particulier si un outil touche à des données sensibles ou déclenche une action irréversible.",
      en: "The trap is forgetting that the model only proposes the call: it's the application code that remains responsible for validating the received arguments before executing them, especially if a tool touches sensitive data or triggers an irreversible action.",
    },
    tags: ["tool-use", "function-calling", "agents"],
  },
  {
    id: "claude-hallucination-mitigation",
    topicId: "claude",
    difficulty: "medium",
    question: {
      fr: "Qu'est-ce qu'une hallucination chez un LLM, et comment en réduire le risque en pratique ?",
      en: "What is a hallucination in an LLM, and how do you reduce its risk in practice ?",
    },
    answer: {
      fr: "Une hallucination est une réponse produite avec assurance par le modèle mais factuellement fausse ou inventée, parce que le modèle génère le texte le plus statistiquement plausible plutôt que de vérifier des faits contre une source. On réduit ce risque en donnant au modèle le contexte factuel nécessaire directement dans le prompt plutôt que de compter sur sa mémoire interne, en lui demandant de citer ses sources ou de dire explicitement quand il ne sait pas, et en validant les réponses critiques par un mécanisme externe, comme une vérification contre une base de données, avant de les utiliser telles quelles.",
      en: "A hallucination is a response the model produces confidently but which is factually wrong or made up, because the model generates the most statistically plausible text rather than checking facts against a source. This risk is reduced by giving the model the necessary factual context directly in the prompt rather than relying on its internal memory, asking it to cite its sources or explicitly say when it doesn't know, and validating critical answers through an external mechanism, like a database check, before using them as-is.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'un prompt bien écrit élimine totalement le risque d'hallucination : c'est une caractéristique structurelle du fonctionnement des LLM, à traiter comme un risque à gérer et à mesurer plutôt qu'un bug ponctuel à corriger définitivement.",
      en: "The trap is believing a well-written prompt eliminates the hallucination risk entirely: it's a structural characteristic of how LLMs work, to be treated as a risk to manage and measure rather than a one-off bug to permanently fix.",
    },
    tags: ["hallucination", "reliability", "grounding"],
  },
  {
    id: "claude-rag-vs-fine-tuning",
    topicId: "claude",
    difficulty: "medium",
    question: {
      fr: "Quand choisir le RAG (retrieval-augmented generation) plutôt que le fine-tuning pour adapter un LLM à un domaine métier ?",
      en: "When should you choose RAG (retrieval-augmented generation) over fine-tuning to adapt an LLM to a business domain ?",
    },
    answer: {
      fr: "Le RAG consiste à récupérer des documents pertinents dans une base externe au moment de la requête et à les injecter dans le prompt, ce qui permet au modèle de répondre avec une information à jour sans jamais réentraîner ses poids. Le fine-tuning modifie les poids du modèle sur un corpus d'exemples pour lui apprendre un style, un format de sortie ou des comportements spécifiques, mais son savoir factuel reste figé à la date du réglage et ne se met pas à jour automatiquement. En pratique, le RAG est le bon choix pour une base de connaissances qui évolue souvent, comme une documentation produit, tandis que le fine-tuning convient mieux pour imposer un format ou un style constant.",
      en: "RAG retrieves relevant documents from an external store at query time and injects them into the prompt, letting the model answer with up-to-date information without ever retraining its weights. Fine-tuning adjusts the model's weights on a corpus of examples to teach it a style, an output format or specific behaviors, but its factual knowledge stays frozen at the tuning date and doesn't update automatically. In practice, RAG is the right choice for a knowledge base that changes often, like product documentation, while fine-tuning fits better for enforcing a consistent format or style.",
    },
    pitfall: {
      fr: "Le piège est de présenter RAG et fine-tuning comme mutuellement exclusifs : les deux répondent à des besoins différents et complémentaires, et une application mature peut très bien combiner un modèle affiné pour le style avec du RAG pour les faits à jour.",
      en: "The trap is presenting RAG and fine-tuning as mutually exclusive: they address different, complementary needs, and a mature application can very well combine a model fine-tuned for style with RAG for up-to-date facts.",
    },
    tags: ["rag", "fine-tuning", "architecture"],
  },
  {
    id: "claude-prompt-injection-security",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce qu'une injection de prompt, et comment s'en protéger dans une application qui traite du contenu externe avec un LLM ?",
      en: "What is a prompt injection, and how do you defend against it in an application that processes external content with an LLM ?",
    },
    answer: {
      fr: "Une injection de prompt consiste à glisser des instructions malveillantes dans du contenu que le modèle va lire, comme un email, une page web ou un document, dans l'espoir que le modèle les exécute comme si elles venaient de l'utilisateur légitime ou du system prompt. Les défenses principales sont de traiter tout contenu externe comme de la donnée et jamais comme des instructions, de limiter strictement les capacités des outils accessibles au modèle quand il traite du contenu non fiable, et de demander une confirmation explicite avant toute action sensible ou irréversible plutôt que de laisser l'agent agir seul.",
      en: "A prompt injection consists of slipping malicious instructions into content the model will read, like an email, a web page or a document, hoping the model will execute them as if they came from the legitimate user or the system prompt. The main defenses are treating any external content as data and never as instructions, strictly limiting the tools available to the model when it processes untrusted content, and requiring explicit confirmation before any sensitive or irreversible action rather than letting the agent act alone.",
    },
    pitfall: {
      fr: "Le piège en entretien est de proposer uniquement un meilleur system prompt comme défense : c'est utile mais insuffisant seul, un attaquant qui contrôle le contenu lu par le modèle peut souvent contourner des instructions purement textuelles, la vraie protection vient des limites imposées au niveau applicatif sur ce que l'agent peut réellement faire.",
      en: "The interview trap is proposing only a better system prompt as the defense: it helps but isn't enough on its own, an attacker who controls the content the model reads can often work around purely textual instructions, the real protection comes from application-level limits on what the agent can actually do.",
    },
    tags: ["prompt-injection", "security", "agents"],
  },
  {
    id: "claude-streaming-responses",
    topicId: "claude",
    difficulty: "easy",
    question: {
      fr: "Pourquoi utiliser le streaming pour les réponses d'un LLM plutôt que d'attendre la réponse complète ?",
      en: "Why use streaming for an LLM's responses instead of waiting for the complete response ?",
    },
    answer: {
      fr: "Le streaming renvoie la réponse token par token au fur et à mesure qu'elle est générée, plutôt que d'attendre que le modèle ait fini de produire l'intégralité du texte avant de renvoyer quoi que ce soit. Pour l'utilisateur, ça réduit drastiquement la latence perçue : il voit le texte apparaître en quelques centaines de millisecondes au lieu d'attendre plusieurs secondes pour une réponse longue. C'est particulièrement important pour une interface conversationnelle, où l'absence de retour visuel pendant plusieurs secondes donne l'impression que l'application est bloquée ou en panne.",
      en: "Streaming returns the response token by token as it's generated, rather than waiting for the model to finish producing the entire text before returning anything. For the user, this drastically reduces perceived latency: they see text appearing within a few hundred milliseconds instead of waiting several seconds for a long response. This matters especially for a conversational interface, where no visual feedback for several seconds makes the application feel stuck or broken.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que le streaming complique la gestion d'erreur côté application : si la connexion tombe à mi-génération, il faut décider comment gérer une réponse partielle, ce qui est plus simple à ignorer avec un appel bloquant classique qui échoue ou réussit d'un bloc.",
      en: "The trap is forgetting that streaming complicates error handling on the application side: if the connection drops mid-generation, you need to decide how to handle a partial response, which is easier to ignore with a classic blocking call that fails or succeeds as a whole.",
    },
    tags: ["streaming", "latency", "user-experience"],
  },
  {
    id: "claude-agentic-workflows",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce qui distingue un workflow agentique d'un simple appel de prompt unique à un LLM ?",
      en: "What distinguishes an agentic workflow from a single simple LLM prompt call ?",
    },
    answer: {
      fr: "Un appel de prompt unique envoie une requête et récupère une réponse en une seule étape. Un workflow agentique fait tourner le modèle dans une boucle : il observe un état, décide d'une action, en général un appel d'outil, observe le résultat de cette action, puis décide de l'étape suivante, jusqu'à atteindre un objectif ou une condition d'arrêt. Cette boucle permet de résoudre des tâches en plusieurs étapes qu'un seul appel ne pourrait pas traiter, comme rechercher une information, l'utiliser pour affiner une recherche suivante, puis produire un résultat final à partir de plusieurs sources.",
      en: "A single prompt call sends a request and gets a response in one step. An agentic workflow runs the model in a loop: it observes a state, decides on an action, generally a tool call, observes the result of that action, then decides on the next step, until it reaches a goal or a stopping condition. This loop makes it possible to solve multi-step tasks that a single call couldn't handle, like searching for information, using it to refine a follow-up search, then producing a final result from multiple sources.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer le besoin de garde-fous dans une boucle agentique : sans limite claire sur le nombre d'itérations, le coût cumulé, ou les actions autorisées sans confirmation, un agent peut boucler indéfiniment ou enchaîner des actions coûteuses ou risquées sans supervision humaine.",
      en: "The trap is underestimating the need for guardrails in an agentic loop: without a clear limit on the number of iterations, cumulative cost, or actions allowed without confirmation, an agent can loop indefinitely or chain costly or risky actions without human oversight.",
    },
    tags: ["agents", "workflows", "orchestration"],
  },

  // Kubernetes
  {
    id: "k8s-pod-vs-container",
    topicId: "kubernetes",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre un Pod et un conteneur dans Kubernetes ?",
      en: "What is the difference between a Pod and a container in Kubernetes ?",
    },
    answer: {
      fr: "Un conteneur est l'unité d'exécution isolée qui fait tourner une seule application, avec ses propres dépendances, au sens Docker classique. Un Pod est la plus petite unité déployable dans Kubernetes, et il peut contenir un ou plusieurs conteneurs qui partagent le même réseau, la même adresse IP et éventuellement des volumes, et qui sont toujours planifiés ensemble sur le même nœud. Le cas le plus courant est un Pod avec un seul conteneur applicatif, mais on utilise plusieurs conteneurs dans un même Pod pour des besoins précis, comme un sidecar qui gère les logs ou le proxy réseau.",
      en: "A container is the isolated execution unit that runs a single application, with its own dependencies, in the classic Docker sense. A Pod is the smallest deployable unit in Kubernetes, and it can contain one or more containers that share the same network, the same IP address and possibly volumes, and that are always scheduled together on the same node. The most common case is a Pod with a single application container, but multiple containers in one Pod are used for specific needs, like a sidecar handling logging or the network proxy.",
    },
    pitfall: {
      fr: "Le piège est de croire que chaque conteneur d'un Pod multi-conteneurs a sa propre adresse IP : ils partagent tous la même adresse réseau du Pod et communiquent entre eux via localhost, ce qui a des implications directes sur la gestion des ports.",
      en: "The trap is believing each container in a multi-container Pod has its own IP address: they all share the Pod's single network address and communicate with each other via localhost, which has direct implications for port management.",
    },
    tags: ["pods", "containers", "basics"],
  },
  {
    id: "k8s-deployment-vs-statefulset",
    topicId: "kubernetes",
    difficulty: "medium",
    question: {
      fr: "Quand utiliser un StatefulSet plutôt qu'un Deployment ?",
      en: "When should you use a StatefulSet instead of a Deployment ?",
    },
    answer: {
      fr: "Un Deployment gère des Pods interchangeables et sans état : chaque réplique est identique, peut être recréée dans n'importe quel ordre, et reçoit un nom généré aléatoirement à chaque recréation. Un StatefulSet garantit une identité stable pour chaque Pod, avec un nom prévisible et numéroté, un volume de stockage persistant qui lui est propre et qui le suit même après un redémarrage, et un ordre de création et de suppression garanti. C'est le bon choix pour des applications avec état qui ont besoin d'une identité réseau stable ou d'un stockage dédié par instance, comme une base de données répliquée.",
      en: "A Deployment manages interchangeable, stateless Pods: each replica is identical, can be recreated in any order, and gets a randomly generated name on each recreation. A StatefulSet guarantees a stable identity for each Pod, with a predictable, numbered name, its own persistent storage volume that follows it even after a restart, and a guaranteed creation and deletion order. It's the right choice for stateful applications that need a stable network identity or dedicated per-instance storage, like a replicated database.",
    },
    pitfall: {
      fr: "Le piège est de déployer une base de données avec un simple Deployment et un volume partagé entre répliques : sans l'identité stable et le stockage dédié d'un StatefulSet, les instances peuvent se marcher dessus ou perdre leurs données lors d'un redémarrage.",
      en: "The trap is deploying a database with a plain Deployment and a shared volume across replicas: without a StatefulSet's stable identity and dedicated storage, instances can step on each other or lose their data on a restart.",
    },
    tags: ["statefulset", "deployment", "stateful-apps"],
  },
  {
    id: "k8s-service-types",
    topicId: "kubernetes",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre les types de Service ClusterIP, NodePort et LoadBalancer ?",
      en: "What is the difference between the ClusterIP, NodePort and LoadBalancer Service types ?",
    },
    answer: {
      fr: "ClusterIP, le type par défaut, expose le service uniquement à l'intérieur du cluster, sur une adresse IP interne stable, ce qui convient pour la communication entre services internes. NodePort ouvre en plus un port fixe sur chaque nœud du cluster, rendant le service accessible depuis l'extérieur via l'IP de n'importe quel nœud combinée à ce port, une solution simple mais rarement utilisée telle quelle en production. LoadBalancer provisionne un équilibreur de charge externe, en général fourni par le cloud provider, qui donne une adresse IP publique stable et distribue le trafic entrant vers les Pods du service, c'est l'option standard pour exposer un service au monde extérieur dans un cluster managé.",
      en: "ClusterIP, the default type, exposes the service only inside the cluster, on a stable internal IP, which fits communication between internal services. NodePort additionally opens a fixed port on every node in the cluster, making the service reachable from outside via any node's IP combined with that port, a simple solution but rarely used as-is in production. LoadBalancer provisions an external load balancer, generally supplied by the cloud provider, which gives a stable public IP and distributes incoming traffic to the service's Pods, the standard option for exposing a service to the outside world in a managed cluster.",
    },
    pitfall: {
      fr: "Le piège est d'oublier qu'un service LoadBalancer crée un équilibreur de charge externe distinct pour chaque service qui l'utilise, ce qui a un coût cloud réel et cumulatif : en pratique, on préfère souvent un Ingress unique qui route plusieurs services derrière un seul point d'entrée.",
      en: "The trap is forgetting that a LoadBalancer service creates a separate external load balancer for every service using it, which has a real, cumulative cloud cost: in practice, a single Ingress routing multiple services behind one entry point is often preferred.",
    },
    tags: ["services", "networking", "load-balancing"],
  },
  {
    id: "k8s-liveness-readiness-probes",
    topicId: "kubernetes",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre une liveness probe et une readiness probe ?",
      en: "What is the difference between a liveness probe and a readiness probe ?",
    },
    answer: {
      fr: "La liveness probe vérifie si le conteneur est toujours en vie et fonctionnel : si elle échoue de façon répétée, Kubernetes considère le conteneur comme bloqué et le redémarre. La readiness probe vérifie si le conteneur est prêt à recevoir du trafic à un instant donné : si elle échoue, Kubernetes retire simplement le Pod de la liste des endpoints du service, sans le redémarrer, jusqu'à ce que la probe redevienne positive. Cette distinction permet de gérer séparément un conteneur bloqué qui doit être relancé, et un conteneur temporairement occupé, par exemple pendant un chargement de cache au démarrage, qui doit juste être exclu du trafic un moment.",
      en: "The liveness probe checks whether the container is still alive and functional: if it repeatedly fails, Kubernetes considers the container stuck and restarts it. The readiness probe checks whether the container is ready to receive traffic at a given moment: if it fails, Kubernetes simply removes the Pod from the service's endpoint list, without restarting it, until the probe passes again. This distinction lets you separately handle a stuck container that needs restarting, and a container temporarily busy, for example during a startup cache warm-up, that just needs to be excluded from traffic for a while.",
    },
    pitfall: {
      fr: "Le piège classique est de configurer la même vérification pour les deux probes : si un problème temporaire de dépendance externe fait échouer la liveness probe en même temps que la readiness, le Pod se fait redémarrer en boucle alors qu'il suffirait de le sortir du trafic le temps que la dépendance se rétablisse.",
      en: "The classic trap is configuring the same check for both probes: if a temporary external dependency issue fails the liveness probe along with readiness, the Pod gets restarted in a loop when simply taking it out of traffic until the dependency recovers would have been enough.",
    },
    tags: ["probes", "health-checks", "reliability"],
  },
  {
    id: "k8s-configmap-vs-secret",
    topicId: "kubernetes",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre un ConfigMap et un Secret dans Kubernetes ?",
      en: "What is the difference between a ConfigMap and a Secret in Kubernetes ?",
    },
    answer: {
      fr: "Les deux permettent d'injecter de la configuration dans un Pod, sous forme de variables d'environnement ou de fichiers montés, sans la coder en dur dans l'image du conteneur. Un ConfigMap est destiné à la configuration non sensible, comme une URL d'API ou un niveau de log. Un Secret est destiné aux données sensibles, comme un mot de passe ou une clé API : son contenu est stocké encodé en base64 par défaut, ce qui n'est pas un vrai chiffrement mais permet d'éviter certains affichages accidentels en clair, et l'accès peut être restreint plus finement via le contrôle d'accès basé sur les rôles (RBAC).",
      en: "Both let you inject configuration into a Pod, as environment variables or mounted files, without hardcoding it into the container image. A ConfigMap is meant for non-sensitive configuration, like an API URL or a log level. A Secret is meant for sensitive data, like a password or an API key: its content is stored base64-encoded by default, which isn't real encryption but avoids some accidental plaintext display, and access can be more finely restricted through role-based access control (RBAC).",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de croire que l'encodage base64 d'un Secret équivaut à du chiffrement : n'importe qui ayant accès à l'objet peut le décoder trivialement, une vraie protection nécessite un chiffrement au repos activé sur le cluster ou une solution de gestion de secrets externe.",
      en: "The classic interview trap is believing a Secret's base64 encoding is equivalent to encryption: anyone with access to the object can trivially decode it, real protection requires encryption at rest enabled on the cluster or an external secrets management solution.",
    },
    tags: ["configmap", "secrets", "configuration"],
  },
  {
    id: "k8s-horizontal-pod-autoscaler",
    topicId: "kubernetes",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne le Horizontal Pod Autoscaler (HPA) ?",
      en: "How does the Horizontal Pod Autoscaler (HPA) work ?",
    },
    answer: {
      fr: "Le HPA surveille une métrique, le plus souvent l'utilisation moyenne du CPU ou de la mémoire des Pods d'un Deployment, mais aussi des métriques personnalisées comme le nombre de requêtes par seconde. À intervalles réguliers, il compare cette métrique à une cible définie et ajuste le nombre de répliques du Deployment à la hausse ou à la baisse pour s'en rapprocher, dans les limites d'un minimum et d'un maximum configurés. C'est un mécanisme de scaling horizontal, qui ajoute ou retire des instances, à distinguer du scaling vertical qui augmenterait les ressources allouées à chaque instance existante.",
      en: "The HPA watches a metric, most often the average CPU or memory usage of a Deployment's Pods, but also custom metrics like requests per second. At regular intervals, it compares that metric to a defined target and adjusts the Deployment's replica count up or down to move toward it, within a configured minimum and maximum. It's a horizontal scaling mechanism, adding or removing instances, distinct from vertical scaling, which would increase the resources allocated to each existing instance.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que le HPA a besoin de requests CPU/mémoire correctement définies sur les Pods pour calculer un pourcentage d'utilisation cohérent : sans ces requests, ou avec des valeurs mal calibrées, les décisions de scaling deviennent erratiques ou inefficaces.",
      en: "The trap is forgetting that the HPA needs correctly defined CPU/memory requests on the Pods to compute a coherent usage percentage: without those requests, or with poorly calibrated values, scaling decisions become erratic or ineffective.",
    },
    tags: ["autoscaling", "hpa", "scaling"],
  },
  {
    id: "k8s-rolling-update-strategy",
    topicId: "kubernetes",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne une mise à jour progressive (rolling update) d'un Deployment, et quels paramètres permettent de la régler ?",
      en: "How does a Deployment's rolling update work, and what parameters let you tune it ?",
    },
    answer: {
      fr: "Une rolling update remplace progressivement les anciennes répliques par de nouvelles, sans interruption de service, en créant de nouveaux Pods avec la nouvelle version puis en supprimant les anciens au fur et à mesure que les nouveaux passent leur readiness probe. Deux paramètres réglent le rythme de ce remplacement : maxUnavailable limite le nombre de Pods qui peuvent être indisponibles en même temps pendant la mise à jour, et maxSurge limite le nombre de Pods supplémentaires qui peuvent être créés temporairement au-delà du nombre de répliques cible. Ensemble, ils permettent d'équilibrer la vitesse de déploiement contre la capacité disponible pendant la transition.",
      en: "A rolling update progressively replaces old replicas with new ones, without service interruption, by creating new Pods with the new version and removing old ones as the new ones pass their readiness probe. Two parameters tune the pace of this replacement: maxUnavailable limits how many Pods can be unavailable at the same time during the update, and maxSurge limits how many extra Pods can be temporarily created beyond the target replica count. Together, they let you balance deployment speed against available capacity during the transition.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'une rolling update garantit à elle seule un déploiement sans aucun impact utilisateur : si la nouvelle version a un bug qui ne se déclenche qu'en charge réelle, il faut aussi une readiness probe pertinente et idéalement une stratégie de rollback rapide, la rolling update seule ne détecte pas les régressions fonctionnelles.",
      en: "The trap is believing a rolling update alone guarantees zero user impact: if the new version has a bug that only triggers under real load, you also need a meaningful readiness probe and ideally a fast rollback strategy, the rolling update on its own doesn't detect functional regressions.",
    },
    tags: ["deployments", "rolling-update", "release-strategy"],
  },
  {
    id: "k8s-resource-requests-limits",
    topicId: "kubernetes",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre les requests et les limits de ressources sur un Pod, et que se passe-t-il en cas de dépassement ?",
      en: "What is the difference between resource requests and limits on a Pod, and what happens when they're exceeded ?",
    },
    answer: {
      fr: "Une request est la quantité de CPU et de mémoire que le Pod est garanti d'obtenir, et c'est cette valeur que le scheduler utilise pour décider sur quel nœud placer le Pod, en s'assurant que le nœud a assez de capacité réservable. Une limit est le plafond que le Pod ne peut pas dépasser. Pour le CPU, dépasser la limite fait simplement brider (throttle) le conteneur, qui ralentit sans être arrêté. Pour la mémoire, dépasser la limite entraîne un arrêt immédiat du conteneur par le noyau avec le statut OOMKilled, car il n'existe pas de mécanisme équivalent au throttling pour la mémoire.",
      en: "A request is the amount of CPU and memory the Pod is guaranteed to get, and it's this value the scheduler uses to decide which node to place the Pod on, making sure that node has enough reservable capacity. A limit is the ceiling the Pod cannot exceed. For CPU, exceeding the limit simply throttles the container, which slows down without being killed. For memory, exceeding the limit causes the kernel to immediately kill the container with an OOMKilled status, since there's no equivalent throttling mechanism for memory.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de traiter CPU et mémoire de façon symétrique : contrairement au CPU, il n'y a pas de ralentissement progressif pour la mémoire, dépasser la limit mémoire tue le conteneur immédiatement, ce qui explique pourquoi un OOMKilled récurrent en production impose de revoir la limit ou de corriger une fuite mémoire plutôt que d'espérer que ça se régule tout seul.",
      en: "The classic interview trap is treating CPU and memory symmetrically: unlike CPU, there's no gradual slowdown for memory, exceeding the memory limit kills the container immediately, which is why a recurring OOMKilled in production means the limit needs revisiting or a memory leak needs fixing, rather than hoping it self-regulates.",
    },
    tags: ["resource-limits", "oom", "scheduling"],
  },

  // GCP
  {
    id: "gcp-compute-engine-vs-cloud-run",
    topicId: "gcp",
    difficulty: "easy",
    question: {
      fr: "Quand choisir Cloud Run plutôt que Compute Engine sur GCP ?",
      en: "When should you choose Cloud Run over Compute Engine on GCP ?",
    },
    answer: {
      fr: "Compute Engine fournit des machines virtuelles classiques, dont on gère soi-même le système d'exploitation, la mise à l'échelle et la maintenance, ce qui donne un contrôle complet mais demande plus d'opérations. Cloud Run est une plateforme serverless qui fait tourner des conteneurs sans gestion d'infrastructure : elle scale automatiquement, y compris jusqu'à zéro instance en l'absence de trafic, et facture à l'usage réel plutôt qu'au temps de machine allumée. Cloud Run convient bien aux applications web et API stateless avec un trafic variable, tandis que Compute Engine reste pertinent pour des charges qui ont besoin d'un contrôle fin de l'environnement ou d'un fonctionnement continu prévisible.",
      en: "Compute Engine provides classic virtual machines, where you manage the operating system, scaling and maintenance yourself, giving full control but requiring more operations work. Cloud Run is a serverless platform that runs containers with no infrastructure management: it scales automatically, including down to zero instances when there's no traffic, and bills for actual usage rather than machine uptime. Cloud Run fits well for stateless web apps and APIs with variable traffic, while Compute Engine remains relevant for workloads that need fine-grained control over the environment or predictable continuous operation.",
    },
    pitfall: {
      fr: "Le piège est d'oublier le cold start avec Cloud Run quand le nombre d'instances est descendu à zéro : la toute première requête après une période d'inactivité met plus de temps à répondre le temps qu'une instance démarre, ce qui peut être gênant pour une API avec des exigences de latence strictes.",
      en: "The trap is forgetting about cold starts with Cloud Run when the instance count has scaled down to zero: the very first request after a period of inactivity takes longer to respond while an instance spins up, which can be an issue for an API with strict latency requirements.",
    },
    tags: ["compute-engine", "cloud-run", "serverless"],
  },
  {
    id: "gcp-iam-basics",
    topicId: "gcp",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne IAM sur GCP, et quelle est la différence entre un rôle et un compte de service ?",
      en: "How does IAM work on GCP, and what is the difference between a role and a service account ?",
    },
    answer: {
      fr: "IAM sur GCP répond à la question de qui, humain ou machine, a le droit de faire quoi sur quelle ressource, en associant des membres à des rôles au niveau d'un projet, d'un dossier ou d'une ressource individuelle. Un rôle est un ensemble de permissions précises, comme la lecture d'un bucket Cloud Storage ou le déploiement d'une nouvelle révision Cloud Run ; GCP propose des rôles prédéfinis larges, des rôles prédéfinis granulaires par service, et permet de créer des rôles personnalisés. Un compte de service est une identité destinée à une application ou une charge de travail plutôt qu'à un humain : on lui attribue des rôles comme à n'importe quel membre, et c'est cette identité que les workloads utilisent pour s'authentifier entre eux.",
      en: "IAM on GCP answers the question of who, human or machine, is allowed to do what on which resource, by binding members to roles at the level of a project, a folder or an individual resource. A role is a set of precise permissions, like reading a Cloud Storage bucket or deploying a new Cloud Run revision; GCP offers broad predefined roles, granular per-service predefined roles, and lets you create custom roles. A service account is an identity meant for an application or a workload rather than a human: it's granted roles like any other member, and it's this identity that workloads use to authenticate to each other.",
    },
    pitfall: {
      fr: "Le piège classique est d'attribuer un rôle prédéfini large, comme Éditeur ou Propriétaire, à un compte de service par simplicité, au lieu de composer les rôles granulaires nécessaires : ça viole le principe du moindre privilège et élargit inutilement l'impact possible d'une clé compromise.",
      en: "The classic trap is granting a broad predefined role, like Editor or Owner, to a service account for simplicity, instead of composing the granular roles actually needed: it violates the least-privilege principle and needlessly widens the possible blast radius of a compromised key.",
    },
    tags: ["iam", "security", "service-accounts"],
  },
  {
    id: "gcp-cloud-storage-classes",
    topicId: "gcp",
    difficulty: "easy",
    question: {
      fr: "Quelles sont les principales classes de stockage Cloud Storage, et sur quel critère choisir entre elles ?",
      en: "What are the main Cloud Storage storage classes, and what criterion should you use to choose between them ?",
    },
    answer: {
      fr: "Cloud Storage propose plusieurs classes qui ont toutes la même latence et la même durabilité, mais qui diffèrent par le coût de stockage et le coût d'accès : Standard pour les données consultées fréquemment, Nearline pour des données accédées environ une fois par mois, Coldline pour un accès trimestriel, et Archive pour des données consultées au plus une fois par an, comme une sauvegarde de conformité de long terme. Le bon critère de choix est la fréquence d'accès attendue aux données, pas leur importance : des données critiques mais rarement lues peuvent très bien vivre en Archive, tant que le coût de récupération occasionnel reste acceptable.",
      en: "Cloud Storage offers several classes that all share the same latency and durability, but differ in storage cost and access cost: Standard for frequently accessed data, Nearline for data accessed roughly once a month, Coldline for quarterly access, and Archive for data accessed at most once a year, like a long-term compliance backup. The right criterion is the expected access frequency, not the data's importance: critical but rarely read data can perfectly well live in Archive, as long as the occasional retrieval cost stays acceptable.",
    },
    pitfall: {
      fr: "Le piège est de choisir une classe uniquement sur le coût de stockage au gigaoctet sans regarder le coût de récupération et la durée de rétention minimale : une classe Archive très bon marché au stockage peut coûter cher si les données sont finalement consultées plus souvent que prévu, ou supprimées avant la durée de rétention minimale, ce qui déclenche des frais de suppression anticipée.",
      en: "The trap is choosing a class based only on per-gigabyte storage cost without looking at retrieval cost and minimum retention duration: a very cheap-to-store Archive class can end up costly if the data is actually accessed more often than expected, or deleted before the minimum retention period, which triggers early deletion fees.",
    },
    tags: ["cloud-storage", "storage-classes", "cost-optimization"],
  },
  {
    id: "gcp-pubsub-basics",
    topicId: "gcp",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne Pub/Sub sur GCP, et quand l'utiliser plutôt qu'un appel HTTP direct entre deux services ?",
      en: "How does Pub/Sub work on GCP, and when should you use it instead of a direct HTTP call between two services ?",
    },
    answer: {
      fr: "Pub/Sub est un service de messagerie asynchrone basé sur le modèle publish-subscribe : un producteur publie des messages sur un topic sans savoir qui les consommera, et un ou plusieurs abonnements indépendants reçoivent chacun une copie de ces messages pour être traités par leurs propres consommateurs, à leur propre rythme. Contrairement à un appel HTTP direct, qui couple les deux services dans le temps et échoue si le service appelé est indisponible, Pub/Sub découple producteur et consommateurs : le producteur continue de fonctionner même si un consommateur est en panne ou plus lent, les messages restent en attente jusqu'à ce qu'ils soient traités et acquittés.",
      en: "Pub/Sub is an asynchronous messaging service based on the publish-subscribe model: a publisher sends messages to a topic without knowing who will consume them, and one or more independent subscriptions each receive a copy of those messages to be processed by their own consumers, at their own pace. Unlike a direct HTTP call, which couples the two services in time and fails if the called service is unavailable, Pub/Sub decouples publisher and consumers: the publisher keeps working even if a consumer is down or slower, messages stay queued until they're processed and acknowledged.",
    },
    pitfall: {
      fr: "Le piège est de supposer que Pub/Sub garantit l'ordre de livraison des messages par défaut : sans configurer explicitement des clés d'ordonnancement, les messages peuvent arriver dans le désordre chez le consommateur, ce qui pose problème pour des traitements qui dépendent d'une séquence stricte d'événements.",
      en: "The trap is assuming Pub/Sub guarantees message delivery order by default: without explicitly configuring ordering keys, messages can arrive out of order at the consumer, which is a problem for processing that depends on a strict sequence of events.",
    },
    tags: ["pubsub", "messaging", "async-architecture"],
  },
  {
    id: "gcp-vpc-basics",
    topicId: "gcp",
    difficulty: "medium",
    question: {
      fr: "Qu'est-ce qu'un VPC sur GCP, et en quoi le modèle GCP diffère-t-il d'autres clouds sur ce point ?",
      en: "What is a VPC on GCP, and how does GCP's model differ from other clouds on this point ?",
    },
    answer: {
      fr: "Un VPC (Virtual Private Cloud) est un réseau privé isolé où tournent les ressources d'un projet, avec ses propres règles de routage et de pare-feu. La particularité de GCP est qu'un VPC est une ressource globale qui peut couvrir plusieurs régions du monde avec un seul réseau logique, alors que les sous-réseaux, eux, sont régionaux et s'étendent automatiquement sur toutes les zones d'une région. Chez d'autres fournisseurs cloud, le réseau équivalent est souvent limité à une seule région, ce qui oblige à connecter plusieurs réseaux régionaux entre eux pour une architecture multi-région, une contrainte que le modèle global de GCP évite par construction.",
      en: "A VPC (Virtual Private Cloud) is an isolated private network where a project's resources run, with its own routing and firewall rules. GCP's distinctive feature is that a VPC is a global resource that can span multiple regions worldwide with a single logical network, while subnets are regional and automatically extend across all zones of a region. With other cloud providers, the equivalent network is often limited to a single region, forcing you to connect several regional networks together for a multi-region architecture, a constraint that GCP's global model avoids by design.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que les règles de pare-feu GCP sont appliquées au niveau du VPC entier et non par sous-réseau : une règle mal ciblée avec des tags ou des comptes de service imprécis peut ouvrir un accès beaucoup plus large que prévu à travers toutes les régions du VPC.",
      en: "The trap is forgetting that GCP firewall rules apply at the level of the entire VPC and not per subnet: a rule poorly targeted with imprecise tags or service accounts can open access much wider than intended, across every region of the VPC.",
    },
    tags: ["vpc", "networking", "architecture"],
  },
  {
    id: "gcp-bigquery-use-cases",
    topicId: "gcp",
    difficulty: "medium",
    question: {
      fr: "Pour quel type de besoin BigQuery est-il adapté, et pourquoi ne convient-il pas comme base de données transactionnelle ?",
      en: "What kind of need is BigQuery suited for, and why doesn't it fit as a transactional database ?",
    },
    answer: {
      fr: "BigQuery est un entrepôt de données serverless orienté colonnes, conçu pour scanner et agréger de très gros volumes de données rapidement lors de requêtes analytiques, comme calculer des statistiques sur des milliards de lignes d'événements. Son moteur est optimisé pour ce type de lecture massive plutôt que pour des écritures fréquentes et unitaires : insérer, modifier ou supprimer une seule ligne à la fois y est possible mais coûteux et inefficace comparé à une base transactionnelle classique comme Cloud SQL, qui est elle optimisée pour ce genre d'opérations ponctuelles et fréquentes avec de fortes garanties de cohérence immédiate.",
      en: "BigQuery is a serverless, columnar data warehouse designed to scan and aggregate very large volumes of data quickly during analytical queries, like computing statistics over billions of event rows. Its engine is optimized for that kind of massive read workload rather than frequent, single-row writes: inserting, updating or deleting one row at a time is possible but costly and inefficient compared to a classic transactional database like Cloud SQL, which is optimized for that kind of frequent, one-off operation with strong immediate consistency guarantees.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser BigQuery comme backend applicatif direct pour une app qui a besoin d'écritures fréquentes et de faible latence par requête : c'est un mésusage de l'outil, la bonne architecture reste une base transactionnelle pour l'application, avec un pipeline régulier qui exporte les données vers BigQuery pour l'analytique.",
      en: "The trap is using BigQuery as a direct application backend for an app that needs frequent writes and low per-query latency: that's a misuse of the tool, the right architecture keeps a transactional database for the application, with a regular pipeline exporting data to BigQuery for analytics.",
    },
    tags: ["bigquery", "data-warehouse", "analytics"],
  },
  {
    id: "gcp-cloud-sql-vs-spanner",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Quand choisir Cloud Spanner plutôt que Cloud SQL pour une base de données relationnelle sur GCP ?",
      en: "When should you choose Cloud Spanner over Cloud SQL for a relational database on GCP ?",
    },
    answer: {
      fr: "Cloud SQL est un service managé pour des moteurs relationnels classiques comme PostgreSQL ou MySQL, qui tourne en réalité sur une seule instance principale avec des réplicas en lecture, et dont la capacité d'écriture a donc un plafond vertical. Cloud Spanner est une base de données distribuée à l'échelle mondiale, capable de scaler horizontalement les écritures sur plusieurs régions tout en garantissant une cohérence forte et transactionnelle, ce qu'aucune base relationnelle classique ne peut faire nativement à cette échelle. Cloud Spanner devient pertinent quand le volume d'écritures dépasse ce qu'une seule instance Cloud SQL peut absorber, ou quand l'application a besoin d'une cohérence forte sur des données réparties dans plusieurs régions du monde.",
      en: "Cloud SQL is a managed service for classic relational engines like PostgreSQL or MySQL, which actually runs on a single primary instance with read replicas, and whose write capacity therefore has a vertical ceiling. Cloud Spanner is a globally distributed database, able to horizontally scale writes across multiple regions while guaranteeing strong, transactional consistency, something no classic relational database can natively do at that scale. Cloud Spanner becomes relevant when the write volume exceeds what a single Cloud SQL instance can absorb, or when the application needs strong consistency over data spread across multiple regions of the world.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de recommander Cloud Spanner par défaut pour tout projet qui grandit : c'est un outil puissant mais nettement plus coûteux et plus complexe à modéliser correctement, y basculer sans avoir un vrai besoin de scale horizontal des écritures ou de cohérence multi-région est une sur-ingénierie coûteuse.",
      en: "The classic interview trap is recommending Cloud Spanner by default for any growing project: it's a powerful tool but notably more expensive and harder to model correctly, switching to it without an actual need for horizontal write scaling or multi-region consistency is costly over-engineering.",
    },
    tags: ["cloud-spanner", "cloud-sql", "database-architecture"],
  },
  {
    id: "gcp-least-privilege-security",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Comment appliquer concrètement le principe du moindre privilège sur une architecture GCP en production ?",
      en: "How do you concretely apply the principle of least privilege on a production GCP architecture ?",
    },
    answer: {
      fr: "En pratique, ça passe par plusieurs leviers combinés : créer un compte de service dédié par charge de travail plutôt que d'en réutiliser un seul partout, lui attribuer uniquement les rôles granulaires strictement nécessaires à cette charge plutôt qu'un rôle large, restreindre l'accès aux ressources sensibles à des périmètres réseau précis via VPC Service Controls, et auditer régulièrement les permissions accordées via Cloud Asset Inventory ou l'outil Recommender qui suggère des réductions de droits inutilisés. L'objectif est qu'une identité compromise, humaine ou machine, ne puisse causer de dégâts que dans un périmètre strictement limité à ce dont elle a réellement besoin.",
      en: "In practice, this involves several combined levers: creating a dedicated service account per workload rather than reusing one everywhere, granting it only the granular roles strictly necessary for that workload rather than a broad role, restricting access to sensitive resources to precise network perimeters via VPC Service Controls, and regularly auditing granted permissions through Cloud Asset Inventory or the Recommender tool, which suggests reducing unused privileges. The goal is that a compromised identity, human or machine, can only cause damage within a perimeter strictly limited to what it actually needs.",
    },
    pitfall: {
      fr: "Le piège est de traiter le moindre privilège comme une configuration ponctuelle faite une fois au lancement du projet : les permissions ont tendance à s'accumuler avec le temps à mesure que de nouveaux besoins apparaissent, sans jamais être retirées, d'où l'importance d'un audit récurrent plutôt que d'une revue unique.",
      en: "The trap is treating least privilege as a one-off configuration done once at project launch: permissions tend to accumulate over time as new needs appear, without ever being removed, which is why a recurring audit matters more than a single review.",
    },
    tags: ["iam", "security", "least-privilege"],
  },

  // Kafka
  {
    id: "kafka-topic-partition-basics",
    topicId: "kafka",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre un topic et une partition dans Kafka ?",
      en: "What is the difference between a topic and a partition in Kafka ?",
    },
    answer: {
      fr: "Un topic est le flux logique nommé dans lequel les producteurs publient des messages, l'équivalent d'une catégorie ou d'un canal. Un topic est physiquement découpé en une ou plusieurs partitions, chacune étant un journal ordonné et immuable auquel les messages sont ajoutés séquentiellement. Ce découpage en partitions est ce qui permet à Kafka de paralléliser la charge, en répartissant les partitions sur plusieurs brokers et en laissant plusieurs consommateurs traiter des partitions différentes en parallèle.",
      en: "A topic is the named logical stream that producers publish messages to, the equivalent of a category or a channel. A topic is physically split into one or more partitions, each an ordered, immutable log that messages are appended to sequentially. This split into partitions is what lets Kafka parallelize load, by spreading partitions across multiple brokers and letting several consumers process different partitions in parallel.",
    },
    pitfall: {
      fr: "Le piège est de croire que Kafka garantit un ordre global des messages sur tout le topic : l'ordre n'est garanti qu'à l'intérieur d'une même partition, pas entre partitions différentes, ce qui a des conséquences directes sur le choix de la clé de partitionnement.",
      en: "The trap is believing Kafka guarantees a global message order across the whole topic: ordering is only guaranteed within a single partition, not across different partitions, which has direct consequences on the choice of partitioning key.",
    },
    tags: ["topics", "partitions", "basics"],
  },
  {
    id: "kafka-producer-acks",
    topicId: "kafka",
    difficulty: "medium",
    question: {
      fr: "Que contrôle le paramètre acks côté producteur Kafka, et quels sont les compromis entre ses valeurs ?",
      en: "What does the acks parameter control on the Kafka producer side, and what are the trade-offs between its values ?",
    },
    answer: {
      fr: "Le paramètre acks détermine combien de brokers doivent confirmer la réception d'un message avant que le producteur considère l'envoi comme réussi. Avec acks=0, le producteur n'attend aucune confirmation, ce qui donne le débit maximal mais aucune garantie de livraison en cas de panne. Avec acks=1, seul le broker leader de la partition doit confirmer, un compromis raisonnable mais qui peut perdre des messages si le leader tombe juste après avoir confirmé et avant que les répliques ne l'aient rattrapé. Avec acks=all (ou -1), tous les réplicas synchrones doivent confirmer, ce qui offre la meilleure durabilité au prix d'une latence plus élevée.",
      en: "The acks parameter determines how many brokers must confirm receipt of a message before the producer considers the send successful. With acks=0, the producer waits for no confirmation, giving maximum throughput but no delivery guarantee in case of failure. With acks=1, only the partition's leader broker must confirm, a reasonable trade-off but one that can lose messages if the leader fails right after confirming and before replicas have caught up. With acks=all (or -1), every in-sync replica must confirm, giving the best durability at the cost of higher latency.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter acks=all comme toujours le meilleur choix sans mentionner son coût en latence et en débit : le bon réglage dépend du besoin métier, une plateforme de logs applicatifs tolère mieux une perte occasionnelle qu'un système de paiement.",
      en: "The interview trap is presenting acks=all as always the best choice without mentioning its cost in latency and throughput: the right setting depends on the business need, an application log pipeline tolerates an occasional loss much better than a payment system.",
    },
    tags: ["producer", "durability", "reliability"],
  },
  {
    id: "kafka-consumer-group-rebalancing",
    topicId: "kafka",
    difficulty: "medium",
    question: {
      fr: "Qu'est-ce qu'un consumer group, et que se passe-t-il lors d'un rebalancing ?",
      en: "What is a consumer group, and what happens during a rebalance ?",
    },
    answer: {
      fr: "Un consumer group est un ensemble de consommateurs qui se partagent la lecture des partitions d'un topic, chaque partition n'étant assignée qu'à un seul consommateur du groupe à la fois, ce qui permet de paralléliser le traitement tout en garantissant que chaque message n'est traité qu'une fois par ce groupe. Un rebalancing se déclenche quand la composition du groupe change, par exemple un consommateur qui rejoint, qui quitte ou qui tombe en panne : Kafka réassigne alors les partitions entre les consommateurs restants. Pendant ce rebalancing, la consommation s'arrête temporairement le temps que la nouvelle assignation soit établie.",
      en: "A consumer group is a set of consumers that share the reading of a topic's partitions, with each partition assigned to only one consumer in the group at a time, which parallelizes processing while guaranteeing each message is only processed once by that group. A rebalance is triggered when the group's membership changes, for example a consumer joining, leaving or failing: Kafka then reassigns partitions among the remaining consumers. During this rebalance, consumption temporarily pauses until the new assignment is settled.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer l'impact d'un rebalancing trop fréquent : un traitement de message trop long qui dépasse le délai max.poll.interval.ms peut faire croire à Kafka que le consommateur est mort et déclencher un rebalancing inutile, créant une boucle de rebalancing qui dégrade fortement le débit global.",
      en: "The trap is underestimating the impact of overly frequent rebalancing: message processing that takes too long and exceeds the max.poll.interval.ms delay can make Kafka think the consumer is dead and trigger an unnecessary rebalance, creating a rebalancing loop that badly degrades overall throughput.",
    },
    tags: ["consumer-groups", "rebalancing", "scaling"],
  },
  {
    id: "kafka-exactly-once-semantics",
    topicId: "kafka",
    difficulty: "hard",
    question: {
      fr: "Comment Kafka permet-il d'obtenir une sémantique exactly-once, et pourquoi est-ce difficile par défaut ?",
      en: "How does Kafka achieve exactly-once semantics, and why is it hard by default ?",
    },
    answer: {
      fr: "Par défaut, Kafka offre une sémantique at-least-once : en cas de panne ou de retry, un message peut être livré plusieurs fois, car garantir qu'il est écrit exactement une fois demande de coordonner producteur, broker et consommateur de façon atomique, ce qui est intrinsèquement difficile dans un système distribué. Kafka propose deux mécanismes pour s'en rapprocher : le producteur idempotent, qui évite les doublons causés par les retries réseau grâce à un identifiant de séquence par producteur, et les transactions, qui permettent de regrouper plusieurs écritures, y compris sur plusieurs partitions ou topics, dans une unité atomique visible seulement si elle est validée entièrement.",
      en: "By default, Kafka offers at-least-once semantics: in case of failure or retry, a message can be delivered more than once, because guaranteeing it's written exactly once requires atomically coordinating producer, broker and consumer, which is inherently hard in a distributed system. Kafka offers two mechanisms to get closer to exactly-once: the idempotent producer, which avoids duplicates caused by network retries through a per-producer sequence identifier, and transactions, which let you group multiple writes, including across several partitions or topics, into an atomic unit visible only if fully committed.",
    },
    pitfall: {
      fr: "Le piège est de croire que exactly-once s'applique automatiquement de bout en bout dès qu'on active les transactions Kafka : la garantie ne couvre que l'écriture dans Kafka, si le consommateur produit un effet de bord externe, comme un appel HTTP ou une écriture en base, il faut aussi rendre ce traitement idempotent ou transactionnel de son côté.",
      en: "The trap is believing exactly-once applies automatically end to end just by enabling Kafka transactions: the guarantee only covers the write into Kafka, if the consumer produces an external side effect, like an HTTP call or a database write, that processing also needs to be made idempotent or transactional on its own side.",
    },
    tags: ["exactly-once", "transactions", "reliability"],
  },
  {
    id: "kafka-retention-vs-compaction",
    topicId: "kafka",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre la rétention par durée et la compaction de logs sur un topic Kafka ?",
      en: "What is the difference between time-based retention and log compaction on a Kafka topic ?",
    },
    answer: {
      fr: "La rétention classique supprime les messages une fois qu'ils dépassent une durée ou une taille configurée, quel que soit leur contenu, ce qui convient pour un flux d'événements où seul l'historique récent compte. La compaction de logs, elle, ne conserve que le dernier message pour chaque clé, en supprimant les versions précédentes devenues obsolètes, ce qui garantit que l'état actuel de chaque clé reste toujours disponible même très longtemps après. La compaction convient bien à un topic utilisé comme changelog d'un état, par exemple la dernière valeur connue pour chaque identifiant utilisateur.",
      en: "Classic retention deletes messages once they exceed a configured duration or size, regardless of their content, which fits an event stream where only recent history matters. Log compaction, instead, keeps only the latest message for each key, removing previous versions that have become obsolete, which guarantees the current state of every key stays available even much later. Compaction fits well for a topic used as a changelog of a state, for example the latest known value for each user identifier.",
    },
    pitfall: {
      fr: "Le piège est de croire que la compaction supprime immédiatement les anciens messages dès qu'une nouvelle valeur arrive pour la même clé : la compaction s'exécute en arrière-plan à intervalles réguliers, donc plusieurs versions d'une même clé peuvent coexister un moment avant que le nettoyage n'ait lieu.",
      en: "The trap is believing compaction immediately removes old messages as soon as a new value arrives for the same key: compaction runs in the background at regular intervals, so several versions of the same key can coexist for a while before cleanup actually happens.",
    },
    tags: ["log-compaction", "retention", "storage"],
  },
  {
    id: "kafka-partition-key-ordering",
    topicId: "kafka",
    difficulty: "medium",
    question: {
      fr: "Comment le choix de la clé de partitionnement affecte-t-il l'ordre et la répartition des messages ?",
      en: "How does the choice of partitioning key affect message ordering and distribution ?",
    },
    answer: {
      fr: "Par défaut, le producteur calcule un hash de la clé du message pour déterminer sur quelle partition il atterrit : deux messages avec la même clé vont toujours vers la même partition, ce qui garantit leur ordre relatif l'un par rapport à l'autre. Choisir une bonne clé, comme un identifiant client pour garantir que tous ses événements arrivent dans l'ordre, est donc essentiel pour des traitements qui dépendent de la séquence des événements. Sans clé, les messages sont distribués en round-robin entre les partitions, ce qui maximise l'équilibrage de charge mais ne donne aucune garantie d'ordre entre eux.",
      en: "By default, the producer hashes the message key to determine which partition it lands on: two messages with the same key always go to the same partition, which guarantees their relative order to each other. Choosing a good key, like a customer identifier to guarantee all their events arrive in order, is therefore essential for processing that depends on event sequence. Without a key, messages are distributed round-robin across partitions, which maximizes load balancing but gives no ordering guarantee between them.",
    },
    pitfall: {
      fr: "Le piège est de choisir une clé avec très peu de valeurs distinctes, comme un statut à deux états : tous les messages avec la même clé finissent sur la même partition, créant un déséquilibre de charge sévère alors que les autres partitions restent sous-utilisées.",
      en: "The trap is choosing a key with very few distinct values, like a two-state status: every message with that same key ends up on the same partition, creating a severe load imbalance while the other partitions stay underused.",
    },
    tags: ["partitioning", "ordering", "keys"],
  },
  {
    id: "kafka-consumer-lag",
    topicId: "kafka",
    difficulty: "easy",
    question: {
      fr: "Qu'est-ce que le consumer lag, et pourquoi est-ce une métrique importante à surveiller ?",
      en: "What is consumer lag, and why is it an important metric to monitor ?",
    },
    answer: {
      fr: "Le consumer lag est l'écart entre le dernier offset écrit dans une partition par les producteurs et le dernier offset lu et validé par un consommateur : concrètement, c'est le nombre de messages en attente de traitement pour ce consommateur. Un lag qui reste stable ou proche de zéro indique que le consommateur suit le rythme de production. Un lag qui augmente en continu signale que le consommateur ne traite pas assez vite, ce qui peut annoncer un retard croissant dans le traitement des données ou, à terme, une saturation.",
      en: "Consumer lag is the gap between the latest offset written to a partition by producers and the latest offset read and committed by a consumer: concretely, it's the number of messages waiting to be processed for that consumer. A lag that stays stable or close to zero indicates the consumer is keeping pace with production. A lag that keeps growing signals the consumer isn't processing fast enough, which can foreshadow a growing delay in data processing or, eventually, a saturation.",
    },
    pitfall: {
      fr: "Le piège est de ne surveiller que la valeur absolue du lag sans regarder sa tendance dans le temps : un lag ponctuellement élevé après un pic de trafic peut être normal et se résorber tout seul, ce qui compte vraiment c'est de savoir si le lag croît durablement ou revient à la normale.",
      en: "The trap is monitoring only the absolute lag value without looking at its trend over time: a temporarily high lag after a traffic spike can be normal and resolve on its own, what really matters is whether the lag keeps growing over time or returns to normal.",
    },
    tags: ["consumer-lag", "monitoring", "operations"],
  },
  {
    id: "kafka-schema-registry",
    topicId: "kafka",
    difficulty: "medium",
    question: {
      fr: "À quoi sert un schema registry dans un écosystème Kafka ?",
      en: "What is a schema registry for in a Kafka ecosystem ?",
    },
    answer: {
      fr: "Un schema registry centralise et versionne les schémas des messages échangés sur les topics, en général au format Avro, Protobuf ou JSON Schema, plutôt que d'envoyer un schéma complet avec chaque message. Producteurs et consommateurs valident leurs messages contre le schéma enregistré, ce qui empêche un producteur de publier un format incompatible sans le savoir et permet aux consommateurs de désérialiser correctement les messages sans connaître le format à l'avance. Le registre applique aussi des règles de compatibilité entre versions, par exemple interdire de supprimer un champ obligatoire, pour éviter de casser des consommateurs existants lors d'une évolution du schéma.",
      en: "A schema registry centralizes and versions the schemas of messages exchanged on topics, typically in Avro, Protobuf or JSON Schema format, rather than sending a full schema with every message. Producers and consumers validate their messages against the registered schema, which prevents a producer from unknowingly publishing an incompatible format and lets consumers correctly deserialize messages without knowing the format in advance. The registry also enforces compatibility rules between versions, for example forbidding the removal of a required field, to avoid breaking existing consumers when the schema evolves.",
    },
    pitfall: {
      fr: "Le piège est de traiter le schema registry comme un simple outil de sérialisation optionnel : dans un système avec de nombreuses équipes qui produisent et consomment les mêmes topics, c'est surtout un contrat d'interface partagé qui évite les ruptures silencieuses entre services découplés.",
      en: "The trap is treating the schema registry as a mere optional serialization tool: in a system with many teams producing and consuming the same topics, it's mainly a shared interface contract that prevents silent breakages between decoupled services.",
    },
    tags: ["schema-registry", "avro", "data-contracts"],
  },

  // Kotlin
  {
    id: "kotlin-null-safety",
    topicId: "kotlin",
    difficulty: "easy",
    question: {
      fr: "Comment Kotlin gère-t-il la nullabilité au niveau du système de types, et à quoi servent l'opérateur ?. et l'opérateur Elvis ?: ?",
      en: "How does Kotlin handle nullability at the type system level, and what are the ?. safe call operator and the ?: Elvis operator for ?",
    },
    answer: {
      fr: "Kotlin distingue au niveau du type lui-même un type nullable, comme String?, d'un type non nullable, comme String : le compilateur interdit d'assigner null à un type non nullable et oblige à gérer explicitement le cas nul pour un type nullable, ce qui élimine à la compilation une grande partie des NullPointerException qu'on trouve en Java. L'opérateur ?. effectue un appel seulement si la valeur n'est pas nulle, et renvoie null sinon, sans lever d'exception. L'opérateur Elvis ?: fournit une valeur de repli si l'expression à sa gauche est nulle, ce qui permet d'écrire une gestion de cas nul concise en une seule ligne.",
      en: "Kotlin distinguishes at the type level itself a nullable type, like String?, from a non-nullable type, like String: the compiler forbids assigning null to a non-nullable type and forces explicit handling of the null case for a nullable type, which eliminates a large share of the NullPointerExceptions found in Java at compile time. The ?. operator performs a call only if the value isn't null, and returns null otherwise, without throwing an exception. The ?: Elvis operator supplies a fallback value if the expression on its left is null, letting you write concise null handling in a single line.",
    },
    pitfall: {
      fr: "Le piège est de croire que Kotlin élimine totalement le risque de NullPointerException : l'opérateur !! force un accès non nul et relance une exception si la valeur est nulle malgré tout, et l'interopérabilité avec du code Java sans annotations de nullabilité peut introduire des valeurs nulles inattendues dans un type Kotlin supposé non nullable.",
      en: "The trap is believing Kotlin fully eliminates the NullPointerException risk: the !! operator forces a non-null access and still throws if the value is null after all, and interop with Java code lacking nullability annotations can introduce unexpected null values into a Kotlin type assumed to be non-nullable.",
    },
    tags: ["null-safety", "type-system", "basics"],
  },
  {
    id: "kotlin-data-class",
    topicId: "kotlin",
    difficulty: "easy",
    question: {
      fr: "Que génère automatiquement le mot-clé data devant une classe Kotlin ?",
      en: "What does the data keyword automatically generate on a Kotlin class ?",
    },
    answer: {
      fr: "Une data class génère automatiquement, à partir des propriétés déclarées dans le constructeur principal, les méthodes equals() et hashCode() basées sur le contenu, une méthode toString() lisible qui liste les propriétés et leurs valeurs, une méthode copy() qui permet de créer une nouvelle instance en ne modifiant que certains champs, et des fonctions componentN() qui permettent la déstructuration, comme val (id, name) = user. C'est l'équivalent Kotlin d'un objet valeur immuable qu'on écrirait à la main en Java avec beaucoup plus de code répétitif.",
      en: "A data class automatically generates, from the properties declared in the primary constructor, content-based equals() and hashCode() methods, a readable toString() method listing the properties and their values, a copy() method that lets you create a new instance while only changing certain fields, and componentN() functions that enable destructuring, like val (id, name) = user. It's the Kotlin equivalent of an immutable value object you'd hand-write in Java with much more boilerplate.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que equals(), hashCode() et copy() ne prennent en compte que les propriétés déclarées dans le constructeur principal : une propriété ajoutée dans le corps de la classe n'entre pas dans ces comparaisons ni dans la copie, ce qui peut créer des bugs subtils si on s'y attend pas.",
      en: "The trap is forgetting that equals(), hashCode() and copy() only account for properties declared in the primary constructor: a property added in the class body isn't included in those comparisons or in the copy, which can create subtle bugs if you don't expect it.",
    },
    tags: ["data-class", "language-features"],
  },
  {
    id: "kotlin-coroutines-vs-threads",
    topicId: "kotlin",
    difficulty: "medium",
    question: {
      fr: "En quoi une coroutine Kotlin diffère-t-elle d'un thread classique ?",
      en: "How does a Kotlin coroutine differ from a classic thread ?",
    },
    answer: {
      fr: "Un thread est une ressource système gérée par le système d'exploitation, coûteuse à créer et limitée en nombre, car chacun réserve sa propre pile mémoire. Une coroutine est une unité de concurrence beaucoup plus légère, gérée par le runtime Kotlin plutôt que par l'OS : on peut en lancer des dizaines de milliers sans épuiser les ressources. Une fonction suspend peut suspendre son exécution sans bloquer le thread sous-jacent, qui reste alors libre d'exécuter d'autres coroutines pendant l'attente, par exemple le temps d'une réponse réseau, avant de reprendre là où elle s'était arrêtée.",
      en: "A thread is a system resource managed by the operating system, expensive to create and limited in number, since each one reserves its own memory stack. A coroutine is a much lighter concurrency unit, managed by the Kotlin runtime rather than the OS: you can launch tens of thousands without exhausting resources. A suspend function can pause its execution without blocking the underlying thread, which stays free to run other coroutines during the wait, for example while a network response is pending, before resuming where it left off.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'une coroutine s'exécute forcément en parallèle sur un autre thread : par défaut, une coroutine peut très bien s'exécuter sur le même thread que celui qui l'a lancée, la concurrence réelle dépend du dispatcher utilisé, pas de la simple existence d'une coroutine.",
      en: "The trap is believing a coroutine necessarily runs in parallel on a different thread: by default, a coroutine can perfectly well run on the same thread that launched it, actual concurrency depends on the dispatcher used, not on the mere existence of a coroutine.",
    },
    tags: ["coroutines", "concurrency", "threads"],
  },
  {
    id: "kotlin-sealed-class",
    topicId: "kotlin",
    difficulty: "medium",
    question: {
      fr: "À quoi sert une sealed class, et en quoi améliore-t-elle un bloc when par rapport à une hiérarchie de classes classique ?",
      en: "What is a sealed class for, and how does it improve a when block compared to a classic class hierarchy ?",
    },
    answer: {
      fr: "Une sealed class restreint l'ensemble des sous-types possibles à ceux déclarés dans le même fichier ou module, ce qui donne au compilateur une connaissance complète et fermée de toutes les variantes existantes, contrairement à une classe ouverte que n'importe qui pourrait étendre ailleurs. Cette connaissance complète permet au compilateur de vérifier qu'un bloc when qui teste le type couvre bien tous les cas possibles, et de signaler une erreur de compilation si un cas est oublié, sans même avoir besoin d'une clause else. C'est particulièrement utile pour modéliser un résultat qui peut être, par exemple, un succès ou l'une de plusieurs erreurs distinctes.",
      en: "A sealed class restricts the set of possible subtypes to those declared in the same file or module, giving the compiler complete, closed knowledge of every existing variant, unlike an open class that anyone could extend elsewhere. That complete knowledge lets the compiler verify that a when block testing the type covers every possible case, and flag a compile error if a case is missed, without even needing an else clause. This is particularly useful for modeling a result that can be, for example, a success or one of several distinct errors.",
    },
    pitfall: {
      fr: "Le piège est d'ajouter une clause else par réflexe dans un when exhaustif sur une sealed class : ça désactive silencieusement la vérification d'exhaustivité du compilateur, un nouveau sous-type ajouté plus tard tombera dans le else au lieu de déclencher une erreur de compilation qui forcerait à le traiter explicitement.",
      en: "The trap is adding an else clause out of habit in a when block that's exhaustive over a sealed class: it silently disables the compiler's exhaustiveness check, a new subtype added later will fall into the else instead of triggering a compile error that would force you to handle it explicitly.",
    },
    tags: ["sealed-class", "when-expression", "type-safety"],
  },
  {
    id: "kotlin-extension-functions",
    topicId: "kotlin",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionnent les fonctions d'extension en Kotlin, et quelle est leur limite fondamentale par rapport à une vraie méthode de la classe ?",
      en: "How do Kotlin extension functions work, and what is their fundamental limitation compared to a real method of the class ?",
    },
    answer: {
      fr: "Une fonction d'extension permet d'ajouter une méthode apparente à une classe existante, y compris une classe qu'on ne peut pas modifier comme String ou une classe d'une librairie tierce, sans hériter ni la modifier. En réalité, le compilateur la transforme en une fonction statique classique qui prend l'objet receveur en premier paramètre : ce n'est donc que du sucre syntaxique, l'extension n'a pas accès aux membres privés de la classe et ne peut pas non plus être surchargée de façon polymorphique comme une vraie méthode virtuelle.",
      en: "An extension function lets you add a method that appears to belong to an existing class, including a class you can't modify like String or one from a third-party library, without inheriting from it or modifying it. In reality, the compiler turns it into a plain static function that takes the receiver object as its first parameter: it's therefore only syntactic sugar, the extension has no access to the class's private members and also can't be polymorphically overridden like a real virtual method.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est d'oublier que la résolution d'une fonction d'extension se fait de façon statique, au type déclaré de la variable et non à son type réel à l'exécution : si une sous-classe redéfinit une extension avec la même signature, c'est le type déclaré de la référence qui détermine quelle version est appelée, contrairement au polymorphisme dynamique d'une vraie méthode.",
      en: "The classic interview trap is forgetting that extension function resolution happens statically, based on the variable's declared type rather than its actual runtime type: if a subclass redefines an extension with the same signature, it's the reference's declared type that determines which version is called, unlike the dynamic polymorphism of a real method.",
    },
    tags: ["extension-functions", "language-features"],
  },
  {
    id: "kotlin-scope-functions",
    topicId: "kotlin",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre let, apply et also, les fonctions de portée les plus utilisées en Kotlin ?",
      en: "What is the difference between let, apply and also, the most commonly used Kotlin scope functions ?",
    },
    answer: {
      fr: "Les trois exécutent un bloc de code dans le contexte d'un objet, mais diffèrent sur deux points : comment on référence l'objet à l'intérieur du bloc, et ce que la fonction retourne. let référence l'objet via it et retourne le résultat du bloc, ce qui convient pour transformer une valeur ou exécuter du code seulement si elle n'est pas nulle. apply référence l'objet via this et retourne l'objet lui-même, ce qui convient pour configurer un objet juste après sa création en enchaînant des appels. also référence l'objet via it comme let mais retourne l'objet lui-même comme apply, ce qui convient pour exécuter un effet de bord, comme un log, sans interrompre une chaîne d'appels sur l'objet original.",
      en: "All three run a block of code in the context of an object, but differ on two points: how the object is referenced inside the block, and what the function returns. let references the object via it and returns the block's result, which fits transforming a value or running code only if it isn't null. apply references the object via this and returns the object itself, which fits configuring an object right after creation by chaining calls. also references the object via it like let but returns the object itself like apply, which fits running a side effect, like a log, without interrupting a chain of calls on the original object.",
    },
    pitfall: {
      fr: "Le piège est de choisir la fonction de portée en fonction de l'habitude plutôt que de ce qu'elle retourne réellement : utiliser apply là où on voulait en fait le résultat transformé du bloc, comme le ferait let, fait continuer la chaîne sur l'objet d'origine au lieu du résultat attendu, une source fréquente de bugs silencieux.",
      en: "The trap is picking a scope function out of habit rather than based on what it actually returns: using apply where you actually wanted the block's transformed result, like let would give, keeps the chain going on the original object instead of the expected result, a frequent source of silent bugs.",
    },
    tags: ["scope-functions", "language-features", "idioms"],
  },
  {
    id: "kotlin-coroutine-dispatchers",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre Dispatchers.IO et Dispatchers.Default, et qu'apporte la programmation concurrente structurée des coroutines ?",
      en: "What is the difference between Dispatchers.IO and Dispatchers.Default, and what does coroutines' structured concurrency provide ?",
    },
    answer: {
      fr: "Dispatchers.Default utilise un pool de threads dimensionné sur le nombre de cœurs CPU disponibles, adapté au calcul intensif en mémoire. Dispatchers.IO utilise un pool beaucoup plus large de threads, conçu pour des opérations qui passent le plus clair de leur temps à attendre, comme un appel réseau ou une lecture disque, où bloquer un thread coûte peu tant que le pool peut en absorber beaucoup en parallèle. La programmation concurrente structurée, elle, garantit qu'une coroutine enfant ne peut pas survivre à son scope parent : si le parent est annulé ou lève une exception, toutes les coroutines enfants sont automatiquement annulées, ce qui évite les fuites de coroutines orphelines qui continueraient à tourner sans qu'on le sache.",
      en: "Dispatchers.Default uses a thread pool sized to the number of available CPU cores, suited for memory-intensive computation. Dispatchers.IO uses a much larger thread pool, designed for operations that spend most of their time waiting, like a network call or a disk read, where blocking a thread costs little as long as the pool can absorb many of them in parallel. Structured concurrency, meanwhile, guarantees a child coroutine can't outlive its parent scope: if the parent is cancelled or throws, every child coroutine is automatically cancelled, avoiding leaks of orphan coroutines that would keep running unnoticed.",
    },
    pitfall: {
      fr: "Le piège classique est de lancer une coroutine avec GlobalScope plutôt que dans un scope structuré lié au cycle de vie du composant appelant : ça casse la concurrence structurée, la coroutine continue de vivre indépendamment et peut fuiter des ressources bien après que le composant qui l'a lancée a disparu.",
      en: "The classic trap is launching a coroutine with GlobalScope rather than within a structured scope tied to the calling component's lifecycle: it breaks structured concurrency, the coroutine keeps living independently and can leak resources long after the component that launched it is gone.",
    },
    tags: ["coroutines", "dispatchers", "structured-concurrency"],
  },
  {
    id: "kotlin-inline-functions-reified",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Pourquoi le mot-clé inline est-il nécessaire pour utiliser des generics reified en Kotlin ?",
      en: "Why is the inline keyword required to use reified generics in Kotlin ?",
    },
    answer: {
      fr: "Comme en Java, les informations de type générique sont normalement effacées à la compilation : une fonction générique classique ne peut donc pas savoir à l'exécution quel type concret T représente, par exemple pour faire T::class ou is T. Le mot-clé inline change ce comportement : le compilateur copie littéralement le corps de la fonction à chaque site d'appel plutôt que de générer un appel de fonction classique, ce qui fait qu'à chaque endroit où la fonction inline est utilisée, le compilateur connaît le type concret réellement fourni et peut le substituer directement dans le code généré. Combiné avec reified sur le paramètre de type, ça permet d'accéder à l'information de type générique à l'exécution comme si elle n'avait jamais été effacée.",
      en: "As in Java, generic type information is normally erased at compile time: a classic generic function therefore can't know at runtime what concrete type T represents, for example to do T::class or is T. The inline keyword changes this: the compiler literally copies the function's body into every call site rather than generating a classic function call, which means that at every place the inline function is used, the compiler knows the actual concrete type supplied and can substitute it directly into the generated code. Combined with reified on the type parameter, this lets you access generic type information at runtime as if it had never been erased.",
    },
    pitfall: {
      fr: "Le piège est d'abuser des fonctions inline pour des corps de fonction volumineux : comme le code est dupliqué à chaque site d'appel plutôt que centralisé, ça augmente la taille du bytecode généré, l'inline reified doit rester réservé aux cas où on a vraiment besoin d'accéder au type générique à l'exécution, pas utilisé par défaut pour toute fonction générique.",
      en: "The trap is overusing inline functions for large function bodies: since the code gets duplicated at every call site rather than centralized, it increases the generated bytecode size, inline reified should stay reserved for cases where you genuinely need runtime access to the generic type, not used by default for every generic function.",
    },
    tags: ["inline-functions", "reified-generics", "advanced"],
  },

  // GitHub Copilot & AI-assisted development
  {
    id: "copilot-what-it-does",
    topicId: "copilot",
    difficulty: "easy",
    question: {
      fr: "Concrètement, comment fonctionne GitHub Copilot pour générer ses suggestions de code ?",
      en: "Concretely, how does GitHub Copilot work to generate its code suggestions ?",
    },
    answer: {
      fr: "Copilot analyse le contexte local du fichier en cours d'édition, souvent complété par d'autres fichiers ouverts ou liés dans l'éditeur, et envoie ce contexte à un modèle de langage entraîné sur de grandes quantités de code source. Le modèle prédit la suite la plus probable du code étant donné ce contexte, un peu comme la complétion prédictive d'un clavier mais appliquée au code, et propose une ou plusieurs suggestions que le développeur peut accepter, modifier ou ignorer. Ce n'est pas un moteur de recherche qui retrouve du code existant : chaque suggestion est générée, pas copiée telle quelle depuis une source précise.",
      en: "Copilot analyzes the local context of the file being edited, often supplemented by other open or related files in the editor, and sends that context to a language model trained on large amounts of source code. The model predicts the most likely continuation of the code given that context, somewhat like a keyboard's predictive completion but applied to code, and proposes one or more suggestions the developer can accept, edit or ignore. It's not a search engine retrieving existing code: each suggestion is generated, not copied verbatim from a specific source.",
    },
    pitfall: {
      fr: "Le piège est de croire que Copilot comprend l'intention métier du projet au même titre qu'un développeur : il prédit une suite plausible de code d'après des patterns statistiques, pas d'après une compréhension réelle des règles métier, d'où l'importance de toujours relire les suggestions avec l'œil critique du contexte réel.",
      en: "The trap is believing Copilot understands the project's business intent the way a developer would: it predicts a plausible continuation of code based on statistical patterns, not on real understanding of business rules, which is why suggestions always need a critical read against the actual context.",
    },
    tags: ["copilot-basics", "code-completion", "llm"],
  },
  {
    id: "copilot-context-relevance",
    topicId: "copilot",
    difficulty: "medium",
    question: {
      fr: "Pourquoi la pertinence des suggestions de Copilot varie-t-elle autant selon les fichiers ouverts dans l'éditeur ?",
      en: "Why does the relevance of Copilot's suggestions vary so much depending on the files open in the editor ?",
    },
    answer: {
      fr: "Copilot construit son contexte de génération en grande partie à partir de ce qui est visible et ouvert dans l'éditeur au moment de la suggestion : les noms de variables, les conventions de style, les fonctions déjà définies dans le fichier ou dans des fichiers liés récemment consultés. Plus ce contexte contient d'indices pertinents, comme un fichier de test qui montre déjà le comportement attendu, ou une interface qui définit clairement le contrat à implémenter, plus les suggestions collent au besoin réel. À l'inverse, un fichier isolé sans contexte suffisant amène le modèle à se rabattre sur des patterns génériques plausibles mais pas forcément adaptés au projet.",
      en: "Copilot builds its generation context largely from what's visible and open in the editor at the time of the suggestion: variable names, style conventions, functions already defined in the file or in recently visited related files. The more that context contains relevant clues, like a test file that already shows the expected behavior, or an interface that clearly defines the contract to implement, the more suggestions match the actual need. Conversely, an isolated file without enough context leads the model to fall back on generic but plausible patterns not necessarily suited to the project.",
    },
    pitfall: {
      fr: "Le piège est de considérer la qualité des suggestions comme une propriété fixe de l'outil plutôt que comme quelque chose qu'on peut activement améliorer : ouvrir le bon fichier de contexte, écrire une signature de fonction claire ou un commentaire d'intention avant de générer change concrètement la qualité de ce qui est proposé.",
      en: "The trap is treating suggestion quality as a fixed property of the tool rather than something you can actively improve: opening the right context file, writing a clear function signature or an intent comment before generating concretely changes the quality of what gets suggested.",
    },
    tags: ["context", "developer-experience"],
  },
  {
    id: "copilot-code-review-risk",
    topicId: "copilot",
    difficulty: "medium",
    question: {
      fr: "Pourquoi le code accepté depuis Copilot ne doit-il pas échapper à une revue de code normale ?",
      en: "Why shouldn't code accepted from Copilot skip normal code review ?",
    },
    answer: {
      fr: "Une suggestion acceptée reste écrite par un modèle statistique qui optimise la plausibilité du code, pas sa correction fonctionnelle, sa sécurité, ni sa conformité aux règles métier spécifiques du projet, qu'il ne connaît que partiellement à travers le contexte visible. Le code généré peut donc compiler et sembler raisonnable tout en contenant une erreur de logique subtile, une faille de sécurité connue reproduite parce qu'elle apparaît fréquemment dans les données d'entraînement, ou simplement ne pas respecter une convention interne à l'équipe. La revue de code reste le filet de sécurité qui vérifie ce que l'outil ne peut pas garantir par construction.",
      en: "An accepted suggestion is still written by a statistical model that optimizes for code plausibility, not for functional correctness, security, or compliance with the project's specific business rules, which it only partially knows through the visible context. Generated code can therefore compile and look reasonable while containing a subtle logic error, a known security flaw reproduced because it appears frequently in the training data, or simply not follow an internal team convention. Code review remains the safety net checking what the tool can't guarantee by construction.",
    },
    pitfall: {
      fr: "Le piège est de baisser la vigilance en revue parce que le code semble bien écrit et idiomatique : un code généré par IA a justement tendance à avoir un style propre et convaincant en apparence, ce qui peut donner une fausse impression de confiance et faire passer plus facilement une erreur de fond inaperçue.",
      en: "The trap is lowering vigilance during review because the code looks well-written and idiomatic: AI-generated code actually tends to have a clean, convincing surface style, which can create a false sense of confidence and let a substantive error slip through unnoticed more easily.",
    },
    tags: ["code-review", "quality", "risk"],
  },
  {
    id: "copilot-license-ip-concerns",
    topicId: "copilot",
    difficulty: "medium",
    question: {
      fr: "Quelles sont les préoccupations juridiques classiques liées à l'usage d'un outil comme Copilot dans un projet d'entreprise ?",
      en: "What are the classic legal concerns around using a tool like Copilot in a company project ?",
    },
    answer: {
      fr: "Le modèle sous-jacent a été entraîné sur de vastes quantités de code source, y compris du code sous licence open source avec des conditions variées, ce qui soulève la question de savoir si une suggestion générée pourrait reproduire, même partiellement, un extrait suffisamment proche d'un code source protégé pour poser un problème de licence ou de droit d'auteur. Les outils modernes intègrent des filtres pour détecter et bloquer les suggestions trop proches d'un code source connu, mais le risque n'est pas nul. C'est pourquoi de nombreuses entreprises encadrent l'usage de ces outils par une politique claire, qui définit ce qui peut être généré, comment vérifier l'absence de code protégé, et qui reste responsable du code final livré.",
      en: "The underlying model was trained on vast amounts of source code, including open source code under varied license terms, which raises the question of whether a generated suggestion could reproduce, even partially, an extract close enough to protected source code to raise a license or copyright issue. Modern tools include filters to detect and block suggestions too close to known source code, but the risk isn't zero. This is why many companies frame the use of these tools with a clear policy, defining what can be generated, how to verify the absence of protected code, and who remains responsible for the final delivered code.",
    },
    pitfall: {
      fr: "Le piège est de considérer que la question juridique ne concerne que l'éditeur de l'outil et pas l'entreprise utilisatrice : en pratique, la responsabilité du code livré en production reste celle de l'entreprise et de ses développeurs, d'où l'importance d'une politique d'usage claire plutôt que de laisser chacun décider seul.",
      en: "The trap is assuming the legal question only concerns the tool vendor and not the using company: in practice, responsibility for code shipped to production remains with the company and its developers, which is why a clear usage policy matters more than leaving everyone to decide on their own.",
    },
    tags: ["licensing", "intellectual-property", "governance"],
  },
  {
    id: "copilot-vs-chat-based-assistants",
    topicId: "copilot",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre la complétion inline de Copilot et un assistant conversationnel comme Claude Code ou une session de chat ?",
      en: "What is the difference between Copilot's inline completion and a conversational assistant like Claude Code or a chat session ?",
    },
    answer: {
      fr: "La complétion inline propose une suite de code directement dans l'éditeur, ligne par ligne ou bloc par bloc, pendant que le développeur écrit, avec un contexte limité à ce qui est immédiatement visible autour du curseur. Un assistant conversationnel comme Claude Code fonctionne en dialogue : on lui décrit un besoin en langage naturel, il peut explorer plusieurs fichiers du projet, exécuter des commandes, planifier une série de modifications avant de les appliquer, et itérer sur plusieurs tours d'échange. La complétion convient bien pour accélérer l'écriture ligne à ligne, l'assistant conversationnel convient mieux pour des tâches qui demandent de comprendre et de modifier une portion plus large du projet.",
      en: "Inline completion suggests a continuation of code directly in the editor, line by line or block by block, as the developer types, with context limited to what's immediately visible around the cursor. A conversational assistant like Claude Code works through dialogue: you describe a need in natural language, it can explore multiple files in the project, run commands, plan a series of changes before applying them, and iterate over several turns of exchange. Completion fits well for speeding up line-by-line writing, the conversational assistant fits better for tasks that require understanding and modifying a larger portion of the project.",
    },
    pitfall: {
      fr: "Le piège est de vouloir résoudre un besoin de refactoring multi-fichiers en s'appuyant uniquement sur des complétions inline enchaînées : le manque de vision d'ensemble du projet fait que chaque suggestion locale peut sembler correcte tout en étant incohérente avec les autres, un assistant conversationnel avec accès à tout le projet est mieux outillé pour ce genre de tâche.",
      en: "The trap is trying to solve a multi-file refactoring need by relying only on chained inline completions: the lack of a whole-project view means each local suggestion can look correct while being inconsistent with the others, a conversational assistant with access to the whole project is better equipped for that kind of task.",
    },
    tags: ["tooling-comparison", "developer-workflow"],
  },
  {
    id: "copilot-prompt-comments",
    topicId: "copilot",
    difficulty: "medium",
    question: {
      fr: "Comment un commentaire bien écrit avant une fonction peut-il améliorer la qualité des suggestions de Copilot ?",
      en: "How can a well-written comment before a function improve the quality of Copilot's suggestions ?",
    },
    answer: {
      fr: "Un commentaire qui décrit clairement l'intention, les cas particuliers à gérer et le comportement attendu en cas d'erreur donne au modèle une information explicite qu'il n'aurait sinon qu'à deviner à partir du nom de la fonction et du code environnant. C'est en pratique une forme de prompt engineering appliqué directement dans le code source : plus l'intention est explicite et sans ambiguïté, plus la suggestion générée a de chances de correspondre au besoin réel dès la première proposition, plutôt que de nécessiter plusieurs retouches manuelles.",
      en: "A comment that clearly describes the intent, the edge cases to handle and the expected error behavior gives the model explicit information it would otherwise only guess from the function name and surrounding code. This is, in practice, a form of prompt engineering applied directly in the source code: the more explicit and unambiguous the intent, the more likely the generated suggestion matches the actual need on the first try, rather than requiring several manual touch-ups.",
    },
    pitfall: {
      fr: "Le piège est de rédiger après coup des commentaires qui décrivent ce que fait le code plutôt que ce qu'il doit faire, dans le seul but de guider Copilot : ça produit des commentaires redondants qui n'ont plus d'utilité une fois la fonction écrite, mieux vaut réserver ce commentaire d'intention au moment où on écrit vraiment la fonction et le garder seulement s'il apporte une information non triviale au lecteur humain aussi.",
      en: "The trap is writing comments after the fact that describe what the code does rather than what it should do, solely to steer Copilot: that produces redundant comments with no ongoing purpose once the function is written, it's better to reserve that intent comment for when you're actually writing the function and keep it only if it also gives a human reader non-trivial information.",
    },
    tags: ["prompting", "developer-workflow", "best-practices"],
  },
  {
    id: "copilot-security-risks",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "Quels sont les risques de sécurité spécifiques liés à l'usage massif d'un outil comme Copilot dans une équipe ?",
      en: "What are the specific security risks of widespread use of a tool like Copilot in a team ?",
    },
    answer: {
      fr: "Le modèle a été entraîné sur du code réel, y compris du code contenant des vulnérabilités connues ou des mauvaises pratiques de sécurité, comme des requêtes SQL construites par concaténation ou une gestion faible des mots de passe : il peut reproduire ces patterns défaillants si le contexte y invite, sans signaler qu'il s'agit d'une pratique risquée. Un autre risque concerne les secrets : un développeur qui laisse traîner une clé API ou un mot de passe en dur dans un fichier ouvert augmente le risque que ce secret réapparaisse, sous une forme ou une autre, dans une suggestion future issue de ce même contexte. Une équipe qui adopte massivement l'outil doit donc renforcer, pas relâcher, ses pratiques de revue de sécurité et de gestion des secrets.",
      en: "The model was trained on real code, including code containing known vulnerabilities or poor security practices, like SQL queries built through concatenation or weak password handling: it can reproduce these flawed patterns if the context invites it, without flagging that it's a risky practice. Another risk concerns secrets: a developer who leaves an API key or a hardcoded password lingering in an open file increases the risk of that secret reappearing, in some form, in a future suggestion drawn from that same context. A team that adopts the tool at scale therefore needs to strengthen, not relax, its security review and secrets management practices.",
    },
    pitfall: {
      fr: "Le piège est de traiter les outils d'analyse de sécurité automatisée comme redondants une fois Copilot en place, sous prétexte que le code généré paraît propre : au contraire, la vitesse de production de code augmente le volume à auditer, ce qui renforce le besoin d'outils de scan automatisé plutôt que de le réduire.",
      en: "The trap is treating automated security scanning tools as redundant once Copilot is in place, on the assumption that generated code looks clean: on the contrary, the increased speed of code production raises the volume that needs auditing, which strengthens the need for automated scanning tools rather than reducing it.",
    },
    tags: ["security", "risk-management", "governance"],
  },
  {
    id: "copilot-productivity-measurement",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "Pourquoi le nombre de lignes de code générées est-il un mauvais indicateur pour mesurer le gain de productivité apporté par un outil comme Copilot ?",
      en: "Why is the number of generated lines of code a poor indicator for measuring the productivity gain from a tool like Copilot ?",
    },
    answer: {
      fr: "Le volume de code produit ne dit rien sur sa qualité, sa maintenabilité, ni sur le temps réellement gagné une fois qu'on compte aussi le temps passé à relire, corriger et parfois défaire des suggestions inadaptées. Un code plus verbeux ou plus copié-collé de patterns génériques peut même faire augmenter artificiellement ce chiffre tout en dégradant la qualité globale du projet. Des indicateurs plus pertinents regardent plutôt le temps total du cycle de développement d'une fonctionnalité, le taux de retour en revue de code, ou la fréquence des bugs en production sur le code produit avec assistance IA comparé à sans, des mesures plus difficiles à collecter mais bien plus représentatives de l'impact réel.",
      en: "The volume of code produced says nothing about its quality, its maintainability, or the time actually saved once you also count time spent reviewing, fixing and sometimes undoing unsuitable suggestions. More verbose code or more copy-pasted generic patterns can even artificially inflate that number while degrading the project's overall quality. More relevant indicators instead look at a feature's total development cycle time, the code review rejection rate, or the frequency of production bugs in code produced with AI assistance compared to without, harder metrics to collect but far more representative of the actual impact.",
    },
    pitfall: {
      fr: "Le piège en entretien est de proposer une métrique facile à mesurer, comme les lignes de code ou le nombre de suggestions acceptées, sans questionner si elle capture vraiment ce qu'on cherche à évaluer : une bonne métrique de productivité doit rester connectée à la valeur livrée et à la qualité, pas seulement au volume produit.",
      en: "The interview trap is proposing an easy-to-measure metric, like lines of code or the number of accepted suggestions, without questioning whether it truly captures what's being evaluated: a good productivity metric needs to stay connected to delivered value and quality, not just to volume produced.",
    },
    tags: ["productivity", "metrics", "engineering-management"],
  },

  // AWS
  {
    id: "aws-ec2-vs-lambda",
    topicId: "aws",
    difficulty: "easy",
    question: {
      fr: "Quand choisir AWS Lambda plutôt qu'EC2 pour héberger une charge applicative ?",
      en: "When should you choose AWS Lambda over EC2 to host an application workload ?",
    },
    answer: {
      fr: "EC2 fournit des machines virtuelles classiques, dont on gère soi-même le système d'exploitation, le dimensionnement et la disponibilité continue, ce qui donne un contrôle complet mais une facturation liée au temps d'allumage de l'instance, qu'elle soit utilisée ou non. Lambda est un service serverless qui exécute une fonction en réponse à un déclencheur, comme une requête HTTP ou un message de file, sans gestion de serveur, avec une facturation au temps d'exécution réel et un scaling automatique jusqu'à zéro en l'absence d'appels. Lambda convient bien à des traitements courts et déclenchés par événement, EC2 reste pertinent pour des charges continues qui ont besoin d'un contrôle fin de l'environnement ou d'une durée d'exécution longue au-delà des limites de Lambda.",
      en: "EC2 provides classic virtual machines, where you manage the operating system, sizing and continuous availability yourself, giving full control but billing tied to instance uptime, whether it's used or not. Lambda is a serverless service that runs a function in response to a trigger, like an HTTP request or a queue message, with no server management, billing for actual execution time and automatic scaling down to zero when there are no calls. Lambda fits well for short, event-triggered processing, EC2 remains relevant for continuous workloads that need fine-grained control over the environment or execution durations longer than Lambda's limits allow.",
    },
    pitfall: {
      fr: "Le piège est d'oublier la limite de durée d'exécution d'une fonction Lambda et le cold start pour une fonction peu sollicitée : un traitement long ou une charge qui a besoin d'une latence constamment faible, même après une période d'inactivité, se prête souvent mieux à EC2 ou à un service conteneurisé toujours actif.",
      en: "The trap is forgetting a Lambda function's execution duration limit and the cold start for an infrequently called function: long-running processing or a workload that needs consistently low latency, even after a period of inactivity, often fits EC2 or an always-on containerized service better.",
    },
    tags: ["ec2", "lambda", "serverless"],
  },
  {
    id: "aws-iam-roles-vs-users",
    topicId: "aws",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre un rôle IAM et un utilisateur IAM sur AWS, et pourquoi préfère-t-on les rôles pour les charges applicatives ?",
      en: "What is the difference between an IAM role and an IAM user on AWS, and why are roles preferred for application workloads ?",
    },
    answer: {
      fr: "Un utilisateur IAM représente une identité durable, en général associée à une personne, avec des identifiants d'accès à long terme qu'il faut stocker et faire tourner régulièrement. Un rôle IAM ne possède pas d'identifiants permanents : il définit un ensemble de permissions que différentes entités, comme une instance EC2, une fonction Lambda, ou même un utilisateur d'un autre compte AWS, peuvent endosser temporairement pour obtenir des identifiants de courte durée générés à la volée. Pour une charge applicative, un rôle évite d'avoir à stocker en dur des identifiants permanents dans le code ou la configuration, ce qui réduit fortement le risque en cas de fuite.",
      en: "An IAM user represents a durable identity, generally tied to a person, with long-term access credentials that need to be stored and rotated regularly. An IAM role holds no permanent credentials: it defines a set of permissions that different entities, like an EC2 instance, a Lambda function, or even a user from another AWS account, can temporarily assume to obtain short-lived credentials generated on the fly. For an application workload, a role avoids having to hardcode permanent credentials in code or configuration, which strongly reduces the risk in case of a leak.",
    },
    pitfall: {
      fr: "Le piège classique est de créer un utilisateur IAM dédié avec une clé d'accès permanente pour une application qui tourne sur EC2 ou Lambda, par simplicité, au lieu d'attacher un rôle à la ressource : ça expose une clé longue durée à un risque de fuite qu'un rôle avec identifiants temporaires évite par construction.",
      en: "The classic trap is creating a dedicated IAM user with a permanent access key for an application running on EC2 or Lambda, for simplicity, instead of attaching a role to the resource: that exposes a long-lived key to a leak risk that a role with temporary credentials avoids by design.",
    },
    tags: ["iam", "security", "roles"],
  },
  {
    id: "aws-s3-storage-classes",
    topicId: "aws",
    difficulty: "easy",
    question: {
      fr: "Quelles sont les principales classes de stockage S3, et sur quel critère choisir entre elles ?",
      en: "What are the main S3 storage classes, and what criterion should you use to choose between them ?",
    },
    answer: {
      fr: "S3 Standard convient aux données consultées fréquemment, avec une disponibilité et une latence optimales. S3 Standard-IA (Infrequent Access) réduit le coût de stockage pour des données accédées occasionnellement, au prix d'un coût par accès plus élevé. S3 Glacier et Glacier Deep Archive offrent le stockage le moins cher pour des données rarement consultées, comme des archives de conformité, mais avec un délai de récupération qui va de quelques minutes à plusieurs heures selon le niveau choisi. Le bon critère de choix reste la fréquence d'accès attendue et la tolérance à la latence de récupération, pas seulement le coût de stockage brut.",
      en: "S3 Standard fits frequently accessed data, with optimal availability and latency. S3 Standard-IA (Infrequent Access) lowers storage cost for occasionally accessed data, at the price of a higher per-access cost. S3 Glacier and Glacier Deep Archive offer the cheapest storage for rarely accessed data, like compliance archives, but with a retrieval delay ranging from a few minutes to several hours depending on the tier chosen. The right criterion remains the expected access frequency and tolerance for retrieval latency, not just the raw storage cost.",
    },
    pitfall: {
      fr: "Le piège est de choisir Glacier uniquement sur le critère du coût de stockage sans anticiper un besoin de récupération urgente : si les données doivent parfois être récupérées rapidement, le délai de restauration de plusieurs heures de l'option la moins chère peut devenir un vrai problème opérationnel.",
      en: "The trap is choosing Glacier based only on storage cost without anticipating a need for urgent retrieval: if the data sometimes needs to be retrieved quickly, the multi-hour restore delay of the cheapest option can become a real operational problem.",
    },
    tags: ["s3", "storage-classes", "cost-optimization"],
  },
  {
    id: "aws-vpc-basics",
    topicId: "aws",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre un sous-réseau public et un sous-réseau privé dans un VPC AWS ?",
      en: "What is the difference between a public subnet and a private subnet in an AWS VPC ?",
    },
    answer: {
      fr: "Un sous-réseau est public quand sa table de routage contient une route vers une Internet Gateway, ce qui permet aux ressources qui y résident, avec une adresse IP publique, de communiquer directement avec Internet. Un sous-réseau est privé quand il n'a pas de route directe vers une Internet Gateway : les ressources qui y résident restent inaccessibles depuis Internet, et si elles ont besoin d'initier des connexions sortantes, comme télécharger une mise à jour, elles passent par une NAT Gateway placée dans un sous-réseau public. L'architecture classique place les ressources exposées, comme un load balancer, dans un sous-réseau public, et les ressources sensibles, comme une base de données, dans un sous-réseau privé.",
      en: "A subnet is public when its route table contains a route to an Internet Gateway, letting resources residing there, with a public IP address, communicate directly with the internet. A subnet is private when it has no direct route to an Internet Gateway: resources residing there stay unreachable from the internet, and if they need to initiate outbound connections, like downloading an update, they go through a NAT Gateway placed in a public subnet. The classic architecture places exposed resources, like a load balancer, in a public subnet, and sensitive resources, like a database, in a private subnet.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'une ressource dans un sous-réseau privé est automatiquement isolée de tout accès sortant vers Internet : sans NAT Gateway configurée, elle ne peut effectivement rien joindre à l'extérieur, mais dès qu'une NAT Gateway est en place, elle garde un accès sortant, ce qui doit rester un choix explicite et pas une supposition par défaut.",
      en: "The trap is assuming a resource in a private subnet is automatically isolated from all outbound internet access: without a NAT Gateway configured, it indeed can't reach anything outside, but as soon as a NAT Gateway is in place, it keeps outbound access, which should remain an explicit choice rather than a default assumption.",
    },
    tags: ["vpc", "networking", "security"],
  },
  {
    id: "aws-rds-vs-dynamodb",
    topicId: "aws",
    difficulty: "medium",
    question: {
      fr: "Quand choisir DynamoDB plutôt que RDS pour un nouveau service ?",
      en: "When should you choose DynamoDB over RDS for a new service ?",
    },
    answer: {
      fr: "RDS gère des moteurs relationnels classiques comme PostgreSQL ou MySQL, avec un schéma structuré, des jointures et des transactions ACID complètes, un choix naturel quand les données ont des relations complexes et que les requêtes évoluent de façon imprévisible au fil du projet. DynamoDB est une base de données clé-valeur et documents entièrement managée, sans schéma fixe, conçue pour scaler horizontalement avec une latence à un chiffre de milliseconde de façon prévisible, à condition de connaître à l'avance les patterns d'accès aux données pour bien concevoir les clés de partition. DynamoDB devient pertinent quand le volume et le débit sont très élevés et que les patterns de requête sont stables et connus dès la conception.",
      en: "RDS manages classic relational engines like PostgreSQL or MySQL, with a structured schema, joins and full ACID transactions, a natural choice when data has complex relationships and queries evolve unpredictably over the project's life. DynamoDB is a fully managed key-value and document database, with no fixed schema, designed to scale horizontally with predictable single-digit millisecond latency, provided the data access patterns are known upfront to design good partition keys. DynamoDB becomes relevant when volume and throughput are very high and query patterns are stable and known at design time.",
    },
    pitfall: {
      fr: "Le piège est de choisir DynamoDB par défaut pour sa réputation de scalabilité sans avoir anticipé les patterns d'accès aux données : contrairement à une base relationnelle où on peut ajouter une nouvelle requête assez librement, changer un pattern d'accès non prévu en DynamoDB implique souvent de revoir la conception des clés, une contrainte de conception forte à assumer dès le départ.",
      en: "The trap is choosing DynamoDB by default for its scalability reputation without having anticipated the data access patterns: unlike a relational database where you can add a new query fairly freely, changing an unplanned access pattern in DynamoDB often requires rethinking the key design, a strong design constraint that needs to be accepted from the start.",
    },
    tags: ["dynamodb", "rds", "database-architecture"],
  },
  {
    id: "aws-auto-scaling-groups",
    topicId: "aws",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne un Auto Scaling Group, et quel rôle joue le load balancer à côté ?",
      en: "How does an Auto Scaling Group work, and what role does the load balancer play alongside it ?",
    },
    answer: {
      fr: "Un Auto Scaling Group maintient un nombre d'instances EC2 identiques entre un minimum et un maximum configurés, en se basant sur une métrique surveillée, le plus souvent l'utilisation CPU moyenne, pour ajouter ou retirer des instances au besoin. Le load balancer, en général un Application Load Balancer, distribue le trafic entrant entre toutes les instances saines actuellement gérées par le groupe, et vérifie leur santé via des health checks réguliers, en retirant automatiquement du routage toute instance qui ne répond plus correctement. Ensemble, ils forment le socle standard d'une architecture web résiliente et élastique sur AWS.",
      en: "An Auto Scaling Group maintains a number of identical EC2 instances between a configured minimum and maximum, based on a monitored metric, most often average CPU usage, to add or remove instances as needed. The load balancer, typically an Application Load Balancer, distributes incoming traffic across every healthy instance currently managed by the group, and checks their health through regular health checks, automatically removing any instance that stops responding correctly from routing. Together, they form the standard foundation of a resilient, elastic web architecture on AWS.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que la nouvelle instance créée par un scale-up démarre à froid, sans cache local ni connexions déjà établies : si le démarrage de l'application est lent, ou si le health check la marque saine avant qu'elle soit vraiment prête à absorber du trafic, ça peut créer des erreurs pour les premières requêtes qui lui sont routées.",
      en: "The trap is forgetting that a new instance created by a scale-up starts cold, with no local cache or already-established connections: if the application startup is slow, or if the health check marks it healthy before it's truly ready to absorb traffic, it can create errors for the first requests routed to it.",
    },
    tags: ["auto-scaling", "load-balancing", "resilience"],
  },
  {
    id: "aws-cloudformation-vs-terraform",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Quand préférer CloudFormation à Terraform pour gérer une infrastructure AWS, et inversement ?",
      en: "When should you prefer CloudFormation over Terraform to manage AWS infrastructure, and vice versa ?",
    },
    answer: {
      fr: "CloudFormation est le service d'infrastructure as code natif d'AWS : il connaît immédiatement les nouveaux services AWS dès leur sortie, s'intègre nativement avec les autres outils AWS comme les Service Catalogs ou StackSets pour du multi-compte, et ne nécessite pas de gérer un fichier d'état séparé, AWS s'en charge en interne. Terraform, lui, est multi-cloud : la même syntaxe HCL peut gérer AWS, Azure, GCP et de nombreux autres fournisseurs dans un seul projet, avec un langage souvent jugé plus lisible et un écosystème de modules communautaires très riche. Le choix dépend donc surtout de si l'infrastructure reste exclusivement AWS ou si elle doit couvrir plusieurs fournisseurs cloud, ou si l'équipe a déjà une expertise établie sur l'un des deux outils.",
      en: "CloudFormation is AWS's native infrastructure as code service: it immediately supports new AWS services as they launch, integrates natively with other AWS tools like Service Catalogs or StackSets for multi-account setups, and requires no separate state file to manage, AWS handles that internally. Terraform is multi-cloud: the same HCL syntax can manage AWS, Azure, GCP and many other providers in a single project, with a language often considered more readable and a very rich ecosystem of community modules. The choice mainly depends on whether the infrastructure stays exclusively on AWS or needs to span several cloud providers, or whether the team already has established expertise with one of the two tools.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter l'un comme objectivement supérieur à l'autre : ce sont deux outils matures avec des compromis différents, la bonne réponse dépend du contexte, notamment de la stratégie multi-cloud ou mono-cloud de l'entreprise, plutôt que d'une préférence technique universelle.",
      en: "The interview trap is presenting one as objectively superior to the other: these are two mature tools with different trade-offs, the right answer depends on context, particularly the company's multi-cloud or single-cloud strategy, rather than a universal technical preference.",
    },
    tags: ["cloudformation", "terraform", "iac"],
  },
  {
    id: "aws-least-privilege-security",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Comment structurer des policies IAM AWS pour appliquer concrètement le principe du moindre privilège ?",
      en: "How do you structure AWS IAM policies to concretely apply the principle of least privilege ?",
    },
    answer: {
      fr: "Une bonne pratique est de partir d'une policy la plus restrictive possible, qui n'autorise que les actions précises nécessaires sur des ressources précises identifiées par leur ARN, plutôt que de partir d'une policy large qu'on essaierait de restreindre après coup. On combine souvent des policies gérées par AWS pour des besoins standards avec des policies personnalisées pour des besoins spécifiques, et on utilise des conditions, comme restreindre l'accès à une plage d'adresses IP ou exiger l'authentification multifacteur pour certaines actions sensibles. AWS IAM Access Analyzer aide à repérer les permissions accordées mais jamais utilisées, ce qui permet de les retirer progressivement sans casser un usage réel.",
      en: "A good practice is starting from the most restrictive policy possible, allowing only the precise actions needed on precise resources identified by their ARN, rather than starting from a broad policy you'd try to restrict afterward. Managed AWS policies for standard needs are often combined with custom policies for specific needs, and conditions are used, like restricting access to an IP range or requiring multi-factor authentication for certain sensitive actions. AWS IAM Access Analyzer helps spot permissions granted but never used, which lets you progressively remove them without breaking real usage.",
    },
    pitfall: {
      fr: "Le piège classique est d'utiliser une policy avec une action en wildcard, comme s3:*, sur une ressource en wildcard, plutôt que de lister précisément les actions et les ressources nécessaires : c'est rapide à écrire mais ça élargit considérablement l'impact possible d'une identité compromise, exactement ce que le moindre privilège cherche à éviter.",
      en: "The classic trap is using a policy with a wildcard action, like s3:*, on a wildcard resource, rather than precisely listing the needed actions and resources: it's quick to write but considerably widens the possible impact of a compromised identity, exactly what least privilege is meant to prevent.",
    },
    tags: ["iam", "security", "least-privilege"],
  },

  // Azure
  {
    id: "azure-app-service-vs-aks",
    topicId: "azure",
    difficulty: "easy",
    question: {
      fr: "Quand choisir Azure App Service plutôt qu'AKS (Azure Kubernetes Service) pour héberger une application web ?",
      en: "When should you choose Azure App Service over AKS (Azure Kubernetes Service) to host a web application ?",
    },
    answer: {
      fr: "App Service est une plateforme managée pensée pour déployer directement une application web ou une API sans gérer l'infrastructure sous-jacente ni orchestrer des conteneurs soi-même : on pousse le code ou une image, App Service s'occupe du reste, y compris le scaling horizontal simple et les certificats. AKS donne un contrôle complet sur un cluster Kubernetes, adapté à une architecture microservices complexe qui a besoin d'orchestration fine, de sidecars, ou de patterns spécifiques à Kubernetes, mais au prix d'une charge opérationnelle bien plus lourde. Pour une application simple ou moyenne sans besoin d'orchestration avancée, App Service évite une complexité inutile.",
      en: "App Service is a managed platform designed to deploy a web application or API directly without managing the underlying infrastructure or orchestrating containers yourself: you push code or an image, App Service handles the rest, including simple horizontal scaling and certificates. AKS gives full control over a Kubernetes cluster, suited to a complex microservices architecture that needs fine-grained orchestration, sidecars, or Kubernetes-specific patterns, but at the cost of much heavier operational overhead. For a simple or medium application without a need for advanced orchestration, App Service avoids unnecessary complexity.",
    },
    pitfall: {
      fr: "Le piège est de choisir AKS par défaut parce que Kubernetes est devenu un standard de fait, sans que le projet ait réellement besoin de son niveau d'orchestration : ça ajoute une charge opérationnelle et une courbe d'apprentissage significatives pour un bénéfice qui peut rester théorique sur une application simple.",
      en: "The trap is choosing AKS by default because Kubernetes has become a de facto standard, without the project actually needing its level of orchestration: it adds significant operational overhead and a learning curve for a benefit that can remain theoretical on a simple application.",
    },
    tags: ["app-service", "aks", "architecture"],
  },
  {
    id: "azure-resource-groups",
    topicId: "azure",
    difficulty: "easy",
    question: {
      fr: "À quoi sert un resource group dans Azure ?",
      en: "What is a resource group for in Azure ?",
    },
    answer: {
      fr: "Un resource group est un conteneur logique qui regroupe les ressources Azure liées à un même projet ou environnement, comme des machines virtuelles, une base de données et un réseau, sans nécessairement partager de contrainte technique entre elles. Il sert principalement d'unité de gestion : appliquer des permissions IAM à toutes les ressources qu'il contient d'un coup, suivre les coûts associés à ce périmètre précis, et surtout supprimer d'un seul coup toutes les ressources d'un environnement de test en supprimant simplement le resource group. C'est une frontière organisationnelle et de gestion du cycle de vie, pas une frontière réseau ou de sécurité en soi.",
      en: "A resource group is a logical container grouping Azure resources related to the same project or environment, like virtual machines, a database and a network, without necessarily sharing a technical constraint between them. It mainly serves as a management unit: applying IAM permissions to every resource it contains at once, tracking costs tied to that precise scope, and especially deleting every resource of a test environment in one go by simply deleting the resource group. It's an organizational and lifecycle management boundary, not a network or security boundary in itself.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'un resource group isole automatiquement le réseau ou la sécurité de ses ressources par rapport à un autre resource group : deux ressources dans deux resource groups différents peuvent très bien communiquer librement entre elles si le réseau et les règles de pare-feu le permettent, l'isolement réelle vient de la configuration réseau, pas du regroupement organisationnel.",
      en: "The trap is believing a resource group automatically isolates the network or security of its resources from another resource group: two resources in two different resource groups can perfectly well communicate freely with each other if the network and firewall rules allow it, real isolation comes from network configuration, not from organizational grouping.",
    },
    tags: ["resource-groups", "governance", "basics"],
  },
  {
    id: "azure-active-directory-basics",
    topicId: "azure",
    difficulty: "medium",
    question: {
      fr: "Quel est le rôle de Microsoft Entra ID (anciennement Azure Active Directory) dans une architecture Azure, et qu'est-ce qu'un service principal ?",
      en: "What is the role of Microsoft Entra ID (formerly Azure Active Directory) in an Azure architecture, and what is a service principal ?",
    },
    answer: {
      fr: "Entra ID est le service d'identité central d'Azure : il gère l'authentification et l'autorisation des utilisateurs, des groupes et des applications à travers l'ensemble des services Azure et de nombreuses applications tierces qui s'y connectent, en s'appuyant sur des protocoles standards comme OAuth 2.0 et OpenID Connect. Un service principal est l'identité qu'utilise une application ou un service, plutôt qu'un humain, pour s'authentifier auprès d'Entra ID et accéder aux ressources Azure avec des permissions précises qui lui sont attribuées, l'équivalent d'un compte de service dans d'autres écosystèmes cloud.",
      en: "Entra ID is Azure's central identity service: it handles authentication and authorization for users, groups and applications across the whole set of Azure services and many third-party applications connecting to it, relying on standard protocols like OAuth 2.0 and OpenID Connect. A service principal is the identity an application or service, rather than a human, uses to authenticate to Entra ID and access Azure resources with precise permissions assigned to it, the equivalent of a service account in other cloud ecosystems.",
    },
    pitfall: {
      fr: "Le piège est de créer un service principal avec un secret client stocké en dur dans la configuration de l'application, plutôt que d'utiliser une identité managée quand la ressource s'y prête : l'identité managée élimine le besoin de gérer et de faire tourner un secret manuellement, réduisant le risque en cas de fuite de configuration.",
      en: "The trap is creating a service principal with a client secret hardcoded into the application's configuration, rather than using a managed identity when the resource allows it: a managed identity eliminates the need to manage and rotate a secret manually, reducing the risk in case of a configuration leak.",
    },
    tags: ["entra-id", "identity", "security"],
  },
  {
    id: "azure-functions-triggers",
    topicId: "azure",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionnent les triggers dans Azure Functions ?",
      en: "How do triggers work in Azure Functions ?",
    },
    answer: {
      fr: "Un trigger définit ce qui déclenche l'exécution d'une fonction et lui fournit automatiquement les données d'entrée associées à cet événement : une requête HTTP, un nouveau message arrivé sur une file Service Bus ou Storage Queue, un fichier ajouté à un compte de stockage, ou encore un timer déclenché à intervalle régulier. Une fonction ne peut avoir qu'un seul trigger, mais peut ensuite utiliser des input bindings et output bindings pour lire ou écrire d'autres ressources Azure, comme une base de données ou un autre message, sans avoir à écrire tout le code d'intégration à la main.",
      en: "A trigger defines what starts a function's execution and automatically supplies it with the input data tied to that event: an HTTP request, a new message arriving on a Service Bus or Storage Queue, a file added to a storage account, or a timer firing at a regular interval. A function can only have one trigger, but can then use input and output bindings to read or write other Azure resources, like a database or another message, without having to hand-write all the integration code.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que la plupart des triggers, comme celui d'une file d'attente, garantissent une livraison at-least-once et non exactly-once : une fonction peut donc être invoquée plus d'une fois pour le même message en cas de panne ou de retry, ce qui impose de rendre le traitement idempotent plutôt que de supposer qu'il ne s'exécutera jamais deux fois.",
      en: "The trap is forgetting that most triggers, like a queue trigger, guarantee at-least-once delivery rather than exactly-once: a function can therefore be invoked more than once for the same message in case of failure or retry, which requires making the processing idempotent rather than assuming it will never run twice.",
    },
    tags: ["azure-functions", "serverless", "triggers"],
  },
  {
    id: "azure-storage-account-tiers",
    topicId: "azure",
    difficulty: "easy",
    question: {
      fr: "Quelles sont les principales options de niveau d'accès (access tier) d'un compte de stockage Azure, et sur quel critère choisir ?",
      en: "What are the main access tier options for an Azure storage account, and what criterion should you use to choose ?",
    },
    answer: {
      fr: "Le niveau Hot convient aux données consultées fréquemment, avec le coût de stockage le plus élevé mais le coût d'accès le plus bas. Le niveau Cool convient à des données accédées occasionnellement, en général au moins une fois par mois, avec un coût de stockage réduit mais un coût par accès plus élevé et une durée de conservation minimale à respecter. Le niveau Archive offre le coût de stockage le plus bas pour des données rarement voire jamais consultées, comme une archive réglementaire, mais nécessite une réhydratation qui peut prendre plusieurs heures avant que la donnée redevienne accessible. Le bon critère de choix reste la fréquence d'accès attendue aux données, pas leur volume ni leur importance perçue.",
      en: "The Hot tier fits frequently accessed data, with the highest storage cost but the lowest access cost. The Cool tier fits occasionally accessed data, typically at least once a month, with lower storage cost but a higher per-access cost and a minimum retention period to respect. The Archive tier offers the lowest storage cost for rarely or never accessed data, like a regulatory archive, but requires rehydration that can take several hours before the data becomes accessible again. The right criterion remains the expected access frequency, not the volume or perceived importance of the data.",
    },
    pitfall: {
      fr: "Le piège est de placer en Archive des données dont on n'est pas certain de la fréquence de consultation future, uniquement pour économiser sur le stockage : si elles sont finalement consultées plus souvent que prévu, le coût cumulé de réhydratation et d'accès peut largement dépasser ce qu'aurait coûté un niveau Cool ou Hot dès le départ.",
      en: "The trap is placing data whose future access frequency isn't certain into Archive, purely to save on storage, if it ends up being accessed more often than expected, the cumulative rehydration and access cost can far exceed what a Cool or Hot tier would have cost from the start.",
    },
    tags: ["storage-account", "access-tiers", "cost-optimization"],
  },
  {
    id: "azure-vnet-basics",
    topicId: "azure",
    difficulty: "medium",
    question: {
      fr: "Qu'est-ce qu'un VNet Azure, et comment un Network Security Group (NSG) s'y intègre-t-il ?",
      en: "What is an Azure VNet, and how does a Network Security Group (NSG) fit into it ?",
    },
    answer: {
      fr: "Un VNet (Virtual Network) est le réseau privé isolé où résident les ressources Azure d'un projet, découpé en sous-réseaux selon les besoins de segmentation. Un NSG est un pare-feu à état qu'on associe à un sous-réseau ou directement à une interface réseau, avec des règles qui autorisent ou refusent le trafic entrant et sortant selon le protocole, le port et la source ou destination. En combinant un découpage en sous-réseaux logiques et des NSG associés à chacun, on peut mettre en place une segmentation réseau fine, par exemple isoler un sous-réseau de base de données pour qu'il n'accepte du trafic que depuis le sous-réseau applicatif.",
      en: "A VNet (Virtual Network) is the isolated private network where a project's Azure resources live, split into subnets according to segmentation needs. An NSG is a stateful firewall attached to a subnet or directly to a network interface, with rules that allow or deny inbound and outbound traffic based on protocol, port and source or destination. By combining a split into logical subnets with NSGs attached to each, you can set up fine-grained network segmentation, for example isolating a database subnet so it only accepts traffic from the application subnet.",
    },
    pitfall: {
      fr: "Le piège est d'oublier qu'un NSG peut être associé à la fois à un sous-réseau et à une interface réseau individuelle, et que les deux jeux de règles s'appliquent alors ensemble : un trafic peut être bloqué par l'un même si l'autre l'autorise, ce qui complique le débogage si on ne vérifie pas les deux niveaux d'association.",
      en: "The trap is forgetting an NSG can be attached to both a subnet and an individual network interface, and that both rule sets then apply together: traffic can be blocked by one even if the other allows it, which complicates debugging if both levels of association aren't checked.",
    },
    tags: ["vnet", "networking", "nsg"],
  },
  {
    id: "azure-devops-vs-github-actions",
    topicId: "azure",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence d'approche entre Azure DevOps Pipelines et GitHub Actions pour la CI/CD ?",
      en: "What is the difference in approach between Azure DevOps Pipelines and GitHub Actions for CI/CD ?",
    },
    answer: {
      fr: "Azure DevOps Pipelines est une plateforme CI/CD complète historiquement pensée pour des organisations avec des besoins de gouvernance poussés, avec une gestion fine des environnements, des approbations multi-étapes, et une intégration profonde avec l'écosystème Microsoft, tout en pouvant fonctionner avec un code hébergé ailleurs que sur Azure Repos. GitHub Actions est plus récent et directement intégré au dépôt GitHub, avec une syntaxe YAML orientée événements du dépôt, un marketplace très riche d'actions communautaires réutilisables, et une adoption plus naturelle pour une équipe déjà centrée sur GitHub. Le choix dépend souvent de l'écosystème déjà en place plutôt que d'une différence fondamentale de capacité entre les deux.",
      en: "Azure DevOps Pipelines is a full CI/CD platform historically designed for organizations with advanced governance needs, with fine-grained environment management, multi-stage approvals, and deep integration with the Microsoft ecosystem, while still being able to work with code hosted elsewhere than Azure Repos. GitHub Actions is more recent and directly integrated into the GitHub repository, with a YAML syntax oriented around repository events, a very rich marketplace of reusable community actions, and more natural adoption for a team already centered on GitHub. The choice often depends on the ecosystem already in place rather than a fundamental capability difference between the two.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer le coût de migration d'un existant conséquent en pipelines Azure DevOps vers GitHub Actions, ou l'inverse, en se basant uniquement sur des préférences de syntaxe : au-delà de la syntaxe, les intégrations spécifiques déjà construites, comme les gates d'approbation ou les connexions à des services externes, représentent souvent le vrai coût de changement.",
      en: "The trap is underestimating the migration cost of a substantial existing set of Azure DevOps pipelines to GitHub Actions, or the reverse, based only on syntax preferences: beyond syntax, the specific integrations already built, like approval gates or connections to external services, are often the real cost of switching.",
    },
    tags: ["ci-cd", "azure-devops", "github-actions"],
  },
  {
    id: "azure-managed-identity",
    topicId: "azure",
    difficulty: "hard",
    question: {
      fr: "Qu'apporte une identité managée (managed identity) par rapport à un service principal classique avec un secret client ?",
      en: "What does a managed identity provide compared to a classic service principal with a client secret ?",
    },
    answer: {
      fr: "Un service principal classique nécessite de générer, stocker et faire tourner régulièrement un secret client, ce qui crée un risque permanent de fuite si ce secret se retrouve dans un dépôt de code, une variable d'environnement mal protégée, ou un log. Une identité managée est automatiquement gérée par Azure pour une ressource spécifique, comme une machine virtuelle ou une App Service : Azure génère et fait tourner les identifiants sous-jacents en interne, sans jamais les exposer au développeur, qui n'a qu'à autoriser cette identité à accéder aux ressources ciblées via IAM. Il existe deux types, l'identité managée assignée par le système, liée au cycle de vie de la ressource, et l'identité managée assignée par l'utilisateur, qui existe indépendamment et peut être partagée entre plusieurs ressources.",
      en: "A classic service principal requires generating, storing and regularly rotating a client secret, creating a permanent leak risk if that secret ends up in a code repository, a poorly protected environment variable, or a log. A managed identity is automatically managed by Azure for a specific resource, like a virtual machine or an App Service: Azure generates and rotates the underlying credentials internally, never exposing them to the developer, who only needs to authorize that identity to access the targeted resources via IAM. There are two types, system-assigned managed identity, tied to the resource's lifecycle, and user-assigned managed identity, which exists independently and can be shared across multiple resources.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'une identité managée est utilisable partout sans restriction : elle ne fonctionne que pour authentifier une ressource Azure auprès d'un autre service Azure qui supporte Entra ID, elle ne remplace pas un mécanisme d'authentification pour un utilisateur humain ou pour un appel vers un service totalement externe à Azure.",
      en: "The trap is believing a managed identity is usable everywhere without restriction: it only works to authenticate an Azure resource to another Azure service that supports Entra ID, it doesn't replace an authentication mechanism for a human user or for a call to a service entirely external to Azure.",
    },
    tags: ["managed-identity", "security", "azure-ad"],
  },

  // Docker
  {
    id: "docker-image-vs-container",
    topicId: "docker",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre une image Docker et un conteneur ?",
      en: "What is the difference between a Docker image and a container ?",
    },
    answer: {
      fr: "Une image Docker est un modèle en lecture seule qui contient le système de fichiers, les dépendances et la configuration nécessaires pour faire tourner une application, construite une fois à partir d'un Dockerfile puis stockée et versionnée. Un conteneur est une instance en cours d'exécution de cette image, avec une couche en écriture ajoutée par-dessus pour tous les changements effectués pendant son fonctionnement. On peut lancer plusieurs conteneurs indépendants à partir de la même image, chacun avec son propre état d'exécution, ses propres processus, et sa propre couche d'écriture, sans que l'image d'origine soit jamais modifiée.",
      en: "A Docker image is a read-only template containing the filesystem, dependencies and configuration needed to run an application, built once from a Dockerfile and then stored and versioned. A container is a running instance of that image, with a writable layer added on top for any changes made while it's running. You can launch several independent containers from the same image, each with its own runtime state, its own processes, and its own writable layer, without the original image ever being modified.",
    },
    pitfall: {
      fr: "Le piège est de croire que les modifications faites dans un conteneur en cours d'exécution, comme installer un paquet manuellement, sont conservées si on relance un nouveau conteneur depuis la même image : elles ne persistent que dans la couche d'écriture de ce conteneur précis, et disparaissent avec lui à moins d'avoir été explicitement intégrées dans une nouvelle image.",
      en: "The trap is believing changes made inside a running container, like manually installing a package, are kept if you launch a new container from the same image: they only persist in that specific container's writable layer, and disappear with it unless explicitly baked into a new image.",
    },
    tags: ["images", "containers", "basics"],
  },
  {
    id: "docker-layers-caching",
    topicId: "docker",
    difficulty: "medium",
    question: {
      fr: "Comment fonctionne le système de couches (layers) dans une image Docker, et comment ça affecte la vitesse de build ?",
      en: "How does the layer system work in a Docker image, and how does it affect build speed ?",
    },
    answer: {
      fr: "Chaque instruction d'un Dockerfile, comme COPY ou RUN, produit une nouvelle couche empilée sur les précédentes, et Docker met en cache chaque couche individuellement en se basant sur l'instruction et son contexte. Au build suivant, si une instruction et tout ce qui la précède n'ont pas changé, Docker réutilise directement la couche en cache au lieu de la reconstruire, ce qui accélère fortement les builds répétés. Dès qu'une instruction change, cette couche et toutes celles qui suivent doivent être reconstruites, même si elles n'ont elles-mêmes pas changé, d'où l'intérêt de bien ordonner les instructions du Dockerfile.",
      en: "Every instruction in a Dockerfile, like COPY or RUN, produces a new layer stacked on top of the previous ones, and Docker caches each layer individually based on the instruction and its context. On the next build, if an instruction and everything before it hasn't changed, Docker directly reuses the cached layer instead of rebuilding it, which strongly speeds up repeated builds. As soon as one instruction changes, that layer and every one after it must be rebuilt, even if they themselves haven't changed, which is why ordering the Dockerfile's instructions carefully matters.",
    },
    pitfall: {
      fr: "Le piège classique est de copier tout le code source avant d'installer les dépendances dans le Dockerfile : comme le code change bien plus souvent que les dépendances, ça invalide systématiquement le cache de l'étape d'installation à chaque build, alors que copier d'abord uniquement le fichier de dépendances, installer, puis copier le reste du code, garde ce cache valide tant que les dépendances n'ont pas changé.",
      en: "The classic trap is copying the entire source code before installing dependencies in the Dockerfile: since code changes far more often than dependencies, that systematically invalidates the install step's cache on every build, whereas copying only the dependency file first, installing, then copying the rest of the code keeps that cache valid as long as dependencies haven't changed.",
    },
    tags: ["layers", "build-cache", "performance"],
  },
  {
    id: "docker-multi-stage-builds",
    topicId: "docker",
    difficulty: "medium",
    question: {
      fr: "À quoi servent les builds multi-étapes (multi-stage builds) dans Docker ?",
      en: "What are multi-stage builds in Docker for ?",
    },
    answer: {
      fr: "Un build multi-étapes permet de définir plusieurs étapes FROM successives dans un même Dockerfile, chacune pouvant utiliser une image de base différente : typiquement une première étape avec tous les outils de compilation nécessaires pour construire l'application, comme le JDK complet et Maven, et une étape finale beaucoup plus légère qui ne récupère que l'artefact compilé depuis la première étape, sur une image minimale d'exécution comme un JRE seul. L'image finale ne contient alors que le strict nécessaire pour exécuter l'application, sans les outils de build qui ont servi à la construire, ce qui réduit fortement la taille de l'image et sa surface d'attaque.",
      en: "A multi-stage build lets you define several successive FROM stages in the same Dockerfile, each able to use a different base image: typically a first stage with all the build tools needed to compile the application, like a full JDK and Maven, and a much lighter final stage that only pulls the compiled artifact from the first stage, on a minimal runtime image like a JRE alone. The final image then contains only what's strictly needed to run the application, without the build tools used to construct it, strongly reducing image size and attack surface.",
    },
    pitfall: {
      fr: "Le piège est d'oublier de nettoyer les fichiers intermédiaires ou de cache dans la dernière étape d'un build multi-étapes : même si les outils de build de la première étape n'apparaissent plus dans l'image finale, des artefacts temporaires copiés par erreur dans la dernière étape peuvent quand même alourdir inutilement l'image finale.",
      en: "The trap is forgetting to clean up intermediate or cache files in the final stage of a multi-stage build: even though the first stage's build tools don't appear in the final image, temporary artifacts accidentally copied into the final stage can still needlessly bloat the final image.",
    },
    tags: ["multi-stage-builds", "image-optimization"],
  },
  {
    id: "docker-volumes-vs-bind-mounts",
    topicId: "docker",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre un volume Docker et un bind mount ?",
      en: "What is the difference between a Docker volume and a bind mount ?",
    },
    answer: {
      fr: "Un bind mount associe directement un chemin du système de fichiers de la machine hôte à un chemin dans le conteneur : le conteneur voit et modifie exactement les fichiers de l'hôte à cet endroit, pratique pour le développement local quand on veut voir ses changements de code reflétés immédiatement dans le conteneur sans reconstruire l'image. Un volume est un espace de stockage entièrement géré par Docker, indépendant de la structure de fichiers de l'hôte, qui persiste au-delà du cycle de vie d'un conteneur donné et peut être partagé entre plusieurs conteneurs de façon contrôlée. Les volumes sont généralement préférés en production, car ils sont portables entre environnements et ne dépendent pas d'un chemin précis sur l'hôte.",
      en: "A bind mount directly ties a path on the host machine's filesystem to a path in the container: the container sees and modifies exactly the host's files at that location, handy for local development when you want code changes reflected immediately in the container without rebuilding the image. A volume is a storage space entirely managed by Docker, independent of the host's file structure, which persists beyond a given container's lifecycle and can be shared across several containers in a controlled way. Volumes are generally preferred in production, since they're portable across environments and don't depend on a specific host path.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser un bind mount en production de la même façon qu'en développement : ça crée une dépendance forte à la structure de fichiers exacte de la machine hôte, ce qui casse la portabilité du déploiement et peut poser des problèmes de permissions selon l'environnement d'exécution.",
      en: "The trap is using a bind mount in production the same way as in development: it creates a strong dependency on the exact file structure of the host machine, which breaks deployment portability and can cause permission issues depending on the runtime environment.",
    },
    tags: ["volumes", "bind-mounts", "storage"],
  },
  {
    id: "docker-networking-basics",
    topicId: "docker",
    difficulty: "medium",
    question: {
      fr: "Comment deux conteneurs peuvent-ils communiquer entre eux par défaut avec Docker ?",
      en: "How can two containers communicate with each other by default with Docker ?",
    },
    answer: {
      fr: "Par défaut, Docker crée un réseau bridge auquel les conteneurs se connectent, et sur un réseau bridge défini par l'utilisateur, plutôt que le réseau bridge par défaut historique, Docker fournit une résolution DNS automatique : chaque conteneur peut joindre un autre conteneur du même réseau simplement en utilisant son nom comme s'il s'agissait d'un nom d'hôte, sans connaître son adresse IP. Cette communication reste interne au réseau Docker : pour qu'un service extérieur à Docker, comme un navigateur sur la machine hôte, puisse joindre un conteneur, il faut explicitement publier un port du conteneur vers un port de l'hôte.",
      en: "By default, Docker creates a bridge network that containers connect to, and on a user-defined bridge network, rather than the legacy default bridge network, Docker provides automatic DNS resolution: any container can reach another container on the same network simply by using its name as if it were a hostname, without knowing its IP address. This communication stays internal to the Docker network: for a service outside Docker, like a browser on the host machine, to reach a container, a container port must be explicitly published to a host port.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que le réseau bridge par défaut historique, celui créé automatiquement sans réseau nommé explicitement, ne fournit pas cette résolution DNS par nom de conteneur : sur ce réseau par défaut, il faut passer par des liens legacy ou connaître les adresses IP, ce qui explique pourquoi la bonne pratique reste de toujours créer un réseau bridge nommé explicitement, notamment avec Docker Compose qui le fait automatiquement.",
      en: "The trap is forgetting that the legacy default bridge network, the one created automatically without an explicitly named network, doesn't provide this container-name DNS resolution: on that default network, you need legacy links or to know IP addresses, which is why the good practice remains always creating an explicitly named bridge network, which Docker Compose does automatically.",
    },
    tags: ["networking", "bridge-network", "dns"],
  },
  {
    id: "docker-compose-purpose",
    topicId: "docker",
    difficulty: "easy",
    question: {
      fr: "À quoi sert Docker Compose, et en quoi diffère-t-il de lancer plusieurs conteneurs avec docker run ?",
      en: "What is Docker Compose for, and how does it differ from launching several containers with docker run ?",
    },
    answer: {
      fr: "Docker Compose permet de décrire dans un seul fichier YAML plusieurs services conteneurisés qui composent une application, avec leurs images, leurs variables d'environnement, leurs volumes, leurs ports et leurs dépendances entre eux, plutôt que d'enchaîner manuellement plusieurs commandes docker run avec de nombreuses options. Une seule commande, docker compose up, suffit alors à démarrer tous les services ensemble, dans le bon ordre de dépendance, sur un réseau commun créé automatiquement où ils peuvent se joindre par leur nom. C'est particulièrement utile pour reproduire facilement un environnement de développement complet, comme une application avec sa base de données et son cache, de façon reproductible pour toute l'équipe.",
      en: "Docker Compose lets you describe, in a single YAML file, several containerized services that make up an application, with their images, environment variables, volumes, ports and dependencies between them, rather than manually chaining several docker run commands with many options. A single command, docker compose up, is then enough to start every service together, in the right dependency order, on a common network created automatically where they can reach each other by name. It's particularly useful for easily reproducing a complete development environment, like an application with its database and cache, in a way that's reproducible for the whole team.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser Docker Compose tel quel comme solution d'orchestration en production à grande échelle : il reste conçu pour un usage mono-machine, sans les capacités de haute disponibilité, de répartition sur plusieurs nœuds ou d'auto-scaling qu'offre un orchestrateur comme Kubernetes, qui devient nécessaire au-delà d'un certain niveau d'exigence de production.",
      en: "The trap is using Docker Compose as-is as a large-scale production orchestration solution: it remains designed for single-machine use, without the high availability, multi-node distribution or auto-scaling capabilities an orchestrator like Kubernetes offers, which becomes necessary beyond a certain level of production requirements.",
    },
    tags: ["docker-compose", "local-development", "orchestration"],
  },
  {
    id: "docker-image-size-optimization",
    topicId: "docker",
    difficulty: "medium",
    question: {
      fr: "Quelles sont les principales techniques pour réduire la taille d'une image Docker ?",
      en: "What are the main techniques for reducing a Docker image's size ?",
    },
    answer: {
      fr: "Partir d'une image de base minimale, comme une variante alpine ou distroless plutôt qu'une image complète avec un système d'exploitation entier, réduit considérablement la taille de départ. Les builds multi-étapes permettent d'exclure les outils de build du résultat final, comme vu précédemment. Regrouper plusieurs instructions RUN liées en une seule limite le nombre de couches créées et évite de laisser des fichiers temporaires dans une couche intermédiaire qui reste comptée dans la taille totale même si elle est supprimée dans une couche suivante. Enfin, un fichier .dockerignore bien configuré évite de copier accidentellement des fichiers inutiles, comme le dossier node_modules local ou l'historique git, dans le contexte de build.",
      en: "Starting from a minimal base image, like an alpine or distroless variant rather than a full image with an entire operating system, considerably reduces the starting size. Multi-stage builds let you exclude build tools from the final result, as seen earlier. Grouping several related RUN instructions into one limits the number of layers created and avoids leaving temporary files in an intermediate layer that still counts toward the total size even if removed in a later layer. Finally, a well-configured .dockerignore file avoids accidentally copying unnecessary files, like the local node_modules folder or the git history, into the build context.",
    },
    pitfall: {
      fr: "Le piège classique est de supprimer des fichiers temporaires dans une instruction RUN séparée de celle qui les a créés : comme chaque couche est immuable une fois créée, supprimer un fichier dans une couche ultérieure ne réduit pas la taille de l'image, le fichier reste présent dans la couche précédente, il faut créer et nettoyer dans la même instruction RUN pour que ça compte réellement.",
      en: "The classic trap is deleting temporary files in a RUN instruction separate from the one that created them: since each layer is immutable once created, removing a file in a later layer doesn't reduce the image size, the file still exists in the earlier layer, you need to create and clean up within the same RUN instruction for it to actually count.",
    },
    tags: ["image-optimization", "best-practices"],
  },
  {
    id: "docker-container-vs-vm",
    topicId: "docker",
    difficulty: "hard",
    question: {
      fr: "En quoi l'isolation apportée par un conteneur diffère-t-elle fondamentalement de celle d'une machine virtuelle ?",
      en: "How does the isolation provided by a container fundamentally differ from that of a virtual machine ?",
    },
    answer: {
      fr: "Une machine virtuelle virtualise le matériel et fait tourner un système d'exploitation complet et indépendant, avec son propre noyau, au-dessus d'un hyperviseur, ce qui offre une isolation très forte mais un coût en ressources et en temps de démarrage significatif. Un conteneur, lui, partage le noyau du système d'exploitation hôte et s'isole grâce à des mécanismes du noyau Linux, principalement les namespaces, qui isolent la vue que le conteneur a du système, comme les processus ou le réseau, et les cgroups, qui limitent et comptabilisent les ressources qu'il peut consommer. Cette isolation au niveau du noyau plutôt qu'au niveau matériel rend les conteneurs beaucoup plus légers et rapides à démarrer, mais avec une frontière d'isolation intrinsèquement moins étanche qu'une VM.",
      en: "A virtual machine virtualizes hardware and runs a full, independent operating system, with its own kernel, on top of a hypervisor, offering very strong isolation but at a significant cost in resources and startup time. A container, instead, shares the host operating system's kernel and isolates itself through Linux kernel mechanisms, mainly namespaces, which isolate the container's view of the system, like processes or networking, and cgroups, which limit and account for the resources it can consume. This kernel-level isolation rather than hardware-level isolation makes containers much lighter and faster to start, but with an isolation boundary that's inherently less airtight than a VM's.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter un conteneur comme aussi sûr qu'une VM pour isoler du code totalement non fiable : parce que le noyau est partagé, une faille d'évasion de conteneur peut potentiellement affecter l'hôte et les autres conteneurs, ce qui explique pourquoi l'exécution de code non fiable préfère souvent une isolation renforcée, comme une VM dédiée ou une sandbox spécialisée type gVisor ou Firecracker.",
      en: "The interview trap is presenting a container as equally safe as a VM for isolating fully untrusted code: because the kernel is shared, a container escape flaw can potentially affect the host and other containers, which is why running untrusted code often prefers stronger isolation, like a dedicated VM or a specialized sandbox such as gVisor or Firecracker.",
    },
    tags: ["isolation", "virtualization", "security"],
  },

  // Terraform
  {
    id: "terraform-state-file-purpose",
    topicId: "terraform",
    difficulty: "easy",
    question: {
      fr: "À quoi sert le fichier d'état (state) de Terraform ?",
      en: "What is Terraform's state file for ?",
    },
    answer: {
      fr: "Le fichier d'état conserve la correspondance entre les ressources déclarées dans la configuration Terraform et les ressources réelles déjà créées chez le fournisseur cloud, avec leurs identifiants et leurs attributs actuels. C'est en comparant cet état enregistré avec la configuration désirée que Terraform détermine quelles actions effectuer, créer, modifier ou supprimer, pour faire converger l'infrastructure réelle vers ce qui est décrit dans le code. Sans ce fichier, Terraform n'aurait aucun moyen de savoir quelles ressources existent déjà ni de faire le lien entre une ressource déclarée dans le code et son équivalent réel chez le fournisseur.",
      en: "The state file keeps the mapping between resources declared in the Terraform configuration and the real resources already created at the cloud provider, along with their identifiers and current attributes. It's by comparing this recorded state with the desired configuration that Terraform determines which actions to take, create, modify or delete, to converge the real infrastructure toward what's described in the code. Without this file, Terraform would have no way of knowing which resources already exist or of linking a resource declared in code to its real counterpart at the provider.",
    },
    pitfall: {
      fr: "Le piège est de modifier une ressource gérée par Terraform directement dans la console du fournisseur cloud, en dehors de Terraform : le fichier d'état ne reflète plus la réalité, ce qu'on appelle une dérive de configuration, et le prochain plan Terraform peut alors proposer de défaire ce changement manuel sans que ce soit l'intention.",
      en: "The trap is modifying a Terraform-managed resource directly in the cloud provider's console, outside of Terraform: the state file no longer reflects reality, what's called configuration drift, and the next Terraform plan can then propose undoing that manual change without that being the intent.",
    },
    tags: ["state", "basics"],
  },
  {
    id: "terraform-plan-vs-apply",
    topicId: "terraform",
    difficulty: "easy",
    question: {
      fr: "Quelle est la différence entre terraform plan et terraform apply ?",
      en: "What is the difference between terraform plan and terraform apply ?",
    },
    answer: {
      fr: "terraform plan calcule et affiche les changements que Terraform effectuerait pour faire correspondre l'infrastructure réelle à la configuration, sans réellement rien modifier : c'est une simulation en lecture seule qui montre précisément ce qui serait créé, modifié ou supprimé. terraform apply exécute réellement ces changements, en général après avoir montré le même plan pour confirmation avant de continuer. Séparer les deux étapes permet de relire et de valider les changements prévus avant qu'ils aient un impact réel, en particulier dans un contexte d'équipe où une revue du plan avant application est une bonne pratique courante.",
      en: "terraform plan computes and displays the changes Terraform would make to bring real infrastructure in line with the configuration, without actually modifying anything: it's a read-only simulation showing precisely what would be created, modified or deleted. terraform apply actually executes those changes, generally after showing that same plan for confirmation before proceeding. Separating the two steps lets you review and validate the planned changes before they have a real impact, especially in a team context where reviewing the plan before applying is a common good practice.",
    },
    pitfall: {
      fr: "Le piège est de lancer terraform apply directement sans avoir lu attentivement le plan affiché juste avant, surtout avec l'option qui saute la confirmation interactive dans un script automatisé : un changement inattendu, comme la suppression et recréation d'une ressource plutôt qu'une simple modification, peut passer inaperçu et causer une interruption de service évitable.",
      en: "The trap is running terraform apply without carefully reading the plan displayed right before, especially with the flag that skips interactive confirmation in an automated script: an unexpected change, like a resource being destroyed and recreated rather than simply modified, can go unnoticed and cause an avoidable service interruption.",
    },
    tags: ["plan", "apply", "workflow"],
  },
  {
    id: "terraform-remote-state-locking",
    topicId: "terraform",
    difficulty: "medium",
    question: {
      fr: "Pourquoi utiliser un backend d'état distant avec verrouillage plutôt que de garder le fichier d'état en local, en particulier en équipe ?",
      en: "Why use a remote state backend with locking rather than keeping the state file locally, especially as a team ?",
    },
    answer: {
      fr: "Un fichier d'état local n'est visible que sur la machine d'une seule personne, ce qui empêche le reste de l'équipe de savoir quel est l'état réel de l'infrastructure ou de lancer leurs propres changements en toute sécurité. Un backend distant, comme un bucket de stockage cloud, centralise ce fichier d'état pour que toute l'équipe travaille à partir de la même source de vérité. Le verrouillage, activé sur la plupart des backends distants, empêche deux exécutions concurrentes de Terraform de modifier le même état en même temps, ce qui éviterait sinon une corruption de l'état ou des changements contradictoires appliqués en parallèle.",
      en: "A local state file is only visible on one person's machine, which prevents the rest of the team from knowing the infrastructure's real state or safely running their own changes. A remote backend, like a cloud storage bucket, centralizes that state file so the whole team works from the same source of truth. Locking, enabled on most remote backends, prevents two concurrent Terraform runs from modifying the same state at the same time, which would otherwise risk state corruption or conflicting changes applied in parallel.",
    },
    pitfall: {
      fr: "Le piège est de committer le fichier d'état local dans le dépôt Git comme solution de partage improvisée : en plus de ne pas résoudre le problème du verrouillage concurrent, le fichier d'état peut contenir des valeurs sensibles en clair, comme des mots de passe générés, ce qui expose ces secrets à quiconque a accès à l'historique du dépôt.",
      en: "The trap is committing the local state file into the Git repository as an improvised sharing solution: besides not solving the concurrent locking problem, the state file can contain sensitive values in plain text, like generated passwords, exposing those secrets to anyone with access to the repository's history.",
    },
    tags: ["remote-state", "locking", "team-workflow"],
  },
  {
    id: "terraform-modules-basics",
    topicId: "terraform",
    difficulty: "medium",
    question: {
      fr: "À quoi servent les modules Terraform ?",
      en: "What are Terraform modules for ?",
    },
    answer: {
      fr: "Un module Terraform est un ensemble de fichiers de configuration regroupés pour représenter un composant d'infrastructure réutilisable, avec des variables d'entrée qui paramètrent son comportement et des valeurs de sortie qui exposent des informations utiles au reste de la configuration. Plutôt que de dupliquer la même déclaration de ressources, comme un réseau ou une base de données, dans chaque environnement ou projet, on définit ce composant une seule fois comme module et on l'appelle avec des paramètres différents pour chaque contexte, ce qui centralise la logique et réduit fortement la duplication de code.",
      en: "A Terraform module is a set of configuration files grouped to represent a reusable infrastructure component, with input variables that parametrize its behavior and output values that expose useful information to the rest of the configuration. Rather than duplicating the same resource declaration, like a network or a database, in every environment or project, you define that component once as a module and call it with different parameters for each context, centralizing the logic and strongly reducing code duplication.",
    },
    pitfall: {
      fr: "Le piège est de créer un module beaucoup trop générique et paramétré à outrance dès le départ, en essayant d'anticiper tous les usages futurs possibles : ça produit un module difficile à comprendre et à maintenir, une meilleure approche est d'extraire un module concret à partir de duplication réelle déjà observée, plutôt que d'anticiper des besoins hypothétiques.",
      en: "The trap is creating a hugely generic, over-parametrized module from the start, trying to anticipate every possible future use: that produces a module that's hard to understand and maintain, a better approach is extracting a concrete module from real duplication already observed, rather than anticipating hypothetical needs.",
    },
    tags: ["modules", "reusability", "best-practices"],
  },
  {
    id: "terraform-idempotency",
    topicId: "terraform",
    difficulty: "medium",
    question: {
      fr: "Que signifie l'idempotence dans le contexte de Terraform, et pourquoi est-ce une propriété essentielle ?",
      en: "What does idempotency mean in the context of Terraform, and why is it an essential property ?",
    },
    answer: {
      fr: "L'idempotence signifie qu'exécuter la même configuration Terraform plusieurs fois de suite produit toujours le même résultat final, sans effet de bord supplémentaire si l'infrastructure correspond déjà à ce qui est décrit. Concrètement, si on lance terraform apply une deuxième fois sans avoir changé la configuration ni l'infrastructure entre-temps, Terraform ne devrait rien avoir à faire, puisque l'état réel correspond déjà à l'état désiré. Cette propriété est ce qui rend Terraform fiable pour de l'automatisation répétée, comme relancer le même pipeline de déploiement plusieurs fois sans risque de dupliquer des ressources ou de créer un état incohérent.",
      en: "Idempotency means running the same Terraform configuration several times in a row always produces the same final result, with no additional side effect if the infrastructure already matches what's described. Concretely, if you run terraform apply a second time without having changed the configuration or the infrastructure in between, Terraform should have nothing to do, since the real state already matches the desired state. This property is what makes Terraform reliable for repeated automation, like re-running the same deployment pipeline several times without risking duplicated resources or an inconsistent state.",
    },
    pitfall: {
      fr: "Le piège est de croire que l'idempotence est garantie automatiquement pour toute ressource, y compris celles qui dépendent de valeurs générées de façon non déterministe, comme un identifiant aléatoire recalculé à chaque plan : une configuration mal écrite peut casser l'idempotence en recréant inutilement une ressource à chaque exécution, il faut vérifier que les valeurs utilisées restent stables entre les runs.",
      en: "The trap is assuming idempotency is automatically guaranteed for every resource, including those depending on non-deterministically generated values, like a random identifier recomputed on every plan: a poorly written configuration can break idempotency by needlessly recreating a resource on every run, the values used need to be checked for staying stable between runs.",
    },
    tags: ["idempotency", "automation", "reliability"],
  },
  {
    id: "terraform-drift-detection",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que la dérive de configuration (configuration drift) en Terraform, et comment la détecter et la corriger ?",
      en: "What is configuration drift in Terraform, and how do you detect and fix it ?",
    },
    answer: {
      fr: "La dérive de configuration survient quand l'infrastructure réelle chez le fournisseur cloud s'écarte de ce que décrit le fichier d'état Terraform, en général parce qu'un changement a été fait en dehors de Terraform, manuellement dans la console ou par un autre outil d'automatisation. On la détecte en exécutant terraform plan, qui compare l'état actuel réel du fournisseur, rafraîchi au début de la commande, avec la configuration désirée, et signale tout écart trouvé. Pour la corriger, deux options existent : relancer terraform apply pour ramener l'infrastructure à ce que décrit la configuration, ou mettre à jour la configuration elle-même pour refléter intentionnellement le changement effectué manuellement, selon que ce changement manuel était voulu ou pas.",
      en: "Configuration drift happens when the real infrastructure at the cloud provider diverges from what Terraform's state file describes, generally because a change was made outside Terraform, manually in the console or through another automation tool. It's detected by running terraform plan, which compares the provider's actual current state, refreshed at the start of the command, with the desired configuration, and flags any discrepancy found. Fixing it offers two options: re-running terraform apply to bring the infrastructure back to what the configuration describes, or updating the configuration itself to intentionally reflect the manually made change, depending on whether that manual change was wanted or not.",
    },
    pitfall: {
      fr: "Le piège est de lancer terraform apply en réflexe dès qu'une dérive est détectée, sans se demander si le changement manuel constaté était en fait légitime : ça peut annuler une correction d'urgence faite manuellement pour de bonnes raisons, la première question à se poser face à une dérive est toujours de savoir laquelle des deux versions, l'état réel ou la configuration, doit gagner.",
      en: "The trap is reflexively running terraform apply as soon as drift is detected, without asking whether the observed manual change was actually legitimate: it can undo an emergency fix made manually for good reasons, the first question to ask when facing drift is always which of the two versions, the real state or the configuration, should win.",
    },
    tags: ["drift", "state-management", "operations"],
  },
  {
    id: "terraform-provider-basics",
    topicId: "terraform",
    difficulty: "easy",
    question: {
      fr: "Qu'est-ce qu'un provider Terraform ?",
      en: "What is a Terraform provider ?",
    },
    answer: {
      fr: "Un provider est un plugin qui traduit les blocs de configuration Terraform, écrits dans un langage déclaratif générique, en appels concrets à l'API d'un fournisseur ou d'un service particulier, comme AWS, Azure, GCP, ou même des services non-cloud comme GitHub ou Datadog. C'est le provider qui sait comment créer, lire, modifier et supprimer chaque type de ressource qu'il expose, et qui gère l'authentification auprès du service ciblé. Un même fichier de configuration Terraform peut déclarer plusieurs providers différents, ce qui permet, par exemple, de gérer à la fois de l'infrastructure AWS et des enregistrements DNS chez un registrar tiers dans le même projet.",
      en: "A provider is a plugin that translates Terraform configuration blocks, written in a generic declarative language, into concrete API calls to a specific provider or service, like AWS, Azure, GCP, or even non-cloud services like GitHub or Datadog. It's the provider that knows how to create, read, update and delete every type of resource it exposes, and that handles authentication to the targeted service. A single Terraform configuration file can declare several different providers, letting you, for example, manage both AWS infrastructure and DNS records at a third-party registrar in the same project.",
    },
    pitfall: {
      fr: "Le piège est d'oublier de fixer une version précise ou une plage de versions pour chaque provider utilisé : sans contrainte de version, une mise à jour automatique du provider entre deux exécutions peut introduire un changement de comportement inattendu, alors que verrouiller les versions garantit des exécutions reproductibles dans le temps.",
      en: "The trap is forgetting to pin a precise version or version range for each provider used: without a version constraint, an automatic provider update between two runs can introduce an unexpected behavior change, while locking versions guarantees reproducible runs over time.",
    },
    tags: ["providers", "basics"],
  },
  {
    id: "terraform-state-secrets-risk",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Pourquoi le fichier d'état Terraform représente-t-il un risque de sécurité, et comment le limiter ?",
      en: "Why does the Terraform state file represent a security risk, and how do you mitigate it ?",
    },
    answer: {
      fr: "Le fichier d'état stocke les attributs complets de chaque ressource gérée, y compris des valeurs sensibles générées ou passées en entrée, comme un mot de passe de base de données ou une clé d'API, et ce, en clair par défaut, non chiffrées dans le fichier lui-même. N'importe qui ayant accès en lecture au fichier d'état peut donc potentiellement récupérer ces secrets, même s'il n'a pas les permissions pour y accéder directement via le fournisseur cloud. On limite ce risque en stockant l'état sur un backend distant qui chiffre les données au repos, en restreignant strictement les permissions d'accès à ce backend, et en évitant autant que possible de faire transiter des secrets bruts par des variables Terraform quand une alternative existe, comme référencer un secret déjà stocké dans un gestionnaire de secrets dédié.",
      en: "The state file stores the complete attributes of every managed resource, including sensitive values generated or passed as input, like a database password or an API key, and by default in plain text, unencrypted within the file itself. Anyone with read access to the state file can therefore potentially retrieve those secrets, even without permissions to access them directly through the cloud provider. This risk is mitigated by storing the state on a remote backend that encrypts data at rest, strictly restricting access permissions to that backend, and avoiding as much as possible passing raw secrets through Terraform variables when an alternative exists, like referencing a secret already stored in a dedicated secrets manager.",
    },
    pitfall: {
      fr: "Le piège est de croire que marquer une variable comme sensitive = true dans Terraform chiffre ou protège sa valeur : ça ne fait que masquer l'affichage de cette valeur dans les logs de plan et d'apply pour éviter une fuite accidentelle à l'écran, la valeur reste stockée en clair dans le fichier d'état, ce qui ne remplace en rien un vrai contrôle d'accès sur ce fichier.",
      en: "The trap is believing marking a variable as sensitive = true in Terraform encrypts or protects its value: it only hides that value's display in plan and apply logs to avoid an accidental on-screen leak, the value still gets stored in plain text in the state file, which is no substitute for real access control on that file.",
    },
    tags: ["state", "secrets", "security"],
  },

  // Apache Spark
  {
    id: "spark-rdd-vs-dataframe",
    topicId: "spark",
    difficulty: "medium",
    question: {
      fr: "Quelle est la différence entre un RDD et un DataFrame dans Apache Spark ?",
      en: "What is the difference between an RDD and a DataFrame in Apache Spark ?",
    },
    answer: {
      fr: "Un RDD (Resilient Distributed Dataset) est l'abstraction de bas niveau de Spark, une collection distribuée d'objets sans structure de schéma connue par Spark, sur laquelle on programme avec des transformations fonctionnelles comme map et filter, avec un contrôle fin mais peu d'optimisations automatiques. Un DataFrame ajoute une structure tabulaire avec des colonnes typées et nommées, comme une table de base de données, ce qui permet à Spark de connaître le schéma des données et d'appliquer un optimiseur de requêtes, Catalyst, qui réorganise et optimise les opérations avant de les exécuter. En pratique, les DataFrames sont largement préférés aujourd'hui pour leurs performances et leur API plus expressive, les RDD restant réservés à des cas qui ont vraiment besoin du contrôle bas niveau.",
      en: "An RDD (Resilient Distributed Dataset) is Spark's low-level abstraction, a distributed collection of objects with no schema structure known to Spark, programmed against with functional transformations like map and filter, giving fine-grained control but few automatic optimizations. A DataFrame adds tabular structure with typed, named columns, like a database table, letting Spark know the data's schema and apply a query optimizer, Catalyst, which reorganizes and optimizes operations before executing them. In practice, DataFrames are widely preferred today for their performance and more expressive API, RDDs remaining reserved for cases that genuinely need low-level control.",
    },
    pitfall: {
      fr: "Le piège est de mélanger allègrement opérations sur RDD et sur DataFrame dans le même traitement sans en mesurer le coût : convertir entre les deux représentations n'est pas gratuit, et repasser par un RDD au milieu d'un pipeline DataFrame prive Spark de la capacité de l'optimiseur Catalyst à voir et optimiser l'ensemble du traitement de bout en bout.",
      en: "The trap is freely mixing RDD and DataFrame operations in the same processing without measuring the cost: converting between the two representations isn't free, and dropping back to an RDD in the middle of a DataFrame pipeline deprives the Catalyst optimizer of the ability to see and optimize the whole processing end to end.",
    },
    tags: ["rdd", "dataframe", "api-comparison"],
  },
  {
    id: "spark-lazy-evaluation",
    topicId: "spark",
    difficulty: "medium",
    question: {
      fr: "Que signifie l'évaluation paresseuse (lazy evaluation) dans Spark, et quelle est la différence entre une transformation et une action ?",
      en: "What does lazy evaluation mean in Spark, and what is the difference between a transformation and an action ?",
    },
    answer: {
      fr: "Une transformation, comme map, filter ou join, décrit une opération à effectuer sur les données mais ne l'exécute pas immédiatement : elle ajoute simplement une étape à un plan d'exécution, un graphe orienté acyclique d'opérations à faire. Une action, comme count, collect ou write, déclenche réellement l'exécution de tout ce plan accumulé jusque-là. Cette évaluation paresseuse permet à Spark d'optimiser l'ensemble du plan avant de l'exécuter, par exemple en combinant plusieurs transformations en une seule passe sur les données ou en réordonnant des opérations pour réduire le volume de données à traiter le plus tôt possible.",
      en: "A transformation, like map, filter or join, describes an operation to perform on the data but doesn't execute it immediately: it simply adds a step to an execution plan, a directed acyclic graph of operations to perform. An action, like count, collect or write, actually triggers the execution of that entire accumulated plan. This lazy evaluation lets Spark optimize the whole plan before executing it, for example by combining several transformations into a single pass over the data or by reordering operations to reduce the volume of data processed as early as possible.",
    },
    pitfall: {
      fr: "Le piège est d'appeler plusieurs actions successives sur le même DataFrame sans le mettre en cache entre les deux : chaque action redéclenche l'exécution complète du plan depuis le début, y compris une éventuelle lecture coûteuse depuis la source de données, ce qui peut multiplier inutilement le temps de traitement total.",
      en: "The trap is calling several successive actions on the same DataFrame without caching it in between: each action re-triggers the full plan's execution from the start, including any costly read from the data source, which can needlessly multiply the total processing time.",
    },
    tags: ["lazy-evaluation", "transformations", "actions"],
  },
  {
    id: "spark-partitioning-basics",
    topicId: "spark",
    difficulty: "medium",
    question: {
      fr: "Pourquoi le nombre et la taille des partitions d'un DataFrame Spark ont-ils un impact direct sur les performances ?",
      en: "Why does the number and size of a Spark DataFrame's partitions have a direct impact on performance ?",
    },
    answer: {
      fr: "Spark répartit les données d'un DataFrame en partitions distribuées sur les différents exécuteurs du cluster, et chaque tâche traite en général une seule partition en parallèle des autres. Trop peu de partitions par rapport au nombre de cœurs disponibles laisse une partie du cluster inactive, faute de travail à répartir en parallèle. Trop de petites partitions crée un surcoût de gestion des tâches qui dépasse le gain de parallélisme, chaque tâche ayant un coût fixe de démarrage indépendant de la quantité de données qu'elle traite. Le bon dimensionnement dépend du volume de données et du nombre de cœurs disponibles, avec l'objectif d'avoir des partitions ni trop nombreuses ni trop grosses, en général de l'ordre de quelques dizaines à quelques centaines de mégaoctets chacune.",
      en: "Spark distributes a DataFrame's data across partitions spread over the cluster's different executors, and each task generally processes a single partition in parallel with others. Too few partitions relative to the available cores leaves part of the cluster idle, for lack of work to distribute in parallel. Too many small partitions creates task management overhead that exceeds the parallelism gain, since each task has a fixed startup cost independent of how much data it processes. Proper sizing depends on the data volume and the number of available cores, aiming for partitions that are neither too numerous nor too large, typically on the order of a few tens to a few hundred megabytes each.",
    },
    pitfall: {
      fr: "Le piège est d'oublier le problème des partitions déséquilibrées (skew), où une clé de partitionnement très fréquente concentre l'essentiel des données sur une seule partition : même avec un nombre de partitions globalement bien dimensionné, cette seule partition surchargée devient le goulot d'étranglement qui ralentit tout le traitement, puisque le job entier attend qu'elle termine.",
      en: "The trap is forgetting the data skew problem, where a very frequent partitioning key concentrates most of the data onto a single partition: even with an overall well-sized partition count, that one overloaded partition becomes the bottleneck slowing down the whole processing, since the entire job waits for it to finish.",
    },
    tags: ["partitioning", "performance", "data-skew"],
  },
  {
    id: "spark-shuffle-cost",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "Pourquoi les opérations qui déclenchent un shuffle sont-elles particulièrement coûteuses dans Spark ?",
      en: "Why are operations that trigger a shuffle particularly expensive in Spark ?",
    },
    answer: {
      fr: "Un shuffle survient quand une opération, comme un groupBy, un join entre deux DataFrames sur une clé, ou un repartition, nécessite de redistribuer les données entre les partitions selon un nouveau critère qui ne correspond pas à leur répartition actuelle. Concrètement, ça implique d'écrire les données intermédiaires sur disque sur chaque exécuteur, de les transférer sur le réseau vers les exécuteurs qui en ont besoin selon la nouvelle clé, puis de les relire, une combinaison d'écriture disque, de trafic réseau et de sérialisation bien plus coûteuse qu'une transformation qui reste au sein d'une même partition sans redistribution.",
      en: "A shuffle happens when an operation, like a groupBy, a join between two DataFrames on a key, or a repartition, requires redistributing data across partitions according to a new criterion that doesn't match their current layout. Concretely, this involves writing intermediate data to disk on every executor, transferring it over the network to the executors that need it based on the new key, then reading it back, a combination of disk writes, network traffic and serialization that's far more costly than a transformation staying within a single partition with no redistribution.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de ne citer que le coût réseau du shuffle en oubliant le coût d'écriture disque intermédiaire : c'est justement cette combinaison des deux qui rend un shuffle nettement plus coûteux qu'un simple transfert réseau, et qui justifie des techniques comme le broadcast join pour l'éviter quand une des deux tables jointes est suffisamment petite.",
      en: "The classic interview trap is citing only the shuffle's network cost while forgetting the intermediate disk write cost: it's precisely that combination of the two that makes a shuffle notably more expensive than a simple network transfer, and that justifies techniques like broadcast joins to avoid it when one of the two joined tables is small enough.",
    },
    tags: ["shuffle", "performance", "joins"],
  },
  {
    id: "spark-driver-vs-executor",
    topicId: "spark",
    difficulty: "easy",
    question: {
      fr: "Quel est le rôle respectif du driver et des executors dans une application Spark ?",
      en: "What are the respective roles of the driver and the executors in a Spark application ?",
    },
    answer: {
      fr: "Le driver est le processus qui exécute le code principal de l'application, construit le plan d'exécution à partir des transformations et actions déclarées, et coordonne l'ensemble du job en découpant le travail en tâches distribuées aux executors. Les executors sont les processus qui tournent sur les nœuds du cluster, exécutent réellement les tâches qui leur sont assignées sur leur partition de données, et renvoient les résultats ou le statut au driver. Le driver reste un point de coordination central pendant toute la durée de vie de l'application, ce qui en fait aussi un point sensible : s'il tombe, l'application entière s'arrête, contrairement à la perte d'un seul executor qui peut souvent être compensée en relançant les tâches perdues sur un autre executor.",
      en: "The driver is the process that runs the application's main code, builds the execution plan from the declared transformations and actions, and coordinates the whole job by splitting work into tasks distributed to executors. Executors are the processes running on the cluster's nodes, actually executing the tasks assigned to them on their data partition, and returning results or status to the driver. The driver stays a central coordination point for the application's whole lifetime, which also makes it a sensitive point: if it fails, the entire application stops, unlike losing a single executor, which can often be compensated by rerunning the lost tasks on another executor.",
    },
    pitfall: {
      fr: "Le piège est de rapatrier trop de données vers le driver avec une action comme collect() sur un DataFrame volumineux : le driver n'a généralement pas la même capacité mémoire distribuée que l'ensemble du cluster, ce qui peut le faire tomber en erreur de mémoire alors que le traitement distribué lui-même se serait bien passé.",
      en: "The trap is pulling too much data back to the driver with an action like collect() on a large DataFrame: the driver generally doesn't have the same distributed memory capacity as the whole cluster, which can crash it with an out-of-memory error even though the distributed processing itself would have gone fine.",
    },
    tags: ["driver", "executors", "architecture"],
  },
  {
    id: "spark-caching-persist",
    topicId: "spark",
    difficulty: "medium",
    question: {
      fr: "Quand et pourquoi utiliser cache() ou persist() sur un DataFrame Spark ?",
      en: "When and why should you use cache() or persist() on a Spark DataFrame ?",
    },
    answer: {
      fr: "À cause de l'évaluation paresseuse, un DataFrame recalcule tout son plan d'exécution depuis le début à chaque action déclenchée sur lui, y compris une lecture coûteuse depuis la source de données. Marquer un DataFrame avec cache() ou persist() indique à Spark de conserver son résultat en mémoire, ou sur un support choisi avec persist(), après le premier calcul, pour que les actions suivantes réutilisent ce résultat déjà calculé plutôt que de tout refaire. C'est particulièrement utile quand un même DataFrame intermédiaire, coûteux à produire, est réutilisé plusieurs fois dans la suite du traitement, par exemple pour plusieurs agrégations différentes sur le même jeu de données filtré.",
      en: "Because of lazy evaluation, a DataFrame recomputes its entire execution plan from scratch on every action triggered on it, including a costly read from the data source. Marking a DataFrame with cache() or persist() tells Spark to keep its result in memory, or on a storage medium chosen with persist(), after the first computation, so subsequent actions reuse that already-computed result instead of redoing everything. This is particularly useful when the same costly-to-produce intermediate DataFrame is reused several times later in the processing, for example for several different aggregations on the same filtered dataset.",
    },
    pitfall: {
      fr: "Le piège est de mettre en cache systématiquement tout DataFrame intermédiaire par réflexe : la mise en cache consomme de la mémoire du cluster, potentiellement au détriment d'autres traitements, et n'apporte aucun bénéfice si le DataFrame en question n'est en réalité utilisé qu'une seule fois derrière, auquel cas on paie le coût de la mise en cache sans jamais en profiter.",
      en: "The trap is reflexively caching every intermediate DataFrame: caching consumes cluster memory, potentially at the expense of other processing, and brings no benefit if that DataFrame is actually only used once afterward, in which case you pay the caching cost without ever benefiting from it.",
    },
    tags: ["caching", "persist", "performance"],
  },
  {
    id: "spark-broadcast-variables",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "Comment un broadcast join permet-il d'éviter un shuffle coûteux, et quelle en est la limite ?",
      en: "How does a broadcast join let you avoid an expensive shuffle, and what is its limit ?",
    },
    answer: {
      fr: "Dans une jointure classique entre deux grandes tables, Spark doit redistribuer les données des deux côtés par shuffle pour que les lignes avec la même clé de jointure se retrouvent sur le même executor. Si l'une des deux tables est suffisamment petite pour tenir en mémoire, Spark peut à la place en envoyer une copie complète, diffusée, à chaque executor : chaque executor joint alors sa partition de la grande table avec la copie locale de la petite table, sans qu'aucun shuffle ne soit nécessaire sur la grande table. Ça transforme une opération coûteuse en réseau et en disque en une opération qui reste largement locale à chaque executor, avec un gain de performance souvent très important.",
      en: "In a classic join between two large tables, Spark needs to shuffle data on both sides so that rows with the same join key end up on the same executor. If one of the two tables is small enough to fit in memory, Spark can instead send a complete, broadcast copy of it to every executor: each executor then joins its partition of the large table with the local copy of the small table, with no shuffle needed on the large table at all. This turns a costly network and disk operation into one that stays largely local to each executor, often with a very significant performance gain.",
    },
    pitfall: {
      fr: "Le piège est de forcer un broadcast join sur une table qui n'est en réalité pas assez petite pour tenir confortablement en mémoire sur chaque executor : plutôt que d'accélérer la jointure, ça peut provoquer des erreurs de mémoire sur les executors ou ralentir fortement la diffusion initiale, la limite de taille raisonnable pour un broadcast reste de l'ordre de quelques centaines de mégaoctets, pas des gigaoctets.",
      en: "The trap is forcing a broadcast join on a table that isn't actually small enough to comfortably fit in memory on every executor: rather than speeding up the join, it can cause out-of-memory errors on executors or badly slow down the initial broadcast, the reasonable size limit for a broadcast remains on the order of a few hundred megabytes, not gigabytes.",
    },
    tags: ["broadcast-join", "shuffle-avoidance", "performance"],
  },
  {
    id: "spark-streaming-vs-batch",
    topicId: "spark",
    difficulty: "medium",
    question: {
      fr: "Comment Spark Structured Streaming traite-t-il un flux de données en continu, et en quoi diffère-t-il d'un traitement batch classique ?",
      en: "How does Spark Structured Streaming process a continuous data stream, and how does it differ from classic batch processing ?",
    },
    answer: {
      fr: "Un traitement batch classique lit un jeu de données fini et connu à l'avance, exécute le traitement complet, puis se termine. Spark Structured Streaming traite un flux de données arrivant en continu, comme depuis Kafka, en le découpant conceptuellement en micro-batches traités les uns après les autres à intervalles réguliers ou dès que de nouvelles données arrivent, tout en réutilisant exactement la même API DataFrame que pour du batch. Le moteur gère automatiquement des aspects propres au streaming, comme le suivi de la progression dans la source pour reprendre au bon endroit après un redémarrage, et le traitement des données tardives par rapport à leur horodatage d'origine.",
      en: "Classic batch processing reads a finite, known-in-advance dataset, runs the full processing, then finishes. Spark Structured Streaming processes a continuously arriving data stream, like one from Kafka, conceptually splitting it into micro-batches processed one after another at regular intervals or as soon as new data arrives, while reusing exactly the same DataFrame API as batch processing. The engine automatically handles streaming-specific concerns, like tracking progress in the source to resume at the right point after a restart, and handling data arriving late relative to its original timestamp.",
    },
    pitfall: {
      fr: "Le piège est de croire que Structured Streaming garantit un traitement en temps réel strict, à la milliseconde : c'est un modèle en micro-batches, avec une latence typique de quelques centaines de millisecondes à quelques secondes selon la configuration, ce qui suffit pour la grande majorité des cas d'usage mais ne convient pas à un besoin de latence véritablement sub-milliseconde, où un moteur de streaming natif comme Flink serait plus adapté.",
      en: "The trap is believing Structured Streaming guarantees strict, millisecond-level real-time processing: it's a micro-batch model, with typical latency from a few hundred milliseconds to a few seconds depending on configuration, which is enough for the vast majority of use cases but doesn't fit a genuinely sub-millisecond latency need, where a native streaming engine like Flink would be better suited.",
    },
    tags: ["structured-streaming", "batch-processing", "real-time"],
  },

  // Java Core (senior/architecte)
  {
    id: "java-memory-model-happens-before",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que la relation happens-before dans le Java Memory Model, et pourquoi une variable partagée sans synchronisation peut-elle donner un résultat incohérent entre threads ?",
      en: "What is the happens-before relation in the Java Memory Model, and why can a shared variable with no synchronization give an inconsistent result across threads ?",
    },
    answer: {
      fr: "Le Java Memory Model ne garantit pas qu'un thread voie immédiatement les écritures faites par un autre thread : sans relation happens-before établie entre l'écriture et la lecture, le compilateur, le processeur ou le cache peuvent réordonner ou retarder la visibilité d'une écriture, y compris la garder uniquement dans un registre ou un cache local au thread. Le mot-clé volatile, un bloc synchronized, ou les classes de java.util.concurrent établissent une relation happens-before qui force la visibilité et interdit certains réordonnancements. Sans cette garantie, un thread peut boucler indéfiniment sur une valeur qu'il croit toujours fausse alors qu'un autre thread l'a modifiée, simplement parce que rien ne l'oblige à relire la mémoire principale.",
      en: "The Java Memory Model doesn't guarantee a thread immediately sees writes made by another thread: without an established happens-before relation between the write and the read, the compiler, the processor or the cache can reorder or delay a write's visibility, including keeping it only in a register or a thread-local cache. The volatile keyword, a synchronized block, or the java.util.concurrent classes establish a happens-before relation that forces visibility and forbids certain reorderings. Without that guarantee, a thread can loop indefinitely on a value it believes is still false even though another thread changed it, simply because nothing forces it to re-read main memory.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de croire que déclarer une variable volatile la rend atomique pour des opérations composées comme un incrément : volatile ne garantit que la visibilité et l'ordre, pas l'atomicité, un compteur volatile incrémenté par plusieurs threads reste sujet aux races conditions, il faut AtomicInteger ou une synchronisation explicite.",
      en: "The classic interview trap is believing declaring a variable volatile makes it atomic for compound operations like an increment: volatile only guarantees visibility and ordering, not atomicity, a volatile counter incremented by several threads is still subject to race conditions, you need AtomicInteger or explicit synchronization.",
    },
    code: {
      lang: "java",
      snippet:
        "// Sans volatile : le thread lecteur peut boucler indéfiniment\nclass Flag {\n    private boolean ready = false; // manque volatile\n\n    void writer() { ready = true; }\n\n    void reader() {\n        while (!ready) {\n            // peut ne jamais voir la mise a jour faite par writer()\n        }\n        System.out.println(\"pret\");\n    }\n}",
    },
    tags: ["memory-model", "concurrency", "volatile"],
  },
  {
    id: "java-classloading-and-metaspace",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne le chargement des classes en Java, et qu'est-ce que Metaspace a changé par rapport à l'ancienne PermGen ?",
      en: "How does class loading work in Java, and what did Metaspace change compared to the old PermGen ?",
    },
    answer: {
      fr: "Le chargement d'une classe suit une hiérarchie de class loaders, du bootstrap loader qui charge les classes cœur du JDK, jusqu'au class loader applicatif, chacun délégant d'abord la recherche à son parent avant de chercher lui-même, ce qui évite qu'une application redéfinisse par erreur une classe système. Avant Java 8, les métadonnées de classes vivaient dans PermGen, une zone de taille fixe dans le tas qui provoquait fréquemment des OutOfMemoryError dans les applications qui chargeaient beaucoup de classes dynamiquement, comme les serveurs d'applications avec rechargement à chaud. Metaspace a déplacé ces métadonnées vers la mémoire native du système d'exploitation, avec une taille qui s'ajuste dynamiquement par défaut, éliminant cette classe entière de problèmes.",
      en: "Class loading follows a hierarchy of class loaders, from the bootstrap loader that loads the JDK's core classes, up to the application class loader, each one first delegating the search to its parent before searching itself, which prevents an application from accidentally redefining a system class. Before Java 8, class metadata lived in PermGen, a fixed-size area within the heap that frequently caused OutOfMemoryError in applications that loaded many classes dynamically, like application servers with hot reloading. Metaspace moved that metadata to the operating system's native memory, with a size that adjusts dynamically by default, eliminating that entire class of problems.",
    },
    pitfall: {
      fr: "Le piège est de croire que Metaspace ne peut plus jamais saturer la mémoire : sans limite explicite via MaxMetaspaceSize, une fuite de class loaders, par exemple des rechargements répétés d'une application qui ne libère jamais les anciens loaders, peut toujours épuiser la mémoire native du système, juste avec un message d'erreur différent de PermGen.",
      en: "The trap is believing Metaspace can no longer run out of memory at all: without an explicit limit via MaxMetaspaceSize, a class loader leak, for example repeated redeployments of an application that never releases old loaders, can still exhaust the system's native memory, just with a different error message than PermGen's.",
    },
    tags: ["classloading", "metaspace", "jvm-internals"],
  },
  {
    id: "java-virtual-threads-project-loom",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Que sont les threads virtuels introduits par Project Loom, et en quoi changent-ils l'approche de la concurrence en Java ?",
      en: "What are the virtual threads introduced by Project Loom, and how do they change the approach to concurrency in Java ?",
    },
    answer: {
      fr: "Un thread virtuel est un thread géré par la JVM plutôt que directement mappé un pour un sur un thread du système d'exploitation, ce qui permet d'en créer des millions sans épuiser les ressources, contrairement aux threads plateforme classiques qui coûtent cher en mémoire et en changement de contexte. Quand un thread virtuel bloque sur une opération d'I/O, la JVM démonte automatiquement le thread plateforme sous-jacent pour le réutiliser ailleurs, puis le remonte quand l'opération se termine, rendant le code bloquant classique aussi efficace qu'une approche réactive sans en avoir la complexité. Ça permet d'écrire du code séquentiel simple, un thread par requête par exemple, tout en gardant un débit élevé sur des charges dominées par l'attente d'I/O.",
      en: "A virtual thread is a thread managed by the JVM rather than directly mapped one-to-one onto an operating system thread, making it possible to create millions of them without exhausting resources, unlike classic platform threads which are expensive in memory and context switching. When a virtual thread blocks on an I/O operation, the JVM automatically unmounts the underlying platform thread to reuse it elsewhere, then remounts it once the operation completes, making classic blocking code as efficient as a reactive approach without its complexity. This lets you write simple sequential code, one thread per request for example, while keeping high throughput on workloads dominated by I/O waits.",
    },
    pitfall: {
      fr: "Le piège est de croire que les threads virtuels accélèrent aussi le calcul intensif en CPU : ils n'apportent aucun bénéfice pour du code qui ne bloque jamais sur de l'I/O, leur intérêt est spécifiquement de démultiplier la concurrence sur des charges qui attendent beaucoup, un bloc synchronized mal utilisé peut aussi épingler un thread virtuel sur son thread plateforme et annuler l'avantage.",
      en: "The trap is believing virtual threads also speed up CPU-intensive computation: they bring no benefit for code that never blocks on I/O, their purpose is specifically to multiply concurrency on workloads that wait a lot, a poorly used synchronized block can also pin a virtual thread to its platform thread and cancel the benefit.",
    },
    code: {
      lang: "java",
      snippet:
        "// Un thread virtuel par tache, sans pool a dimensionner\ntry (var executor = Executors.newVirtualThreadPerTaskExecutor()) {\n    for (int i = 0; i < 100_000; i++) {\n        executor.submit(() -> {\n            callBlockingService(); // bloque sans gaspiller un thread OS\n            return null;\n        });\n    }\n}",
    },
    tags: ["virtual-threads", "project-loom", "concurrency"],
  },
  {
    id: "java-jit-compilation-tiers",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne la compilation JIT à plusieurs niveaux de la JVM, et pourquoi une application Java met-elle du temps à atteindre ses performances de pointe ?",
      en: "How does the JVM's tiered JIT compilation work, and why does a Java application take time to reach its peak performance ?",
    },
    answer: {
      fr: "Le code Java est d'abord exécuté en mode interprété, lent mais immédiat. La JVM surveille en parallèle les méthodes les plus fréquemment appelées, dites chaudes, et les compile progressivement en code natif via deux compilateurs JIT : C1, rapide à compiler mais avec des optimisations limitées, puis C2, plus lent à compiler mais capable d'optimisations agressives comme l'inlining ou l'analyse d'échappement. Ce processus explique le phénomène de warm-up : une application vient de démarrer tourne d'abord en interprété ou en compilation C1, et n'atteint son débit maximal qu'après que les chemins chauds aient été identifiés et recompilés en C2, ce qui peut prendre plusieurs minutes sous charge réelle.",
      en: "Java code first runs in interpreted mode, slow but immediate. The JVM simultaneously monitors the most frequently called methods, called hot methods, and progressively compiles them to native code through two JIT compilers: C1, fast to compile but with limited optimizations, then C2, slower to compile but capable of aggressive optimizations like inlining or escape analysis. This process explains the warm-up phenomenon: an application that just started runs first in interpreted or C1-compiled mode, and only reaches its maximum throughput once hot paths have been identified and recompiled with C2, which can take several minutes under real load.",
    },
    pitfall: {
      fr: "Le piège est d'oublier l'impact du warm-up sur des environnements qui redémarrent souvent les instances, comme des fonctions serverless ou des déploiements fréquents en conteneurs : chaque nouvelle instance repart de zéro en interprété, ce qui peut fausser des benchmarks faits juste après un déploiement ou dégrader la latence des premières requêtes après un scale-up.",
      en: "The trap is forgetting the warm-up impact on environments that restart instances often, like serverless functions or frequent container deployments: every new instance starts from scratch in interpreted mode, which can skew benchmarks run right after a deployment or degrade latency for the first requests after a scale-up.",
    },
    tags: ["jit", "jvm-internals", "performance"],
  },
  {
    id: "java-fork-join-vs-executor",
    topicId: "java-core",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre le framework Fork/Join et un ExecutorService classique, et quand le work-stealing apporte-t-il un vrai bénéfice ?",
      en: "What is the difference between the Fork/Join framework and a classic ExecutorService, and when does work-stealing bring a real benefit ?",
    },
    answer: {
      fr: "Un ExecutorService classique distribue des tâches indépendantes vers un pool de threads fixe, chaque thread traitant les tâches d'une file partagée jusqu'à épuisement. Le framework Fork/Join est conçu pour des tâches récursives qui se divisent elles-mêmes en sous-tâches plus petites, chaque thread du pool ayant sa propre file de travail, et le work-stealing permet à un thread devenu inactif de voler des tâches dans la file d'un thread encore occupé plutôt que de rester oisif. Ça convient particulièrement bien aux algorithmes de type diviser pour régner, comme trier ou parcourir une grande structure en la découpant récursivement en morceaux traités en parallèle.",
      en: "A classic ExecutorService distributes independent tasks to a fixed thread pool, each thread processing tasks from a shared queue until it's exhausted. The Fork/Join framework is designed for recursive tasks that split themselves into smaller subtasks, each thread in the pool having its own work queue, and work-stealing lets an idle thread steal tasks from a still-busy thread's queue rather than sitting idle. This fits particularly well with divide-and-conquer algorithms, like sorting or traversing a large structure by recursively splitting it into chunks processed in parallel.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser Fork/Join pour des tâches qui ne se divisent pas naturellement ou qui bloquent sur de l'I/O : le work-stealing n'apporte rien sur des tâches indépendantes de taille fixe, et une tâche qui bloque longtemps sur une ressource externe dans un pool Fork/Join peut affamer le pool commun partagé par défaut avec d'autres usages, comme les streams parallèles.",
      en: "The trap is using Fork/Join for tasks that don't naturally split or that block on I/O: work-stealing brings nothing for independent, fixed-size tasks, and a task that blocks for a long time on an external resource inside a Fork/Join pool can starve the common pool shared by default with other usages, like parallel streams.",
    },
    code: {
      lang: "java",
      snippet:
        "class SumTask extends RecursiveTask<Long> {\n    private final int[] arr; private final int lo, hi;\n    SumTask(int[] arr, int lo, int hi) { this.arr = arr; this.lo = lo; this.hi = hi; }\n\n    protected Long compute() {\n        if (hi - lo <= 1000) {\n            long sum = 0;\n            for (int i = lo; i < hi; i++) sum += arr[i];\n            return sum;\n        }\n        int mid = (lo + hi) / 2;\n        SumTask left = new SumTask(arr, lo, mid);\n        left.fork();\n        long rightResult = new SumTask(arr, mid, hi).compute();\n        return left.join() + rightResult;\n    }\n}",
    },
    tags: ["fork-join", "work-stealing", "concurrency"],
  },

  // Spring Boot (senior/architecte)
  {
    id: "spring-aop-proxy-mechanics",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne l'AOP de Spring sous le capot, et pourquoi une méthode privée ou une classe finale ne peut-elle pas être interceptée ?",
      en: "How does Spring's AOP work under the hood, and why can't a private method or a final class be intercepted ?",
    },
    answer: {
      fr: "Spring implémente l'AOP, utilisée par exemple pour @Transactional ou @Cacheable, en générant un proxy autour du bean réel au démarrage du contexte. Si la classe implémente une interface, Spring utilise un proxy JDK dynamique qui implémente cette même interface et délègue les appels. Si la classe n'implémente pas d'interface, Spring utilise CGLIB, qui génère une sous-classe à l'exécution qui hérite de la classe cible et surcharge ses méthodes pour y injecter le comportement additionnel. Dans les deux cas, l'interception ne fonctionne que sur des appels qui passent par le proxy de l'extérieur : une méthode privée n'est jamais visible depuis l'extérieur donc jamais interceptée, et une classe ou une méthode finale ne peut pas être sous-classée ou surchargée par CGLIB.",
      en: "Spring implements AOP, used for example by @Transactional or @Cacheable, by generating a proxy around the real bean at context startup. If the class implements an interface, Spring uses a JDK dynamic proxy that implements that same interface and delegates calls. If the class implements no interface, Spring uses CGLIB, which generates a subclass at runtime that extends the target class and overrides its methods to inject the additional behavior. In both cases, interception only works on calls that go through the proxy from the outside: a private method is never visible from the outside so it's never intercepted, and a final class or method can't be subclassed or overridden by CGLIB.",
    },
    pitfall: {
      fr: "Le piège est de mettre @Transactional ou @Cacheable sur une méthode privée en pensant que ça fonctionnera silencieusement de façon dégradée : Spring ne lève souvent aucune erreur, l'annotation est simplement ignorée sans avertissement clair, ce qui rend le bug difficile à repérer sans comprendre le mécanisme de proxy sous-jacent.",
      en: "The trap is putting @Transactional or @Cacheable on a private method thinking it will just silently work in a degraded way: Spring often throws no error, the annotation is simply ignored with no clear warning, which makes the bug hard to spot without understanding the underlying proxy mechanism.",
    },
    tags: ["aop", "proxies", "spring-internals"],
  },
  {
    id: "spring-application-context-refresh",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Que se passe-t-il pendant la méthode refresh() de l'ApplicationContext au démarrage d'une application Spring Boot ?",
      en: "What happens during the ApplicationContext's refresh() method at Spring Boot startup ?",
    },
    answer: {
      fr: "refresh() orchestre toute l'initialisation du contexte en une séquence d'étapes précises : préparer le contexte, charger les définitions de bean sans encore les instancier, invoquer les BeanFactoryPostProcessor qui peuvent modifier ces définitions avant toute instanciation, enregistrer les BeanPostProcessor qui interviendront autour de chaque création de bean, puis instancier tous les beans singletons non paresseux dans l'ordre de leurs dépendances, et enfin publier un événement de contexte prêt. Comprendre cet ordre explique pourquoi un BeanFactoryPostProcessor peut ajouter ou modifier des définitions de bean avant leur création, alors qu'un BeanPostProcessor n'agit qu'après qu'un bean donné a déjà été instancié.",
      en: "refresh() orchestrates the whole context initialization in a precise sequence of steps: prepare the context, load bean definitions without instantiating them yet, invoke BeanFactoryPostProcessors which can modify those definitions before any instantiation, register BeanPostProcessors that will act around every bean creation, then instantiate every non-lazy singleton bean in dependency order, and finally publish a context-refreshed event. Understanding this order explains why a BeanFactoryPostProcessor can add or modify bean definitions before their creation, while a BeanPostProcessor only acts after a given bean has already been instantiated.",
    },
    pitfall: {
      fr: "Le piège en entretien est de confondre BeanFactoryPostProcessor et BeanPostProcessor : le premier agit sur les métadonnées de définition avant toute création d'instance, comme PropertySourcesPlaceholderConfigurer qui résout les valeurs ${...}, le second agit sur les instances déjà créées, comme l'application d'un proxy AOP, les mélanger révèle une compréhension superficielle du cycle de vie.",
      en: "The interview trap is confusing BeanFactoryPostProcessor with BeanPostProcessor: the former acts on definition metadata before any instance is created, like PropertySourcesPlaceholderConfigurer resolving ${...} values, the latter acts on already-created instances, like applying an AOP proxy, mixing them up reveals a shallow understanding of the lifecycle.",
    },
    tags: ["application-context", "spring-internals", "lifecycle"],
  },
  {
    id: "spring-boot-graceful-shutdown",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Comment configurer un arrêt propre (graceful shutdown) d'une application Spring Boot, et pourquoi est-ce particulièrement important sous Kubernetes ?",
      en: "How do you configure a graceful shutdown for a Spring Boot application, and why does it matter especially under Kubernetes ?",
    },
    answer: {
      fr: "Activer server.shutdown=graceful fait que Spring Boot, en recevant un signal d'arrêt, arrête d'accepter de nouvelles requêtes mais laisse les requêtes déjà en cours se terminer normalement dans une fenêtre de temps configurable, plutôt que de couper brutalement les connexions actives. C'est particulièrement important sous Kubernetes parce que la séquence d'arrêt d'un Pod n'est pas instantanée : Kubernetes retire le Pod du service au même moment qu'il envoie SIGTERM au conteneur, mais à cause de la propagation réseau, des requêtes déjà routées vers ce Pod peuvent continuer à arriver pendant quelques secondes après le SIGTERM, un arrêt brutal côté application les ferait échouer inutilement.",
      en: "Enabling server.shutdown=graceful makes Spring Boot, upon receiving a shutdown signal, stop accepting new requests but let already in-flight requests finish normally within a configurable time window, rather than abruptly cutting active connections. This matters especially under Kubernetes because a Pod's shutdown sequence isn't instantaneous: Kubernetes removes the Pod from the service at the same time it sends SIGTERM to the container, but due to network propagation, requests already routed to that Pod can keep arriving for a few seconds after SIGTERM, an abrupt shutdown on the application side would needlessly fail them.",
    },
    pitfall: {
      fr: "Le piège est de configurer le graceful shutdown côté application sans ajouter un preStop hook avec un court délai côté Kubernetes : sans ce délai, le conteneur peut recevoir SIGTERM et commencer à s'arrêter avant que le retrait du Pod du service ait fini de se propager sur tous les nœuds, laissant une fenêtre où des requêtes arrivent encore sur un Pod déjà en train de fermer ses connexions.",
      en: "The trap is configuring graceful shutdown on the application side without adding a preStop hook with a short delay on the Kubernetes side: without that delay, the container can receive SIGTERM and start shutting down before the Pod's removal from the service has finished propagating across all nodes, leaving a window where requests still arrive at a Pod already closing its connections.",
    },
    code: {
      lang: "yaml",
      snippet:
        "# application.yml\nserver:\n  shutdown: graceful\nspring:\n  lifecycle:\n    timeout-per-shutdown-phase: 20s\n---\n# deployment.yaml (extrait)\nlifecycle:\n  preStop:\n    exec:\n      command: [\"sh\", \"-c\", \"sleep 10\"]",
    },
    tags: ["graceful-shutdown", "kubernetes", "production-readiness"],
  },
  {
    id: "spring-cache-abstraction-pitfalls",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Quels sont les pièges les plus fréquents de l'abstraction de cache de Spring avec @Cacheable ?",
      en: "What are the most common pitfalls of Spring's cache abstraction with @Cacheable ?",
    },
    answer: {
      fr: "Par défaut, la clé de cache est générée à partir de tous les arguments de la méthode via leurs equals() et hashCode() : passer un objet complexe mal équipé de ces méthodes, ou plusieurs arguments dans un ordre qui varie, peut produire des clés incohérentes qui empêchent le cache de fonctionner comme prévu, d'où l'intérêt d'utiliser l'attribut key avec une expression SpEL explicite pour des cas non triviaux. Comme pour @Transactional, @Cacheable repose sur un proxy AOP, donc un appel interne à this depuis une autre méthode de la même classe contourne complètement le cache. Enfin, sans stratégie d'éviction ou de durée de vie explicite, un cache mal dimensionné peut soit grossir indéfiniment jusqu'à épuiser la mémoire, soit servir des données périmées bien après qu'elles aient changé en base.",
      en: "By default, the cache key is generated from all of a method's arguments via their equals() and hashCode(), passing a complex object poorly equipped with those methods, or several arguments in a varying order, can produce inconsistent keys that prevent the cache from working as intended, which is why using the key attribute with an explicit SpEL expression matters for non-trivial cases. Like @Transactional, @Cacheable relies on an AOP proxy, so an internal call to this from another method in the same class completely bypasses the cache. Finally, without an explicit eviction strategy or time-to-live, a poorly sized cache can either grow indefinitely until it exhausts memory, or serve stale data well after it has changed in the database.",
    },
    pitfall: {
      fr: "Le piège classique est d'oublier @CacheEvict ou @CachePut lors d'une mise à jour des données sous-jacentes : le cache continue alors silencieusement de servir l'ancienne valeur, un bug particulièrement pernicieux car il ne se manifeste que par des données visiblement fausses, sans exception ni log d'erreur.",
      en: "The classic trap is forgetting @CacheEvict or @CachePut when updating the underlying data: the cache then silently keeps serving the old value, a particularly insidious bug since it only manifests as visibly wrong data, with no exception or error log.",
    },
    tags: ["caching", "spring-cache", "pitfalls"],
  },
  {
    id: "spring-boot-observability-stack",
    topicId: "spring-boot",
    difficulty: "hard",
    question: {
      fr: "Comment Micrometer et le tracing distribué s'articulent-ils dans une architecture microservices Spring Boot observable ?",
      en: "How do Micrometer and distributed tracing fit together in an observable Spring Boot microservices architecture ?",
    },
    answer: {
      fr: "Micrometer fournit une façade de métriques indépendante du système de monitoring cible, comme Prometheus ou Datadog : le code applicatif instrumente des compteurs, jauges et temporisations une seule fois, et Micrometer se charge de les exporter dans le format attendu par le backend choisi. Pour le tracing distribué, qui suit une requête à travers plusieurs microservices, Spring Boot s'appuie sur Micrometer Tracing, qui propage un identifiant de trace et de span à travers les appels HTTP et les files de messages, et exporte ces traces vers un collecteur compatible OpenTelemetry, comme Zipkin ou Jaeger. Ensemble, métriques et traces donnent une vue à la fois quantitative, combien de requêtes et à quelle latence, et qualitative, où exactement le temps est passé pour une requête donnée à travers le système.",
      en: "Micrometer provides a metrics facade independent of the target monitoring system, like Prometheus or Datadog: application code instruments counters, gauges and timers once, and Micrometer handles exporting them in the format expected by the chosen backend. For distributed tracing, which follows a request across several microservices, Spring Boot relies on Micrometer Tracing, which propagates a trace and span identifier across HTTP calls and message queues, and exports those traces to an OpenTelemetry-compatible collector, like Zipkin or Jaeger. Together, metrics and traces give both a quantitative view, how many requests and at what latency, and a qualitative one, exactly where time was spent for a given request across the system.",
    },
    pitfall: {
      fr: "Le piège est de mettre en place le tracing sans propager correctement le contexte à travers les frontières asynchrones, comme un appel à un thread pool personnalisé ou un message Kafka : sans propagation explicite du contexte de trace, chaque service voit une trace qui commence de zéro, cassant la continuité qui fait tout l'intérêt du tracing distribué.",
      en: "The trap is setting up tracing without correctly propagating the context across asynchronous boundaries, like a call to a custom thread pool or a Kafka message: without explicit trace context propagation, each service sees a trace that starts from scratch, breaking the continuity that's the whole point of distributed tracing.",
    },
    tags: ["observability", "micrometer", "distributed-tracing"],
  },

  // JPA & Hibernate (senior/architecte)
  {
    id: "jpa-batch-inserts-updates",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Comment activer le batching des insertions Hibernate, et pourquoi la stratégie de génération d'identifiant IDENTITY l'empêche-t-elle de fonctionner ?",
      en: "How do you enable Hibernate insert batching, and why does the IDENTITY id generation strategy prevent it from working ?",
    },
    answer: {
      fr: "Le batching regroupe plusieurs instructions INSERT ou UPDATE en un seul aller-retour réseau vers la base, ce qui réduit fortement le temps passé en latence réseau lors d'opérations en masse, en activant hibernate.jdbc.batch_size et en insérant les entités par lots plutôt qu'une par une. Le problème est que la stratégie IDENTITY délègue la génération de l'identifiant à la base de données au moment même de l'insertion : Hibernate a besoin de connaître cet identifiant tout de suite après chaque insert pour le reste de son fonctionnement interne, ce qui l'oblige à exécuter chaque insertion individuellement pour récupérer l'identifiant généré, rendant le batching impossible. Les stratégies SEQUENCE ou TABLE, qui génèrent l'identifiant avant l'insertion, sont compatibles avec le batching.",
      en: "Batching groups several INSERT or UPDATE statements into a single network round-trip to the database, which strongly reduces time spent on network latency during bulk operations, by enabling hibernate.jdbc.batch_size and inserting entities in batches rather than one at a time. The problem is that the IDENTITY strategy delegates identifier generation to the database at the exact moment of insertion: Hibernate needs to know that identifier right after each insert for the rest of its internal bookkeeping, forcing it to execute each insertion individually to retrieve the generated identifier, making batching impossible. The SEQUENCE or TABLE strategies, which generate the identifier before insertion, are compatible with batching.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de configurer hibernate.jdbc.batch_size en pensant que ça suffit, sans réaliser que le choix de la stratégie de génération d'identifiant peut silencieusement annuler tout le bénéfice attendu : vérifier le SQL généré, ou activer les logs de batching, reste le seul moyen fiable de confirmer que le batching fonctionne réellement.",
      en: "The classic interview trap is configuring hibernate.jdbc.batch_size and thinking that's enough, without realizing the id generation strategy choice can silently cancel the whole expected benefit: checking the generated SQL, or enabling batching logs, remains the only reliable way to confirm batching is actually happening.",
    },
    code: {
      lang: "properties",
      snippet:
        "spring.jpa.properties.hibernate.jdbc.batch_size=50\nspring.jpa.properties.hibernate.order_inserts=true\nspring.jpa.properties.hibernate.order_updates=true\n# Incompatible avec le batching :\n# @GeneratedValue(strategy = GenerationType.IDENTITY)\n# Compatible :\n# @GeneratedValue(strategy = GenerationType.SEQUENCE)",
    },
    tags: ["batching", "performance", "id-generation"],
  },
  {
    id: "jpa-second-level-cache-distributed",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Quel problème spécifique pose le cache de second niveau d'Hibernate dans une application déployée sur plusieurs instances ?",
      en: "What specific problem does Hibernate's second-level cache raise in an application deployed across multiple instances ?",
    },
    answer: {
      fr: "Par défaut, chaque instance de l'application maintient son propre cache de second niveau en mémoire locale, sans aucune communication avec les caches des autres instances. Si une instance modifie une donnée en base, les autres instances continuent de servir la valeur périmée depuis leur propre cache jusqu'à expiration de sa durée de vie configurée, ce qui peut créer des incohérences visibles par les utilisateurs selon l'instance qui traite leur requête. La solution est d'utiliser un fournisseur de cache distribué, comme Hazelcast ou Infinispan, capable de propager les invalidations entre toutes les instances, ou d'accepter une durée de vie de cache suffisamment courte pour rendre l'incohérence temporaire tolérable au regard du besoin métier.",
      en: "By default, each application instance maintains its own second-level cache in local memory, with no communication with other instances' caches. If one instance updates data in the database, other instances keep serving the stale value from their own cache until its configured time-to-live expires, which can create inconsistencies visible to users depending on which instance handles their request. The solution is using a distributed cache provider, like Hazelcast or Infinispan, able to propagate invalidations across every instance, or accepting a short enough cache time-to-live to make the temporary inconsistency tolerable given the business need.",
    },
    pitfall: {
      fr: "Le piège est d'activer le cache de second niveau en environnement multi-instance sans avoir vérifié quel fournisseur de cache est réellement configuré derrière : un cache local par défaut comme EHCache en mode standalone donne une fausse impression de sécurité, alors qu'il n'offre aucune cohérence entre instances contrairement à un déploiement en cluster explicite.",
      en: "The trap is enabling second-level cache in a multi-instance environment without checking which cache provider is actually configured behind it: a local default cache like EHCache in standalone mode gives a false sense of safety, since it offers no consistency across instances unlike an explicitly clustered deployment.",
    },
    tags: ["second-level-cache", "distributed-systems", "consistency"],
  },
  {
    id: "jpa-dto-projections-performance",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Pourquoi préférer une projection DTO à une entité complète pour un endpoint de lecture seule, et comment l'écrire en JPQL ?",
      en: "Why prefer a DTO projection over a full entity for a read-only endpoint, and how do you write one in JPQL ?",
    },
    answer: {
      fr: "Charger une entité complète récupère toutes ses colonnes et active le suivi des modifications par le contexte de persistance, même quand seules deux ou trois valeurs sont réellement nécessaires pour la réponse, ce qui gaspille de la bande passante réseau, de la mémoire, et du travail de dirty checking inutile. Une projection DTO via une expression constructeur JPQL exécute une requête SQL qui ne sélectionne que les colonnes nécessaires et retourne directement des objets détachés, non gérés par le contexte de persistance, ce qui est nettement plus léger pour tout endpoint qui ne fait que lire et afficher de la donnée sans jamais la modifier.",
      en: "Loading a full entity fetches every column and enables change tracking by the persistence context, even when only two or three values are actually needed for the response, which wastes network bandwidth, memory, and unnecessary dirty-checking work. A DTO projection via a JPQL constructor expression runs a SQL query that only selects the needed columns and directly returns detached objects, not managed by the persistence context, which is markedly lighter for any endpoint that only reads and displays data without ever modifying it.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser des projections DTO partout par réflexe de performance, y compris sur des écrans qui ont ensuite besoin de modifier et sauvegarder la même donnée : un DTO est détaché et ne peut pas être sauvegardé directement, il faudrait recharger une entité gérée pour toute opération d'écriture, ce qui peut annuler le gain si mal anticipé.",
      en: "The trap is using DTO projections everywhere out of a performance reflex, including on screens that later need to modify and save that same data: a DTO is detached and can't be saved directly, a managed entity would need to be reloaded for any write operation, which can cancel the gain if not planned for.",
    },
    code: {
      lang: "java",
      snippet:
        "public record OrderSummary(Long id, String customerName, BigDecimal total) {}\n\n@Query(\"\"\"\n  select new com.app.OrderSummary(o.id, o.customer.name, o.total)\n  from Order o where o.status = :status\n  \"\"\")\nList<OrderSummary> findSummariesByStatus(@Param(\"status\") OrderStatus status);",
    },
    tags: ["dto-projections", "performance", "jpql"],
  },
  {
    id: "jpa-flush-modes",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Que déclenche un flush du contexte de persistance, et quelle est la différence entre le mode AUTO et le mode COMMIT ?",
      en: "What triggers a flush of the persistence context, and what is the difference between AUTO and COMMIT flush modes ?",
    },
    answer: {
      fr: "Un flush synchronise les changements en attente dans le contexte de persistance, entités nouvelles, modifiées ou supprimées, vers la base de données en exécutant les instructions SQL correspondantes, sans pour autant valider la transaction. En mode AUTO, le mode par défaut, Hibernate déclenche un flush automatique avant l'exécution de toute requête JPQL ou Criteria, pour garantir que cette requête voit bien les changements en attente faits dans la même transaction. En mode COMMIT, le flush n'a lieu qu'au moment de la validation de la transaction, ce qui peut améliorer les performances en évitant des flushs intermédiaires, mais au prix du risque qu'une requête exécutée dans la transaction ne voie pas encore des changements pourtant déjà faits en mémoire.",
      en: "A flush synchronizes pending changes in the persistence context, new, modified or deleted entities, to the database by executing the corresponding SQL statements, without committing the transaction. In AUTO mode, the default, Hibernate triggers an automatic flush before executing any JPQL or Criteria query, to guarantee that query sees pending changes made within the same transaction. In COMMIT mode, the flush only happens at transaction commit time, which can improve performance by avoiding intermediate flushes, but at the risk that a query executed within the transaction won't yet see changes already made in memory.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer le coût du dirty checking automatique déclenché à chaque flush AUTO sur un contexte de persistance qui contient énormément d'entités chargées : Hibernate doit comparer l'état actuel de chaque entité gérée avec son instantané initial, ce qui peut devenir un vrai goulot d'étranglement dans une transaction qui charge et manipule un grand nombre d'objets.",
      en: "The trap is underestimating the cost of the automatic dirty checking triggered on every AUTO flush when the persistence context holds a huge number of loaded entities: Hibernate has to compare each managed entity's current state against its initial snapshot, which can become a real bottleneck in a transaction that loads and manipulates a large number of objects.",
    },
    tags: ["flush-modes", "dirty-checking", "persistence-context"],
  },
  {
    id: "jpa-multi-tenancy-strategies",
    topicId: "jpa-hibernate",
    difficulty: "hard",
    question: {
      fr: "Quelles sont les principales stratégies de multi-tenancy avec Hibernate, et quels sont leurs compromis ?",
      en: "What are the main multi-tenancy strategies with Hibernate, and what are their trade-offs ?",
    },
    answer: {
      fr: "La stratégie base de données séparée donne à chaque client sa propre base physique, l'isolation la plus forte possible mais aussi la plus coûteuse à opérer et à faire évoluer, chaque migration de schéma devant être répétée sur chaque base. La stratégie schéma séparé partage une seule base mais donne un schéma dédié par client, un compromis raisonnable entre isolation et coût opérationnel. La stratégie colonne discriminante partage à la fois la base et le schéma, avec une colonne tenant_id qui filtre chaque requête, la plus économique en ressources mais la plus risquée si un filtre est oublié quelque part, exposant potentiellement les données d'un client à un autre.",
      en: "The separate database strategy gives each customer their own physical database, the strongest possible isolation but also the most costly to operate and evolve, every schema migration needing to be repeated on every database. The separate schema strategy shares a single database but gives a dedicated schema per customer, a reasonable trade-off between isolation and operational cost. The discriminator column strategy shares both the database and the schema, with a tenant_id column filtering every query, the cheapest in resources but the riskiest if a filter is forgotten somewhere, potentially exposing one customer's data to another.",
    },
    pitfall: {
      fr: "Le piège en entretien est de recommander la stratégie colonne discriminante sans mentionner son risque de sécurité majeur : oublier le filtre tenant_id sur une seule requête, ou sur un accès direct en base pour du débogage, peut exposer des données confidentielles entre clients, c'est pourquoi cette stratégie exige des garde-fous supplémentaires, comme des filtres Hibernate appliqués automatiquement au niveau de la session.",
      en: "The interview trap is recommending the discriminator column strategy without mentioning its major security risk: forgetting the tenant_id filter on a single query, or on a direct database access for debugging, can expose confidential data across customers, which is why this strategy demands extra guardrails, like Hibernate filters automatically applied at the session level.",
    },
    tags: ["multi-tenancy", "architecture", "security"],
  },

  // SQL (senior/architecte)
  {
    id: "sql-execution-plan-reading",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Comment lire un plan d'exécution pour diagnostiquer une requête lente, et quelle est la différence entre un seq scan et un index scan ?",
      en: "How do you read an execution plan to diagnose a slow query, and what is the difference between a seq scan and an index scan ?",
    },
    answer: {
      fr: "Un plan d'exécution, obtenu avec EXPLAIN ou EXPLAIN ANALYZE, décrit la stratégie choisie par l'optimiseur pour exécuter une requête, sous forme d'arbre d'opérations dont il faut lire les nœuds les plus internes en premier. Un seq scan, ou parcours séquentiel, lit la table entière ligne par ligne, ce qui est en réalité optimal quand une grande proportion des lignes correspond au filtre. Un index scan utilise une structure d'index pour sauter directement aux lignes pertinentes, bien plus rapide quand le filtre ne sélectionne qu'une petite fraction de la table. EXPLAIN ANALYZE exécute réellement la requête et ajoute le temps mesuré et le nombre de lignes réel à chaque étape, ce qui permet de repérer un écart entre l'estimation de l'optimiseur et la réalité, souvent le signe de statistiques obsolètes.",
      en: "An execution plan, obtained with EXPLAIN or EXPLAIN ANALYZE, describes the strategy the optimizer chose to execute a query, as a tree of operations that should be read from the innermost nodes first. A seq scan, or sequential scan, reads the entire table row by row, which is actually optimal when a large proportion of rows match the filter. An index scan uses an index structure to jump directly to relevant rows, much faster when the filter only selects a small fraction of the table. EXPLAIN ANALYZE actually runs the query and adds the measured time and the real row count to each step, which lets you spot a gap between the optimizer's estimate and reality, often a sign of stale statistics.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de croire qu'un seq scan est toujours le signe d'un problème de performance : sur une petite table, ou quand le filtre sélectionne la majorité des lignes, un seq scan est souvent plus rapide qu'un index scan à cause du surcoût de navigation dans la structure d'index, l'optimiseur fait généralement le bon choix, l'intervention manuelle ne devrait venir qu'après avoir constaté un vrai écart entre estimation et réalité.",
      en: "The classic interview trap is believing a seq scan is always a sign of a performance problem: on a small table, or when the filter selects most of the rows, a seq scan is often faster than an index scan because of the overhead of navigating the index structure, the optimizer usually makes the right call, manual intervention should only come after observing a real gap between estimate and reality.",
    },
    code: {
      lang: "sql",
      snippet:
        "EXPLAIN ANALYZE\nSELECT * FROM orders WHERE customer_id = 42;\n\n-- Index Scan using idx_orders_customer_id on orders\n--   (cost=0.29..8.31 rows=5 width=64)\n--   (actual time=0.02..0.03 rows=5 loops=1)",
    },
    tags: ["execution-plan", "index-scan", "performance-tuning"],
  },
  {
    id: "sql-cte-recursive",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne une CTE récursive, et pour quel type de problème est-elle particulièrement adaptée ?",
      en: "How does a recursive CTE work, and what kind of problem is it particularly suited for ?",
    },
    answer: {
      fr: "Une CTE récursive se définit en deux parties combinées par UNION ALL : un membre initial qui produit les lignes de départ, et un membre récursif qui référence la CTE elle-même pour produire les lignes suivantes à partir des précédentes, la récursion s'arrêtant naturellement quand le membre récursif ne produit plus aucune nouvelle ligne. C'est la solution naturelle pour parcourir une structure hiérarchique de profondeur variable stockée dans une seule table, comme une arborescence de catégories, un organigramme d'entreprise, ou une nomenclature de composants, là où une jointure classique ne peut gérer qu'un nombre fixe de niveaux.",
      en: "A recursive CTE is defined in two parts combined by UNION ALL: an initial member that produces the starting rows, and a recursive member that references the CTE itself to produce the next rows from the previous ones, the recursion naturally stopping when the recursive member no longer produces any new row. It's the natural solution for traversing a hierarchical structure of variable depth stored in a single table, like a category tree, a company org chart, or a bill of materials, where a classic join can only handle a fixed number of levels.",
    },
    pitfall: {
      fr: "Le piège est d'oublier une condition d'arrêt correcte dans une hiérarchie qui contient un cycle, par exemple une donnée corrompue où un enregistrement finit par référencer un de ses propres descendants : sans protection, la CTE récursive peut boucler indéfiniment, la plupart des moteurs proposent une clause pour détecter les cycles ou limiter la profondeur maximale de récursion.",
      en: "The trap is forgetting a correct stopping condition in a hierarchy that contains a cycle, for example corrupted data where a record ends up referencing one of its own descendants: without protection, the recursive CTE can loop indefinitely, most engines offer a clause to detect cycles or cap the maximum recursion depth.",
    },
    code: {
      lang: "sql",
      snippet:
        "WITH RECURSIVE org_chart AS (\n  SELECT id, name, manager_id, 1 AS depth\n  FROM employees WHERE manager_id IS NULL\n  UNION ALL\n  SELECT e.id, e.name, e.manager_id, oc.depth + 1\n  FROM employees e\n  JOIN org_chart oc ON e.manager_id = oc.id\n)\nSELECT * FROM org_chart ORDER BY depth;",
    },
    tags: ["cte", "recursive-queries", "hierarchical-data"],
  },
  {
    id: "sql-partitioning-strategies",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que le partitionnement de table, et quand devient-il pertinent à grande échelle ?",
      en: "What is table partitioning, and when does it become relevant at scale ?",
    },
    answer: {
      fr: "Le partitionnement découpe physiquement une grande table en plusieurs sous-tables plus petites, appelées partitions, selon une clé, par plage de valeurs comme une date, par liste de valeurs discrètes, ou par hachage. Vu de l'application, la table reste unique, mais le moteur peut exclure entièrement les partitions non concernées par une requête, une technique appelée partition pruning, ce qui accélère considérablement les requêtes qui filtrent sur la clé de partitionnement. Ça devient pertinent quand une table atteint des dizaines ou centaines de millions de lignes et que les requêtes ciblent naturellement un sous-ensemble prévisible, par exemple les données d'un mois donné dans une table d'événements, ce qui permet aussi de purger de vieilles données en supprimant une partition entière plutôt qu'en exécutant un DELETE coûteux.",
      en: "Partitioning physically splits a large table into several smaller sub-tables, called partitions, based on a key, by value range like a date, by list of discrete values, or by hash. From the application's point of view, the table remains a single one, but the engine can entirely skip partitions irrelevant to a query, a technique called partition pruning, which considerably speeds up queries that filter on the partitioning key. This becomes relevant when a table reaches tens or hundreds of millions of rows and queries naturally target a predictable subset, for example a given month's data in an events table, which also allows purging old data by dropping an entire partition rather than running a costly DELETE.",
    },
    pitfall: {
      fr: "Le piège est de partitionner une table sur une clé qui ne correspond pas aux filtres réellement utilisés par les requêtes de l'application : sans filtre sur la clé de partitionnement, le moteur doit scanner toutes les partitions de toute façon, annulant le bénéfice du partition pruning tout en ajoutant de la complexité opérationnelle inutile.",
      en: "The trap is partitioning a table on a key that doesn't match the filters actually used by the application's queries: without a filter on the partitioning key, the engine has to scan every partition anyway, canceling the partition pruning benefit while adding unnecessary operational complexity.",
    },
    tags: ["partitioning", "scalability", "database-design"],
  },
  {
    id: "sql-mvcc-concurrency",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Comment le contrôle de concurrence multi-versions (MVCC) permet-il à des lecteurs de ne jamais bloquer des écrivains ?",
      en: "How does multi-version concurrency control (MVCC) let readers never block writers ?",
    },
    answer: {
      fr: "Plutôt que de verrouiller une ligne pour empêcher toute lecture pendant qu'elle est modifiée, une base MVCC conserve plusieurs versions physiques de chaque ligne modifiée, chacune associée à l'identifiant de la transaction qui l'a créée. Quand une transaction lit une ligne, elle voit la version qui était valide au début de sa propre transaction ou de sa requête, selon le niveau d'isolation, sans jamais avoir besoin d'attendre qu'une écriture concurrente se termine. Les anciennes versions devenues inutiles, parce qu'aucune transaction active n'en a plus besoin, sont ensuite nettoyées par un processus de maintenance en arrière-plan, comme le VACUUM de PostgreSQL.",
      en: "Rather than locking a row to prevent any read while it's being modified, an MVCC database keeps several physical versions of each modified row, each tied to the identifier of the transaction that created it. When a transaction reads a row, it sees the version that was valid at the start of its own transaction or its query, depending on the isolation level, without ever needing to wait for a concurrent write to finish. Old versions that become unnecessary, because no active transaction still needs them, are then cleaned up by a background maintenance process, like PostgreSQL's VACUUM.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que MVCC élimine les verrous de lecture mais pas les conflits d'écriture concurrente : deux transactions qui modifient la même ligne en même temps se heurtent toujours, et négliger la maintenance des anciennes versions, comme un VACUUM qui ne tourne jamais, peut faire gonfler la taille physique des tables et dégrader les performances avec le temps.",
      en: "The trap is forgetting MVCC eliminates read locks but not concurrent write conflicts: two transactions modifying the same row at the same time still collide, and neglecting old version maintenance, like a VACUUM that never runs, can bloat tables' physical size and degrade performance over time.",
    },
    tags: ["mvcc", "concurrency", "database-internals"],
  },
  {
    id: "sql-connection-pooling",
    topicId: "sql",
    difficulty: "hard",
    question: {
      fr: "Pourquoi le pooling de connexions est-il indispensable, et pourquoi une taille de pool plus grande n'améliore-t-elle pas toujours les performances ?",
      en: "Why is connection pooling essential, and why doesn't a larger pool size always improve performance ?",
    },
    answer: {
      fr: "Ouvrir une nouvelle connexion à une base de données est une opération coûteuse, impliquant une négociation réseau et souvent une authentification, ce qui rendrait l'application inutilisable si chaque requête devait ouvrir puis fermer sa propre connexion. Un pool de connexions, comme HikariCP, maintient un ensemble de connexions déjà établies et prêtes à l'emploi, que les threads applicatifs empruntent puis rendent après usage. Contrairement à l'intuition, augmenter indéfiniment la taille du pool ne s'échelonne pas linéairement : la base de données elle-même a un nombre limité de cœurs pour traiter les requêtes en parallèle, et trop de connexions actives simultanément créent surtout plus de contention sur les ressources partagées de la base, comme les verrous ou le cache de pages, sans accélérer le débit réel.",
      en: "Opening a new database connection is a costly operation, involving network negotiation and often authentication, which would make an application unusable if every query had to open and close its own connection. A connection pool, like HikariCP, maintains a set of already established, ready-to-use connections that application threads borrow and return after use. Counter-intuitively, endlessly increasing pool size doesn't scale linearly: the database itself has a limited number of cores to process queries in parallel, and too many simultaneously active connections mostly create more contention on the database's shared resources, like locks or the page cache, without speeding up actual throughput.",
    },
    pitfall: {
      fr: "Le piège classique est de dimensionner le pool de connexions à la louche, souvent bien trop large, en pensant que plus de connexions veut dire plus de débit : la formule couramment recommandée pour HikariCP part du nombre de cœurs disponibles côté base, un pool surdimensionné dégrade souvent les performances au lieu de les améliorer.",
      en: "The classic trap is sizing the connection pool by guesswork, often far too large, assuming more connections means more throughput: the commonly recommended formula for HikariCP starts from the number of cores available on the database side, an oversized pool often degrades performance instead of improving it.",
    },
    tags: ["connection-pooling", "hikaricp", "performance-tuning"],
  },

  // Angular (senior/architecte)
  {
    id: "angular-zoneless-change-detection",
    topicId: "angular",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce qu'Angular zoneless, et en quoi les signals rendent-ils Zone.js obsolète pour la détection de changements ?",
      en: "What is zoneless Angular, and how do signals make Zone.js obsolete for change detection ?",
    },
    answer: {
      fr: "Zone.js déclenche un cycle de détection de changements en interceptant tous les événements asynchrones possibles du navigateur, une approche large mais coûteuse puisqu'elle vérifie l'ensemble de l'arbre de composants même quand une seule petite partie a réellement changé. Les signals, eux, savent précisément quels composants ou quelles expressions du template dépendent de leur valeur, puisque cette dépendance est déclarée explicitement à la lecture du signal. Angular zoneless retire complètement Zone.js et s'appuie uniquement sur ce graphe de dépendances fin des signals pour ne recalculer que ce qui a réellement besoin de l'être, ce qui réduit le travail de détection de changements et supprime le poids de Zone.js dans le bundle final.",
      en: "Zone.js triggers a change detection cycle by intercepting every possible asynchronous browser event, a broad but costly approach since it checks the entire component tree even when only one small part actually changed. Signals, on the other hand, precisely know which components or template expressions depend on their value, since that dependency is explicitly declared when the signal is read. Zoneless Angular removes Zone.js entirely and relies solely on that fine-grained signal dependency graph to only recompute what genuinely needs it, which reduces change detection work and removes Zone.js's weight from the final bundle.",
    },
    pitfall: {
      fr: "Le piège est de migrer vers le mode zoneless sans avoir remplacé toutes les propriétés de composant classiques par des signals : une propriété mutée directement sans passer par un signal n'a plus aucun mécanisme pour déclencher une mise à jour du template en l'absence de Zone.js, ce qui casse silencieusement l'affichage plutôt que de lever une erreur explicite.",
      en: "The trap is migrating to zoneless mode without having replaced every classic component property with signals: a property mutated directly without going through a signal no longer has any mechanism to trigger a template update once Zone.js is gone, which silently breaks the display rather than throwing an explicit error.",
    },
    tags: ["zoneless", "signals", "change-detection"],
  },
  {
    id: "angular-ssr-hydration",
    topicId: "angular",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne l'hydratation d'une application Angular Universal, et qu'est-ce qu'une erreur d'hydratation ?",
      en: "How does hydration work for an Angular Universal application, and what is a hydration mismatch ?",
    },
    answer: {
      fr: "Le rendu côté serveur, Angular Universal, génère le HTML complet d'une page sur le serveur pour l'envoyer déjà prêt au navigateur, améliorant le temps de premier affichage et le référencement. L'hydratation est l'étape qui suit côté client : plutôt que de jeter ce HTML et de tout re-rendre depuis zéro, Angular réutilise le DOM déjà présent et y attache les écouteurs d'événements et l'état applicatif nécessaires pour le rendre interactif, sans flash de contenu ni re-rendu visible. Une erreur d'hydratation survient quand le DOM effectivement rendu côté client, si Angular devait le regénérer, ne correspond pas exactement au DOM produit côté serveur, souvent à cause de code qui donne un résultat différent selon qu'il tourne sur le serveur ou dans le navigateur, comme un accès direct à window ou à la date courante.",
      en: "Server-side rendering, Angular Universal, generates a page's full HTML on the server to send it already ready to the browser, improving first paint time and SEO. Hydration is the step that follows on the client: rather than discarding that HTML and re-rendering everything from scratch, Angular reuses the DOM already present and attaches the event listeners and application state needed to make it interactive, with no content flash or visible re-render. A hydration mismatch happens when the DOM that would actually be rendered client-side, if Angular had to regenerate it, doesn't exactly match the DOM produced server-side, often because of code that gives a different result depending on whether it runs on the server or in the browser, like a direct access to window or the current date.",
    },
    pitfall: {
      fr: "Le piège classique est d'accéder directement à des API du navigateur, comme window ou localStorage, dans du code qui s'exécute aussi côté serveur pendant le SSR : ça provoque une erreur au moment du rendu serveur ou une incohérence d'hydratation, la bonne pratique est de vérifier la plateforme d'exécution ou d'isoler ce code dans un hook de cycle de vie qui ne s'exécute que côté client.",
      en: "The classic trap is directly accessing browser APIs, like window or localStorage, in code that also runs server-side during SSR: it causes a server-render error or a hydration mismatch, the right practice is checking the execution platform or isolating that code in a lifecycle hook that only runs client-side.",
    },
    tags: ["ssr", "hydration", "angular-universal"],
  },
  {
    id: "angular-module-federation-microfrontends",
    topicId: "angular",
    difficulty: "hard",
    question: {
      fr: "Comment Module Federation permet-il de construire des micro-frontends Angular indépendamment déployables ?",
      en: "How does Module Federation enable independently deployable Angular micro-frontends ?",
    },
    answer: {
      fr: "Module Federation, une fonctionnalité de Webpack, permet à une application Angular de charger dynamiquement à l'exécution du code JavaScript compilé et déployé séparément par une autre équipe, plutôt que de tout compiler ensemble dans un seul bundle monolithique au moment du build. Une application hôte déclare quels modules distants elle peut consommer et à quelle adresse les trouver, tandis que chaque micro-frontend expose les modules qu'il souhaite partager. Ça permet à plusieurs équipes de développer, tester et déployer leur partie de l'application indépendamment, avec des cycles de release découplés, tout en partageant certaines dépendances communes, comme Angular lui-même, pour éviter de les charger plusieurs fois.",
      en: "Module Federation, a Webpack feature, lets an Angular application dynamically load, at runtime, JavaScript code compiled and deployed separately by another team, rather than compiling everything together into a single monolithic bundle at build time. A host application declares which remote modules it can consume and where to find them, while each micro-frontend exposes the modules it wants to share. This lets several teams develop, test and deploy their part of the application independently, with decoupled release cycles, while sharing certain common dependencies, like Angular itself, to avoid loading them multiple times.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer la gestion des versions de dépendances partagées entre micro-frontends indépendants : si deux équipes déploient des versions incompatibles d'une même librairie partagée, comme deux versions majeures d'Angular différentes, l'application peut charger la mauvaise version au runtime ou planter de façon difficile à diagnostiquer, une vraie gouvernance de versionnage devient nécessaire dès que plusieurs équipes sont impliquées.",
      en: "The trap is underestimating shared dependency version management across independent micro-frontends: if two teams deploy incompatible versions of the same shared library, like two different Angular major versions, the application can load the wrong version at runtime or crash in a way that's hard to diagnose, real versioning governance becomes necessary as soon as several teams are involved.",
    },
    tags: ["micro-frontends", "module-federation", "architecture"],
  },
  {
    id: "angular-http-interceptors-chain",
    topicId: "angular",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne une chaîne d'intercepteurs HTTP fonctionnels en Angular, et dans quel ordre s'exécutent-ils ?",
      en: "How does a chain of functional HTTP interceptors work in Angular, and in what order do they execute ?",
    },
    answer: {
      fr: "Un intercepteur HTTP fonctionnel est une fonction qui reçoit la requête sortante et une fonction next représentant la suite de la chaîne, ce qui lui permet de modifier la requête avant de la transmettre, de transformer la réponse après l'avoir reçue de next, ou de court-circuiter complètement la chaîne, par exemple pour renvoyer une réponse en cache sans jamais appeler le serveur. Les intercepteurs déclarés s'exécutent dans l'ordre où ils sont fournis pour la partie requête, du premier au dernier, puis dans l'ordre inverse pour la partie réponse, chaque intercepteur pouvant observer et transformer ce que les suivants dans la chaîne renvoient.",
      en: "A functional HTTP interceptor is a function that receives the outgoing request and a next function representing the rest of the chain, letting it modify the request before forwarding it, transform the response after receiving it from next, or completely short-circuit the chain, for example to return a cached response without ever calling the server. Declared interceptors run in the order they're provided for the request side, first to last, then in reverse order for the response side, each interceptor able to observe and transform what the next ones in the chain return.",
    },
    pitfall: {
      fr: "Le piège est d'oublier qu'un intercepteur qui gère l'authentification et tente de rafraîchir un token expiré doit gérer le cas où plusieurs requêtes échouent simultanément avec un token expiré : sans mécanisme pour partager un seul rafraîchissement en cours entre toutes ces requêtes, l'application peut déclencher plusieurs appels de rafraîchissement concurrents inutiles, voire invalider mutuellement les tokens obtenus.",
      en: "The trap is forgetting that an interceptor handling authentication and trying to refresh an expired token must handle the case where several requests fail simultaneously with an expired token: without a mechanism to share a single in-flight refresh across all those requests, the application can trigger several unnecessary concurrent refresh calls, or even have the obtained tokens invalidate each other.",
    },
    code: {
      lang: "typescript",
      snippet:
        "export const authInterceptor: HttpInterceptorFn = (req, next) => {\n  const token = inject(AuthService).getToken();\n  const authReq = token\n    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })\n    : req;\n  return next(authReq);\n};\n\n// providers: [provideHttpClient(withInterceptors([authInterceptor]))]",
    },
    tags: ["http-interceptors", "functional-interceptors", "authentication"],
  },
  {
    id: "angular-performance-budgets",
    topicId: "angular",
    difficulty: "hard",
    question: {
      fr: "À quoi servent les budgets de performance dans angular.json, et comment une stratégie de préchargement (preloading) complète-t-elle le lazy loading ?",
      en: "What are performance budgets in angular.json for, and how does a preloading strategy complement lazy loading ?",
    },
    answer: {
      fr: "Les budgets de performance définissent des seuils de taille, par exemple pour le bundle initial ou pour un composant donné, et font échouer le build ou lèvent un avertissement si un seuil est dépassé, ce qui empêche une régression de taille de passer inaperçue au fil des évolutions du projet. Le lazy loading découpe l'application en modules chargés seulement quand l'utilisateur navigue vers la route correspondante, ce qui réduit le bundle initial mais peut introduire un délai visible au premier accès à une route. Une stratégie de préchargement, comme PreloadAllModules ou une stratégie personnalisée basée sur la probabilité de navigation, charge ces modules lazy en arrière-plan une fois l'application initiale prête, pour qu'ils soient déjà disponibles quand l'utilisateur y accède réellement.",
      en: "Performance budgets define size thresholds, for example for the initial bundle or for a given component, and fail the build or raise a warning if a threshold is exceeded, which prevents a size regression from going unnoticed as the project evolves. Lazy loading splits the application into modules loaded only when the user navigates to the matching route, which reduces the initial bundle but can introduce a visible delay on first access to a route. A preloading strategy, like PreloadAllModules or a custom strategy based on navigation probability, loads those lazy modules in the background once the initial application is ready, so they're already available by the time the user actually reaches them.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser PreloadAllModules sans réflexion sur une application avec de nombreux modules lourds et rarement visités : ça revient à annuler une bonne partie du bénéfice du lazy loading en téléchargeant quand même tout le code en arrière-plan, une stratégie de préchargement personnalisée et sélective est souvent préférable à grande échelle.",
      en: "The trap is using PreloadAllModules without thought on an application with many heavy, rarely visited modules: that ends up canceling much of lazy loading's benefit by downloading all the code in the background anyway, a custom, selective preloading strategy is often preferable at scale.",
    },
    code: {
      lang: "json",
      snippet:
        '{\n  "budgets": [\n    { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },\n    { "type": "anyComponentStyle", "maximumWarning": "4kb" }\n  ]\n}',
    },
    tags: ["performance-budgets", "lazy-loading", "preloading"],
  },

  // Claude & LLM (senior/architecte)
  {
    id: "claude-mcp-protocol",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que le Model Context Protocol (MCP), et quel problème standardise-t-il pour les applications basées sur des LLM ?",
      en: "What is the Model Context Protocol (MCP), and what problem does it standardize for LLM-based applications ?",
    },
    answer: {
      fr: "Avant MCP, chaque application qui voulait connecter un LLM à une source de données ou à un outil externe, une base de données, un système de fichiers, une API tierce, devait écrire une intégration spécifique et non réutilisable pour ce cas précis. MCP définit un protocole standard client-serveur qui décrit comment un serveur expose des outils, des ressources et des prompts de façon uniforme, et comment n'importe quel client compatible, comme Claude Desktop ou Claude Code, peut découvrir et utiliser ces capacités sans intégration sur mesure. C'est l'équivalent, pour les applications LLM, de ce que le Language Server Protocol a apporté aux éditeurs de code : un seul serveur MCP écrit une fois peut être réutilisé par n'importe quel client qui parle le protocole.",
      en: "Before MCP, every application wanting to connect an LLM to a data source or an external tool, a database, a filesystem, a third-party API, had to write a specific, non-reusable integration for that exact case. MCP defines a standard client-server protocol describing how a server uniformly exposes tools, resources and prompts, and how any compatible client, like Claude Desktop or Claude Code, can discover and use those capabilities with no custom integration. It's the equivalent, for LLM applications, of what the Language Server Protocol brought to code editors: a single MCP server written once can be reused by any client that speaks the protocol.",
    },
    pitfall: {
      fr: "Le piège est de traiter un serveur MCP comme une simple API REST déguisée : la valeur du protocole vient justement de sa capacité à décrire dynamiquement au client quels outils et ressources sont disponibles et comment les utiliser, plutôt que de coder en dur cette connaissance côté client, ce qui permet au même client de fonctionner avec des serveurs MCP totalement différents sans modification.",
      en: "The trap is treating an MCP server as just a disguised REST API: the protocol's value comes precisely from its ability to dynamically describe to the client which tools and resources are available and how to use them, rather than hardcoding that knowledge client-side, which lets the same client work with completely different MCP servers with no modification.",
    },
    tags: ["mcp", "protocol-design", "agent-architecture"],
  },
  {
    id: "claude-subagent-architecture",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Quand a-t-on intérêt à déléguer une tâche à un subagent plutôt que de la traiter directement dans la boucle principale d'un agent ?",
      en: "When does it make sense to delegate a task to a subagent rather than handling it directly in an agent's main loop ?",
    },
    answer: {
      fr: "Un subagent démarre avec un contexte propre et isolé, sans l'historique de la conversation principale, ce qui convient bien à une tâche de recherche ou d'exploration dont le résultat final compte, mais dont les nombreuses étapes intermédiaires n'ont pas besoin de polluer le contexte de l'agent principal. Déléguer permet aussi de paralléliser plusieurs tâches indépendantes, chaque subagent travaillant de son côté, et de limiter le rayon d'action d'une tâche risquée en lui donnant un accès plus restreint aux outils que l'agent principal. À l'inverse, une tâche qui a besoin de tout le contexte déjà accumulé dans la conversation, ou qui est trop simple pour justifier le coût de démarrage d'un nouveau contexte, se traite mieux directement en ligne.",
      en: "A subagent starts with a clean, isolated context, without the main conversation's history, which fits well for a research or exploration task whose final result matters, but whose many intermediate steps don't need to clutter the main agent's context. Delegating also allows parallelizing several independent tasks, each subagent working on its own, and limiting a risky task's blast radius by giving it more restricted tool access than the main agent. Conversely, a task that needs all the context already accumulated in the conversation, or that's too simple to justify the cost of starting a new context, is better handled directly inline.",
    },
    pitfall: {
      fr: "Le piège est de déléguer systématiquement par réflexe, y compris pour des tâches triviales : chaque subagent a un coût de démarrage et perd l'accès direct au contexte déjà établi, sur-déléguer peut rendre le système plus lent et plus difficile à suivre qu'un traitement direct, la délégation doit rester une décision motivée par un besoin réel d'isolation ou de parallélisation.",
      en: "The trap is delegating out of reflex for everything, including trivial tasks: every subagent has a startup cost and loses direct access to already established context, over-delegating can make the system slower and harder to follow than direct handling, delegation should remain a decision motivated by a real need for isolation or parallelization.",
    },
    tags: ["subagents", "agent-architecture", "orchestration"],
  },
  {
    id: "claude-evals-and-regression-testing",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Comment construire des evals pour tester une fonctionnalité basée sur un LLM, et pourquoi les tests unitaires classiques ne suffisent-ils pas ?",
      en: "How do you build evals to test an LLM-powered feature, and why aren't classic unit tests enough ?",
    },
    answer: {
      fr: "Un test unitaire classique vérifie qu'une même entrée produit toujours exactement la même sortie, une hypothèse qui ne tient pas pour un LLM dont les réponses varient en formulation même à comportement correct. Un eval compare plutôt la sortie du modèle contre un ensemble de critères de qualité, comme la présence d'informations attendues, l'absence d'un comportement interdit, ou un score attribué par un modèle juge qui évalue la réponse selon une grille définie, sur un jeu de cas représentatifs constitué à l'avance. L'objectif est de détecter une régression de comportement après un changement de prompt ou de modèle, pas de vérifier une égalité stricte de texte.",
      en: "A classic unit test checks that the same input always produces exactly the same output, an assumption that doesn't hold for an LLM whose responses vary in phrasing even with correct behavior. An eval instead compares the model's output against a set of quality criteria, like the presence of expected information, the absence of a forbidden behavior, or a score assigned by a judge model that evaluates the response against a defined rubric, over a set of representative cases built in advance. The goal is to detect a behavior regression after a prompt or model change, not to check strict text equality.",
    },
    pitfall: {
      fr: "Le piège est de construire un jeu d'evals une seule fois puis de ne jamais le faire évoluer : à mesure que de nouveaux cas limites sont découverts en production, ne pas les ajouter au jeu d'evals fait qu'on continue de tester contre un périmètre qui ne reflète plus les vrais usages, un jeu d'evals doit être un actif vivant, pas un artefact figé créé une seule fois.",
      en: "The trap is building an eval set once and never evolving it: as new edge cases are discovered in production, not adding them to the eval set means continuing to test against a scope that no longer reflects real usage, an eval set should be a living asset, not a frozen artifact created once.",
    },
    tags: ["evals", "testing", "llm-quality"],
  },
  {
    id: "claude-context-caching-cost",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionne le cache de prompt, et dans quel scénario apporte-t-il le plus de bénéfice en coût et en latence ?",
      en: "How does prompt caching work, and in what scenario does it bring the most benefit in cost and latency ?",
    },
    answer: {
      fr: "Le cache de prompt permet de réutiliser le traitement déjà fait par le modèle sur une portion stable et répétée du prompt, comme un long system prompt, un jeu d'exemples, ou un gros document de référence, plutôt que de retraiter cette portion identique à chaque nouvel appel. Tant que cette portion reste inchangée d'un appel à l'autre et que les appels arrivent dans une fenêtre de temps suffisamment rapprochée, les appels suivants bénéficient d'un coût et d'une latence largement réduits sur cette partie mise en cache. C'est particulièrement rentable pour un agent qui réutilise le même contexte volumineux, comme une base de code entière ou une longue documentation, sur de nombreux appels successifs dans une même session.",
      en: "Prompt caching lets you reuse processing the model already did on a stable, repeated portion of the prompt, like a long system prompt, a set of examples, or a large reference document, rather than reprocessing that identical portion on every new call. As long as that portion stays unchanged from one call to the next and calls arrive within a close enough time window, subsequent calls benefit from largely reduced cost and latency on that cached part. It's particularly worthwhile for an agent that reuses the same large context, like an entire codebase or lengthy documentation, across many successive calls within the same session.",
    },
    pitfall: {
      fr: "Le piège est de placer le contenu qui change à chaque appel, comme la question spécifique de l'utilisateur, avant la portion stable dans l'ordre du prompt : le cache ne profite qu'au préfixe commun et identique d'un appel à l'autre, si l'ordre mélange contenu variable et contenu stable, aucune portion utile ne reste identique assez longtemps pour bénéficier du cache.",
      en: "The trap is placing content that changes on every call, like the user's specific question, before the stable portion in the prompt's order: the cache only benefits the common, identical prefix from one call to the next, if the ordering mixes variable and stable content, no useful portion stays identical long enough to benefit from caching.",
    },
    tags: ["prompt-caching", "cost-optimization", "latency"],
  },
  {
    id: "claude-guardrails-vs-fine-tuning",
    topicId: "claude",
    difficulty: "hard",
    question: {
      fr: "Pour un comportement critique en matière de sécurité, quand privilégier des garde-fous applicatifs plutôt qu'un fine-tuning du modèle ?",
      en: "For a safety-critical behavior, when should you favor application-level guardrails over fine-tuning the model ?",
    },
    answer: {
      fr: "Un garde-fou applicatif, comme une validation stricte des entrées et sorties, une liste blanche d'actions autorisées, ou une vérification déterministe après génération, offre une garantie vérifiable et modifiable rapidement sans avoir à réentraîner quoi que ce soit. Le fine-tuning modifie le comportement du modèle lui-même, ce qui peut sembler séduisant pour ancrer un comportement plus profondément, mais reste probabiliste par nature : rien ne garantit à 100% qu'un modèle affiné respecte toujours la règle visée, surtout face à une entrée inhabituelle non représentée dans les données d'entraînement. Pour un comportement réellement critique, la bonne pratique est de placer la garantie dure du côté du code déterministe, et de réserver le modèle, éventuellement affiné, à la partie où un jugement plus souple est acceptable.",
      en: "An application-level guardrail, like strict input and output validation, an allowlist of permitted actions, or a deterministic check after generation, offers a verifiable guarantee that can be modified quickly with no need to retrain anything. Fine-tuning changes the model's own behavior, which can seem appealing for anchoring a behavior more deeply, but remains probabilistic by nature: nothing guarantees 100% that a fine-tuned model always follows the intended rule, especially facing an unusual input not represented in the training data. For a genuinely critical behavior, the right practice is placing the hard guarantee on the deterministic code side, and reserving the model, possibly fine-tuned, for the part where more flexible judgment is acceptable.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter le fine-tuning comme une solution de sécurité en soi : un modèle affiné pour refuser certaines demandes reste un modèle probabiliste, un attaquant suffisamment motivé peut souvent trouver une formulation qui contourne le comportement appris, la sécurité réelle doit reposer sur des couches déterministes qui ne dépendent pas du bon vouloir du modèle.",
      en: "The interview trap is presenting fine-tuning as a security solution in itself: a model fine-tuned to refuse certain requests remains a probabilistic model, a sufficiently motivated attacker can often find a phrasing that bypasses the learned behavior, real security must rest on deterministic layers that don't depend on the model's goodwill.",
    },
    tags: ["guardrails", "fine-tuning", "ai-safety"],
  },

  // Kubernetes (senior/architecte)
  {
    id: "k8s-pod-disruption-budgets",
    topicId: "kubernetes",
    difficulty: "hard",
    question: {
      fr: "À quoi sert un PodDisruptionBudget, et en quoi diffère-t-il de la protection apportée par les probes ?",
      en: "What is a PodDisruptionBudget for, and how does it differ from the protection probes provide ?",
    },
    answer: {
      fr: "Un PodDisruptionBudget définit le nombre minimum de Pods d'une application qui doivent rester disponibles, ou le nombre maximum qui peuvent être indisponibles, lors d'une interruption volontaire déclenchée par un administrateur du cluster, comme le drainage d'un nœud pour maintenance ou une mise à jour de la version de Kubernetes. Contrairement aux probes, qui protègent contre des pannes de l'application elle-même en la retirant du trafic ou en la redémarrant, le PodDisruptionBudget protège contre des opérations d'infrastructure planifiées, en empêchant l'outil qui orchestre le drainage de retirer trop de Pods d'une même application en même temps, ce qui garantit une continuité de service minimale pendant les opérations de maintenance du cluster.",
      en: "A PodDisruptionBudget defines the minimum number of an application's Pods that must remain available, or the maximum number that can be unavailable, during a voluntary disruption triggered by a cluster administrator, like draining a node for maintenance or upgrading the Kubernetes version. Unlike probes, which protect against failures of the application itself by removing it from traffic or restarting it, a PodDisruptionBudget protects against planned infrastructure operations, by preventing the tool orchestrating the drain from removing too many Pods of the same application at once, guaranteeing minimal service continuity during cluster maintenance operations.",
    },
    pitfall: {
      fr: "Le piège est de définir un PodDisruptionBudget trop strict, comme minAvailable égal au nombre total de répliques, sur une application qui n'a que deux ou trois instances : ça peut bloquer indéfiniment un drainage de nœud légitime, car Kubernetes refusera de supprimer un seul Pod tant que la condition du budget ne peut pas être respectée, immobilisant potentiellement une opération de maintenance critique.",
      en: "The trap is defining a PodDisruptionBudget too strictly, like minAvailable equal to the total replica count, on an application with only two or three instances: it can indefinitely block a legitimate node drain, since Kubernetes will refuse to remove even one Pod as long as the budget's condition can't be met, potentially stalling a critical maintenance operation.",
    },
    code: {
      lang: "yaml",
      snippet:
        "apiVersion: policy/v1\nkind: PodDisruptionBudget\nmetadata:\n  name: api-pdb\nspec:\n  minAvailable: 2\n  selector:\n    matchLabels:\n      app: api",
    },
    tags: ["pod-disruption-budget", "cluster-operations", "resilience"],
  },
  {
    id: "k8s-network-policies",
    topicId: "kubernetes",
    difficulty: "hard",
    question: {
      fr: "Comment une NetworkPolicy met-elle en place une approche zero-trust entre Pods, et que se passe-t-il par défaut sans aucune policy ?",
      en: "How does a NetworkPolicy implement a zero-trust approach between Pods, and what happens by default with no policy at all ?",
    },
    answer: {
      fr: "Par défaut, sans aucune NetworkPolicy, tous les Pods d'un cluster Kubernetes peuvent communiquer librement entre eux, quel que soit le namespace, un modèle ouvert qui ne convient pas à une architecture qui a besoin d'isoler ses services. Une NetworkPolicy sélectionne un ensemble de Pods via des labels et définit des règles d'entrée et de sortie explicites, en général en s'appuyant sur le principe zero-trust : dès qu'une NetworkPolicy s'applique à un Pod, tout le trafic non explicitement autorisé par une règle est refusé par défaut, ce qui inverse le modèle ouvert initial en modèle fermé par défaut, où chaque flux de communication doit être explicitement justifié.",
      en: "By default, with no NetworkPolicy at all, every Pod in a Kubernetes cluster can freely communicate with every other, regardless of namespace, an open model that doesn't fit an architecture needing to isolate its services. A NetworkPolicy selects a set of Pods via labels and defines explicit ingress and egress rules, generally following the zero-trust principle: as soon as a NetworkPolicy applies to a Pod, all traffic not explicitly allowed by a rule is denied by default, flipping the initial open model into a default-closed one, where every communication flow must be explicitly justified.",
    },
    pitfall: {
      fr: "Le piège est de croire que les NetworkPolicy fonctionnent automatiquement sur n'importe quel cluster : elles ne sont appliquées que si le plugin réseau (CNI) utilisé les implémente réellement, certains plugins réseau basiques les ignorent silencieusement, donnant une fausse impression de sécurité si on ne vérifie pas la compatibilité du CNI en place.",
      en: "The trap is assuming NetworkPolicies work automatically on any cluster: they're only enforced if the network plugin (CNI) in use actually implements them, some basic network plugins silently ignore them, giving a false sense of security if the CNI's compatibility isn't checked.",
    },
    code: {
      lang: "yaml",
      snippet:
        "apiVersion: networking.k8s.io/v1\nkind: NetworkPolicy\nmetadata:\n  name: deny-all-then-allow-db\nspec:\n  podSelector:\n    matchLabels: { app: database }\n  policyTypes: [Ingress]\n  ingress:\n    - from:\n        - podSelector:\n            matchLabels: { app: backend }\n      ports:\n        - port: 5432",
    },
    tags: ["network-policy", "zero-trust", "security"],
  },
  {
    id: "k8s-operator-pattern",
    topicId: "kubernetes",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que le pattern Operator dans Kubernetes, et comment une boucle de réconciliation fonctionne-t-elle ?",
      en: "What is the Operator pattern in Kubernetes, and how does a reconciliation loop work ?",
    },
    answer: {
      fr: "Un Operator encode la connaissance opérationnelle nécessaire pour gérer une application complexe, souvent avec état, comme une base de données répliquée, en étendant l'API Kubernetes avec une nouvelle ressource personnalisée, une CRD, qui décrit l'état désiré de cette application à un niveau d'abstraction métier plutôt qu'au niveau bas des Pods et Services. Le contrôleur associé exécute en continu une boucle de réconciliation : il observe l'état réel actuel, le compare à l'état désiré décrit dans la ressource personnalisée, et prend les actions nécessaires pour rapprocher l'un de l'autre, comme créer une nouvelle réplique après une panne ou orchestrer une mise à jour de version en respectant un ordre précis.",
      en: "An Operator encodes the operational knowledge needed to manage a complex, often stateful application, like a replicated database, by extending the Kubernetes API with a new custom resource, a CRD, that describes that application's desired state at a business-level abstraction rather than at the low level of Pods and Services. The associated controller continuously runs a reconciliation loop: it observes the current actual state, compares it to the desired state described in the custom resource, and takes the necessary actions to bring the two closer together, like creating a new replica after a failure or orchestrating a version upgrade while respecting a precise order.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'un Operator élimine tout risque opérationnel simplement parce qu'il automatise des tâches auparavant manuelles : un Operator mal écrit peut lui-même introduire des bugs subtils dans sa logique de réconciliation, comme une boucle qui ne converge jamais vers l'état désiré dans certains cas limites, la qualité de l'Operator devient elle-même une dépendance critique de l'application qu'il gère.",
      en: "The trap is believing an Operator eliminates all operational risk simply because it automates previously manual tasks: a poorly written Operator can itself introduce subtle bugs in its reconciliation logic, like a loop that never converges to the desired state in certain edge cases, the Operator's quality itself becomes a critical dependency of the application it manages.",
    },
    tags: ["operator-pattern", "crd", "reconciliation-loop"],
  },
  {
    id: "k8s-multi-cluster-strategies",
    topicId: "kubernetes",
    difficulty: "hard",
    question: {
      fr: "Pour quelles raisons une organisation opte-t-elle pour plusieurs clusters Kubernetes plutôt qu'un seul grand cluster ?",
      en: "For what reasons does an organization choose multiple Kubernetes clusters rather than one large cluster ?",
    },
    answer: {
      fr: "Plusieurs clusters permettent une isolation forte entre environnements, comme production et hors-production, ou entre équipes, réduisant l'impact d'une mauvaise configuration ou d'une panne à un seul cluster plutôt qu'à l'ensemble du système. Ça permet aussi de répondre à des contraintes de localisation géographique des données ou de latence, en ayant un cluster par région proche des utilisateurs, et de limiter le rayon d'explosion d'une panne du plan de contrôle Kubernetes lui-même, qui affecterait sinon absolument toutes les charges de travail d'un seul coup. Le prix à payer est une complexité opérationnelle supplémentaire : gérer la cohérence de configuration, le déploiement coordonné et parfois le routage du trafic entre plusieurs clusters demande des outils et des processus dédiés.",
      en: "Multiple clusters allow strong isolation between environments, like production and non-production, or between teams, reducing the impact of a misconfiguration or an outage to a single cluster rather than the whole system. It also lets you address data geographic location or latency constraints, with one cluster per region close to users, and limits the blast radius of an outage of the Kubernetes control plane itself, which would otherwise affect absolutely every workload at once. The price to pay is added operational complexity: managing configuration consistency, coordinated deployment and sometimes traffic routing across multiple clusters requires dedicated tools and processes.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter le multi-cluster comme toujours supérieur pour la résilience sans mentionner son coût opérationnel réel : une petite équipe qui peine déjà à bien opérer un seul cluster va souvent aggraver sa situation en en ajoutant un deuxième, la bonne réponse dépend de la maturité opérationnelle de l'équipe, pas seulement des bénéfices théoriques.",
      en: "The interview trap is presenting multi-cluster as always superior for resilience without mentioning its real operational cost: a small team already struggling to properly operate one cluster will often worsen its situation by adding a second, the right answer depends on the team's operational maturity, not just theoretical benefits.",
    },
    tags: ["multi-cluster", "architecture", "operational-maturity"],
  },
  {
    id: "k8s-init-containers-sidecars",
    topicId: "kubernetes",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre un init container et un conteneur sidecar, et pour quels cas d'usage chacun est-il adapté ?",
      en: "What is the difference between an init container and a sidecar container, and what use cases fit each one ?",
    },
    answer: {
      fr: "Un init container s'exécute avant les conteneurs principaux du Pod et doit terminer avec succès avant qu'ils ne démarrent, ce qui convient à une tâche de préparation ponctuelle, comme attendre qu'une dépendance externe soit disponible ou initialiser des données dans un volume partagé. Un conteneur sidecar tourne en parallèle du conteneur principal pendant toute la durée de vie du Pod, ce qui convient à une fonctionnalité continue qui accompagne l'application, comme un proxy de service mesh qui intercepte tout le trafic réseau, ou un agent qui collecte et transmet les logs en continu. Depuis Kubernetes 1.28, les sidecars peuvent être déclarés comme un type particulier d'init container avec restartPolicy Always, ce qui leur donne un ordre de démarrage et d'arrêt bien défini par rapport au conteneur principal.",
      en: "An init container runs before the Pod's main containers and must complete successfully before they start, which fits a one-off preparation task, like waiting for an external dependency to become available or initializing data in a shared volume. A sidecar container runs alongside the main container for the Pod's whole lifetime, which fits an ongoing capability accompanying the application, like a service mesh proxy intercepting all network traffic, or an agent continuously collecting and forwarding logs. Since Kubernetes 1.28, sidecars can be declared as a special kind of init container with restartPolicy Always, giving them a well-defined startup and shutdown order relative to the main container.",
    },
    pitfall: {
      fr: "Le piège classique avant Kubernetes 1.28 était l'ordre d'arrêt d'un sidecar déclaré comme un simple conteneur normal du Pod : rien ne garantissait qu'il s'arrête après le conteneur principal, ce qui pouvait couper un proxy de service mesh avant que l'application ait fini de traiter ses dernières requêtes, un problème que le support natif des sidecars comme init containers résout en leur donnant un ordre d'arrêt explicite après les conteneurs principaux.",
      en: "The classic trap before Kubernetes 1.28 was a sidecar declared as a plain regular Pod container's shutdown order: nothing guaranteed it would stop after the main container, which could cut a service mesh proxy before the application finished processing its last requests, a problem native sidecar support as init containers solves by giving them an explicit shutdown order after main containers.",
    },
    code: {
      lang: "yaml",
      snippet:
        "initContainers:\n  - name: wait-for-db\n    image: busybox\n    command: [\"sh\", \"-c\", \"until nc -z db 5432; do sleep 2; done\"]\n  - name: log-shipper\n    image: fluent-bit\n    restartPolicy: Always  # sidecar natif, tourne en parallele du main",
    },
    tags: ["init-containers", "sidecars", "pod-design"],
  },

  // GCP (senior/architecte)
  {
    id: "gcp-workload-identity-federation",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Comment Workload Identity Federation permet-il d'éliminer complètement les clés de compte de service ?",
      en: "How does Workload Identity Federation let you eliminate service account keys entirely ?",
    },
    answer: {
      fr: "Une clé de compte de service est un identifiant statique et de longue durée qui, s'il fuite, reste valide et exploitable jusqu'à sa révocation manuelle, ce qui en fait un risque de sécurité permanent. Workload Identity Federation permet à une charge de travail qui s'exécute en dehors de GCP, par exemple sur AWS, sur un autre cloud, ou dans une pipeline CI/CD externe, de s'authentifier auprès de GCP en échangeant un jeton d'identité déjà émis par son propre fournisseur d'identité, sans jamais avoir besoin de créer ni de stocker de clé GCP statique. GCP fait confiance à ce jeton externe via une relation de fédération configurée à l'avance, et échange ce jeton contre des identifiants GCP temporaires et à courte durée de vie.",
      en: "A service account key is a static, long-lived credential that, if leaked, stays valid and usable until manually revoked, making it a permanent security risk. Workload Identity Federation lets a workload running outside GCP, for example on AWS, on another cloud, or in an external CI/CD pipeline, authenticate to GCP by exchanging an identity token already issued by its own identity provider, with no need to ever create or store a static GCP key. GCP trusts that external token through a federation relationship configured in advance, and exchanges that token for temporary, short-lived GCP credentials.",
    },
    pitfall: {
      fr: "Le piège est de continuer à créer des clés de compte de service par habitude pour des charges de travail externes, alors que Workload Identity Federation couvre désormais la grande majorité de ces cas : de nombreuses organisations gagneraient à auditer et éliminer progressivement leurs clés statiques existantes plutôt que d'en accepter la présence comme une fatalité.",
      en: "The trap is continuing to create service account keys out of habit for external workloads, when Workload Identity Federation now covers the vast majority of those cases: many organizations would benefit from auditing and progressively eliminating their existing static keys rather than accepting their presence as inevitable.",
    },
    tags: ["workload-identity", "security", "authentication"],
  },
  {
    id: "gcp-multi-region-architecture",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Quels sont les principaux défis d'une architecture multi-région sur GCP, au-delà du simple déploiement des mêmes services dans plusieurs régions ?",
      en: "What are the main challenges of a multi-region architecture on GCP, beyond simply deploying the same services in several regions ?",
    },
    answer: {
      fr: "Déployer les mêmes services applicatifs dans plusieurs régions est la partie relativement simple : le vrai défi est la donnée. Une base de données à cohérence forte, comme Cloud SQL, ne réplique naturellement que vers des réplicas en lecture dans d'autres régions, avec un failover manuel ou semi-automatique en cas de panne de la région primaire, ce qui impose de choisir entre disponibilité et cohérence en cas de partition réseau. Un service global comme Cloud Spanner résout ce problème par une cohérence forte distribuée nativement, au prix d'un coût et d'une latence d'écriture plus élevés. Le routage du trafic entre régions, via un load balancer global, doit aussi gérer le failover automatique et le drainage progressif du trafic pendant une bascule pour éviter une coupure brutale.",
      en: "Deploying the same application services across multiple regions is the relatively easy part: the real challenge is data. A strongly consistent database, like Cloud SQL, only naturally replicates to read replicas in other regions, with manual or semi-automatic failover if the primary region fails, forcing a choice between availability and consistency during a network partition. A global service like Cloud Spanner solves this with natively distributed strong consistency, at the cost of higher write latency and cost. Traffic routing between regions, via a global load balancer, also needs to handle automatic failover and progressive traffic draining during a switchover to avoid an abrupt cutoff.",
    },
    pitfall: {
      fr: "Le piège en entretien est de ne parler que de la couche applicative sans mentionner le vrai défi de la couche donnée : une architecture multi-région qui néglige la stratégie de réplication et de failover de sa base de données n'est en réalité multi-région que pour le calcul, pas pour la résilience globale du système.",
      en: "The interview trap is talking only about the application layer without mentioning the real data layer challenge: a multi-region architecture that neglects its database's replication and failover strategy is really only multi-region for compute, not for the system's overall resilience.",
    },
    tags: ["multi-region", "high-availability", "architecture"],
  },
  {
    id: "gcp-cost-optimization-committed-use",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre les remises d'utilisation engagée et les remises d'utilisation continue sur GCP ?",
      en: "What is the difference between committed use discounts and sustained use discounts on GCP ?",
    },
    answer: {
      fr: "Les remises d'utilisation continue s'appliquent automatiquement, sans aucune action de configuration, dès qu'une ressource Compute Engine tourne suffisamment longtemps dans un mois, la remise augmentant progressivement avec la durée d'utilisation. Les remises d'utilisation engagée demandent un engagement explicite et anticipé sur un volume de ressources pour une durée d'un ou trois ans, en échange d'une réduction de prix nettement plus importante que la remise continue, mais avec l'obligation de payer ce volume engagé même si l'usage réel finit par être inférieur. Le choix dépend donc de la prévisibilité de la charge : un usage stable et prévisible sur le long terme justifie un engagement, un usage variable ou en forte croissance se contente mieux des remises automatiques.",
      en: "Sustained use discounts apply automatically, with no configuration action at all, as soon as a Compute Engine resource runs long enough within a month, the discount progressively increasing with usage duration. Committed use discounts require an explicit, upfront commitment to a resource volume for a one or three year term, in exchange for a notably larger price reduction than the sustained discount, but with the obligation to pay for that committed volume even if actual usage ends up lower. The choice therefore depends on workload predictability: stable, predictable long-term usage justifies a commitment, variable or fast-growing usage is better served by the automatic discounts.",
    },
    pitfall: {
      fr: "Le piège est de s'engager sur un volume de ressources trop optimiste en anticipation d'une croissance qui ne se réalise pas : contrairement à la remise d'utilisation continue qui ne coûte jamais plus que l'usage réel, un engagement mal dimensionné continue de facturer le volume promis même si l'usage réel chute, transformant une optimisation de coût en surcoût.",
      en: "The trap is committing to an overly optimistic resource volume in anticipation of growth that doesn't materialize: unlike the sustained use discount which never costs more than actual usage, a poorly sized commitment keeps billing the promised volume even if actual usage drops, turning a cost optimization into an overspend.",
    },
    tags: ["cost-optimization", "finops", "compute-engine"],
  },
  {
    id: "gcp-cloud-armor-security",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Quel rôle joue Cloud Armor dans une architecture GCP exposée sur Internet ?",
      en: "What role does Cloud Armor play in a GCP architecture exposed to the internet ?",
    },
    answer: {
      fr: "Cloud Armor est le pare-feu applicatif et la protection anti-DDoS de GCP, positionné en périphérie du réseau au niveau du load balancer global, avant même que le trafic n'atteigne les services backend. Il permet de définir des règles basées sur l'adresse IP source, la géolocalisation, ou des signatures d'attaques connues comme l'injection SQL ou le cross-site scripting via des règles préconfigurées, et absorbe les attaques volumétriques de déni de service directement en périphérie du réseau Google, avant qu'elles ne consomment la moindre ressource applicative. C'est une couche de défense complémentaire à la sécurité applicative elle-même, pas un substitut à une application qui validerait mal ses propres entrées.",
      en: "Cloud Armor is GCP's web application firewall and anti-DDoS protection, positioned at the network edge at the global load balancer level, before traffic even reaches backend services. It lets you define rules based on source IP address, geolocation, or known attack signatures like SQL injection or cross-site scripting through preconfigured rules, and absorbs volumetric denial-of-service attacks right at Google's network edge, before they consume any application resources at all. It's a complementary defense layer to the application's own security, not a substitute for an application that poorly validates its own inputs.",
    },
    pitfall: {
      fr: "Le piège est de considérer Cloud Armor comme suffisant à lui seul pour la sécurité applicative : les règles préconfigurées détectent des patterns d'attaques connus mais ne remplacent pas une validation rigoureuse des entrées côté application, une vulnérabilité applicative spécifique et non couverte par les signatures génériques reste exploitable même derrière Cloud Armor.",
      en: "The trap is considering Cloud Armor sufficient on its own for application security: preconfigured rules detect known attack patterns but don't replace rigorous input validation on the application side, a specific application vulnerability not covered by generic signatures remains exploitable even behind Cloud Armor.",
    },
    tags: ["cloud-armor", "waf", "security"],
  },
  {
    id: "gcp-terraform-project-factory",
    topicId: "gcp",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que le pattern project factory avec Terraform sur GCP, et quel problème d'échelle résout-il ?",
      en: "What is the Terraform project factory pattern on GCP, and what scaling problem does it solve ?",
    },
    answer: {
      fr: "Sur GCP, un projet est l'unité de base d'isolation des ressources, de facturation et de permissions, et une organisation qui grandit finit souvent par en créer des dizaines, un par équipe ou par environnement. Le pattern project factory encapsule dans un module Terraform réutilisable toute la configuration standard qu'un nouveau projet doit respecter, la structure des comptes de service, les APIs activées par défaut, les règles IAM de base, les exports de logs vers un projet centralisé, pour que créer un nouveau projet conforme aux standards de l'organisation devienne un simple appel de module avec quelques paramètres plutôt qu'une configuration manuelle répétée et sujette aux oublis.",
      en: "On GCP, a project is the basic unit of resource, billing and permission isolation, and a growing organization often ends up creating dozens of them, one per team or environment. The project factory pattern encapsulates, in a reusable Terraform module, all the standard configuration a new project must follow, service account structure, APIs enabled by default, baseline IAM rules, log exports to a centralized project, so creating a new project compliant with the organization's standards becomes a simple module call with a few parameters rather than a repeated, error-prone manual configuration.",
    },
    pitfall: {
      fr: "Le piège est de traiter le project factory comme une configuration figée une fois pour toutes : les standards de l'organisation évoluent, un module qui n'est jamais mis à jour finit par créer de nouveaux projets non conformes aux exigences actuelles, la vraie valeur du pattern vient d'un module maintenu activement, pas seulement de son existence initiale.",
      en: "The trap is treating the project factory as a configuration frozen once and for all: the organization's standards evolve, a module that's never updated ends up creating new projects that don't meet current requirements, the pattern's real value comes from an actively maintained module, not just its initial existence.",
    },
    tags: ["project-factory", "terraform", "governance"],
  },

  // Kafka (senior/architecte)
  {
    id: "kafka-transactional-outbox-pattern",
    topicId: "kafka",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que le pattern transactional outbox, et quel problème résout-il quand un service doit à la fois écrire en base et publier un événement Kafka ?",
      en: "What is the transactional outbox pattern, and what problem does it solve when a service must both write to a database and publish a Kafka event ?",
    },
    answer: {
      fr: "Écrire en base de données et publier sur Kafka sont deux opérations sur deux systèmes distincts qui ne partagent pas de transaction commune : si l'écriture en base réussit mais que la publication Kafka échoue juste après, ou l'inverse, le système se retrouve dans un état incohérent où l'événement publié ne reflète pas la réalité, ou où un changement d'état n'est jamais notifié. Le pattern outbox résout ça en écrivant, dans la même transaction de base de données que le changement métier, une ligne représentant l'événement à publier dans une table outbox dédiée. Un processus séparé, souvent basé sur Change Data Capture, lit ensuite cette table et publie réellement les événements vers Kafka, garantissant qu'un événement n'est jamais perdu ni publié sans que le changement métier correspondant ait réellement été validé.",
      en: "Writing to a database and publishing to Kafka are two operations on two separate systems that don't share a common transaction: if the database write succeeds but the Kafka publish fails right after, or vice versa, the system ends up in an inconsistent state where the published event doesn't reflect reality, or a state change is never notified. The outbox pattern solves this by writing, within the same database transaction as the business change, a row representing the event to publish into a dedicated outbox table. A separate process, often based on Change Data Capture, then reads that table and actually publishes the events to Kafka, guaranteeing an event is never lost nor published without the matching business change having actually been committed.",
    },
    pitfall: {
      fr: "Le piège en entretien est de proposer d'appeler directement Kafka juste après le commit de la transaction base de données comme solution suffisante : ça laisse une fenêtre où le processus peut planter entre les deux opérations, l'outbox garantit l'atomicité en rattachant la publication à la même transaction que l'écriture métier, pas en les enchaînant l'une après l'autre.",
      en: "The interview trap is proposing calling Kafka directly right after the database transaction commits as a sufficient solution: that leaves a window where the process can crash between the two operations, the outbox guarantees atomicity by tying publication to the same transaction as the business write, not by chaining them one after the other.",
    },
    tags: ["outbox-pattern", "distributed-transactions", "reliability"],
  },
  {
    id: "kafka-multi-datacenter-replication",
    topicId: "kafka",
    difficulty: "hard",
    question: {
      fr: "Comment MirrorMaker 2 permet-il de répliquer des topics Kafka entre plusieurs datacenters, et quel compromis cela impose-t-il ?",
      en: "How does MirrorMaker 2 let you replicate Kafka topics across multiple datacenters, and what trade-off does that impose ?",
    },
    answer: {
      fr: "MirrorMaker 2 est un connecteur qui consomme les messages d'un cluster Kafka source et les republie vers un cluster Kafka cible, généralement situé dans un autre datacenter ou une autre région, en préservant les partitions et en propageant aussi les mises à jour de configuration des topics et les offsets des consumer groups. Cette réplication est asynchrone par nature : il existe toujours un délai, même faible, entre l'écriture dans le cluster source et sa disponibilité dans le cluster cible, ce qui signifie qu'en cas de bascule vers le datacenter de secours, les tout derniers messages écrits juste avant la panne du cluster source peuvent ne pas encore avoir été répliqués.",
      en: "MirrorMaker 2 is a connector that consumes messages from a source Kafka cluster and republishes them to a target Kafka cluster, generally located in another datacenter or region, preserving partitions and also propagating topic configuration updates and consumer group offsets. This replication is asynchronous by nature: there's always a delay, even a small one, between a write in the source cluster and its availability in the target cluster, meaning that in case of failover to the backup datacenter, the very last messages written just before the source cluster's failure may not have been replicated yet.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'une bascule vers le datacenter de secours après une réplication MirrorMaker 2 garantit zéro perte de données : c'est une réplication asynchrone, pas une réplication synchrone comme celle des réplicas au sein d'un même cluster Kafka, accepter ce compromis de perte de données potentielle en cas de bascule est une décision d'architecture à assumer explicitement, pas un détail d'implémentation.",
      en: "The trap is believing a failover to the backup datacenter after MirrorMaker 2 replication guarantees zero data loss: it's asynchronous replication, not the synchronous replication used by in-sync replicas within a single Kafka cluster, accepting this potential data loss trade-off during failover is an architecture decision to make explicitly, not an implementation detail.",
    },
    tags: ["mirrormaker", "disaster-recovery", "multi-datacenter"],
  },
  {
    id: "kafka-consumer-rebalance-strategies",
    topicId: "kafka",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre le rebalancing eager et le rebalancing coopératif sticky dans un consumer group Kafka ?",
      en: "What is the difference between eager rebalancing and cooperative sticky rebalancing in a Kafka consumer group ?",
    },
    answer: {
      fr: "Le rebalancing eager, la stratégie historique, retire à tous les consommateurs du groupe l'intégralité de leurs partitions assignées dès qu'un rebalancing démarre, puis les réattribue entièrement à la fin, ce qui arrête totalement la consommation pour tout le groupe pendant la durée du rebalancing, même pour les consommateurs qui ne changent finalement pas d'assignation. Le rebalancing coopératif sticky ne retire que les partitions qui doivent effectivement changer de consommateur, en plusieurs petites étapes successives, permettant aux autres consommateurs de continuer à traiter leurs partitions inchangées pendant tout le processus, ce qui réduit considérablement l'interruption globale du groupe, en particulier avec un grand nombre de partitions ou de consommateurs.",
      en: "Eager rebalancing, the historical strategy, strips every consumer in the group of all their assigned partitions as soon as a rebalance starts, then fully reassigns them at the end, which entirely halts consumption for the whole group during the rebalance, even for consumers whose assignment doesn't ultimately change. Cooperative sticky rebalancing only revokes the partitions that actually need to move to a different consumer, in several small successive steps, letting other consumers keep processing their unchanged partitions throughout the process, considerably reducing the group's overall interruption, especially with a large number of partitions or consumers.",
    },
    pitfall: {
      fr: "Le piège est de changer la stratégie de rebalancing sur un seul consommateur du groupe sans l'appliquer de façon cohérente à tous : la stratégie coopérative sticky nécessite que tous les membres du groupe la supportent, un mélange de configurations incompatibles entre consommateurs peut provoquer des erreurs de configuration bloquantes plutôt qu'un rebalancing dégradé.",
      en: "The trap is changing the rebalancing strategy on a single consumer in the group without applying it consistently across all of them: cooperative sticky rebalancing requires every group member to support it, a mix of incompatible configurations across consumers can cause blocking configuration errors rather than a merely degraded rebalance.",
    },
    tags: ["rebalancing", "consumer-groups", "cooperative-sticky"],
  },
  {
    id: "kafka-tiered-storage",
    topicId: "kafka",
    difficulty: "hard",
    question: {
      fr: "Qu'apporte le stockage à niveaux (tiered storage) dans Kafka, et quel problème structurel résout-il ?",
      en: "What does tiered storage bring to Kafka, and what structural problem does it solve ?",
    },
    answer: {
      fr: "Historiquement, chaque broker Kafka stocke l'intégralité des données d'une partition sur son propre disque local, ce qui couple étroitement la capacité de stockage à la capacité de calcul : pour conserver plus longtemps l'historique d'un topic, il faut ajouter plus de disque à chaque broker, même si le débit de traitement n'a pas besoin d'augmenter. Le stockage à niveaux découple les deux en déplaçant automatiquement les segments de log les plus anciens, moins susceptibles d'être lus fréquemment, vers un stockage objet distant bon marché, comme S3 ou GCS, tout en gardant les données récentes sur le disque local rapide des brokers. Ça permet de conserver un historique de rétention beaucoup plus long à moindre coût, sans avoir à sur-dimensionner le disque local de chaque broker.",
      en: "Historically, each Kafka broker stores an entire partition's data on its own local disk, which tightly couples storage capacity to compute capacity: to keep a topic's history longer, you need to add more disk to every broker, even if processing throughput doesn't need to grow. Tiered storage decouples the two by automatically moving older log segments, less likely to be read frequently, to cheap remote object storage, like S3 or GCS, while keeping recent data on the brokers' fast local disk. This allows for much longer retention history at lower cost, without having to oversize each broker's local disk.",
    },
    pitfall: {
      fr: "Le piège est de croire que le stockage à niveaux élimine tout coût ou toute latence supplémentaire pour lire de vieilles données : lire un segment déplacé vers le stockage objet distant reste plus lent qu'une lecture sur disque local, le stockage à niveaux optimise le coût de rétention longue durée, pas la latence de lecture sur les données anciennes.",
      en: "The trap is believing tiered storage eliminates all extra cost or latency for reading old data: reading a segment moved to remote object storage remains slower than a local disk read, tiered storage optimizes long-term retention cost, not read latency on old data.",
    },
    tags: ["tiered-storage", "cost-optimization", "kafka-architecture"],
  },
  {
    id: "kafka-idempotent-consumer-pattern",
    topicId: "kafka",
    difficulty: "hard",
    question: {
      fr: "Comment implémenter un consommateur idempotent pour absorber sans risque la sémantique at-least-once par défaut de Kafka ?",
      en: "How do you implement an idempotent consumer to safely absorb Kafka's default at-least-once semantics ?",
    },
    answer: {
      fr: "Puisque Kafka livre par défaut chaque message au moins une fois, un même message peut être traité plusieurs fois par le consommateur en cas de retry après une panne. Un consommateur idempotent garantit que traiter le même message plusieurs fois produit exactement le même résultat que le traiter une seule fois, généralement en enregistrant les identifiants des messages déjà traités dans un magasin durable, comme une colonne unique en base de données, et en vérifiant cet identifiant avant tout traitement pour ignorer silencieusement un doublon déjà connu. Une alternative consiste à concevoir l'effet de bord lui-même pour qu'il soit naturellement idempotent, par exemple un UPSERT en base plutôt qu'un INSERT, qui donne le même résultat final qu'il soit exécuté une ou plusieurs fois.",
      en: "Since Kafka delivers each message at least once by default, the same message can be processed more than once by the consumer after a retry following a failure. An idempotent consumer guarantees that processing the same message multiple times produces exactly the same result as processing it once, generally by recording already-processed message identifiers in a durable store, like a unique column in a database, and checking that identifier before any processing to silently skip a known duplicate. An alternative is designing the side effect itself to be naturally idempotent, for example an UPSERT in a database rather than an INSERT, which gives the same final result whether executed once or multiple times.",
    },
    pitfall: {
      fr: "Le piège est de ne dédupliquer qu'en mémoire locale au processus consommateur : un redémarrage du consommateur perd cet état de déduplication et peut retraiter un message déjà traité avant le redémarrage, l'état de déduplication doit être stocké dans un support durable, cohérent avec l'effet de bord lui-même, idéalement dans la même transaction si possible.",
      en: "The trap is deduplicating only in memory local to the consumer process: a consumer restart loses that deduplication state and can reprocess a message already handled before the restart, deduplication state must be stored in a durable store, consistent with the side effect itself, ideally in the same transaction if possible.",
    },
    code: {
      lang: "sql",
      snippet:
        "-- Deduplication via contrainte unique + upsert idempotent\nCREATE TABLE processed_events (event_id UUID PRIMARY KEY);\n\nINSERT INTO processed_events (event_id) VALUES ($1)\nON CONFLICT (event_id) DO NOTHING;\n-- si 0 ligne affectee, le message a deja ete traite : on l'ignore",
    },
    tags: ["idempotent-consumer", "at-least-once", "reliability"],
  },

  // Kotlin (senior/architecte)
  {
    id: "kotlin-flow-vs-livedata",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Quels avantages Kotlin Flow apporte-t-il par rapport à des callbacks classiques pour représenter un flux de valeurs asynchrones dans le temps ?",
      en: "What advantages does Kotlin Flow bring over classic callbacks for representing an asynchronous stream of values over time ?",
    },
    answer: {
      fr: "Un Flow représente un flux de valeurs émises de façon asynchrone dans le temps, construit sur les coroutines, avec un support natif des opérateurs de transformation comme map, filter ou debounce, ce qu'un simple callback n'offre pas sans bibliothèque additionnelle. Contrairement à un callback enregistré manuellement, un Flow est froid par défaut : il ne commence à produire des valeurs que lorsqu'un collecteur s'y abonne via collect, et s'arrête proprement, y compris en libérant ses ressources, quand la coroutine qui le collecte est annulée, ce qui évite les fuites classiques d'un callback qu'on oublie de désenregistrer.",
      en: "A Flow represents a stream of values emitted asynchronously over time, built on coroutines, with native support for transformation operators like map, filter or debounce, which a plain callback doesn't offer without an additional library. Unlike a manually registered callback, a Flow is cold by default: it only starts producing values once a collector subscribes via collect, and stops cleanly, including releasing its resources, when the coroutine collecting it is cancelled, avoiding the classic leak of a callback one forgets to unregister.",
    },
    pitfall: {
      fr: "Le piège est de confondre un Flow froid, qui redémarre sa production depuis le début pour chaque nouveau collecteur, avec un StateFlow ou un SharedFlow, chauds, qui partagent une seule émission en cours entre plusieurs collecteurs : utiliser un Flow froid là où on voulait en réalité partager un seul état observé par plusieurs composants recrée inutilement la même logique de production à chaque abonnement.",
      en: "The trap is confusing a cold Flow, which restarts its production from scratch for every new collector, with a hot StateFlow or SharedFlow, which share a single ongoing emission across multiple collectors: using a cold Flow where you actually wanted to share a single state observed by several components needlessly recreates the same production logic on every subscription.",
    },
    code: {
      lang: "kotlin",
      snippet:
        "fun searchResults(query: Flow<String>): Flow<List<Result>> =\n    query\n        .debounce(300)\n        .distinctUntilChanged()\n        .flatMapLatest { q -> api.search(q) }\n        .catch { emit(emptyList()) }",
    },
    tags: ["kotlin-flow", "coroutines", "reactive-streams"],
  },
  {
    id: "kotlin-multiplatform-basics",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Que permet Kotlin Multiplatform, et comment le code commun cohabite-t-il avec du code spécifique à chaque plateforme ?",
      en: "What does Kotlin Multiplatform enable, and how does common code coexist with platform-specific code ?",
    },
    answer: {
      fr: "Kotlin Multiplatform permet d'écrire une seule fois la logique métier partagée, comme les modèles de données, les règles de validation ou les appels réseau, et de la compiler pour plusieurs cibles, Android, iOS, backend JVM ou web, plutôt que de dupliquer cette logique dans chaque plateforme avec son propre langage. Quand une fonctionnalité a besoin d'une capacité spécifique à une plateforme, comme l'accès à un capteur natif, le code commun déclare une fonction ou une classe attendue via le mot-clé expect, et chaque plateforme fournit sa propre implémentation concrète via actual, le compilateur s'assurant que chaque cible dispose bien de l'implémentation attendue.",
      en: "Kotlin Multiplatform lets you write shared business logic once, like data models, validation rules or network calls, and compile it for several targets, Android, iOS, JVM backend or web, rather than duplicating that logic in each platform with its own language. When a feature needs a platform-specific capability, like access to a native sensor, the common code declares an expected function or class via the expect keyword, and each platform supplies its own concrete implementation via actual, the compiler ensuring every target does have the expected implementation.",
    },
    pitfall: {
      fr: "Le piège est de vouloir partager l'intégralité de l'interface utilisateur en Kotlin Multiplatform en pensant obtenir le même bénéfice que pour la logique métier : l'UI reste généralement spécifique à chaque plateforme, sauf à adopter Compose Multiplatform qui étend le partage jusqu'à l'interface, la promesse historique de KMP se limite d'abord à la logique métier, pas à l'apparence de l'application.",
      en: "The trap is wanting to share the entire user interface in Kotlin Multiplatform expecting the same benefit as for business logic: the UI generally stays platform-specific, unless adopting Compose Multiplatform which extends sharing to the interface, KMP's original promise is first about business logic, not the application's appearance.",
    },
    tags: ["kotlin-multiplatform", "kmp", "cross-platform"],
  },
  {
    id: "kotlin-delegated-properties",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Comment fonctionnent les propriétés déléguées en Kotlin, et à quoi servent by lazy et Delegates.observable ?",
      en: "How do delegated properties work in Kotlin, and what are by lazy and Delegates.observable for ?",
    },
    answer: {
      fr: "Une propriété déléguée transfère la logique de son accesseur get et éventuellement de son mutateur set à un objet séparé, plutôt que d'écrire cette logique directement dans chaque propriété qui en a besoin, ce qui permet de réutiliser un comportement générique de gestion de propriété à travers de nombreuses classes différentes. by lazy calcule la valeur d'une propriété seulement au premier accès, puis met en cache ce résultat pour tous les accès suivants, ce qui convient à une initialisation coûteuse dont on n'est pas sûr qu'elle sera nécessaire. Delegates.observable exécute un callback à chaque changement de valeur de la propriété, avec l'ancienne et la nouvelle valeur, ce qui convient à un besoin de réaction automatique, comme rafraîchir un affichage dès qu'un champ change.",
      en: "A delegated property offloads its getter's logic, and optionally its setter's, to a separate object, rather than writing that logic directly in every property that needs it, letting a generic property management behavior be reused across many different classes. by lazy computes a property's value only on first access, then caches that result for every following access, which fits an expensive initialization one isn't sure will actually be needed. Delegates.observable runs a callback on every change of the property's value, with the old and new value, which fits a need for automatic reaction, like refreshing a display as soon as a field changes.",
    },
    pitfall: {
      fr: "Le piège est d'utiliser by lazy avec son mode de synchronisation par défaut, thread-safe, dans un contexte où la propriété n'est de toute façon accédée que par un seul thread : ce mode par défaut ajoute un coût de synchronisation inutile, le paramètre LazyThreadSafetyMode.NONE évite ce coût quand l'accès mono-thread est garanti.",
      en: "The trap is using by lazy with its default, thread-safe synchronization mode in a context where the property is only ever accessed by a single thread anyway: that default mode adds an unnecessary synchronization cost, the LazyThreadSafetyMode.NONE parameter avoids that cost when single-threaded access is guaranteed.",
    },
    code: {
      lang: "kotlin",
      snippet:
        "class UserSession {\n    val config: Config by lazy(LazyThreadSafetyMode.NONE) {\n        loadExpensiveConfig()\n    }\n\n    var theme: String by Delegates.observable(\"light\") { _, old, new ->\n        println(\"theme change: $old -> $new\")\n    }\n}",
    },
    tags: ["delegated-properties", "language-features"],
  },
  {
    id: "kotlin-contracts-and-smart-casts",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que l'API contracts en Kotlin, et quel problème de smart cast résout-elle pour des fonctions utilitaires personnalisées ?",
      en: "What is Kotlin's contracts API, and what smart cast problem does it solve for custom utility functions ?",
    },
    answer: {
      fr: "Le compilateur Kotlin effectue un smart cast automatique après une vérification comme if (x != null) ou if (x is String), parce qu'il sait analyser ce type de condition directement dans le code. Ce raisonnement s'arrête cependant net dès que la vérification passe par une fonction utilitaire personnalisée, comme une fonction isValid(x) qui encapsule en interne la même vérification : le compilateur ne peut pas savoir que cette fonction garantit quoi que ce soit sur le type ou la nullabilité de x après son appel. L'API contracts permet de déclarer explicitement, dans la signature de cette fonction utilitaire, la garantie qu'elle fournit, ce qui permet au compilateur d'appliquer le smart cast même à travers cet appel de fonction.",
      en: "The Kotlin compiler performs an automatic smart cast after a check like if (x != null) or if (x is String), because it knows how to analyze that kind of condition directly in the code. That reasoning stops dead, however, as soon as the check goes through a custom utility function, like an isValid(x) function that internally wraps the same check: the compiler can't know that function guarantees anything about x's type or nullability after it's called. The contracts API lets you explicitly declare, in that utility function's signature, the guarantee it provides, letting the compiler apply the smart cast even across that function call.",
    },
    pitfall: {
      fr: "Le piège est de déclarer un contrat qui ne correspond pas réellement au comportement de la fonction, par exemple promettre qu'un paramètre est toujours non nul en sortie alors que la fonction peut dans certains cas retourner sans que ce soit vrai : le compilateur fait confiance au contrat déclaré sans le vérifier lui-même, un contrat mensonger peut introduire un bug de type non détecté à la compilation.",
      en: "The trap is declaring a contract that doesn't actually match the function's behavior, for example promising a parameter is always non-null on exit when the function can in some cases return without that being true: the compiler trusts the declared contract without verifying it itself, a false contract can introduce a type bug undetected at compile time.",
    },
    code: {
      lang: "kotlin",
      snippet:
        "fun requireNotBlank(value: String?): Boolean {\n    contract {\n        returns(true) implies (value != null)\n    }\n    return !value.isNullOrBlank()\n}\n\nfun greet(name: String?) {\n    if (requireNotBlank(name)) {\n        println(name.length) // smart cast : name est String ici\n    }\n}",
    },
    tags: ["contracts", "smart-cast", "type-system"],
  },
  {
    id: "kotlin-value-classes",
    topicId: "kotlin",
    difficulty: "hard",
    question: {
      fr: "Que sont les value classes en Kotlin, et en quoi permettent-elles d'ajouter un typage fort sans coût à l'exécution ?",
      en: "What are value classes in Kotlin, and how do they add strong typing with no runtime cost ?",
    },
    answer: {
      fr: "Une value class enveloppe une seule valeur, par exemple un Long représentant un identifiant, dans un type distinct qui empêche à la compilation de confondre par erreur un UserId avec un OrderId même s'ils partagent le même type sous-jacent. Dans la plupart des cas, le compilateur inline complètement cette enveloppe et manipule directement la valeur sous-jacente au moment de l'exécution, sans jamais créer d'objet wrapper réel en mémoire, ce qui donne la sécurité de typage d'une classe dédiée sans le coût mémoire ni l'indirection d'une vraie allocation d'objet.",
      en: "A value class wraps a single value, for example a Long representing an identifier, in a distinct type that prevents mistakenly confusing a UserId with an OrderId at compile time even though they share the same underlying type. In most cases, the compiler fully inlines that wrapper and directly manipulates the underlying value at runtime, never creating a real wrapper object in memory, which gives the type safety of a dedicated class with none of the memory cost or indirection of a real object allocation.",
    },
    pitfall: {
      fr: "Le piège est de croire que l'inlining s'applique systématiquement dans tous les contextes : dès qu'une value class est utilisée comme type générique, stockée dans une collection d'objets, ou exposée via une interface, le compilateur doit la boxer comme un objet réel, annulant l'avantage de performance dans ces cas précis, ce qui reste rarement un problème en pratique mais doit être connu.",
      en: "The trap is believing inlining systematically applies in every context: as soon as a value class is used as a generic type, stored in a collection of objects, or exposed through an interface, the compiler has to box it as a real object, canceling the performance benefit in those specific cases, which is rarely an issue in practice but should be known.",
    },
    code: {
      lang: "kotlin",
      snippet:
        "@JvmInline\nvalue class UserId(val value: Long)\n\n@JvmInline\nvalue class OrderId(val value: Long)\n\nfun getOrder(userId: UserId, orderId: OrderId) { /* ... */ }\n// getOrder(orderId, userId) ne compile pas : erreur de type detectee",
    },
    tags: ["value-classes", "inline-classes", "type-safety"],
  },

  // GitHub Copilot (senior/architecte)
  {
    id: "copilot-enterprise-governance",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "Quels leviers de gouvernance une organisation met-elle en place pour déployer un outil comme Copilot à l'échelle de l'entreprise ?",
      en: "What governance levers does an organization put in place to roll out a tool like Copilot enterprise-wide ?",
    },
    answer: {
      fr: "À l'échelle individuelle, chaque développeur décide seul de ce qu'il accepte ou non, mais à l'échelle d'une entreprise, il faut une politique explicite qui couvre plusieurs axes : quels dépôts et quelles données de code peuvent être exposés à l'outil, en particulier pour du code sous contrat de confidentialité avec un client, quelles restrictions s'appliquent au filtrage des suggestions proches de code protégé, quel niveau d'audit et de traçabilité est nécessaire sur l'usage de l'outil, et comment cette politique s'articule avec les exigences réglementaires du secteur, comme la finance ou la santé, qui peuvent interdire purement et simplement l'envoi de certains types de code vers un service tiers.",
      en: "At the individual scale, each developer decides alone what to accept or not, but at enterprise scale, an explicit policy is needed covering several axes: which repositories and code data can be exposed to the tool, especially for code under a confidentiality agreement with a client, what restrictions apply to filtering suggestions close to protected code, what level of audit and traceability is needed on the tool's usage, and how that policy fits with the sector's regulatory requirements, like finance or healthcare, which can outright forbid sending certain kinds of code to a third-party service.",
    },
    pitfall: {
      fr: "Le piège est de traiter l'adoption d'un outil d'IA comme une simple décision d'achat de licence sans impliquer les équipes sécurité et conformité en amont : découvrir après coup qu'un usage non encadré a exposé du code sensible à un service tiers coûte bien plus cher, en réputation et en remédiation, que le temps investi à cadrer la politique d'usage avant le déploiement.",
      en: "The trap is treating adoption of an AI tool as a simple license purchase decision without involving security and compliance teams upfront: discovering after the fact that unregulated usage exposed sensitive code to a third-party service costs far more, in reputation and remediation, than the time invested in framing the usage policy before rollout.",
    },
    tags: ["governance", "enterprise-adoption", "compliance"],
  },
  {
    id: "copilot-custom-instructions",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "À quoi servent des fichiers d'instructions personnalisées pour un assistant IA au niveau d'un dépôt, et quel problème d'équipe résolvent-ils ?",
      en: "What are custom instruction files for an AI assistant at the repository level for, and what team problem do they solve ?",
    },
    answer: {
      fr: "Sans contexte partagé, chaque développeur d'une équipe interagit avec l'assistant IA avec ses propres habitudes de formulation, ce qui produit des suggestions de style et de convention incohérentes d'un développeur à l'autre sur le même projet. Un fichier d'instructions personnalisées, versionné dans le dépôt au même titre que le code, encode une fois pour toutes les conventions de l'équipe, la structure du projet, les patterns à privilégier ou à éviter, ce que tout membre de l'équipe bénéficie automatiquement sans avoir à répéter ce contexte à chaque session. C'est un changement d'échelle : on ne configure plus l'assistant pour soi, on configure le comportement attendu de l'assistant pour tout le projet.",
      en: "Without shared context, every developer on a team interacts with the AI assistant using their own phrasing habits, producing inconsistent style and convention suggestions from one developer to another on the same project. A custom instructions file, versioned in the repository alongside the code, encodes the team's conventions once and for all, the project structure, the patterns to favor or avoid, which every team member automatically benefits from without repeating that context every session. It's a change of scale: you're no longer configuring the assistant for yourself, you're configuring the assistant's expected behavior for the whole project.",
    },
    pitfall: {
      fr: "Le piège est de laisser ce fichier d'instructions devenir obsolète par rapport à l'évolution réelle du projet, par exemple s'il mentionne encore une convention ou une architecture abandonnée depuis : un fichier d'instructions non maintenu peut activement induire l'assistant en erreur, il doit être révisé avec la même rigueur qu'une documentation d'architecture vivante.",
      en: "The trap is letting this instructions file become outdated relative to the project's actual evolution, for example if it still mentions a convention or architecture abandoned since: an unmaintained instructions file can actively mislead the assistant, it needs to be reviewed with the same rigor as living architecture documentation.",
    },
    tags: ["custom-instructions", "team-workflow", "developer-experience"],
  },
  {
    id: "copilot-agentic-coding-vs-autocomplete",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "En quoi un mode de codage agentique diffère-t-il fondamentalement de la simple complétion autocomplete, en termes de risque et de supervision nécessaire ?",
      en: "How does an agentic coding mode fundamentally differ from simple autocomplete, in terms of risk and needed supervision ?",
    },
    answer: {
      fr: "L'autocomplete propose une suggestion locale que le développeur relit avant de l'accepter ligne par ligne ou bloc par bloc, ce qui donne un point de contrôle humain à chaque petite modification. Un mode agentique planifie et applique lui-même une série de modifications à travers plusieurs fichiers, exécute potentiellement des commandes, et peut itérer plusieurs fois avant de présenter un résultat final, ce qui déplace le point de contrôle humain de chaque ligne individuelle vers l'ensemble du plan et son exécution. Ça demande une supervision différente : relire un diff complet et cohérent plutôt que chaque suggestion isolée, et surtout limiter les capacités que l'agent peut exercer sans confirmation explicite, en particulier pour des actions difficiles à annuler.",
      en: "Autocomplete offers a local suggestion the developer reviews before accepting it line by line or block by block, giving a human checkpoint at every small change. An agentic mode plans and applies a series of changes across several files itself, potentially runs commands, and can iterate several times before presenting a final result, moving the human checkpoint from every individual line to the overall plan and its execution. This demands different supervision: reviewing a complete, coherent diff rather than each isolated suggestion, and especially limiting the capabilities the agent can exercise without explicit confirmation, particularly for hard-to-undo actions.",
    },
    pitfall: {
      fr: "Le piège est d'appliquer la même vigilance qu'avec l'autocomplete à un mode agentique, en relisant superficiellement un gros diff multi-fichiers de la même façon qu'on relirait une seule ligne suggérée : le volume et la portée d'un changement agentique demandent une revue plus structurée, en particulier sur les fichiers de configuration ou les points d'entrée sensibles que le diff peut toucher sans que ce soit évident au premier coup d'œil.",
      en: "The trap is applying the same vigilance used for autocomplete to an agentic mode, superficially skimming a large multi-file diff the same way one would review a single suggested line: the volume and scope of an agentic change demands a more structured review, especially on configuration files or sensitive entry points the diff might touch without it being obvious at first glance.",
    },
    tags: ["agentic-coding", "risk-management", "code-review"],
  },
  {
    id: "copilot-vs-open-source-alternatives",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "Pour un environnement fortement réglementé, quels critères font pencher vers un modèle auto-hébergé plutôt qu'un assistant cloud comme Copilot ?",
      en: "For a heavily regulated environment, what criteria tip the balance toward a self-hosted model rather than a cloud assistant like Copilot ?",
    },
    answer: {
      fr: "Un assistant cloud envoie systématiquement le contexte de code à un service tiers pour générer ses suggestions, ce qui pose un problème direct dans un secteur où la réglementation interdit la sortie de certaines données du périmètre de l'entreprise, comme certaines données bancaires ou de santé selon les juridictions. Un modèle open source auto-hébergé, exécuté entièrement dans l'infrastructure de l'entreprise, élimine ce problème de sortie de données au prix d'une qualité de suggestion généralement inférieure aux meilleurs modèles propriétaires, et d'une charge opérationnelle réelle pour héberger et maintenir l'infrastructure d'inférence nécessaire, en particulier le matériel GPU. Le choix dépend donc d'un arbitrage entre contrainte réglementaire stricte et qualité de l'assistance obtenue.",
      en: "A cloud assistant systematically sends code context to a third-party service to generate its suggestions, which poses a direct problem in a sector where regulation forbids certain data from leaving the company's perimeter, like certain banking or healthcare data depending on jurisdiction. A self-hosted open source model, running entirely within the company's infrastructure, eliminates that data egress problem at the cost of generally lower suggestion quality than the best proprietary models, and a real operational burden to host and maintain the necessary inference infrastructure, especially GPU hardware. The choice therefore depends on a trade-off between strict regulatory constraints and the quality of assistance obtained.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter l'auto-hébergement comme automatiquement plus sûr sans nuancer : un modèle auto-hébergé mal opéré, avec des accès mal contrôlés à l'infrastructure d'inférence, peut présenter des risques de sécurité tout aussi réels qu'un service cloud, la contrainte réglementaire porte sur la sortie de données hors périmètre, pas sur une garantie automatique de sécurité supérieure.",
      en: "The interview trap is presenting self-hosting as automatically safer with no nuance: a poorly operated self-hosted model, with poorly controlled access to the inference infrastructure, can present security risks just as real as a cloud service, the regulatory constraint is about data leaving the perimeter, not an automatic guarantee of superior security.",
    },
    tags: ["self-hosted-llm", "regulated-industries", "data-privacy"],
  },
  {
    id: "copilot-measuring-code-quality-impact",
    topicId: "copilot",
    difficulty: "hard",
    question: {
      fr: "Comment mesurer si l'usage intensif d'un assistant IA dégrade ou améliore la dette technique d'un projet sur le long terme ?",
      en: "How do you measure whether heavy AI assistant usage degrades or improves a project's technical debt over the long term ?",
    },
    answer: {
      fr: "La dette technique se manifeste rarement immédiatement : elle apparaît plutôt dans la difficulté croissante à faire évoluer le code plusieurs mois plus tard. Des indicateurs pertinents incluent l'évolution du temps nécessaire pour implémenter une fonctionnalité de complexité comparable au fil du temps, le taux de duplication de code détecté par des outils d'analyse statique, la fréquence à laquelle un même module doit être retouché à cause de bugs récurrents, et le ratio entre code ajouté et code supprimé lors des refactorings, un ratio qui pencherait anormalement vers l'ajout pouvant signaler une accumulation de code jamais vraiment consolidé. Aucun indicateur seul ne suffit, la dette technique se lit dans une tendance sur plusieurs mois, pas dans une mesure ponctuelle.",
      en: "Technical debt rarely shows up immediately: it tends to appear instead in the growing difficulty of evolving the code several months later. Relevant indicators include how the time needed to implement a feature of comparable complexity evolves over time, the code duplication rate detected by static analysis tools, how often the same module needs rework due to recurring bugs, and the ratio of code added to code removed during refactoring, a ratio abnormally skewed toward addition potentially signaling an accumulation of code never truly consolidated. No single indicator is enough on its own, technical debt shows up as a trend over several months, not in a one-off measurement.",
    },
    pitfall: {
      fr: "Le piège est de vouloir mesurer l'impact sur la dette technique avec une seule métrique instantanée, comme un score de qualité de code calculé une fois : la vraie question est de savoir si cette métrique se dégrade ou s'améliore dans le temps en comparant des périodes avant et après l'adoption massive de l'outil, pas sa valeur absolue à un instant donné.",
      en: "The trap is trying to measure technical debt impact with a single instantaneous metric, like a code quality score computed once: the real question is whether that metric degrades or improves over time by comparing periods before and after the tool's heavy adoption, not its absolute value at a given moment.",
    },
    tags: ["technical-debt", "engineering-metrics", "long-term-quality"],
  },

  // AWS (senior/architecte)
  {
    id: "aws-multi-account-landing-zone",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Pourquoi une organisation adopte-t-elle une stratégie multi-compte avec AWS Organizations plutôt qu'un seul compte AWS pour tout ?",
      en: "Why does an organization adopt a multi-account strategy with AWS Organizations rather than a single AWS account for everything ?",
    },
    answer: {
      fr: "Un compte AWS est la frontière la plus forte d'isolation disponible, plus stricte qu'un simple découpage en VPC ou en tags à l'intérieur d'un même compte : une mauvaise configuration IAM ou une charge qui dérape en consommation de ressources reste confinée à un seul compte plutôt que de menacer l'ensemble du système. AWS Organizations permet de gérer de façon centralisée de nombreux comptes, en général un par équipe, par environnement ou par charge de travail, avec une consolidation de la facturation, des politiques de sécurité appliquées automatiquement à tous les comptes via des Service Control Policies, et une landing zone qui fournit une structure de base cohérente, journalisation centralisée, comptes de sécurité dédiés, dès la création d'un nouveau compte.",
      en: "An AWS account is the strongest isolation boundary available, stricter than a simple split into VPCs or tags within a single account: a bad IAM configuration or a workload that runs away with resource consumption stays confined to one account rather than threatening the whole system. AWS Organizations lets you centrally manage many accounts, generally one per team, environment or workload, with consolidated billing, security policies automatically applied to every account via Service Control Policies, and a landing zone that provides a consistent baseline structure, centralized logging, dedicated security accounts, from the moment a new account is created.",
    },
    pitfall: {
      fr: "Le piège est de sous-estimer la charge de gouvernance nécessaire dès que le nombre de comptes grandit : sans landing zone standardisée et automatisée dès le départ, chaque nouveau compte créé manuellement dérive progressivement des standards de sécurité de l'organisation, une prolifération de comptes non gouvernés est souvent pire qu'un seul compte bien géré.",
      en: "The trap is underestimating the governance workload needed as the number of accounts grows: without a standardized, automated landing zone from the start, every manually created new account gradually drifts from the organization's security standards, an ungoverned proliferation of accounts is often worse than a single well-managed one.",
    },
    tags: ["aws-organizations", "landing-zone", "multi-account"],
  },
  {
    id: "aws-well-architected-framework",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Quels sont les piliers du Well-Architected Framework d'AWS, et comment sert-il concrètement lors d'une revue d'architecture ?",
      en: "What are the pillars of AWS's Well-Architected Framework, and how is it concretely used during an architecture review ?",
    },
    answer: {
      fr: "Le framework structure l'évaluation d'une architecture cloud autour de plusieurs piliers : excellence opérationnelle, sécurité, fiabilité, efficacité des performances, optimisation des coûts, et durabilité. Une revue Well-Architected consiste à passer en revue une charge de travail concrète face à un ensemble de questions structurées pour chaque pilier, comme comment la charge se comporte-t-elle en cas de panne d'une zone de disponibilité, afin d'identifier des lacunes concrètes plutôt que de rester à un niveau de principes abstraits. C'est un outil de diagnostic qui produit une liste priorisée de risques et d'actions correctives, pas une simple checklist de conformité théorique.",
      en: "The framework structures the evaluation of a cloud architecture around several pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability. A Well-Architected review consists of reviewing a concrete workload against a set of structured questions for each pillar, like how the workload behaves during an availability zone outage, in order to identify concrete gaps rather than staying at an abstract level of principles. It's a diagnostic tool that produces a prioritized list of risks and corrective actions, not just a theoretical compliance checklist.",
    },
    pitfall: {
      fr: "Le piège en entretien est de réciter les six piliers sans pouvoir expliquer comment ils s'appliquent concrètement à une charge de travail réelle : la vraie valeur du framework vient de la mise en tension de ces piliers entre eux, par exemple un compromis conscient entre coût et fiabilité, plutôt que de les traiter comme des cases à cocher indépendantes.",
      en: "The interview trap is reciting the six pillars without being able to explain how they concretely apply to a real workload: the framework's real value comes from weighing these pillars against each other, for example a conscious trade-off between cost and reliability, rather than treating them as independent boxes to check.",
    },
    tags: ["well-architected-framework", "architecture-review", "aws-best-practices"],
  },
  {
    id: "aws-eventbridge-event-driven-architecture",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Comment Amazon EventBridge facilite-t-il une architecture orientée événements découplée entre plusieurs services ?",
      en: "How does Amazon EventBridge facilitate a decoupled event-driven architecture across several services ?",
    },
    answer: {
      fr: "EventBridge est un bus d'événements managé qui reçoit des événements de sources variées, services AWS, applications personnalisées, ou partenaires SaaS externes, et les route vers un ou plusieurs consommateurs selon des règles de filtrage basées sur le contenu de l'événement, sans que le producteur ait besoin de connaître à l'avance qui consomme ses événements. Ce découplage permet d'ajouter un nouveau consommateur à un flux d'événements existant sans jamais modifier le service producteur, contrairement à une intégration point à point où chaque nouveau consommateur demanderait une modification du côté producteur. Les schémas d'événements peuvent aussi être versionnés et découverts automatiquement, ce qui facilite la documentation et l'évolution du contrat d'événements dans le temps.",
      en: "EventBridge is a managed event bus that receives events from varied sources, AWS services, custom applications, or external SaaS partners, and routes them to one or more consumers based on content-filtering rules, with the producer never needing to know in advance who consumes its events. This decoupling lets you add a new consumer to an existing event flow without ever modifying the producing service, unlike a point-to-point integration where every new consumer would require a change on the producer side. Event schemas can also be versioned and automatically discovered, which eases documentation and the evolution of the event contract over time.",
    },
    pitfall: {
      fr: "Le piège est de traiter EventBridge comme une file de messages classique garantissant l'ordre strict de traitement : EventBridge est conçu pour du routage d'événements avec un débit élevé, pas pour un ordonnancement garanti comme celui d'une partition Kafka, un besoin d'ordre strict entre événements liés nécessite un mécanisme complémentaire, comme encoder une séquence explicite dans l'événement lui-même.",
      en: "The trap is treating EventBridge as a classic message queue guaranteeing strict processing order: EventBridge is designed for high-throughput event routing, not for guaranteed ordering like a Kafka partition's, a need for strict order between related events requires a complementary mechanism, like encoding an explicit sequence in the event itself.",
    },
    tags: ["eventbridge", "event-driven-architecture", "decoupling"],
  },
  {
    id: "aws-vpc-peering-transit-gateway",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Quand le VPC Peering devient-il insuffisant, et pourquoi bascule-t-on vers un Transit Gateway pour une architecture réseau à grande échelle ?",
      en: "When does VPC Peering become insufficient, and why do you move to a Transit Gateway for a large-scale network architecture ?",
    },
    answer: {
      fr: "Le VPC Peering connecte exactement deux VPC entre eux, sans transitivité : si le VPC A est connecté au VPC B, et le VPC B au VPC C, le trafic ne peut pas transiter automatiquement de A vers C à travers B, chaque paire de VPC qui doit communiquer nécessite sa propre connexion de peering dédiée. Ça devient rapidement ingérable à mesure que le nombre de VPC augmente, le nombre de connexions nécessaires croissant de façon quadratique. Un Transit Gateway agit comme un routeur central auquel chaque VPC se connecte une seule fois, et qui gère lui-même le routage entre tous les VPC connectés, ramenant la croissance du nombre de connexions à gérer à une simple relation linéaire avec le nombre de VPC plutôt que quadratique.",
      en: "VPC Peering connects exactly two VPCs together, with no transitivity: if VPC A is connected to VPC B, and VPC B to VPC C, traffic can't automatically transit from A to C through B, every pair of VPCs that needs to communicate requires its own dedicated peering connection. This quickly becomes unmanageable as the number of VPCs grows, the number of needed connections growing quadratically. A Transit Gateway acts as a central router each VPC connects to just once, and which itself handles routing between every connected VPC, bringing the growth of connections to manage back to a simple linear relationship with the number of VPCs rather than quadratic.",
    },
    pitfall: {
      fr: "Le piège en entretien est de recommander systématiquement Transit Gateway même pour une architecture avec seulement deux ou trois VPC : au-delà d'un certain seuil ça se justifie clairement, mais pour un petit nombre de VPC, le coût et la complexité additionnelle d'un Transit Gateway ne se justifient pas face à une simple connexion de peering directe et suffisante.",
      en: "The interview trap is systematically recommending Transit Gateway even for an architecture with only two or three VPCs: beyond a certain threshold it's clearly justified, but for a small number of VPCs, the added cost and complexity of a Transit Gateway isn't justified against a simple, sufficient direct peering connection.",
    },
    tags: ["vpc-peering", "transit-gateway", "networking"],
  },
  {
    id: "aws-cost-explorer-finops",
    topicId: "aws",
    difficulty: "hard",
    question: {
      fr: "Quelle est la différence entre les Savings Plans et les Reserved Instances, et comment les tags de coût aident-ils à responsabiliser les équipes ?",
      en: "What is the difference between Savings Plans and Reserved Instances, and how do cost allocation tags help make teams accountable ?",
    },
    answer: {
      fr: "Les Reserved Instances engagent sur un type d'instance précis dans une région donnée pour un ou trois ans, en échange d'une remise substantielle, mais avec peu de flexibilité si les besoins changent de type d'instance. Les Savings Plans engagent plutôt sur un montant d'usage horaire en dollars, indépendamment du type d'instance ou même du service utilisé selon le plan choisi, ce qui offre une flexibilité bien supérieure tout en gardant un niveau de remise comparable. Les tags de coût, appliqués systématiquement à chaque ressource avec l'équipe ou le projet responsable, permettent ensuite de ventiler la facture globale par équipe dans Cost Explorer, ce qui rend chaque équipe visible et responsable de son propre coût plutôt que de diluer la responsabilité dans une facture globale opaque.",
      en: "Reserved Instances commit to a specific instance type in a given region for one or three years, in exchange for a substantial discount, but with little flexibility if needs shift to a different instance type. Savings Plans instead commit to an hourly usage amount in dollars, independent of instance type or even the service used depending on the plan chosen, offering far greater flexibility while keeping a comparable discount level. Cost allocation tags, systematically applied to every resource with the responsible team or project, then let you break down the overall bill by team in Cost Explorer, making each team visible and accountable for its own cost rather than diluting accountability in an opaque global bill.",
    },
    pitfall: {
      fr: "Le piège est d'imposer les tags de coût après coup sur une infrastructure déjà existante plutôt que dès la création des ressources : une politique de tagging obligatoire appliquée via Infrastructure as Code ou une garde AWS Config dès le départ évite la situation bien plus pénible de devoir rétro-tagger manuellement des centaines de ressources existantes.",
      en: "The trap is imposing cost tags after the fact on already existing infrastructure rather than from resource creation: a mandatory tagging policy enforced via Infrastructure as Code or an AWS Config guardrail from the start avoids the far more painful situation of having to manually retro-tag hundreds of existing resources.",
    },
    tags: ["finops", "cost-optimization", "savings-plans"],
  },

  // Azure (senior/architecte)
  {
    id: "azure-management-groups-policy",
    topicId: "azure",
    difficulty: "hard",
    question: {
      fr: "Comment les groupes de gestion et Azure Policy s'articulent-ils pour gouverner un grand nombre d'abonnements Azure ?",
      en: "How do management groups and Azure Policy work together to govern a large number of Azure subscriptions ?",
    },
    answer: {
      fr: "Les groupes de gestion forment une hiérarchie au-dessus des abonnements, ce qui permet d'organiser des dizaines d'abonnements par division, par environnement ou par filiale, plutôt que de gérer chaque abonnement isolément. Azure Policy s'applique à n'importe quel niveau de cette hiérarchie, avec un héritage automatique vers le bas, une politique appliquée au niveau racine s'applique donc à tous les abonnements en dessous sans configuration répétée. C'est ce qui permet d'imposer des règles transverses, comme interdire la création de ressources publiques sans chiffrement, ou restreindre les régions autorisées, de façon garantie sur l'ensemble du tenant plutôt que de compter sur la discipline de chaque équipe.",
      en: "Management groups form a hierarchy above subscriptions, allowing dozens of subscriptions to be organized by division, environment or subsidiary, rather than managing each subscription in isolation. Azure Policy applies at any level of that hierarchy, with automatic inheritance downward, so a policy applied at the root level applies to every subscription beneath it without repeated configuration. This is what allows enforcing cross-cutting rules, like forbidding the creation of unencrypted public resources, or restricting allowed regions, with a guarantee across the whole tenant rather than relying on each team's discipline.",
    },
    pitfall: {
      fr: "Le piège est de définir des politiques en mode audit uniquement, qui se contentent de signaler une non-conformité sans jamais la bloquer : pour des exigences réellement critiques, comme le chiffrement obligatoire, il faut passer en mode deny qui empêche la création de la ressource non conforme, l'audit seul laisse le risque se propager avant qu'un humain ne le remarque.",
      en: "The trap is defining policies in audit-only mode, which merely flags non-compliance without ever blocking it: for truly critical requirements, like mandatory encryption, you need deny mode which prevents the non-compliant resource from being created, audit alone lets the risk spread before a human notices it.",
    },
    tags: ["management-groups", "azure-policy", "governance"],
  },
  {
    id: "azure-entra-id-conditional-access",
    topicId: "azure",
    difficulty: "hard",
    question: {
      fr: "Quel est le rôle de l'accès conditionnel dans Microsoft Entra ID, et en quoi diffère-t-il d'une authentification multifacteur appliquée uniformément ?",
      en: "What is the role of Conditional Access in Microsoft Entra ID, and how does it differ from uniformly applied multi-factor authentication ?",
    },
    answer: {
      fr: "Appliquer l'authentification multifacteur à absolument toutes les connexions, sans distinction, crée une friction constante qui pousse souvent les utilisateurs à chercher des contournements. L'accès conditionnel évalue plutôt un ensemble de signaux contextuels à chaque tentative de connexion, comme la localisation géographique, l'appareil utilisé et son niveau de conformité, le niveau de risque calculé du compte, et applique des exigences graduées seulement quand le contexte le justifie, en exigeant par exemple une vérification supplémentaire uniquement pour une connexion depuis un pays inhabituel ou un appareil non enregistré. Cette approche basée sur le risque maintient une sécurité forte sans imposer une friction inutile sur les connexions habituelles et déjà de confiance.",
      en: "Applying multi-factor authentication to absolutely every login indiscriminately creates constant friction that often pushes users to seek workarounds. Conditional Access instead evaluates a set of contextual signals on every sign-in attempt, like geographic location, the device used and its compliance level, the account's calculated risk level, and applies graduated requirements only when context justifies it, for example requiring extra verification only for a login from an unusual country or an unregistered device. This risk-based approach maintains strong security without imposing needless friction on routine, already-trusted logins.",
    },
    pitfall: {
      fr: "Le piège est de configurer des politiques d'accès conditionnel sans jamais tester leur effet en mode simulation avant activation : une politique mal réglée peut bloquer par erreur des connexions légitimes à grande échelle, en particulier pour des comptes de service automatisés qui ne peuvent pas répondre à un défi multifacteur, une politique d'exclusion explicite et testée pour ces comptes est indispensable avant tout déploiement large.",
      en: "The trap is configuring Conditional Access policies without ever testing their effect in simulation mode before activation: a poorly tuned policy can wrongly block legitimate logins at scale, especially for automated service accounts that cannot respond to an MFA challenge, an explicit, tested exclusion policy for those accounts is essential before any broad rollout.",
    },
    tags: ["entra-id", "conditional-access", "identity-security"],
  },
  {
    id: "azure-vnet-hub-spoke-topology",
    topicId: "azure",
    difficulty: "hard",
    question: {
      fr: "Pourquoi la topologie hub-and-spoke est-elle un choix courant pour l'architecture réseau d'une organisation utilisant plusieurs réseaux virtuels Azure ?",
      en: "Why is the hub-and-spoke topology a common choice for the network architecture of an organization using several Azure virtual networks ?",
    },
    answer: {
      fr: "Dans cette topologie, un réseau virtuel central, le hub, héberge les services partagés comme le pare-feu, la passerelle VPN vers le réseau on-premise, et les outils d'inspection du trafic, tandis que chaque application ou équipe possède son propre réseau virtuel spoke qui se connecte uniquement au hub via un peering. Le trafic entre deux spokes distincts, ou vers l'extérieur, transite obligatoirement par le hub, ce qui centralise l'inspection de sécurité et le contrôle du trafic sortant en un seul point plutôt que de le dupliquer dans chaque spoke. Ça facilite aussi l'ajout d'une nouvelle équipe ou d'une nouvelle application : elle reçoit son propre spoke isolé sans avoir à répliquer toute l'infrastructure de sécurité partagée.",
      en: "In this topology, a central virtual network, the hub, hosts shared services like the firewall, the VPN gateway to the on-premise network, and traffic inspection tools, while each application or team owns its own spoke virtual network that connects only to the hub via peering. Traffic between two distinct spokes, or heading outward, is required to transit through the hub, which centralizes security inspection and outbound traffic control at a single point rather than duplicating it in every spoke. This also eases adding a new team or application: it gets its own isolated spoke without having to replicate the entire shared security infrastructure.",
    },
    pitfall: {
      fr: "Le piège est d'oublier que le peering entre réseaux virtuels n'est pas transitif par défaut, exactement comme pour le VPC peering AWS : deux spokes ne peuvent pas communiquer directement entre eux uniquement parce qu'ils sont tous deux peerés au hub, il faut soit router explicitement le trafic à travers le firewall du hub, soit un mécanisme de routage additionnel comme une table de routes définies par l'utilisateur.",
      en: "The trap is forgetting that peering between virtual networks isn't transitive by default, exactly like AWS VPC peering: two spokes can't communicate directly with each other just because they're both peered to the hub, you either need to explicitly route traffic through the hub's firewall, or an additional routing mechanism like a user-defined route table.",
    },
    tags: ["hub-spoke", "virtual-network", "network-architecture"],
  },
  {
    id: "azure-aks-vs-app-service",
    topicId: "azure",
    difficulty: "hard",
    question: {
      fr: "Quels critères font pencher le choix d'hébergement entre Azure Kubernetes Service et Azure App Service pour une application web ?",
      en: "What criteria tip the hosting choice between Azure Kubernetes Service and Azure App Service for a web application ?",
    },
    answer: {
      fr: "App Service est une plateforme managée pensée pour héberger une application web ou une API sans avoir à gérer l'infrastructure sous-jacente, avec un déploiement simple depuis un dépôt Git ou une image de conteneur, un choix pertinent quand l'application est relativement autonome et ne nécessite pas d'orchestration complexe entre plusieurs services. AKS devient pertinent quand l'organisation opère déjà plusieurs microservices qui doivent communiquer entre eux, avec des besoins de scaling fin par service, un contrôle précis du réseau interne entre les pods, ou des exigences de portabilité vers d'autres fournisseurs cloud grâce à la nature standard de Kubernetes. Le coût réel d'AKS n'est pas seulement financier mais organisationnel : il demande une expertise Kubernetes dédiée que toutes les équipes n'ont pas.",
      en: "App Service is a managed platform designed to host a web app or API without managing the underlying infrastructure, with simple deployment from a Git repository or a container image, a sensible choice when the application is relatively self-contained and doesn't require complex orchestration across several services. AKS becomes relevant when the organization already operates several microservices that need to communicate with each other, with fine-grained per-service scaling needs, precise control over internal networking between pods, or portability requirements toward other cloud providers thanks to Kubernetes's standard nature. The real cost of AKS isn't just financial but organizational: it demands dedicated Kubernetes expertise that not every team has.",
    },
    pitfall: {
      fr: "Le piège classique en entretien est de recommander Kubernetes par réflexe parce que c'est la solution la plus reconnue techniquement, sans évaluer si la complexité opérationnelle additionnelle, gestion des nœuds, des mises à jour de version, du réseau interne, est réellement justifiée par les besoins de l'application : une simple application web sur App Service, plus simple à opérer, reste souvent le meilleur choix.",
      en: "The classic interview trap is recommending Kubernetes by reflex because it's the most technically recognized solution, without evaluating whether the added operational complexity, node management, version upgrades, internal networking, is actually justified by the application's needs: a simple web app on App Service, simpler to operate, often remains the better choice.",
    },
    tags: ["aks", "app-service", "hosting-strategy"],
  },
  {
    id: "azure-cost-management-reservations",
    topicId: "azure",
    difficulty: "hard",
    question: {
      fr: "Comment les instances réservées et les remises Azure Hybrid Benefit permettent-elles de réduire durablement une facture Azure ?",
      en: "How do Reserved Instances and the Azure Hybrid Benefit discount durably reduce an Azure bill ?",
    },
    answer: {
      fr: "Les instances réservées engagent sur un volume de calcul pour une durée d'un ou trois ans en échange d'une remise substantielle par rapport au tarif à la demande, un choix pertinent pour une charge stable et prévisible comme une base de données de production qui tourne en continu. L'Azure Hybrid Benefit permet, lui, de réutiliser des licences Windows Server ou SQL Server déjà possédées sous contrat Software Assurance pour réduire le coût de calcul sur Azure, ce qui évite de payer deux fois pour une licence déjà détenue par l'organisation. Combinées, ces deux remises peuvent réduire significativement le coût d'une charge de travail Windows ou SQL Server stable, à condition d'avoir une visibilité claire sur les licences déjà possédées.",
      en: "Reserved Instances commit to a compute volume for a one- or three-year term in exchange for a substantial discount over on-demand pricing, a sensible choice for a stable and predictable workload like a production database running continuously. Azure Hybrid Benefit, meanwhile, lets you reuse Windows Server or SQL Server licenses already owned under a Software Assurance contract to reduce compute cost on Azure, avoiding paying twice for a license the organization already holds. Combined, these two discounts can significantly reduce the cost of a stable Windows or SQL Server workload, provided there's clear visibility into the licenses already owned.",
    },
    pitfall: {
      fr: "Le piège est de réserver de la capacité sur un type d'instance avant d'avoir une visibilité fiable sur l'usage réel à long terme : une réservation sur trois ans pour une charge qui finit par être redimensionnée ou migrée vers un autre type d'instance quelques mois plus tard représente un engagement financier gaspillé, mieux vaut d'abord observer plusieurs mois d'usage stable avant de s'engager sur la durée la plus longue.",
      en: "The trap is reserving capacity on an instance type before having reliable visibility into real long-term usage: a three-year reservation for a workload that ends up resized or migrated to a different instance type a few months later represents a wasted financial commitment, it's better to first observe several months of stable usage before committing to the longest term.",
    },
    tags: ["cost-management", "reserved-instances", "hybrid-benefit"],
  },

  // Docker (senior/architecte)
  {
    id: "docker-multi-stage-build-optimization",
    topicId: "docker",
    difficulty: "hard",
    question: {
      fr: "Comment un build Docker multi-étapes réduit-il la taille et la surface d'attaque de l'image finale ?",
      en: "How does a multi-stage Docker build reduce the final image's size and attack surface ?",
    },
    answer: {
      fr: "Un build multi-étapes utilise plusieurs instructions FROM dans un même Dockerfile, où une première étape installe les outils de compilation, les dépendances de développement, et produit un artefact compilé, tandis qu'une étape finale distincte part d'une image minimale, par exemple une image distroless ou alpine, et copie uniquement l'artefact final depuis l'étape précédente. Le compilateur, les dépendances de build, et tout l'outillage intermédiaire n'existent jamais dans l'image finale livrée en production, ce qui réduit à la fois sa taille, souvent d'un facteur de plusieurs centaines de mégaoctets à quelques dizaines, et sa surface d'attaque puisque des outils comme un compilateur ou un gestionnaire de paquets absents ne peuvent pas être détournés par un attaquant ayant obtenu un accès au conteneur.",
      en: "A multi-stage build uses several FROM instructions in a single Dockerfile, where a first stage installs build tools, development dependencies, and produces a compiled artifact, while a separate final stage starts from a minimal image, for example a distroless or alpine image, and copies only the final artifact from the previous stage. The compiler, build dependencies, and all intermediate tooling never exist in the final image shipped to production, which reduces both its size, often by a factor of several hundred megabytes down to a few dozen, and its attack surface since tools like a compiler or package manager that are absent can't be repurposed by an attacker who gained access to the container.",
    },
    pitfall: {
      fr: "Le piège est de copier par erreur un répertoire trop large depuis l'étape de build vers l'étape finale, par exemple tout le répertoire de travail plutôt que le seul binaire ou artefact nécessaire, ce qui réintroduit dans l'image finale des fichiers de configuration de build, des secrets utilisés pendant la compilation, ou des dépendances intermédiaires que le multi-étapes est justement censé éliminer.",
      en: "The trap is mistakenly copying too broad a directory from the build stage to the final stage, for example the entire working directory rather than just the needed binary or artifact, which reintroduces build configuration files, secrets used during compilation, or intermediate dependencies into the final image, exactly what multi-stage builds are meant to eliminate.",
    },
    tags: ["multi-stage-build", "image-optimization", "container-security"],
  },
  {
    id: "docker-rootless-and-non-root-containers",
    topicId: "docker",
    difficulty: "hard",
    question: {
      fr: "Pourquoi exécuter un conteneur avec un utilisateur non root est-il une pratique de sécurité importante, même si le conteneur reste isolé de l'hôte ?",
      en: "Why is running a container as a non-root user an important security practice, even though the container remains isolated from the host ?",
    },
    answer: {
      fr: "Par défaut, un processus dans un conteneur s'exécute en tant que root à l'intérieur de ce conteneur, ce qui semble sans conséquence puisque l'isolation du conteneur limite en théorie son impact sur l'hôte. Mais une vulnérabilité d'évasion de conteneur, qui permet à un processus de sortir de son isolation pour atteindre le système hôte, devient bien plus dangereuse si le processus qui s'échappe avait des privilèges root à l'intérieur du conteneur, cette élévation se propage souvent vers l'hôte. Exécuter le conteneur avec un utilisateur applicatif dédié, non privilégié, via l'instruction USER dans le Dockerfile, limite les dégâts possibles même en cas de faille d'évasion, en appliquant le principe de défense en profondeur plutôt que de compter uniquement sur l'isolation du conteneur.",
      en: "By default, a process in a container runs as root inside that container, which seems inconsequential since container isolation theoretically limits its impact on the host. But a container escape vulnerability, which lets a process break out of its isolation to reach the host system, becomes far more dangerous if the escaping process had root privileges inside the container, that elevation often carries over to the host. Running the container with a dedicated, unprivileged application user, via the USER instruction in the Dockerfile, limits possible damage even in the event of an escape flaw, applying defense in depth rather than relying solely on container isolation.",
    },
    pitfall: {
      fr: "Le piège est de définir un utilisateur non root dans le Dockerfile sans vérifier que l'application peut réellement fonctionner avec des permissions réduites, par exemple écrire dans des répertoires ou ouvrir des ports en dessous de 1024 qui nécessitent des privilèges root par défaut sur Linux : le résultat est un conteneur qui échoue silencieusement ou avec des erreurs de permission confuses au démarrage plutôt qu'une sécurité renforcée.",
      en: "The trap is setting a non-root user in the Dockerfile without verifying the application can actually run with reduced permissions, for example writing to directories or opening ports below 1024 which require root privileges by default on Linux: the result is a container that fails silently or with confusing permission errors at startup rather than improved security.",
    },
    tags: ["container-security", "non-root", "defense-in-depth"],
  },
  {
    id: "docker-layer-caching-build-performance",
    topicId: "docker",
    difficulty: "hard",
    question: {
      fr: "Comment l'ordre des instructions dans un Dockerfile influence-t-il l'efficacité du cache de build, et quelle organisation privilégier ?",
      en: "How does instruction order in a Dockerfile influence build cache efficiency, and what organization should be favored ?",
    },
    answer: {
      fr: "Docker met en cache chaque couche produite par une instruction, et invalide non seulement la couche modifiée mais aussi toutes les couches suivantes dès qu'une instruction ou les fichiers qu'elle copie changent. Placer les instructions les plus stables en premier, comme l'installation des dépendances système ou applicatives à partir d'un fichier de manifeste, et ne copier le code source de l'application qu'en dernier, permet de préserver le cache des étapes coûteuses en temps, comme l'installation de dépendances, même quand seul le code applicatif change entre deux builds. Inverser cet ordre, en copiant tout le code source avant d'installer les dépendances, invalide le cache d'installation à chaque modification de n'importe quel fichier du projet, même un simple commentaire.",
      en: "Docker caches each layer produced by an instruction, and invalidates not just the modified layer but every subsequent layer as soon as an instruction or the files it copies change. Placing the most stable instructions first, like installing system or application dependencies from a manifest file, and copying the application's source code only last, preserves the cache for time-costly steps, like dependency installation, even when only application code changes between two builds. Reversing that order, copying all source code before installing dependencies, invalidates the installation cache on every modification to any file in the project, even a simple comment.",
    },
    pitfall: {
      fr: "Le piège est de copier le fichier de manifeste de dépendances et le reste du code source en une seule instruction COPY, ce qui empêche Docker de distinguer un changement de dépendance d'un simple changement de code applicatif : séparer explicitement la copie du fichier de manifeste, suivie de l'installation, puis la copie du reste du code, est nécessaire pour bénéficier réellement du cache différentiel.",
      en: "The trap is copying the dependency manifest file and the rest of the source code in a single COPY instruction, which prevents Docker from distinguishing a dependency change from a simple application code change: explicitly separating the manifest file copy, followed by installation, then copying the rest of the code, is needed to actually benefit from differential caching.",
    },
    tags: ["layer-caching", "build-performance", "dockerfile-optimization"],
  },
  {
    id: "docker-container-resource-limits",
    topicId: "docker",
    difficulty: "hard",
    question: {
      fr: "Pourquoi définir des limites explicites de CPU et de mémoire sur un conteneur est-il essentiel dans un environnement partagé, et quel risque survient sans elles ?",
      en: "Why is setting explicit CPU and memory limits on a container essential in a shared environment, and what risk arises without them ?",
    },
    answer: {
      fr: "Sans limite explicite, un conteneur peut consommer une part illimitée des ressources de la machine hôte, ce qui devient un problème direct dès que plusieurs conteneurs partagent la même machine, comme c'est le cas dans un cluster Kubernetes ou même simplement plusieurs conteneurs Docker sur le même hôte. Un conteneur avec une fuite mémoire ou une boucle consommant du CPU en continu peut alors affamer les autres conteneurs voisins, provoquant leur ralentissement voire leur arrêt forcé par le système, un phénomène parfois appelé bruit de voisinage. Définir des limites explicites, et idéalement aussi des requêtes de ressources qui garantissent un minimum réservé, permet au planificateur de placer les charges de façon prévisible et d'isoler l'impact d'un conteneur défaillant.",
      en: "Without an explicit limit, a container can consume an unbounded share of the host machine's resources, which becomes a direct problem as soon as several containers share the same machine, as is the case in a Kubernetes cluster or even simply several Docker containers on the same host. A container with a memory leak or a loop continuously consuming CPU can then starve neighboring containers, causing their slowdown or even forced termination by the system, a phenomenon sometimes called noisy neighbor. Setting explicit limits, and ideally also resource requests that guarantee a reserved minimum, lets the scheduler place workloads predictably and isolates the impact of a failing container.",
    },
    pitfall: {
      fr: "Le piège est de fixer une limite mémoire trop basse par excès de prudence sans avoir mesuré la consommation réelle sous charge : dépasser la limite mémoire provoque une terminaison brutale du conteneur par le noyau, souvent bien plus perturbatrice qu'un ralentissement progressif, il faut mesurer l'usage réel en conditions de charge représentatives avant de fixer une limite définitive plutôt que de deviner une valeur arbitraire.",
      en: "The trap is setting a memory limit too low out of excessive caution without having measured real consumption under load: exceeding the memory limit causes an abrupt kernel-triggered container termination, often far more disruptive than a gradual slowdown, actual usage under representative load conditions should be measured before setting a final limit rather than guessing an arbitrary value.",
    },
    tags: ["resource-limits", "noisy-neighbor", "container-orchestration"],
  },
  {
    id: "docker-image-scanning-supply-chain",
    topicId: "docker",
    difficulty: "hard",
    question: {
      fr: "Quel rôle joue le scan de vulnérabilités des images de conteneur dans la sécurisation de la chaîne d'approvisionnement logicielle ?",
      en: "What role does container image vulnerability scanning play in securing the software supply chain ?",
    },
    answer: {
      fr: "Une image de conteneur agrège des couches provenant de sources multiples, l'image de base, les paquets systèmes installés, les dépendances applicatives, chacune pouvant introduire des vulnérabilités connues indépendamment du code applicatif écrit par l'équipe. Un scanner d'image analyse chaque couche par rapport à des bases de données de vulnérabilités connues et alerte sur les composants obsolètes ou vulnérables avant que l'image ne soit déployée. Intégré directement dans le pipeline de build, ce scan bloque la publication d'une image contenant une vulnérabilité critique, ce qui déplace la détection du problème vers l'amont, avant la production, plutôt que de découvrir la faille après coup via un audit de sécurité externe ou pire un incident.",
      en: "A container image aggregates layers from multiple sources, the base image, installed system packages, application dependencies, each potentially introducing known vulnerabilities independently of the application code written by the team. An image scanner analyzes each layer against databases of known vulnerabilities and flags outdated or vulnerable components before the image is deployed. Integrated directly into the build pipeline, this scan blocks publishing an image containing a critical vulnerability, shifting problem detection upstream, before production, rather than discovering the flaw after the fact via an external security audit or worse an incident.",
    },
    pitfall: {
      fr: "Le piège est de scanner une image une seule fois au moment du build puis de la considérer sûre indéfiniment : de nouvelles vulnérabilités sont découvertes en continu dans des composants déjà publiés, une image jugée saine il y a six mois peut contenir aujourd'hui une vulnérabilité critique récemment révélée, un rescan périodique des images déjà déployées en production est nécessaire, pas seulement un scan ponctuel au moment de la construction.",
      en: "The trap is scanning an image once at build time and then considering it safe indefinitely: new vulnerabilities are continuously discovered in already published components, an image deemed healthy six months ago may today contain a recently disclosed critical vulnerability, periodic rescanning of images already deployed to production is necessary, not just a one-off scan at build time.",
    },
    tags: ["image-scanning", "supply-chain-security", "vulnerability-management"],
  },

  // Terraform (senior/architecte)
  {
    id: "terraform-state-locking-remote-backend",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Pourquoi un backend distant avec verrouillage d'état est-il indispensable dès qu'une équipe travaille à plusieurs sur le même code Terraform ?",
      en: "Why is a remote backend with state locking essential as soon as a team collaborates on the same Terraform codebase ?",
    },
    answer: {
      fr: "Le fichier d'état Terraform décrit la correspondance entre le code de configuration et les ressources réellement créées dans le cloud. S'il reste local sur le poste de chaque développeur, deux personnes qui appliquent des changements en parallèle travaillent chacune sur une copie de l'état potentiellement désynchronisée de l'autre, ce qui peut conduire l'une à écraser les changements de l'autre ou à recréer par erreur une ressource déjà existante. Un backend distant, comme un bucket de stockage cloud avec verrouillage natif, centralise cet état en un seul endroit partagé, et le verrouillage empêche deux applications concurrentes de s'exécuter simultanément sur le même état, l'une devant attendre que l'autre libère le verrou avant de démarrer.",
      en: "The Terraform state file describes the mapping between the configuration code and the resources actually created in the cloud. If it stays local on each developer's machine, two people applying changes in parallel each work on a copy of the state potentially out of sync with the other's, which can lead one to overwrite the other's changes or mistakenly recreate an already existing resource. A remote backend, like a cloud storage bucket with native locking, centralizes this state in one shared location, and locking prevents two concurrent applies from running simultaneously against the same state, one having to wait for the other to release the lock before starting.",
    },
    pitfall: {
      fr: "Le piège est de croire qu'un backend distant seul suffit sans vérifier que le mécanisme de verrouillage est réellement actif et fonctionnel : certains backends de stockage ne fournissent pas de verrouillage natif et nécessitent une ressource complémentaire dédiée, un apply concurrent sur un backend sans verrouillage effectif reproduit exactement le problème de corruption d'état qu'on cherchait à éviter.",
      en: "The trap is believing a remote backend alone is enough without verifying the locking mechanism is actually active and functional: some storage backends don't provide native locking and require a dedicated complementary resource, a concurrent apply on a backend without effective locking reproduces exactly the state corruption problem one was trying to avoid.",
    },
    tags: ["state-management", "remote-backend", "team-collaboration"],
  },
  {
    id: "terraform-module-design-versioning",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Quels principes suivre pour concevoir des modules Terraform réutilisables entre plusieurs équipes ou projets ?",
      en: "What principles should be followed to design Terraform modules reusable across several teams or projects ?",
    },
    answer: {
      fr: "Un module réutilisable doit exposer une interface claire à travers ses variables d'entrée et ses sorties, en cachant les détails d'implémentation internes plutôt que de forcer l'appelant à connaître la structure exacte des ressources créées à l'intérieur. Il doit rester suffisamment générique pour couvrir plusieurs cas d'usage légitimes sans devenir une jungle de conditions imbriquées essayant de tout couvrir. Chaque module publié doit aussi être versionné explicitement, via des tags Git sémantiques par exemple, pour que les équipes consommatrices puissent épingler une version précise et choisir consciemment le moment de migrer vers une version plus récente, plutôt que de subir un changement de comportement du module sans préavis simplement parce que la branche principale a évolué.",
      en: "A reusable module should expose a clear interface through its input variables and outputs, hiding internal implementation details rather than forcing the caller to know the exact structure of resources created inside. It should stay generic enough to cover several legitimate use cases without becoming a jungle of nested conditionals trying to cover everything. Every published module should also be explicitly versioned, via semantic Git tags for example, so consuming teams can pin a specific version and consciously choose when to migrate to a newer one, rather than suffering an unannounced behavior change in the module simply because the main branch evolved.",
    },
    pitfall: {
      fr: "Le piège est de référencer un module directement depuis la branche principale de son dépôt Git sans épingler de version précise : dès que le mainteneur du module pousse un changement, potentiellement incompatible, toutes les équipes consommatrices l'héritent immédiatement au prochain plan, sans le contrôle et la période de test qu'une version épinglée explicite aurait permis.",
      en: "The trap is referencing a module directly from its Git repository's main branch without pinning a specific version: as soon as the module maintainer pushes a change, potentially incompatible, every consuming team inherits it immediately on the next plan, without the control and testing window an explicitly pinned version would have allowed.",
    },
    tags: ["module-design", "versioning", "reusability"],
  },
  {
    id: "terraform-drift-detection-management",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Qu'est-ce que la dérive d'infrastructure par rapport à l'état Terraform, et comment la détecter et la gérer en continu ?",
      en: "What is infrastructure drift relative to Terraform state, and how do you detect and manage it continuously ?",
    },
    answer: {
      fr: "La dérive survient quand une ressource cloud est modifiée en dehors de Terraform, par exemple via la console web du fournisseur cloud lors d'une intervention manuelle en urgence, ce qui rend l'état enregistré par Terraform incohérent avec la réalité du système. Une exécution régulière de terraform plan en mode lecture seule, souvent automatisée dans un pipeline planifié, permet de détecter cette divergence en comparant l'état enregistré à l'état réel du fournisseur cloud, sans jamais appliquer de changement automatiquement. La dérive détectée doit ensuite être traitée consciemment : soit en réappliquant la configuration Terraform pour restaurer l'état voulu, soit en important formellement le changement manuel dans la configuration si ce changement était en réalité légitime et doit être conservé.",
      en: "Drift occurs when a cloud resource is modified outside of Terraform, for example via the cloud provider's web console during an emergency manual intervention, which makes Terraform's recorded state inconsistent with the system's reality. Regularly running terraform plan in read-only mode, often automated in a scheduled pipeline, detects this divergence by comparing the recorded state to the cloud provider's actual state, without ever applying a change automatically. Detected drift must then be handled consciously: either by reapplying the Terraform configuration to restore the intended state, or by formally importing the manual change into the configuration if that change was actually legitimate and should be kept.",
    },
    pitfall: {
      fr: "Le piège est de réagir à une dérive détectée en lançant automatiquement un terraform apply sans revue humaine préalable : si la modification manuelle détectée était en réalité une correction d'urgence légitime, l'écraser automatiquement sans comprendre pourquoi elle a été faite peut réintroduire l'incident même que cette modification manuelle avait justement corrigé.",
      en: "The trap is reacting to detected drift by automatically triggering a terraform apply without prior human review: if the detected manual modification was actually a legitimate emergency fix, automatically overwriting it without understanding why it was made can reintroduce the very incident that manual change had just fixed.",
    },
    tags: ["drift-detection", "state-management", "infrastructure-as-code"],
  },
  {
    id: "terraform-workspace-environment-separation",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Pourquoi les workspaces Terraform natifs sont-ils souvent déconseillés pour séparer des environnements de production et de test, et par quoi les remplacer ?",
      en: "Why are native Terraform workspaces often discouraged for separating production and test environments, and what should replace them ?",
    },
    answer: {
      fr: "Les workspaces natifs de Terraform partagent le même code de configuration et le même backend, en ne faisant varier que le nom de l'état, ce qui signifie qu'une même erreur de configuration, ou une variable mal renseignée, s'applique identiquement à tous les workspaces y compris la production. Ils n'offrent également aucune isolation d'accès : n'importe qui ayant accès au code peut changer de workspace et appliquer directement sur la production sans barrière supplémentaire. La pratique généralement recommandée sépare plutôt les environnements par des répertoires de configuration distincts, voire des dépôts distincts, avec des backends d'état différents et des permissions d'accès différenciées, ce qui rend une action accidentelle sur la production structurellement plus difficile plutôt que de compter sur la seule vigilance humaine.",
      en: "Terraform's native workspaces share the same configuration code and the same backend, varying only the state's name, meaning a single configuration error, or a mistyped variable, applies identically to every workspace including production. They also offer no access isolation: anyone with access to the code can switch workspace and apply directly to production with no additional barrier. The generally recommended practice instead separates environments through distinct configuration directories, or even distinct repositories, with different state backends and differentiated access permissions, making an accidental action on production structurally harder rather than relying on human vigilance alone.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter les workspaces comme LA solution standard de gestion multi-environnement sans nuancer leurs limites : ils restent utiles pour des cas d'usage plus légers, comme tester rapidement une variation temporaire de configuration, mais une séparation stricte de production nécessite une isolation plus forte que ce que les workspaces natifs fournissent.",
      en: "The interview trap is presenting workspaces as THE standard multi-environment management solution without nuancing their limits: they remain useful for lighter use cases, like quickly testing a temporary configuration variation, but strict production separation needs stronger isolation than native workspaces provide.",
    },
    tags: ["workspaces", "environment-separation", "production-safety"],
  },
  {
    id: "terraform-policy-as-code-sentinel-opa",
    topicId: "terraform",
    difficulty: "hard",
    question: {
      fr: "Quel problème le policy-as-code, comme Sentinel ou Open Policy Agent, résout-il par rapport à une simple revue manuelle des plans Terraform ?",
      en: "What problem does policy-as-code, like Sentinel or Open Policy Agent, solve compared to a simple manual review of Terraform plans ?",
    },
    answer: {
      fr: "Une revue manuelle d'un plan Terraform dépend entièrement de l'attention et de l'expertise du relecteur humain à l'instant où il lit le diff, un relecteur pressé ou peu familier d'un fournisseur cloud spécifique peut facilement laisser passer une ressource exposée publiquement par erreur ou un chiffrement manquant. Le policy-as-code encode ces règles de sécurité et de conformité sous forme de politiques exécutables automatiquement contre chaque plan avant qu'il ne soit appliqué, comme interdire toute base de données sans chiffrement au repos, ce qui transforme une vérification dépendante de la vigilance humaine en un contrôle systématique et reproductible, appliqué de façon identique que ce soit le développeur le plus junior ou le plus senior qui pousse le changement.",
      en: "A manual review of a Terraform plan depends entirely on the human reviewer's attention and expertise at the moment they read the diff, a rushed reviewer or one unfamiliar with a specific cloud provider can easily miss a resource mistakenly exposed publicly or missing encryption. Policy-as-code encodes these security and compliance rules as policies automatically executed against every plan before it's applied, like forbidding any database without encryption at rest, turning a check dependent on human vigilance into a systematic, reproducible control, applied identically whether it's the most junior or the most senior developer pushing the change.",
    },
    pitfall: {
      fr: "Le piège est d'écrire des politiques tellement strictes et nombreuses qu'elles bloquent des cas légitimes fréquemment, ce qui pousse les équipes à chercher des contournements ou à demander des dérogations systématiques : une politique doit rester alignée sur un risque réel et documenté, pas sur une prudence théorique maximale qui finit par être perçue comme un obstacle bureaucratique plutôt qu'une protection utile.",
      en: "The trap is writing policies so strict and numerous that they frequently block legitimate cases, pushing teams to seek workarounds or request systematic exemptions: a policy should stay aligned with a real, documented risk, not maximal theoretical caution that ends up perceived as a bureaucratic obstacle rather than useful protection.",
    },
    tags: ["policy-as-code", "sentinel", "governance"],
  },

  // Apache Spark (senior/architecte)
  {
    id: "spark-partitioning-shuffle-optimization",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "Pourquoi le partitionnement des données est-il le levier de performance le plus important sur un job Spark, et comment limiter le coût d'un shuffle ?",
      en: "Why is data partitioning the most important performance lever on a Spark job, and how do you limit the cost of a shuffle ?",
    },
    answer: {
      fr: "Spark distribue le traitement en découpant les données en partitions traitées en parallèle sur les différents exécuteurs du cluster. Un shuffle, déclenché par des opérations comme un regroupement ou une jointure entre deux jeux de données, force une redistribution des données à travers le réseau entre les nœuds pour rassembler les enregistrements partageant une même clé, une opération coûteuse en entrées-sorties disque et en trafic réseau. Réduire ce coût passe par plusieurs leviers : partitionner les données en amont selon la clé qui sera utilisée pour la jointure ou l'agrégation afin que les données pertinentes soient déjà colocalisées, éviter les jointures entre un très grand jeu de données et un petit jeu de données en utilisant plutôt une diffusion broadcast du petit jeu vers tous les exécuteurs, et ajuster le nombre de partitions pour éviter à la fois des partitions trop petites qui multiplient la charge de coordination et des partitions trop grosses qui saturent la mémoire d'un exécuteur.",
      en: "Spark distributes processing by splitting data into partitions processed in parallel across the cluster's executors. A shuffle, triggered by operations like a groupBy or a join between two datasets, forces a redistribution of data across the network between nodes to gather records sharing the same key, an operation costly in disk I/O and network traffic. Reducing this cost involves several levers: pre-partitioning data by the key that will be used for the join or aggregation so relevant data is already colocated, avoiding joins between a very large dataset and a small one by instead using a broadcast of the small dataset to every executor, and tuning the number of partitions to avoid both partitions too small which multiply coordination overhead and partitions too large which saturate an executor's memory.",
    },
    pitfall: {
      fr: "Le piège classique est d'utiliser une jointure classique entre une grande table de faits et une petite table de dimension sans activer explicitement une jointure broadcast, alors que Spark peut échouer à la détecter automatiquement selon la taille estimée, ce qui déclenche un shuffle complet et coûteux sur la grande table alors qu'une diffusion de la petite table aurait suffi et été bien moins coûteuse.",
      en: "The classic trap is using a regular join between a large fact table and a small dimension table without explicitly enabling a broadcast join, when Spark may fail to detect it automatically depending on estimated size, triggering a full and costly shuffle on the large table when broadcasting the small table would have sufficed and been far cheaper.",
    },
    tags: ["partitioning", "shuffle", "performance-tuning"],
    code: {
      lang: "scala",
      snippet: "import org.apache.spark.sql.functions.broadcast\n\nval result = largeFactDf.join(\n  broadcast(smallDimensionDf),\n  Seq(\"customer_id\")\n)",
    },
  },
  {
    id: "spark-catalyst-optimizer-explain",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "Quel rôle joue l'optimiseur Catalyst dans l'exécution d'une requête Spark SQL, et comment lire un plan d'exécution pour diagnostiquer un problème ?",
      en: "What role does the Catalyst optimizer play in executing a Spark SQL query, and how do you read an execution plan to diagnose a problem ?",
    },
    answer: {
      fr: "Catalyst transforme une requête écrite en Spark SQL ou via l'API DataFrame en un plan logique, applique des règles d'optimisation comme le refoulement des filtres au plus près de la source de données ou l'élimination de colonnes inutilisées, puis génère un plan physique optimisé pour l'exécution réelle sur le cluster. Appeler explain sur un DataFrame affiche ce plan à plusieurs niveaux, du plan logique non optimisé jusqu'au plan physique final, ce qui permet de vérifier concrètement si un filtre a bien été refoulé près de la lecture de données plutôt qu'appliqué après avoir chargé l'intégralité du jeu de données, ou si une jointure a été convertie en jointure broadcast comme attendu.",
      en: "Catalyst transforms a query written in Spark SQL or via the DataFrame API into a logical plan, applies optimization rules like pushing filters as close as possible to the data source or eliminating unused columns, then generates a physical plan optimized for actual execution on the cluster. Calling explain on a DataFrame displays this plan at several levels, from the unoptimized logical plan down to the final physical plan, letting you concretely verify whether a filter was actually pushed down near the data read rather than applied after loading the entire dataset, or whether a join was converted into a broadcast join as expected.",
    },
    pitfall: {
      fr: "Le piège est de supposer qu'un filtre écrit tôt dans le code sera automatiquement refoulé efficacement par Catalyst sans jamais vérifier le plan réel via explain : certaines transformations, en particulier l'usage de fonctions définies par l'utilisateur opaques pour l'optimiseur, empêchent Catalyst de voir à travers et de refouler le filtre, ce qui dégrade silencieusement la performance sans qu'aucune erreur ne soit levée.",
      en: "The trap is assuming a filter written early in the code will automatically be efficiently pushed down by Catalyst without ever checking the actual plan via explain: certain transformations, especially the use of user-defined functions opaque to the optimizer, prevent Catalyst from seeing through them to push the filter down, silently degrading performance with no error ever raised.",
    },
    tags: ["catalyst-optimizer", "query-planning", "spark-sql"],
  },
  {
    id: "spark-memory-management-executor-tuning",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "Comment la mémoire d'un exécuteur Spark se répartit-elle entre exécution et stockage, et quelles erreurs de configuration provoquent des échecs de type out-of-memory ?",
      en: "How is a Spark executor's memory split between execution and storage, and what configuration mistakes cause out-of-memory failures ?",
    },
    answer: {
      fr: "La mémoire d'un exécuteur se divise principalement entre la mémoire d'exécution, utilisée pour les calculs de shuffle, de tri et d'agrégation, et la mémoire de stockage, utilisée pour la mise en cache de données. Ces deux régions partagent un pool unifié qui peut s'emprunter dynamiquement l'une à l'autre selon les besoins courants, mais restent bornées par une fraction configurable de la mémoire totale allouée à l'exécuteur, le reste étant réservé à la JVM elle-même et à la mémoire hors tas utilisée notamment pour certains formats de sérialisation. Une erreur out-of-memory survient typiquement quand une partition individuelle est trop volumineuse pour tenir en mémoire sur un seul exécuteur, souvent à cause d'un partitionnement déséquilibré où une clé concentre une part disproportionnée des données, un phénomène appelé asymétrie de données.",
      en: "An executor's memory is mainly split between execution memory, used for shuffle, sort, and aggregation computations, and storage memory, used for caching data. These two regions share a unified pool that can dynamically borrow from each other based on current needs, but remain bounded by a configurable fraction of the executor's total allocated memory, the rest being reserved for the JVM itself and off-heap memory used notably for certain serialization formats. An out-of-memory error typically occurs when an individual partition is too large to fit in memory on a single executor, often due to unbalanced partitioning where one key concentrates a disproportionate share of the data, a phenomenon called data skew.",
    },
    pitfall: {
      fr: "Le piège est de réagir à une erreur out-of-memory en augmentant uniquement la mémoire allouée à chaque exécuteur sans diagnostiquer la cause réelle : si le problème vient d'une asymétrie de données où une seule clé concentre l'essentiel du volume, augmenter la mémoire ne fait que repousser temporairement le problème, la vraie solution passe par un salage de la clé ou un repartitionnement explicite pour répartir la charge plus uniformément.",
      en: "The trap is reacting to an out-of-memory error by only increasing the memory allocated to each executor without diagnosing the real cause: if the problem stems from data skew where a single key concentrates most of the volume, increasing memory only temporarily postpones the problem, the real fix involves salting the key or explicit repartitioning to spread the load more evenly.",
    },
    tags: ["memory-management", "data-skew", "executor-tuning"],
  },
  {
    id: "spark-structured-streaming-watermarks",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "À quoi servent les watermarks dans Spark Structured Streaming, et quel compromis règlent-ils face aux données en retard ?",
      en: "What are watermarks for in Spark Structured Streaming, and what trade-off do they settle regarding late data ?",
    },
    answer: {
      fr: "Dans un traitement en fenêtres temporelles sur un flux continu, comme une agrégation par fenêtre de cinq minutes, le système doit décider à quel moment une fenêtre est considérée comme définitivement close pour produire son résultat, alors que des données peuvent arriver en retard à cause de la latence réseau ou d'une source de données elle-même en retard. Un watermark définit un seuil de tolérance explicite, par exemple accepter des données en retard jusqu'à dix minutes après leur horodatage d'origine, au-delà duquel les données en retard sont définitivement ignorées et la fenêtre correspondante est purgée de l'état interne maintenu par Spark. C'est un compromis assumé entre l'exactitude, en attendant plus longtemps on capture plus de données réellement en retard, et la consommation mémoire, l'état interne pour des fenêtres jamais fermées grandirait indéfiniment sans ce seuil.",
      en: "In windowed processing over a continuous stream, like an aggregation over a five-minute window, the system must decide when a window is considered definitively closed to produce its result, even though data can arrive late due to network latency or a data source itself running behind. A watermark defines an explicit tolerance threshold, for example accepting late data up to ten minutes after its original timestamp, beyond which late data is definitively ignored and the corresponding window is purged from the internal state Spark maintains. It's a deliberate trade-off between accuracy, waiting longer captures more genuinely late data, and memory consumption, the internal state for windows never closed would grow indefinitely without this threshold.",
    },
    pitfall: {
      fr: "Le piège est de fixer un seuil de watermark arbitrairement court pour économiser de la mémoire sans avoir mesuré la distribution réelle des retards observés en production : un seuil trop agressif fait silencieusement disparaître des données légitimes mais simplement un peu tardives, ce qui fausse les résultats d'agrégation sans qu'aucune erreur explicite ne signale le problème.",
      en: "The trap is setting an arbitrarily short watermark threshold to save memory without having measured the actual distribution of delays observed in production: too aggressive a threshold silently drops legitimate but simply somewhat late data, skewing aggregation results with no explicit error ever flagging the problem.",
    },
    tags: ["structured-streaming", "watermarks", "late-data-handling"],
  },
  {
    id: "spark-cluster-manager-choice",
    topicId: "spark",
    difficulty: "hard",
    question: {
      fr: "Quels critères orientent le choix entre Kubernetes et YARN comme gestionnaire de cluster pour exécuter des jobs Spark en production ?",
      en: "What criteria guide the choice between Kubernetes and YARN as the cluster manager for running Spark jobs in production ?",
    },
    answer: {
      fr: "YARN reste historiquement dominant dans les environnements qui possèdent déjà un cluster Hadoop établi, avec un écosystème mature de gestion des ressources et une intégration native avec le stockage HDFS, un choix naturel quand l'infrastructure existante repose déjà sur cette pile. Kubernetes devient pertinent quand l'organisation a déjà standardisé son infrastructure de calcul autour des conteneurs pour d'autres charges de travail, ce qui permet de faire tourner Spark sur la même plateforme opérationnelle que le reste des applications plutôt que de maintenir deux systèmes de gestion de cluster distincts avec des compétences opérationnelles différentes. Kubernetes offre aussi un scaling élastique plus naturel et une isolation par conteneur plus fine, au prix d'un écosystème Spark-sur-Kubernetes encore moins mature sur certains aspects avancés que l'intégration YARN historique.",
      en: "YARN remains historically dominant in environments that already have an established Hadoop cluster, with a mature resource management ecosystem and native integration with HDFS storage, a natural choice when existing infrastructure already relies on that stack. Kubernetes becomes relevant when the organization has already standardized its compute infrastructure around containers for other workloads, allowing Spark to run on the same operational platform as the rest of the applications rather than maintaining two separate cluster management systems with different operational skill sets. Kubernetes also offers more natural elastic scaling and finer per-container isolation, at the cost of a Spark-on-Kubernetes ecosystem still less mature on certain advanced aspects than the historical YARN integration.",
    },
    pitfall: {
      fr: "Le piège en entretien est de présenter Kubernetes comme un successeur strictement supérieur à YARN pour Spark dans tous les cas : dans une organisation déjà fortement investie dans un cluster Hadoop mature avec YARN, migrer vers Kubernetes uniquement par tendance technologique, sans bénéfice opérationnel concret, ajoute une complexité de migration significative pour un gain incertain.",
      en: "The interview trap is presenting Kubernetes as a strictly superior successor to YARN for Spark in every case: in an organization already heavily invested in a mature Hadoop cluster with YARN, migrating to Kubernetes purely out of technology trend, without a concrete operational benefit, adds significant migration complexity for an uncertain gain.",
    },
    tags: ["cluster-manager", "kubernetes", "yarn"],
  },
];
