---
title: "The rules, checks, and lessons that help me build"
description: "Working notes on agent rules, UI behavior, change cost, and the evidence behind done."
category: "Note"
topic: "IN THE MARGIN"
minutes: 8
order: 1
featured: true
draft: false
---

<p class="margin-intro">Margin notes alongside a longer piece written for the Uno Platform blog. The decisions, mistakes, and checks I want to keep nearby while building.</p>

“It works.”

I keep coming back to how much that sentence leaves out.

The build ran. A test passed. The screen looked right. All useful. But I can slide from one of those statements into a much larger claim without noticing.

Especially when the explanation sounds finished.

But this starts before review. Giving an agent a feature also gives it decisions: where the logic belongs, which existing service to use, what an error looks like, what counts as finished. The rules I keep are attempts to make those decisions less accidental.

I have been turning recurring mistakes into rules and skills for my Uno Platform work. The useful part is remembering what each one is there to catch.

### Before the first edit

<aside class="editorial-sidenote"><span>01 / Before code</span><p>An unresolved question is cheaper to fix before it becomes an implementation.</p></aside>

A Save button is a useful place to start. The normal path is obvious: enter something, save it, see a confirmation. The decisions around it are less obvious.

What survives a failed request? What happens on a second click? Does retry repeat the operation safely? If there is a calculation, who has decided the rounding and discount rules?

That is the job I give `uno-write-spec`. Anything the agent would otherwise guess goes into **Unresolved Questions**. I want to settle those before the guess becomes code, tests, and a confident explanation.

Then the repository: read `HANDOFF.md`, check the Git state, read the spec. Find the save service that already exists. Look at Uno Toolkit and Uno Extensions before making another control, helper, or dependency.

A small note to myself: the fastest-looking first edit can create a lot of work if it starts from the wrong understanding.

### The UI is part of the behavior

<aside class="editorial-sidenote"><span>02 / State matters</span><p>Loading, empty, error, recovery. The transitions belong to the feature too.</p></aside>

Loading, empty, error, and recovery states belong in the feature. `uno-component-states` makes me name them. A failed save should keep the user's input. Retry needs to work when I actually press it.

I use `uno-break-it` to give a separate QA agent awkward things to try: navigate away during a load, fire navigation twice, spam a toggle, force an error, let an old response arrive after a newer one. Findings come back with severity and screenshots.

These are useful because a screen can look complete while the transitions between states are still wrong. The UI and the logic have to agree about what happened.

Authorization is still a gap I review myself. The service needs to decide whether a user can perform the operation. My skills do not check that yet. The architecture notes also need to say what gets logged, so sensitive data does not quietly become debug output.

### A check has edges

I want to get better at asking where they are.

A test can tell me that a rule behaves as expected. It cannot tell me whether I asked for the right rule. Or whether the words on the screen still describe it.

<figure class="article-study thought-study" data-margin-motion>
<div class="thought-sheet"><img src="/personal-notes/assets/checks-note.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="A passing result leads to a magnifying glass, awkward cases and another check." />
<svg class="thought-traces" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="none"><path class="question-path" d="M429 171Q498 100 570 155"/><path class="question-path" d="M330 476Q433 544 565 483"/><path class="question-path" d="M977 668Q1090 608 1143 727"/></g><g class="story-ink" fill="none" stroke="#163bce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path class="story-path" pathLength="1" d="M429 171Q498 100 570 155"/><path class="story-path" pathLength="1" d="M330 476Q433 544 565 483"/><path class="story-path" pathLength="1" d="M977 668Q1090 608 1143 727"/></g><circle class="story-marker" r="3" fill="#163bce" opacity="0"/></svg></div>
<figcaption class="motion-caption"><span>Try it. Then try the awkward case.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

With AI, I can get an implementation and a convincing explanation in the same sitting. That is useful. It also makes them feel like two pieces of evidence when they might just be the same assumption, said twice.

Something to watch for: am I checking the work, or agreeing with the account of the work?

If the agent assumes discounts happen before tax, then writes the implementation and expected test results from that assumption, both can agree and still be wrong. I need the expected result to come from the requirement we agreed on.

