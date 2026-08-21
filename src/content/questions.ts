export type TopicId =
  | "java-core"
  | "spring-boot"
  | "jpa-hibernate"
  | "sql"
  | "angular"
  | "claude"
  | "kubernetes"
  | "gcp";

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
];
