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

export interface Question {
  id: string;
  topicId: TopicId;
  difficulty: Difficulty;
  question: LocalizedText;
  answer: LocalizedText;
  pitfall: LocalizedText;
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
];