For UI work, `uno-verify` exercises the running Debug app through Uno's automation server. It invokes controls and reads the visual tree and `DataContext` after an action. I want to know that the saved state changed, not just that the button accepted a click.

### The code has to survive the chat

I want to follow the values from the form into a saved record. Names and responsibilities should make that possible without reopening the conversation that produced the code.

The agent should use the project's existing patterns and name its choice briefly. Loading and errors should not acquire a new implementation on every screen.

The `xaml-semantic-lint` hook catches some recurring departures after edits: hard-coded colors, blocking waits, platform branches in a model. Its feedback includes a fix. A platform branch belongs behind a platform service; an async operation should be awaited rather than blocked with `.Result`.

That helps with consistency. It does not tell me whether the code is understandable. Five vaguely named helpers can obscure a small operation just as easily as one long method.

I use `uno-audit` to keep comments that explain a constraint or decision and remove ones that only narrate the next line. The explanation needs somewhere durable to live.

### Try the next small request

<aside class="editorial-sidenote"><span>05 / Change cost</span><p>Contained. Scattered. Unguarded. Three more useful answers than “maintainable.”</p></aside>

“Is this maintainable?” feels too large to answer honestly.

Try a smaller question. If the rule changes tomorrow, where would I start?

One place? A few places for good reasons? A sentence copied into a screen that I will probably forget?

I like this question because it makes me look at the actual work. I have to follow the rule through the project instead of admiring the structure from a distance.

<figure class="article-study thought-study" data-margin-motion>
<div class="thought-sheet"><img src="/personal-notes/assets/rules-note.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Hand-drawn rule notes connect a code diff, a UI form, and branching logic." />
<svg class="thought-traces" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="none"><path class="question-path" d="M1056 524C1200 414 1025 291 800 299"/><path class="question-path" d="M320 78Q365 93 370 146"/><path class="question-path" d="M993 844Q996 891 1057 923"/></g><g class="story-ink" fill="none" stroke="#163bce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path class="story-path" pathLength="1" d="M1056 524C1200 414 1025 291 800 299"/><path class="story-path" pathLength="1" d="M320 78Q365 93 370 146"/><path class="story-path" pathLength="1" d="M993 844Q996 891 1057 923"/></g><circle class="story-marker" r="3" fill="#163bce" opacity="0"/></svg></div>
<figcaption class="motion-caption"><span>Keep the rule close to the work.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

And then: what would tell me I missed a place?

That last part is easy to leave out.

The change-cost probe in `uno-audit` made this much more concrete for me. Take the main feature, propose three plausible changes, list the affected files, and name the test that would catch a mistake. The verdict is **Contained**, **Scattered**, or **Unguarded**.

In Patina, my public-art conservation app, the results were different for three quite ordinary requests:

- **Change an escalation threshold from three moderate findings to two.** The rule had tests, but the same threshold appeared in the page, two `.resw` files, and the generator for those strings. Scattered. The copy had no check.
- **Swap the file-like storage implementation.** One implementation and a dependency-injection registration. Store tests already used an in-memory fake. Contained.
- **Show an error and retry a failed save.** The store, survey model, page message, and strings would change. The fake could not simulate a failed write. Unguarded.

The threshold example is the one I keep thinking about. The calculation could change correctly while the UI kept explaining the old rule. Passing unit tests would not catch that.

So the question becomes: where else have I written this decision down? That includes user-facing text.

I also want the reason for an architectural decision in the spec, with its tradeoff. And a workaround needs a removal condition. “Remove when this SDK issue is fixed” is much more useful than a comment that leaves the next person guessing whether the workaround still matters.

### Leave the unfinished part visible

<aside class="editorial-sidenote"><span>06 / Evidence</span><p>Passed, failed, could not run. Keep the distinction visible.</p></aside>

A useful handoff might be very short:

<blockquote><p>Checked this path.<br>Couldn’t check that one.<br>This decision still needs a person.</p></blockquote>

Less satisfying than a tidy “done.” More useful when I return to the work.

