---
title: "The rules, checks, and lessons that help me build"
description: "How I use rules and skills to define behavior, build with agents, and verify the result."
category: "Note"
topic: "IN THE MARGIN"
minutes: 8
order: 1
featured: true
draft: false
---

<p class="margin-intro">A personal companion to my article for the Uno Platform blog, focused on the practices behind my development workflow.</p>

I judge the work by whether I can trust the feature now and whether someone else can change it later. That applies to the code, the UI, and the process I use to build them.

When I give an agent a feature, I also delegate decisions about where logic belongs, what to reuse, and how to verify the result. I need to understand those decisions as well as the implementation.

Over the past year, I have turned recurring mistakes into rules and skills for my Uno Platform work. These are the practices I use while building, and the examples that have helped me refine them.

### I define the behavior before writing code

<aside class="editorial-sidenote"><span>01 / Before code</span><p>The spec records unresolved questions before the agent makes implementation decisions.</p></aside>

Take a form with a Save button. The user enters data and expects it to be saved, but the requirements also need to cover a failed request, a second click, and a retry. If the form calculates a total, the agent needs the product's rules for discounts and rounding before it can implement them.

I use `uno-write-spec` to establish those requirements. Anything the agent would otherwise have to assume goes under **Unresolved Questions** for me to decide.

Before changing code, the agent reads `HANDOFF.md`, the Git state, and the spec. It should reuse an existing save service and check what Uno Toolkit and Uno Extensions provide before writing a custom control or helper, or adding a dependency.

### The UI is part of the behavior

<aside class="editorial-sidenote"><span>02 / State matters</span><p>Loading, empty, error, and recovery states are part of the behavior I verify.</p></aside>

For screens that read or write data, `uno-component-states` defines loading, empty, error, and recovery states. A failed save should preserve the user's input and offer a way to recover. I verify retry in the running app.

I also use `uno-break-it` to have a separate QA agent exercise failure scenarios: navigating during a load, double-fired navigation, repeated toggles, forced errors, and an older response arriving after a newer one. Each finding includes a severity and a screenshot.

These are useful because a screen can look complete while the transitions between states are still wrong. The UI and the logic have to agree about what happened.

Security belongs in the same review. The service should verify that the user is authorized to perform the operation, and sensitive data should stay out of logs. The architecture notes record what gets logged. Authorization is still something I review by hand; none of my skills check it yet.

### I check what the tests establish

<figure class="article-study thought-study inline-doodle doodle-checks" data-margin-motion>
<div class="thought-sheet"><a class="doodle-detail" href="/personal-notes/assets/checks-note.webp" target="_blank" rel="noopener" aria-label="Open illustration at full size"><img src="/personal-notes/assets/checks-note.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="A passing result leads to a magnifying glass, awkward cases and another check." /></a>
<svg class="thought-traces" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="none"><path class="question-path" d="M429 171Q498 100 570 155"/><path class="question-path" d="M330 476Q433 544 565 483"/><path class="question-path" d="M977 668Q1090 608 1143 727"/></g><g class="story-ink" fill="none" stroke="#163bce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path class="story-path" pathLength="1" d="M429 171Q498 100 570 155"/><path class="story-path" pathLength="1" d="M330 476Q433 544 565 483"/><path class="story-path" pathLength="1" d="M977 668Q1090 608 1143 727"/></g><circle class="story-marker" r="3" fill="#163bce" opacity="0"/></svg></div>
<figcaption class="motion-caption"><span>Exercise the expected behavior and the failure cases.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

A passing test gives me confidence in the behavior it covers. I also need to know where its expected result came from and which parts of the feature it does not verify.

The agent's explanation is useful during review, but it is not independent evidence that the implementation is correct. Code and tests can inherit the same unverified assumption.

If the agent assumes discounts happen before tax, then writes the implementation and expected test results from that assumption, both can agree and still be wrong. I need the expected result to come from the requirement we agreed on.

