export default [
  `<div i::fetch:embrace="SerSeaEpi.json"> <h2>List of Series</h2> <ol> <li> <h3>Batman The Series is the no. 0 in your play list.</h3> <ul> <li> <h4>Hjelp! Batman is the no. 0 in series Batman The Series.</h4> <ol> <li>episode #0: episode_pilot produced by DC Comics.</li> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> <template if="(#season % 2) === 0"> <ol> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> </template> </li> <li> <h4>Hjelp! Bat2 is the no. 1 in series Batman The Series.</h4> <template if="(#season % 2) === 0"> <ol> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> </template> </li> <li> <h4>Wat will be is the no. 2 in series Batman The Series.</h4> <ol> <li>episode #0: episode_whatever produced by DC Comics.</li> <li>episode #1: episode_whatever-batman-does produced by DC Comics.</li> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> <template if="(#season % 2) === 0"> <ol> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> </template> </li> <li> <h4>Hjelp! Wat! is the no. 3 in series Batman The Series.</h4> <template if="(#season % 2) === 0"> <ol> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> </template> </li> <template for="season of serie.seasons"> <li> <h4>{{season.title}} is the no. {{#season}} in series {{serie.title}}.</h4> <template if="(#season % 2) === 0"> <ol> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> </template> </li> </template> </ul> </li> <template for="serie of series"> <li> <h3>{{serie.title}} is the no. {{#serie}} in your play list.</h3> <ul> <template for="season of serie.seasons"> <li> <h4>{{season.title}} is the no. {{#season}} in series {{serie.title}}.</h4> <template if="(#season % 2) === 0"> <ol> <template for="episode of season.episodes"> <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li> </template> </ol> </template> </li> </template> </ul> </li> </template> </ol> <template></template></div>`,
  `<div i::fetch:embrace="SerSeaEpi.json">
  <h2>List of Series</h2>
  <ol>

    <li>
      <h3>Batman The Series is the no. 0 in your play list.</h3>
      <ul>

        <li>
          <h4>Hjelp! Batman is the no. 0 in series Batman The Series.</h4>

          <ol>

            <li>episode #0: episode_pilot produced by DC Comics.</li>
            <template for="episode of season.episodes">
              <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
            </template>
          </ol>
          <template if="(#season % 2) === 0">
            <ol>
              <template for="episode of season.episodes">
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template>
            </ol>
          </template>
        </li>

        <li>
          <h4>Hjelp! Bat2 is the no. 1 in series Batman The Series.</h4>
          <template if="(#season % 2) === 0">
            <ol>
              <template for="episode of season.episodes">
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template>
            </ol>
          </template>
        </li>

        <li>
          <h4>Wat will be is the no. 2 in series Batman The Series.</h4>

          <ol>

            <li>episode #0: episode_whatever produced by DC Comics.</li>

            <li>episode #1: episode_whatever-batman-does produced by DC Comics.</li>
            <template for="episode of season.episodes">
              <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
            </template>
          </ol>
          <template if="(#season % 2) === 0">
            <ol>
              <template for="episode of season.episodes">
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template>
            </ol>
          </template>
        </li>

        <li>
          <h4>Hjelp! Wat! is the no. 3 in series Batman The Series.</h4>
          <template if="(#season % 2) === 0">
            <ol>
              <template for="episode of season.episodes">
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template>
            </ol>
          </template>
        </li>
        <template for="season of serie.seasons">
          <li>
            <h4>{{season.title}} is the no. {{#season}} in series {{serie.title}}.</h4>
            <template if="(#season % 2) === 0">
              <ol>
                <template for="episode of season.episodes">
                  <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
                </template>
              </ol>
            </template>
          </li>
        </template>
      </ul>
    </li>
    <template for="serie of series">
      <li>
        <h3>{{serie.title}} is the no. {{#serie}} in your play list.</h3>
        <ul>
          <template for="season of serie.seasons">
            <li>
              <h4>{{season.title}} is the no. {{#season}} in series {{serie.title}}.</h4>
              <template if="(#season % 2) === 0">
                <ol>
                  <template for="episode of season.episodes">
                    <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
                  </template>
                </ol>
              </template>
            </li>
          </template>
        </ul>
      </li>
    </template>
  </ol>
  <template></template>
</div>`,
  [
    [39, 39],
    [0, 2],
    [24, 24],
    [0, 2],
    [5, 5],
    [0, 5],
    [5, 5],
    [0, 6],
    [59, 59],
    [0, 6],
    [5, 5],
    [0, 9],
    [5, 5],
    [0, 10],
    [65, 65],
    [0, 11],
    [5, 5],
    [0, 13],
    [58, 58],
    [0, 12],
    [44, 44],
    [0, 14],
    [70, 70],
    [0, 12],
    [12, 12],
    [0, 10],
    [6, 6],
    [0, 10],
    [36, 36],
    [0, 12],
    [5, 5],
    [0, 14],
    [44, 44],
    [0, 16],
    [70, 70],
    [0, 14],
    [12, 12],
    [0, 12],
    [6, 6],
    [0, 10],
    [12, 12],
    [0, 8],
    [6, 6],
    [0, 9],
    [5, 5],
    [0, 10],
    [63, 63],
    [0, 10],
    [36, 36],
    [0, 12],
    [5, 5],
    [0, 14],
    [44, 44],
    [0, 16],
    [70, 70],
    [0, 14],
    [12, 12],
    [0, 12],
    [6, 6],
    [0, 10],
    [12, 12],
    [0, 8],
    [6, 6],
    [0, 9],
    [5, 5],
    [0, 10],
    [63, 63],
    [0, 11],
    [5, 5],
    [0, 13],
    [61, 61],
    [0, 13],
    [73, 73],
    [0, 12],
    [44, 44],
    [0, 14],
    [70, 70],
    [0, 12],
    [12, 12],
    [0, 10],
    [6, 6],
    [0, 10],
    [36, 36],
    [0, 12],
    [5, 5],
    [0, 14],
    [44, 44],
    [0, 16],
    [70, 70],
    [0, 14],
    [12, 12],
    [0, 12],
    [6, 6],
    [0, 10],
    [12, 12],
    [0, 8],
    [6, 6],
    [0, 9],
    [5, 5],
    [0, 10],
    [63, 63],
    [0, 10],
    [36, 36],
    [0, 12],
    [5, 5],
    [0, 14],
    [44, 44],
    [0, 16],
    [70, 70],
    [0, 14],
    [12, 12],
    [0, 12],
    [6, 6],
    [0, 10],
    [12, 12],
    [0, 8],
    [6, 6],
    [0, 8],
    [41, 41],
    [0, 10],
    [5, 5],
    [0, 12],
    [76, 76],
    [0, 12],
    [36, 36],
    [0, 14],
    [5, 5],
    [0, 16],
    [44, 44],
    [0, 18],
    [70, 70],
    [0, 16],
    [12, 12],
    [0, 14],
    [6, 6],
    [0, 12],
    [12, 12],
    [0, 10],
    [6, 6],
    [0, 8],
    [12, 12],
    [0, 6],
    [6, 6],
    [0, 4],
    [6, 6],
    [0, 4],
    [33, 33],
    [0, 6],
    [5, 5],
    [0, 8],
    [66, 66],
    [0, 8],
    [5, 5],
    [0, 10],
    [41, 41],
    [0, 12],
    [5, 5],
    [0, 14],
    [76, 76],
    [0, 14],
    [36, 36],
    [0, 16],
    [5, 5],
    [0, 18],
    [44, 44],
    [0, 20],
    [70, 70],
    [0, 18],
    [12, 12],
    [0, 16],
    [6, 6],
    [0, 14],
    [12, 12],
    [0, 12],
    [6, 6],
    [0, 10],
    [12, 12],
    [0, 8],
    [6, 6],
    [0, 6],
    [6, 6],
    [0, 4],
    [12, 12],
    [0, 2],
    [6, 6],
    [0, 2],
    [22, 22],
    [0, 1],
    [6, 6]
  ]
]