I don’t want every change to arrive with a wall of evidence. I want the claim to fit what actually happened. If something couldn’t run, that belongs beside the result, not buried after the summary.

There is a difference between an unfinished feature and an unfinished check. I need to be able to see which one I'm looking at.

My `uno-scaffolding` gates get more demanding as the scope grows. Build, tests, and lint are the baseline, with no warnings on the touched target. A business rule or state transition needs a test that can run without launching the app. UI behavior needs to be exercised in the running app.

For a P1 or P2 bug, I want a regression test that fails before the fix, or a clear reason one cannot be written. Before a “done” or “ready to demo” claim, the completeness audit goes into `docs/COMPLETENESS.md`.

The stop hook checks that the report is newer than the last source commit. If it is missing or stale, the agent either does the audit or narrows the claim.

What I care about in the report is the evidence: an element, a runtime value, a trace, a test. If a device was unavailable, say which check could not run and why.

The `handoff` skill updates `HANDOFF.md` after substantial sessions. Next time, I want the decisions and loose ends to be there already.

<figure class="article-study thought-study" data-margin-motion>
<div class="thought-sheet"><img src="/personal-notes/assets/lessons-note.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="An open notebook of lessons, a crossed-out first try, and a small screen marked live, with a loop back for next time." />
<svg class="thought-traces" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="none"><path class="question-path" d="M915 814Q913 911 1098 892"/><path class="question-path" d="M1240 368C1374 207 1090 187 1104 105Q1121 69 1198 74"/><path class="question-path" d="M1305 720C1345 678 1327 671 1340 646Q1430 628 1418 506"/></g><g class="story-ink" fill="none" stroke="#163bce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path class="story-path" pathLength="1" d="M915 814Q913 911 1098 892"/><path class="story-path" pathLength="1" d="M1240 368C1374 207 1090 187 1104 105Q1121 69 1198 74"/><path class="story-path" pathLength="1" d="M1305 720C1345 678 1327 671 1340 646Q1430 628 1418 506"/></g><circle class="story-marker" r="3" fill="#163bce" opacity="0"/></svg></div>
<figcaption class="motion-caption"><span>Take the lesson into the next build.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

### Don’t let the checks become the project

The uncomfortable part: I can overbuild the review process too.

A rule catches a mistake, so I add another. Then another. Eventually I’m managing the interruptions instead of looking at the code.

One example: a lint check for `x:Bind` without an explicit `Mode` flagged 16 places in one app. All 16 were correct. I kept it as a report instead of a blocker.

I apply the same question to the implementation. An abstraction should make something easier now: give a rule a clear home, or let me test an external dependency. An imagined future use is weaker justification.

My global rules have a **Do Not Overbuild** section. Adding a dependency, changing a data model, or changing a public API needs my decision. I want the options and tradeoffs before that choice becomes part of the project.

A reminder to myself: a check has to keep earning its place. If I routinely dismiss it, either the check is wrong or I have stopped paying attention. Neither is a good steady state.

### Measure the improvement

<aside class="editorial-sidenote"><span>08 / One variable</span><p>Change one thing, measure again, compare the same UI states.</p></aside>

Performance work needs a baseline. A long list looking fine with three sample records tells me very little.

With `uno-hill-climb`, the performance agent gets one metric, changes one thing per attempt, and measures again. A change stays only when the metric improves and screenshots of fixed app states still match within tolerance.

Other checks deliberately make the content inconvenient: 200 rows, a 400-character string, or 20 trips between two pages while watching memory. Those give me something specific to inspect: clipping, overflow, responsiveness, retained state.

I want the same discipline here as elsewhere. What changed? What evidence says it helped? What might it have broken?

<aside class="margin-note"><span>Still open</span><p>Which checks change a decision? Which ones just make the report longer?</p></aside>

For now, three questions to leave beside the green check:

- What does this result actually establish?
- What will the next small change cost?
- What am I still taking on trust?

These are the notes I want beside the work. A clearer requirement before the edit. A rule I can find when it changes. A UI I have actually tried. And a handoff that says what is still unknown.
