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
  [[0, 1], [135, 135], [1, 0], [0, 1], [16, 16], [1, 0], [0, 1]]
  // [[0, 1], [1166, 1166], [0, 16], [212, 212], [0, 4]]
];