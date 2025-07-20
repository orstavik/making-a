export default [
  `<div template:="" i::fetch:embrace="SerSeaEpi.json">
  <h2>List of Series ("series" is an array? true)</h2>
  <ol>
    <li>
      <h3>Batman The Series is the no. 0 in your play list.</h3>
      <ul>
        <li>
          <h4>Hjelp! Batman is the no. 0 in series Batman The Series.</h4>
          <ol> <!-- { "type": "season", "title": "Hjelp! Batman", "episodes": [ "episode_pilot" ] } -->
            <li>episode #0: episode_pilot produced by DC Comics.</li> <template for="episode of season.episodes">
              <!-- {{JSON.stringify(season, null, 2)}} -->
              <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
            </template>
          </ol> <template if="(#season % 2) === 0">
            <ol> <template for="episode of season.episodes"> <!-- {{JSON.stringify(season, null, 2)}} -->
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template></ol>
          </template>
        </li>
        <li>
          <h4>Hjelp! Bat2 is the no. 1 in series Batman The Series.</h4> <template if="(#season % 2) === 0">
            <ol> <template for="episode of season.episodes"> <!-- {{JSON.stringify(season, null, 2)}} -->
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template></ol>
          </template>
        </li>
        <li>
`, `
<div template:="" i::fetch:embrace="SerSeaEpi.json">
  <h2>List of Series ("series" is an array? true)</h2>
  <ol>
    <li>
      <h3>Batman The Series is the no. 0 in your play list.</h3>
      <ul>
        <li>
          <h4>Hjelp! Batman is the no. 0 in series Batman The Series.</h4>
          <ol> <!-- { "type": "season", "title": "Hjelp! Batman", "episodes": [ "episode_pilot" ] } -->
            <li>episode #0: episode_pilot produced by DC Comics.</li> <template for="episode of season.episodes">
              <!-- {{JSON.stringify(season, null, 2)}} -->
              <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
            </template>
          </ol> <template if="(#season % 2) === 0">
            <ol> <template for="episode of season.episodes"> <!-- {{JSON.stringify(season, null, 2)}} -->
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template></ol>
          </template>
        </li>
        <li>
          <h4>Hjelp! Bat2 is the no. 1 in series Batman The Series.</h4> <template if="(#season % 2) === 0">
            <ol> <template for="episode of season.episodes">
                <!-- {{JSON.stringify(season, null, 2)}} -->
                <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
              </template></ol>
          </template>
        </li>
        <li>
    `,
  [
    "2T\n",
    "0Adiv",
    "0ttemplate",
    "0r",
    "0ti",
    "0r",
    "0rfetch",
    "0rembrace",
    "0vSerSeaEpi.json",
    "0T\n  ",
    "0Ah2",
    "0TList of Series (\"series\" is an array? true)",
    "0Bh2",
    "0T\n  ",
    "0Aol",
    "0T\n    ",
    "0Ali",
    "0T\n      ",
    "0Ah3",
    "0TBatman The Series is the no. 0 in your play list.",
    "0Bh3",
    "0T\n      ",
    "0Aul",
    "0T\n        ",
    "0Ali",
    "0T\n          ",
    "0Ah4",
    "0THjelp! Batman is the no. 0 in series Batman The Series.",
    "0Bh4",
    "0T\n          ",
    "0Aol",
    "0T ",
    "0C { \"type\": \"season\", \"title\": \"Hjelp! Batman\", \"episodes\": [ \"episode_pilot\" ] } ",
    "0T\n            ",
    "0Ali",
    "0Tepisode #0: episode_pilot produced by DC Comics.",
    "0Bli",
    "0T ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "0T\n              ",
    "0C {{JSON.stringify(season, null, 2)}} ",
    "0T\n              ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "0T\n            ",
    "0Btemplate",
    "0T\n          ",
    "0Bol",
    "0T ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "0T\n            ",
    "0Aol",
    "0T ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "0T ",
    "0C {{JSON.stringify(season, null, 2)}} ",
    "0T\n                ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "0T\n              ",
    "0Btemplate",
    "0Bol",
    "0T\n          ",
    "0Btemplate",
    "0T\n        ",
    "0Bli",
    "0T\n        ",
    "0Ali",
    "0T\n          ",
    "0Ah4",
    "0THjelp! Bat2 is the no. 1 in series Batman The Series.",
    "0Bh4",
    "0T ",
    "0Atemplate",
    "0tif",
    "0v(#season % 2) === 0",
    "0T\n            ",
    "0Aol",
    "0T ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "1T ",
    "2T\n                ",
    "0C {{JSON.stringify(season, null, 2)}} ",
    "0T\n                ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "0T\n              ",
    "0Btemplate",
    "0Bol",
    "0T\n          ",
    "0Btemplate",
    "0T\n        ",
    "0Bli",
    "0T\n        ",
    "0Ali",
    "1T\n",
    "2T\n    "
  ]
];