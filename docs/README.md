# Penis Logistiekapp

Welkom in de Penis Logistiekapp!

## Autorisatie

De autorisatie loopt via PocketId, beschikbaar op `login.troela.fun`. Neem contact op met Roelof voor OIDC-credentials.

De front-end en de back-end zijn idealiter gekoppeld aan dezelfde applicatie binnen Pocket, maar Quarkus is daar niet zo
streng op.

### API-authorisatie

De front-end is geschreven in Nuxt, en gebruikt `better-auth` voor het inloggen. Dit is onhandig, maar het werkt.

De back-end gebruikt OIDC natively, maar is in principe niet direct benaderbaar door Nuxt.

In de front-end zit een `server/api/[..all].ts`-endpoint, dat alle calls die niet door Nuxt worden afgehandeld, doorzet
naar
de back-end server en de `Bearer`-token toevoegd aan de request, indien de user is ingelogd.

Hier zit ook een uitdaging: de back-end server snapt alleen Bearers, maar de front-end weet niet waneer die JWT verloopt
en lijkt
de better-auth-sessie gewoon te verlengen wanneer nodig. Hierdoor kan de JWT verlopen (deze kan wel gerefreshed worden,
wat de front-end soms ook lijkt te doen).

## Het domein

Het domein is opgezet uit Chats, met daarin berichten, en een eventuele ChatSubject. De Subjects zijn voor ons wat
voorheen de tickets waren.

Komt er dus op neer: alles is een chat.

Chats hebben:

- ChatUsers, gebruikers die direct onderdeel zijn van de chat
- ChatGroups, groepen die als geheel onderdeel zijn van de chat
- Entries, wat berichten, afbeeldingen en syteemmeldingen zijn (zoals het toevoegen van gebruikers)
  - Entries (abstract), met een groupingKey om berichten die tegelijk zijn gestuurd, bij elkaar te houden
  - AttributedChatEntry, met een user (wie) en een group (uit welke rol)
    - ChatFile, een afbeelding of bestand (voor nu alleen afbeeldingen)
    - ChatMessage, een bericht

Er is in de Entries-opzet nog ruimte voor systeemberichten, maar die zitten er voor nu even niet in.

Verder heeft een chat een createdAt en een updatedAt, want da's makkelijk om te hebben.

## Een chat aanmaken

Om een chat aan te maken, is in het `chats`-domein een `ChatService`. Die kan met de methode `createChat` een nieuwe
chat aanmaken.

Een nieuwe chat maak je aan met een `subject` en een lijst van `Users` en `Groups`. Tenminste een user of groups is
verplicht, maar een chat van alleen users, alleen groups of een mix van beide is mogelijk.

Er is een HTTP-endpoint in de `ChatResource` voor `POST /chats` met een body als:

```json
{
  "title": "Mijn chat",
  "members": [
    {
      "type": "user",
      "id": 1
    },
    {
      "type": "group",
      "id": 1
    }
  ]
}
```

De ChatResource zorgt ervoor dat, indien de aanvragende gebruiker niet in de lijst met members zit en ook niet onderdeel
is van de genoemde groepen, deze als individu aan de chat wordt toegevoegd.

## Alle chats ophalen

De chats zijn op te halen met de `ChatService::findAllSorted` en `ChatService::findForUserSorted`-methoden. Deze geeft
_alle_ chats terug (eventueel toegespitst op de user), zonder paginering.

Alternatieve methoden zijn:

- `ChatService::find(ForUser)WithoutSubjectSorted` om alle chats zonder een `ChatSubject` (bijv. `Issue`) op te halen
- `ChatService::find(ForUser)WithSubjectTypeSorted(Class<? extends ChatSubject>)` om alle chats met een bepaald
  `ChatSubject`
  type op te halen.

Alle bovengenoemde methoden geven niet de `ChatEntry`-objecten terug, om het geheugen van de server met een schijntje
respect te behandelen.

## Een individuele chat ophalen

Om wél de `ChatEntry`-objecten te krijgen, moet je een individuele chat ophalen. Dit kan met de `ChatService::findChat`
-methode.

Deze methode neemt de ID van de chat en geeft een chat terug. Om de autorisatie af te werken, kan je ook kiezen om de
`ChatService::findChatForUser`-methode te gebruiken.

Deze methode checkt of de aanvragende gebruiker lid is van de chat. Als dat niet zo is, krijg je een lege Optional
terug.

De afweging tussen beide methoden is voor admins, maar hoe dit in de UI moet worden getoond is niet helemaal duidelijk.
