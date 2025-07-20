export default [
  `
<ol class="$short normal $other $bob" 
    portal-something:reaction_bob 
>
            <li
    other:portal 
    alice.hello:sun.shine
    class="$short(something) normal jojo $bob"
>episode #0: episode_pilot produced by DC Comics.</li>
            <template for="episode of season.episodes">
              <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
            </template>
          </ol>
          <img src="https://example.com/image.jpg" alt="An example image" class="example-image"/>
 `,
  `
<ol class="$short normal $other $bob" 
    portal-something:reaction_bob 
>
            <li
    other:portal 
    alice.hello:sun.shine
    class="$short(something) normal jojo $bob"
>episode #0: episode_pilot produced by DC Comics.</li>
            <template for="episode of season.episodes">
              <li>episode #{{#episode}}: {{episode}} produced by {{producer}}.</li>
            </template>
          </ol>
          <img src="https://example.com/image.jpg" alt="An example image" class="example-image"/>
 `,
  [
    "0T\n",
    "0Aol",
    "0tclass",
    "0c$short",
    "0cnormal",
    "0c$other",
    "0c$bob",
    "0tportal-something",
    "0rreaction_bob",
    "0T\n            ",
    "0Ali",
    "0tother",
    "0rportal",
    "0talice.hello",
    "0rsun.shine",
    "0tclass",
    "0c$short(something)",
    "0cnormal",
    "0cjojo",
    "0c$bob",
    "0Tepisode #0: episode_pilot produced by DC Comics.",
    "0Bli",
    "0T\n            ",
    "0Atemplate",
    "0tfor",
    "0vepisode of season.episodes",
    "0T\n              ",
    "0Ali",
    "0Tepisode #{{#episode}}: {{episode}} produced by {{producer}}.",
    "0Bli",
    "0T\n            ",
    "0Btemplate",
    "0T\n          ",
    "0Bol",
    "0T\n          ",
    "0Aimg",
    "0tsrc",
    "0vhttps://example.com/image.jpg",
    "0talt",
    "0vAn example image",
    "0tclass",
    "0cexample-image",
    "0T\n "
  ]
];