---
title: "Reviewing AI‑Written Code"
description: "What I look for beyond a passing test."
category: "Note"
topic: "IN THE MARGIN"
minutes: 3
order: 1
featured: true
draft: false
---

<p class="margin-intro">Margin notes alongside a longer piece written for the Uno Platform blog. The questions I want to keep nearby.</p>

“It works.”

I keep coming back to how much that sentence leaves out.

The build ran. A test passed. The screen looked right. All useful. But I can slide from one of those statements into a much larger claim without noticing.

Especially when the explanation sounds finished.

### A check has edges

I want to get better at asking where they are.

A test can tell me that a rule behaves as expected. It cannot tell me whether I asked for the right rule. Or whether the words on the screen still describe it.

<figure class="article-study" data-margin-motion>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="study-01" xmlns="http://www.w3.org/2000/svg"><title id="study-01">A passing test covers one case, not the whole feature.</title>
<g fill="none" stroke="#e1e6ed"><path d="M24 64H616M24 272H616"/></g>
<text class="study-meta" x="24" y="36">FIELD NOTE / 01</text>
<g class="motion-layer" style="--order:0"><rect x="24" y="88" width="592" height="160" rx="4" fill="none" stroke="#becbd9" stroke-dasharray="4 5"/><text class="study-meta" x="42" y="116">THE FEATURE</text></g><g class="motion-layer" style="--order:1"><rect x="48" y="140" width="206" height="82" rx="3" fill="#f4f7fb" stroke="#becbd9"/><text class="study-label" x="68" y="174">This case passes</text><text class="study-meta" x="68" y="198">OBSERVED</text></g><g class="motion-layer" style="--order:2"><text class="study-label" x="372" y="164">Other inputs?</text><text class="study-label" x="372" y="197">The right rule?</text></g>
<g fill="none" stroke="#becbd9" stroke-width="1.5"><path class="question-path" d="M68 209H232"/><path class="question-path" d="M254 165H306L340 158H358"/><path class="question-path" d="M254 198H358"/></g>
<g class="story-ink" fill="none" stroke="#52759a" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path class="story-path" pathLength="1" d="M68 209H232"/><path class="story-path" pathLength="1" d="M254 165H306L340 158H358"/><path class="story-path" pathLength="1" d="M254 198H358"/></g>
<circle class="story-marker" r="4" fill="#52759a" opacity="0" aria-hidden="true"/>
</svg>
<figcaption class="motion-caption"><span>A passing check has a boundary.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

With AI, I can get an implementation and a convincing explanation in the same sitting. That is useful. It also makes them feel like two pieces of evidence when they might just be the same assumption, said twice.

Something to watch for: am I checking the work, or agreeing with the account of the work?

### Try the next small request

“Is this maintainable?” feels too large to answer honestly.

Try a smaller question. If the rule changes tomorrow, where would I start?

One place? A few places for good reasons? A sentence copied into a screen that I will probably forget?

I like this question because it makes me look at the actual work. I have to follow the rule through the project instead of admiring the structure from a distance.

<figure class="article-study" data-margin-motion>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="study-02" xmlns="http://www.w3.org/2000/svg"><title id="study-02">One rule change needs to be followed through the logic, tests, and words on screen.</title>
<g fill="none" stroke="#e1e6ed"><path d="M24 64H616M24 272H616"/></g>
<text class="study-meta" x="24" y="36">FIELD NOTE / 02</text>
<g class="motion-layer" style="--order:0"><text class="study-label" x="24" y="105">Change one rule</text><text class="study-meta" x="24" y="127">WHERE DOES IT REACH?</text></g><g class="motion-layer" style="--order:1"><rect x="24" y="168" width="160" height="68" rx="3" fill="none" stroke="#becbd9"/><text class="study-label" x="44" y="198">Logic</text><text class="study-meta" x="44" y="218">IMPLEMENTATION</text></g><g class="motion-layer" style="--order:2"><rect x="240" y="168" width="160" height="68" rx="3" fill="none" stroke="#becbd9"/><text class="study-label" x="260" y="198">Tests</text><text class="study-meta" x="260" y="218">EXPECTATIONS</text></g><g class="motion-layer" style="--order:3"><rect x="456" y="168" width="160" height="68" rx="3" fill="none" stroke="#becbd9"/><text class="study-label" x="476" y="198">Screen copy</text><text class="study-meta" x="476" y="218">EXPLANATION</text></g>
<g fill="none" stroke="#becbd9" stroke-width="1.5"><path class="question-path" d="M104 136V160"/><path class="question-path" d="M184 202H232"/><path class="question-path" d="M400 202H448"/></g>
<g class="story-ink" fill="none" stroke="#52759a" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path class="story-path" pathLength="1" d="M104 136V160"/><path class="story-path" pathLength="1" d="M184 202H232"/><path class="story-path" pathLength="1" d="M400 202H448"/></g>
<circle class="story-marker" r="4" fill="#52759a" opacity="0" aria-hidden="true"/>
</svg>
<figcaption class="motion-caption"><span>Follow the change all the way to the words on screen.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

