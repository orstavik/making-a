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
  [[39, 39], [1, 0], [0, 3], [23, 23], [1, 0], [0, 3], [4, 4], [1, 0], [0, 6], [4, 4], [1, 0], [0, 7], [58, 58], [1, 0], [0, 7], [4, 4], [1, 0], [0, 10], [4, 4], [1, 0], [0, 11], [64, 64], [1, 0], [0, 12], [4, 4], [1, 0], [0, 14], [57, 57], [1, 0], [0, 13], [43, 43], [1, 0], [0, 15], [69, 69], [1, 0], [0, 13], [11, 11], [1, 0], [0, 11], [5, 5], [1, 0], [0, 11], [35, 35], [1, 0], [0, 13], [4, 4], [1, 0], [0, 15], [43, 43], [1, 0], [0, 17], [69, 69], [1, 0], [0, 15], [11, 11], [1, 0], [0, 13], [5, 5], [1, 0], [0, 11], [11, 11], [1, 0], [0, 9], [5, 5], [1, 0], [0, 10], [4, 4], [1, 0], [0, 11], [62, 62], [1, 0], [0, 11], [35, 35], [1, 0], [0, 13], [4, 4], [1, 0], [0, 15], [43, 43], [1, 0], [0, 17], [69, 69], [1, 0], [0, 15], [11, 11], [1, 0], [0, 13], [5, 5], [1, 0], [0, 11], [11, 11], [1, 0], [0, 9], [5, 5], [1, 0], [0, 10], [4, 4], [1, 0], [0, 11], [62, 62], [1, 0], [0, 12], [4, 4], [1, 0], [0, 14], [60, 60], [1, 0], [0, 14], [72, 72], [1, 0], [0, 13], [43, 43], [1, 0], [0, 15], [69, 69], [1, 0], [0, 13], [11, 11], [1, 0], [0, 11], [5, 5], [1, 0], [0, 11], [35, 35], [1, 0], [0, 13], [4, 4], [1, 0], [0, 15], [43, 43], [1, 0], [0, 17], [69, 69], [1, 0], [0, 15], [11, 11], [1, 0], [0, 13], [5, 5], [1, 0], [0, 11], [11, 11], [1, 0], [0, 9], [5, 5], [1, 0], [0, 10], [4, 4], [1, 0], [0, 11], [62, 62], [1, 0], [0, 11], [35, 35], [1, 0], [0, 13], [4, 4], [1, 0], [0, 15], [43, 43], [1, 0], [0, 17], [69, 69], [1, 0], [0, 15], [11, 11], [1, 0], [0, 13], [5, 5], [1, 0], [0, 11], [11, 11], [1, 0], [0, 9], [5, 5], [1, 0], [0, 9], [40, 40], [1, 0], [0, 11], [4, 4], [1, 0], [0, 13], [75, 75], [1, 0], [0, 13], [35, 35], [1, 0], [0, 15], [4, 4], [1, 0], [0, 17], [43, 43], [1, 0], [0, 19], [69, 69], [1, 0], [0, 17], [11, 11], [1, 0], [0, 15], [5, 5], [1, 0], [0, 13], [11, 11], [1, 0], [0, 11], [5, 5], [1, 0], [0, 9], [11, 11], [1, 0], [0, 7], [5, 5], [1, 0], [0, 5], [5, 5], [1, 0], [0, 5], [32, 32], [1, 0], [0, 7], [4, 4], [1, 0], [0, 9], [65, 65], [1, 0], [0, 9], [4, 4], [1, 0], [0, 11], [40, 40], [1, 0], [0, 13], [4, 4], [1, 0], [0, 15], [75, 75], [1, 0], [0, 15], [35, 35], [1, 0], [0, 17], [4, 4], [1, 0], [0, 19], [43, 43], [1, 0], [0, 21], [69, 69], [1, 0], [0, 19], [11, 11], [1, 0], [0, 17], [5, 5], [1, 0], [0, 15], [11, 11], [1, 0], [0, 13], [5, 5], [1, 0], [0, 11], [11, 11], [1, 0], [0, 9], [5, 5], [1, 0], [0, 7], [5, 5], [1, 0], [0, 5], [11, 11], [1, 0], [0, 3], [5, 5], [28, 0], [0, 31]]
]