For UI work, `uno-verify` exercises the running Debug app through Uno's automation server. It invokes controls and reads the visual tree and `DataContext` after an action. I want to know that the saved state changed, not just that the button accepted a click.

### I need to understand the implementation

When I read the implementation, I want to follow how the form's values become a saved record. Names should explain their purpose, and responsibilities should make it clear where validation ends and storage begins.

The code should follow the project's conventions. If screens already share an approach to loading and errors, the next screen should use it. The agent names the pattern it has chosen so I can review that choice.

The `xaml-semantic-lint` hook catches some recurring departures after edits: hard-coded colors, blocking waits, platform branches in a model. Its feedback includes a fix. A platform branch belongs behind a platform service; an async operation should be awaited rather than blocked with `.Result`.

Readability still takes judgment. A longer method can be easy to follow, while several vaguely named helpers can make the same operation harder to understand.

I use `uno-audit` to retain comments that explain constraints and decisions and remove comments that merely describe the next line. The code needs to make sense once the chat is gone.

### I check what the next change will take

<figure class="article-study thought-study inline-doodle doodle-rules" data-margin-motion>
<div class="thought-sheet"><a class="doodle-detail" href="/personal-notes/assets/rules-note.webp" target="_blank" rel="noopener" aria-label="Open illustration at full size"><img src="/personal-notes/assets/rules-note.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="Hand-drawn rule notes connect a code diff, a UI form, and branching logic." /></a>
<svg class="thought-traces" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="none"><path class="question-path" d="M1056 524C1200 414 1025 291 800 299"/><path class="question-path" d="M320 78Q365 93 370 146"/><path class="question-path" d="M993 844Q996 891 1057 923"/></g><g class="story-ink" fill="none" stroke="#163bce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path class="story-path" pathLength="1" d="M1056 524C1200 414 1025 291 800 299"/><path class="story-path" pathLength="1" d="M320 78Q365 93 370 146"/><path class="story-path" pathLength="1" d="M993 844Q996 891 1057 923"/></g><circle class="story-marker" r="3" fill="#163bce" opacity="0"/></svg></div>
<figcaption class="motion-caption"><span>Keep the rule close to the work.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

I assess maintainability by considering a plausible requirement change. If the form needs a new validation rule, the next developer or agent should be able to find the existing rules and add it where it belongs.

The change-cost probe in `uno-audit` takes the app's main feature and three plausible requests. For each request, it lists the files that would change, identifies the test that would catch a mistake, and gives a verdict: **Contained**, **Scattered**, or **Unguarded**.

In Patina, my public-art conservation app, the probe showed three different outcomes:

- **Change an escalation threshold from three moderate findings to two.** The rule had tests, but the same threshold appeared in the page, two `.resw` files, and the generator for those strings. Scattered. The copy had no check.
- **Swap the file-like storage implementation.** One implementation and a dependency-injection registration. Store tests already used an in-memory fake. Contained.
- **Show an error and retry a failed save.** The store, survey model, page message, and strings would change. The fake could not simulate a failed write. Unguarded.

The threshold example exposed a weakness that passing tests had hidden. The rule was tested in code, but the page and resource files restated it without a check of their own. A future change could update the behavior and leave the explanation wrong. I now include those descriptions when reviewing the scope of a rule change.

I also want the reason for an architectural decision in the spec, with its tradeoff. And a workaround needs a removal condition. “Remove when this SDK issue is fixed” is much more useful than a comment that leaves the next person guessing whether the workaround still matters.

### I want evidence before calling it done

I want a clear account of which checks passed, failed, or could not run. The amount of evidence should match the scope of the work, and the final claim should reflect what was actually verified.

My `uno-scaffolding` gates get more demanding as the scope grows. Build, tests, and lint are the baseline, with no warnings on the touched target. A business rule or state transition needs a test that can run without launching the app. UI behavior needs to be exercised in the running app.

For a P1 or P2 bug, I want a regression test that fails before the fix, or a clear reason one cannot be written. Before a “done” or “ready to demo” claim, the completeness audit goes into `docs/COMPLETENESS.md`.

