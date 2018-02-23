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
The following diagrams provide insight into the flow of my application. 
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
- Possibly get random Pokemons in the game based on the undiscovered Pokemons.
- Filter the Pokedex based on discovered Pokemons.
- Disable searching for undiscovered Pokemons.

## Sources
- [Routie](http://projects.jga.me/routie/)
- [pokeApi](https://pokeapi.co/)

## License
Copyright 2018

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.