# wafs
The course repo for 'Web App From Scratch'

## Advantages and disadvantages of JavaScript libraries/frameworks
Voordelen:
- Minder code om te schrijven
- Sneller te schrijven, dus minder kosten
- Er is een hele community die ervoor zorgt dat de library of het framework verbetert (support team, forums)
- Code is beter leesbaar 
- Je hoeft meestal niet na te denken over browser compatibility, omdat dat ingebouwd zit
- Veiliger dan alles zelf schrijven.

Er tussenin:
- Omdat er zoveel mensen aan werken is de kans op bugs kleiner en worden deze snel verholpen. Tegelijkertijd neem je ook eventuele bugs mee en dit kan zorgen voor security flaws, - zeker omdat de code opensource is en door kwaadwillende bestudeerd kan worden.

Nadelen:
- Je wordt soms beperkt door de mogelijkheden van het framework/de library.
- Je leert niet hoe de achterliggende taal echt werkt.
- Frameworks en libraries missen vaak de specifieke functionaliteit waar een groot project om vraagt.
- Performance, je laadt vaak veel functionaliteit in die je niet nodig hebt.
- Vaak nieuwe dingen om te leren als het framework zichzelf update.
- Afhankelijk van andere mensen


## Advantages and disadvantages of client-side single page web apps
Voordelen:
- Betere user experience omdat je de pagina maar 1 keer laadt.
- Snel in gebruik, omdat de meeste resources maar 1 keer worden geladen.
- Back-end en front-end kunnen los van elkaar staan.
- Het is makkelijker om een mobiele app te maken omdat de backend code herbruikbaar is.

Nadelen:
- SEO is moeilijker te implementeren.
- Slechte performance, zwaar voor een browser, dus zal op mobiel minder goed werken.
- Zware client frameworks zijn benodigd om de app te laden.
- Onveilig wegens gebruik van XSS.
- Naarmate je meer content op je site krijgt wordt de site steeds langzamer en een minder goede keuze (bijv. webshops)
- JavaScript nodig om te laden dus slechte toegankelijkheid
- Analytics tools zijn normaal gesproken bedoeld voor meerdere pagina’s.


## Best practices
- Don't use global variables/objects
- Declare variables at top of scope
- Use short clear meaningful names (English)
- Work in strict mode
- camelCase your code if(code != Constructor || CONSTANTS)
- Place external scripts at the bottom of the page
- Indent your code
- Commit often, push once
