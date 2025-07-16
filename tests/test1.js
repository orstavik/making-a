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
    [12, 12],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [2, 2],
    [1, 0],
    [0, 1],
    [8, 8],
    [1, 0],
    [0, 1],
    [4, 4],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 1],
    [3, 3],
    [0, 1],
    [1, 1]
  ],
  399,
  `a p:r:r="v">ta>tbta>ta>ta>tbta>ta>ta>tbta>ta>tbta p="v">ta>tbtbtbta p="v">ta>ta p="v">ta>tbtbtbtbtbta>ta>tbta p="v">ta>ta p="v">ta>tbtbtbtbtbta>ta>tbta>ta>tbta>tbta p="v">ta>tbtbtbta p="v">ta>ta p="v">ta>tbtbtbtbtbta>ta>tbta p="v">ta>ta p="v">ta>tbtbtbtbtbta p="v">ta>ta>tbta p="v">ta>ta p="v">ta>tbtbtbtbtbtbtbtbta p="v">ta>ta>tbta>ta p="v">ta>ta>tbta p="v">ta>ta p="v">ta>tbtbtbtbtbtbtbtbtbtbta>bb`
]