And then: what would tell me I missed a place?

That last part is easy to leave out.

### Leave the unfinished part visible

A useful handoff might be very short:

<blockquote><p>Checked this path.<br>Couldn’t check that one.<br>This decision still needs a person.</p></blockquote>

Less satisfying than a tidy “done.” More useful when I return to the work.

I don’t want every change to arrive with a wall of evidence. I want the claim to fit what actually happened. If something couldn’t run, that belongs beside the result, not buried after the summary.

There is a difference between an unfinished feature and an unfinished check. I need to be able to see which one I’m looking at.

<figure class="article-study" data-margin-motion>
<svg viewBox="0 0 640 320" role="img" aria-labelledby="study-03" xmlns="http://www.w3.org/2000/svg"><title id="study-03">A handoff separates checked work, unchecked work, and decisions still needed.</title>
<g fill="none" stroke="#e1e6ed"><path d="M24 64H616M24 272H616"/></g>
<text class="study-meta" x="24" y="36">FIELD NOTE / 03</text>
<g class="motion-layer" style="--order:0"><text class="study-meta" x="24" y="99">HANDOFF</text><path d="M24 114H616" fill="none" stroke="#e1e6ed"/></g><g class="motion-layer" style="--order:1"><text class="study-label" x="24" y="151">Checked</text><text class="study-meta" x="390" y="151">THE PATH I RAN</text></g><g class="motion-layer" style="--order:2"><text class="study-label" x="24" y="199">Unchecked</text><text class="study-meta" x="390" y="199">THE PATH I COULDN’T RUN</text></g><g class="motion-layer" style="--order:3"><text class="study-label" x="24" y="247">Needs a decision</text><text class="study-meta" x="390" y="247">THE QUESTION STILL OPEN</text></g>
<g fill="none" stroke="#becbd9" stroke-width="1.5"><path class="question-path" d="M210 146H366"/><path class="question-path" d="M210 194H366"/><path class="question-path" d="M210 242H366"/></g>
<g class="story-ink" fill="none" stroke="#52759a" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path class="story-path" pathLength="1" d="M210 146H366"/><path class="story-path" pathLength="1" d="M210 194H366"/><path class="story-path" pathLength="1" d="M210 242H366"/></g>
<circle class="story-marker" r="4" fill="#52759a" opacity="0" aria-hidden="true"/>
</svg>
<figcaption class="motion-caption"><span>Make the limit of the evidence visible.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

### Don’t let the checks become the project

The uncomfortable part: I can overbuild the review process too.

A rule catches a mistake, so I add another. Then another. Eventually I’m managing the interruptions instead of looking at the code.

A reminder to myself: a check has to keep earning its place. If I routinely dismiss it, either the check is wrong or I have stopped paying attention. Neither is a good steady state.

<aside class="margin-note"><span>Still open</span><p>Which checks change a decision? Which ones just make the report longer?</p></aside>

For now, three questions to leave beside the green check:

- What does this result actually establish?
- What will the next small change cost?
- What am I still taking on trust?

Not a score. Just somewhere to start looking again.
