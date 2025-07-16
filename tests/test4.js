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
 `,
  [[67, 67]],
  67,
  `ta p="$ . $ $" pq:rq>ta p:r pq:rq p="$ . . $">tbta p="v">ta>tbtbtbt`
];