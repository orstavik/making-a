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
    "0Adiv",
    "0ti",
    "0r",
    "0rfetch",
    "0rembrace",
    "0vSerSeaEpi.json",
    "1T ",
    "2T\n  ",
    "0Ah2",
    "0TList of Series",
    "0Bh2",
    "1T ",
    "2T\n  ",
    "0Aol",
    "1T ",
    "2T\n\n    ",
    "0Ali",
    "1T ",
    "2T\n      ",
    "0Ah3",
    "0TBatman The Series is the no. 0 in your play list.",
    "0Bh3",
    "1T ",
    "2T\n      ",
    "0Aul",
    "1T ",
    "2T\n\n        ",
    "0Ali",
    "1T ",
    "2T\n          ",
    "0Ah4",
    "0THjelp! Batman is the no. 0 in series Batman The Series.",
    "0Bh4",
    "1T ",
    "2T\n\n          ",
    "0Aol",
    "1T ",
    "2T\n\n            ",
    "0Ali",
    "0Tepisode #0: episode_pilot produced by DC Comics.",
    "0Bli",
    "1T ",
    "2T\n            ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n              ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n            ",
    "0Btemplate",
    "1T ",
    "2T\n          ",
    "0Bol",
    "1T ",
    "2T\n          ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "1T ",
    "2T\n            ",
    "0Aol",
    "1T ",
    "2T\n              ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n              ",
    "0Btemplate",
    "1T ",
    "2T\n            ",
    "0Bol",
    "1T ",
    "2T\n          ",
    "0Btemplate",
    "1T ",
    "2T\n        ",
    "0Bli",
    "1T ",
    "2T\n\n        ",
    "0Ali",
    "1T ",
    "2T\n          ",
    "0Ah4",
    "0THjelp! Bat2 is the no. 1 in series Batman The Series.",
    "0Bh4",
    "1T ",
    "2T\n          ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "1T ",
    "2T\n            ",
    "0Aol",
    "1T ",
    "2T\n              ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n              ",
    "0Btemplate",
    "1T ",
    "2T\n            ",
    "0Bol",
    "1T ",
    "2T\n          ",
    "0Btemplate",
    "1T ",
    "2T\n        ",
    "0Bli",
    "1T ",
    "2T\n\n        ",
    "0Ali",
    "1T ",
    "2T\n          ",
    "0Ah4",
    "0TWat will be is the no. 2 in series Batman The Series.",
    "0Bh4",
    "1T ",
    "2T\n\n          ",
    "0Aol",
    "1T ",
    "2T\n\n            ",
    "0Ali",
    "0Tepisode #0: episode_whatever produced by DC Comics.",
    "0Bli",
    "1T ",
    "2T\n\n            ",
    "0Ali",
    "0Tepisode #1: episode_whatever-batman-does produced by DC Comics.",
    "0Bli",
    "1T ",
    "2T\n            ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n              ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n            ",
    "0Btemplate",
    "1T ",
    "2T\n          ",
    "0Bol",
    "1T ",
    "2T\n          ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "1T ",
    "2T\n            ",
    "0Aol",
    "1T ",
    "2T\n              ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n              ",
    "0Btemplate",
    "1T ",
    "2T\n            ",
    "0Bol",
    "1T ",
    "2T\n          ",
    "0Btemplate",
    "1T ",
    "2T\n        ",
    "0Bli",
    "1T ",
    "2T\n\n        ",
    "0Ali",
    "1T ",
    "2T\n          ",
    "0Ah4",
    "0THjelp! Wat! is the no. 3 in series Batman The Series.",
    "0Bh4",
    "1T ",
    "2T\n          ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "1T ",
    "2T\n            ",
    "0Aol",
    "1T ",
    "2T\n              ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n              ",
    "0Btemplate",
    "1T ",
    "2T\n            ",
    "0Bol",
    "1T ",
    "2T\n          ",
    "0Btemplate",
    "1T ",
    "2T\n        ",
    "0Bli",
    "1T ",
    "2T\n        ",
    "0Atemplate",
    "0tfor",
    "0vseason of serie.seasons",
    "1T ",
    "2T\n          ",
    "0Ali",
    "1T ",
    "2T\n            ",
    "0Ah4",
    "0T{{season.title}} is the no. {{#season}} in series {{serie.title}}.",
    "0Bh4",
    "1T ",
    "2T\n            ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "1T ",
    "2T\n              ",
    "0Aol",
    "1T ",
    "2T\n                ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                  ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n                ",
    "0Btemplate",
    "1T ",
    "2T\n              ",
    "0Bol",
    "1T ",
    "2T\n            ",
    "0Btemplate",
    "1T ",
    "2T\n          ",
    "0Bli",
    "1T ",
    "2T\n        ",
    "0Btemplate",
    "1T ",
    "2T\n      ",
    "0Bul",
    "1T ",
    "2T\n    ",
    "0Bli",
    "1T ",
    "2T\n    ",
    "0Atemplate",
    "0tfor",
    "0vserie of series",
    "1T ",
    "2T\n      ",
    "0Ali",
    "1T ",
    "2T\n        ",
    "0Ah3",
    "0T{{serie.title}} is the no. {{#serie}} in your play list.",
    "0Bh3",
    "1T ",
    "2T\n        ",
    "0Aul",
    "1T ",
    "2T\n          ",
    "0Atemplate",
    "0tfor",
    "0vseason of serie.seasons",
    "1T ",
    "2T\n            ",
    "0Ali",
    "1T ",
    "2T\n              ",
    "0Ah4",
    "0T{{season.title}} is the no. {{#season}} in series {{serie.title}}.",
    "0Bh4",
    "1T ",
    "2T\n              ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "1T ",
    "2T\n                ",
    "0Aol",
    "1T ",
    "2T\n                  ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                    ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "1T ",
    "2T\n                  ",
    "0Btemplate",
    "1T ",
    "2T\n                ",
    "0Bol",
    "1T ",
    "2T\n              ",
    "0Btemplate",
    "1T ",
    "2T\n            ",
    "0Bli",
    "1T ",
    "2T\n          ",
    "0Btemplate",
    "1T ",
    "2T\n        ",
    "0Bul",
    "1T ",
    "2T\n      ",
    "0Bli",
    "1T ",
    "2T\n    ",
    "0Btemplate",
    "1T ",
    "2T\n  ",
    "0Bol",
    "1T ",
    "2T\n  ",
    "0Atemplate",
    "0Btemplate",
    "2T\n",
    "0Bdiv"
  ]
]