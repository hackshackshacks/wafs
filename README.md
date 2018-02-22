# Web App From Scratch (wafs)
This is my first attempt at a single page web app. I've recreated the well known 'Who is this Pokemon?' game.

## What does it do?
### Game
On the home page you can play the 'who is' game. A Pokemon outline appears and you try to guess it's name within 10 seconds. If you succeed, the Pokemon is added to your Pokedex. You can switch between the first three generations of Pokemon using the navigation menu.

### Pokedex
On the Pokedex page you can view all Pokemons. All Pokemons, except the ones you already found, are just outlines. Just like on the 'game' page you can switch between generations using the menu. If you click a discovered Pokemon you go to the Pokemon detail page.

### Pokemon detail
On this page you can view details about the selected Pokemon. At this point the details include name, height, weight and types.

## How does it work?
### Actor diagram
![Actor Diagram](/github_images/actor-diagram.png)



### Interaction diagram
#### Core
![Actor Diagram](/github_images/interaction_1.png)



#### Game
![Actor Diagram](/github_images/interaction_2.png)



#### Pokedex
![Actor Diagram](/github_images/interaction_3.png)



#### Detail
![Actor Diagram](/github_images/interaction_4.png)



## Api
This app uses the [pokeApi](https://pokeapi.co/) API. The API isn't as fast as I would like it to be. The rate limit is 300 requests per day per IP address.

## Features
- Who is this Pokemon game
- Pokedex
- Details of discovered Pokemon
- Multiple and easily expandable Pokemon generations

## Programming principles & best practices
- Don't use global variables/objects
- Declare variables at top of scope
- Use short clear meaningful names (English)
- camelCase your code
- Place external scripts at the bottom of the page
- Indent your code using 2 spaces
- Commit often, push once
- I've used Javascript Standard Style to format my code

## Wishlist
- Get score from amount of discovered Pokemon instead of seperate variable.
- More meaningful details on the Pokemon detail page.
- Possibly get random Pokemons in the game based on the undiscovered Pokemons