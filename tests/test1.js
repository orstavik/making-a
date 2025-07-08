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
    [39, 39], [0, 1], [1, 1], [0, 1], [23, 23], [0, 1], [1, 1], [0, 1], [4, 4], [0, 2], [1, 1], [0, 3], [4, 4], [0, 1], [1, 1], [0, 5], [58, 58], [0, 1], [1, 1], [0, 5], [4, 4], [0, 2], [1, 1], [0, 7], [4, 4], [0, 1], [1, 1], [0, 9], [64, 64], [0, 2], [1, 1], [0, 9], [4, 4], [0, 2], [1, 1], [0, 11], [57, 57], [0, 1], [1, 1], [0, 11], [43, 43], [0, 1], [1, 1], [0, 13], [69, 69], [0, 1], [1, 1], [0, 11], [11, 11], [0, 1], [1, 1], [0, 9], [5, 5], [0, 1], [1, 1], [0, 9], [35, 35], [0, 1], [1, 1], [0, 11], [4, 4], [0, 1], [1, 1], [0, 13], [43, 43], [0, 1], [1, 1], [0, 15], [69, 69], [0, 1], [1, 1], [0, 13], [11, 11], [0, 1], [1, 1], [0, 11], [5, 5], [0, 1], [1, 1], [0, 9], [11, 11], [0, 1], [1, 1], [0, 7], [5, 5], [0, 2], [1, 1], [0, 7], [4, 4], [0, 1], [1, 1], [0, 9], [62, 62], [0, 1], [1, 1], [0, 9], [35, 35], [0, 1], [1, 1], [0, 11], [4, 4], [0, 1], [1, 1], [0, 13], [43, 43], [0, 1], [1, 1], [0, 15], [69, 69], [0, 1], [1, 1], [0, 13], [11, 11], [0, 1], [1, 1], [0, 11], [5, 5], [0, 1], [1, 1], [0, 9], [11, 11], [0, 1], [1, 1], [0, 7], [5, 5], [0, 2], [1, 1], [0, 7], [4, 4], [0, 1], [1, 1], [0, 9], [62, 62], [0, 2], [1, 1], [0, 9], [4, 4], [0, 2], [1, 1], [0, 11], [60, 60], [0, 2], [1, 1], [0, 11], [72, 72], [0, 1], [1, 1], [0, 11], [43, 43], [0, 1], [1, 1], [0, 13], [69, 69], [0, 1], [1, 1], [0, 11], [11, 11], [0, 1], [1, 1], [0, 9], [5, 5], [0, 1], [1, 1], [0, 9], [35, 35], [0, 1], [1, 1], [0, 11], [4, 4], [0, 1], [1, 1], [0, 13], [43, 43], [0, 1], [1, 1], [0, 15], [69, 69], [0, 1], [1, 1], [0, 13], [11, 11], [0, 1], [1, 1], [0, 11], [5, 5], [0, 1], [1, 1], [0, 9], [11, 11], [0, 1], [1, 1], [0, 7], [5, 5], [0, 2], [1, 1], [0, 7], [4, 4], [0, 1], [1, 1], [0, 9], [62, 62], [0, 1], [1, 1], [0, 9], [35, 35], [0, 1], [1, 1], [0, 11], [4, 4], [0, 1], [1, 1], [0, 13], [43, 43], [0, 1], [1, 1], [0, 15], [69, 69], [0, 1], [1, 1], [0, 13], [11, 11], [0, 1], [1, 1], [0, 11], [5, 5], [0, 1], [1, 1], [0, 9], [11, 11], [0, 1], [1, 1], [0, 7], [5, 5], [0, 1], [1, 1], [0, 7], [40, 40], [0, 1], [1, 1], [0, 9], [4, 4], [0, 1], [1, 1], [0, 11], [75, 75], [0, 1], [1, 1], [0, 11], [35, 35], [0, 1], [1, 1], [0, 13], [4, 4], [0, 1], [1, 1], [0, 15], [43, 43], [0, 1], [1, 1], [0, 17], [69, 69], [0, 1], [1, 1], [0, 15], [11, 11], [0, 1], [1, 1], [0, 13], [5, 5], [0, 1], [1, 1], [0, 11], [11, 11], [0, 1], [1, 1], [0, 9], [5, 5], [0, 1], [1, 1], [0, 7], [11, 11], [0, 1], [1, 1], [0, 5], [5, 5], [0, 1], [1, 1], [0, 3], [5, 5], [0, 1], [1, 1], [0, 3], [32, 32], [0, 1], [1, 1], [0, 5], [4, 4], [0, 1], [1, 1], [0, 7], [65, 65], [0, 1], [1, 1], [0, 7], [4, 4], [0, 1], [1, 1], [0, 9], [40, 40], [0, 1], [1, 1], [0, 11], [4, 4], [0, 1], [1, 1], [0, 13], [75, 75], [0, 1], [1, 1], [0, 13], [35, 35], [0, 1], [1, 1], [0, 15], [4, 4], [0, 1], [1, 1], [0, 17], [43, 43], [0, 1], [1, 1], [0, 19], [69, 69], [0, 1], [1, 1], [0, 17], [11, 11], [0, 1], [1, 1], [0, 15], [5, 5], [0, 1], [1, 1], [0, 13], [11, 11], [0, 1], [1, 1], [0, 11], [5, 5], [0, 1], [1, 1], [0, 9], [11, 11], [0, 1], [1, 1], [0, 7], [5, 5], [0, 1], [1, 1], [0, 5], [5, 5], [0, 1], [1, 1], [0, 3], [11, 11], [0, 1], [1, 1], [0, 1], [5, 5], [0, 2], [22, 22], [0, 1], [6, 6]
  ]
]