The stop hook checks that the report is newer than the last source commit. If it is missing or stale, the agent either does the audit or narrows the claim.

<figure class="article-study thought-study inline-doodle doodle-lessons" data-margin-motion>
<div class="thought-sheet"><a class="doodle-detail" href="/personal-notes/assets/lessons-note.webp" target="_blank" rel="noopener" aria-label="Open illustration at full size"><img src="/personal-notes/assets/lessons-note.webp" width="1536" height="1024" loading="lazy" decoding="async" alt="An open notebook of lessons, a crossed-out first try, and a small screen marked live, with a loop back for next time." /></a>
<svg class="thought-traces" viewBox="0 0 1536 1024" aria-hidden="true"><g fill="none" stroke="none"><path class="question-path" d="M915 814Q913 911 1098 892"/><path class="question-path" d="M1240 368C1374 207 1090 187 1104 105Q1121 69 1198 74"/><path class="question-path" d="M1305 720C1345 678 1327 671 1340 646Q1430 628 1418 506"/></g><g class="story-ink" fill="none" stroke="#163bce" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path class="story-path" pathLength="1" d="M915 814Q913 911 1098 892"/><path class="story-path" pathLength="1" d="M1240 368C1374 207 1090 187 1104 105Q1121 69 1198 74"/><path class="story-path" pathLength="1" d="M1305 720C1345 678 1327 671 1340 646Q1430 628 1418 506"/></g><circle class="story-marker" r="3" fill="#163bce" opacity="0"/></svg></div>
<figcaption class="motion-caption"><span>Take the lesson into the next build.</span><button class="motion-toggle" type="button" aria-label="Pause illustration" aria-pressed="false" hidden>Pause motion</button></figcaption>
</figure>

An item graded as proven at runtime must name its evidence: an element, a runtime value, a trace line, or a test. If a check cannot run because a device is unavailable, the report must identify the check and explain why it could not run.

The `handoff` skill updates `HANDOFF.md` after substantial sessions so the next session starts with the decisions, verification results, and remaining work.

### I question the complexity, including my checks

The rules themselves need review. A check should catch a meaningful problem and give me useful feedback. Adding more checks does not automatically make the workflow better.

A lint check for `x:Bind` without an explicit `Mode` flagged 16 places in one app. All 16 were correct. I kept it as a report instead of a blocker.

I apply the same question to the implementation. An abstraction should make something easier now: give a rule a clear home, or let me test an external dependency. An imagined future use is weaker justification.

My global rules have a **Do Not Overbuild** section. Adding a dependency, changing a data model, or changing a public API needs my decision. I want the options and tradeoffs before that choice becomes part of the project.

I kept that check available because its findings can still be useful during review, but they did not justify blocking the work. A check needs to earn the interruption it creates.

### I measure performance changes

<aside class="editorial-sidenote"><span>08 / One variable</span><p>Change one thing, measure again, compare the same UI states.</p></aside>

I want evidence before accepting a performance change. A long list should remain responsive with realistic data, and memory and network use should be reasonable for the work the app performs.

With `uno-hill-climb`, the performance agent gets one metric, changes one thing per attempt, and measures again. A change stays only when the metric improves and screenshots of fixed app states still match within tolerance.

The completeness audit checks a 200-row list and a 400-character string for clipping and overflow. The failure-testing workflow navigates between two pages 20 times while watching memory. These checks let me inspect behavior beyond a screen populated with a few sample records.

The result should show what changed, how it was measured, and whether the existing behavior was preserved.

<aside class="margin-note"><span>Still open</span><p>I continue to review which checks catch useful problems and which create unnecessary interruptions.</p></aside>

Across the workflow, I want to be able to answer three questions:

- What does this result actually establish?
- What will the next small change cost?
- What am I still taking on trust?

When the next requirement arrives, I want a developer or agent to find the rule, make the change, and show how they verified it. These practices help me get there. They have developed from mistakes in my own work, and I continue to adjust them as I learn.

