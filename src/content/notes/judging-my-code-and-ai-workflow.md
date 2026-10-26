---
title: "How I Judge My Code and My AI Workflow"
description: "I judge code quality by how confidently I can trust a feature today and how easily someone else can change it tomorrow."
category: "Essay"
topic: "AI WORKFLOW"
minutes: 10
order: 1
featured: true
draft: true
---

I judge code quality by how confidently I can trust a feature today and how easily someone else can change it tomorrow.




That applies whether I accept a suggested method or hand an agent a whole feature. With an agent, I also delegate decisions about where logic belongs, what to reuse, and how to verify the result. Reviewing the code means reviewing those decisions and the evidence behind them.




Over the past year, I have turned lessons from recurring mistakes into agent rules and skills for Uno Platform work. The examples below show the standards I use and how those skills help enforce them. A reference matrix at the end lists the skills you can borrow.




Take a form with a Save button. The user fills it out, clicks Save, and sees a confirmation. I want to know what happens when the connection drops or the user clicks twice. I also want someone to find and change its validation rules confidently a month later.








### I start with behavior I can trust




Correctness starts with knowing what the feature should do. If the form calculates an order total, the calculation must follow the product’s rules for quantities, discounts, and rounding. The agent needs those rules before it can implement or test them.




That is why <code>uno-write-spec</code> runs before any code. Anything the agent would otherwise have to assume goes under <strong>Unresolved Questions</strong> for me to decide.




Reliability belongs in that definition. A failed save should preserve what the user typed and offer a way to recover. A double click should save once. For screens that read or write data, <code>uno-component-states</code> defines loading, empty, and error states. Retry has to work in the running app before the change counts.




I also want help finding failures I have missed. <code>uno-break-it</code> gives a separate QA agent a catalog of scenarios to try in the running app: double-fired navigation, navigating mid-load, a spammed toggle, forced errors, and an older response arriving after a newer one. Each finding gets a severity and a screenshot.




Security is part of the same review. The service should verify that the user is authorized to submit the form, and sensitive data should stay out of logs. The spec’s Architecture Brief records what gets logged, but authorization is the part I still review by hand. None of my skills check it yet.







### I need to understand the code




When I read the implementation, I want to follow how the form’s values become a saved record. Names should explain their purpose. Responsibilities should be clear enough that I can tell where validation ends and storage begins.




That starts with understanding the repository. Before changing anything, the agent reads <code>HANDOFF.md</code>, the Git state, and the spec. If a save service already exists, it should use it. Before writing a custom control or helper, or adding a package, it checks what Uno Toolkit and Uno Extensions already provide.




The new code should also follow the project’s conventions. If screens share an approach to loading and errors, the next screen should use it. The agent loads the skill for the area it touches and names the chosen pattern in one line, so I can review that choice.




A hook called <code>xaml-semantic-lint</code> checks after every edit for departures from those conventions, including hand-drawn cards, code-behind handlers, hard-coded colors, and blocking waits on tasks. Its feedback names each problem and the fix for each rule:



Hook feedback
<pre><code>xaml-semantic-lint: 2 hit(s) in FooViewModel.cs (PLATFORMLEAK, SYNCWAIT)
- PLATFORMLEAK: platform branch on __ANDROID__ in a model
- SYNCWAIT: blocking wait: Async().Result

PLATFORMLEAK fix: move the branch into a platform service and inject it;
models stay platform-neutral.
SYNCWAIT fix: await the task. If the caller cannot be async
(constructor, property), start the load from a command or MVUX
feed instead of blocking.</code></pre>



Readability still takes judgment. A longer method can be easy to follow; several vaguely named helpers can make the same logic harder to understand. The agent’s explanation helps during review, but the code has to make sense once the chat is gone.




Comments should explain constraints and decisions. I use <code>uno-audit</code> to remove comments that merely narrate the next line and retain the ones that explain why the code needs to work a particular way.







### I check what the next change will take




Maintainability becomes concrete when a requirement changes. If the form needs a new validation rule, the next developer or agent should find the existing rules and add it where it belongs.




I probe that before anyone makes the change. In <code>uno-audit</code>, a change-cost probe takes the app’s main feature and three plausible requests. For each request, it lists the files that would change, identifies the test that would catch a mistake, and gives a verdict: <strong>Contained</strong>, <strong>Scattered</strong>, or <strong>Unguarded</strong>.




Here is what that revealed in Patina, my public-art conservation app:



<table>
<thead><tr><th>Proposed change</th><th>Files it would touch</th><th>Test coverage</th><th>Verdict</th></tr></thead>
<tbody>
<tr><td>Escalate a survey at two moderate findings instead of three</td><td>The rule class, plus the rule restated in the page, both <code>.resw</code> files, and the script that generates them</td><td>Unit tests cover the code; nothing covers the copy</td><td>Scattered</td></tr>
<tr><td>Move storage to another file-like store</td><td>A new storage-interface implementation and one dependency-injection registration</td><td>Store tests use an in-memory fake</td><td>Contained</td></tr>
<tr><td>Show an error and allow retry when a save fails</td><td>The store, survey model, page message, and strings</td><td>None yet: the fake has no write-failure switch</td><td>Unguarded</td></tr>
</tbody>
<caption>Table 1 · The change-cost probe on Patina.</caption>
</table>



The first row exposed a weakness that passing tests had hidden. The rule was correct and tested in code, but the page and both resource files also restated it, and no test checked that text. Changing the behavior could leave the explanation wrong.

<figure class="editorial-figure"><div class="editorial-heading"><span>FIG. 01</span><strong>A passing rule can leave its explanation behind</strong></div><svg class="figure-wide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 276" role="img" aria-label="Illustrative threshold change: code uses two moderate findings while unchecked page and resource text can still say three. Passing rule tests do not verify the explanation."><rect width="560" height="276" fill="white"/><text x="28" y="32" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">CHANGE REQUEST</text><text x="28" y="58" fill="#5d6876" font-size="17" font-family="Georgia,serif" text-anchor="start">Escalate at two moderate findings</text><path d="M28 76H532" fill="none" stroke="#e8edf2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="28" y="99" fill="#4c7198" font-size="11" font-family="monospace" text-anchor="start">Rule class</text><rect x="28" y="112" width="236" height="104" rx="3" fill="white" stroke="#4c7198"/><text x="44" y="148" fill="#4c7198" font-size="11" font-family="monospace" text-anchor="start">threshold = 2</text><path d="M44 164H248" fill="none" stroke="#e8edf2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="44" y="190" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Covered by unit tests</text><text x="296" y="99" fill="#707c8c" font-size="11" font-family="monospace" text-anchor="start">Page + resource copy</text><rect x="296" y="112" width="236" height="104" rx="3" fill="white" stroke="#cbd3dd"/><text x="312" y="148" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Three moderate findings</text><path d="M312 164H516" fill="none" stroke="#e8edf2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="312" y="190" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">No check of the wording</text><path d="M40 216V242H63" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="40" cy="216" r="2" fill="white" stroke="#cbd3dd" stroke-width="1.4"/><text x="70" y="246" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Behavior and explanation can diverge.</text></svg><svg class="figure-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 426" role="img" aria-label="Illustrative threshold change: code uses two moderate findings while unchecked page and resource text can still say three. Passing rule tests do not verify the explanation."><rect width="360" height="426" fill="white"/><text x="24" y="32" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">CHANGE REQUEST</text><text x="24" y="58" fill="#5d6876" font-size="17" font-family="Georgia,serif" text-anchor="start">Escalate at two moderate findings</text><path d="M24 76H336" fill="none" stroke="#e8edf2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="24" y="99" fill="#4c7198" font-size="11" font-family="monospace" text-anchor="start">Rule class</text><rect x="24" y="112" width="312" height="104" rx="3" fill="white" stroke="#4c7198"/><text x="40" y="148" fill="#4c7198" font-size="11" font-family="monospace" text-anchor="start">threshold = 2</text><path d="M40 164H320" fill="none" stroke="#e8edf2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="190" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Covered by unit tests</text><text x="24" y="249" fill="#707c8c" font-size="11" font-family="monospace" text-anchor="start">Page + resource copy</text><rect x="24" y="262" width="312" height="104" rx="3" fill="white" stroke="#cbd3dd"/><text x="40" y="298" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Three moderate findings</text><path d="M40 314H320" fill="none" stroke="#e8edf2" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="40" y="340" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">No check of the wording</text><path d="M36 366V392H59" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="36" cy="366" r="2" fill="white" stroke="#cbd3dd" stroke-width="1.4"/><text x="66" y="396" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Behavior and explanation can diverge.</text></svg><figcaption>The Patina change-cost probe exposed an unchecked second surface: the words describing the rule. This illustrates the drift a future change could introduce.</figcaption></figure>


That finding changes what I need to review. A passing unit test gives me confidence in the calculation, but the change also needs a check of every place that describes it. Each copy creates another opportunity for drift, so I ask why duplication exists before adding more.




The reasoning behind structural choices belongs in the repository too. I record decisions in the spec with a reason and a tradeoff. The <code>handoff</code> skill updates <code>HANDOFF.md</code> at the end of each substantial session, so the next session starts with that context.




Workarounds need an explicit removal condition. My <code>uno-scaffolding</code> rule requires a comment such as:



Workaround comment
<pre><code>// WORKAROUND(&lt;gotcha name&gt;): &lt;what it works around&gt;; remove when Uno.Sdk &gt; 6.7.30</code></pre>



The next person should be able to tell why the workaround exists and when it is safe to remove.







### I want evidence before calling it done




I want to verify a validation rule without launching the app and clicking through screens. I also want a clear account of which checks passed, failed, or could not run.




The build gates in <code>uno-scaffolding</code> set that expectation. The checks accumulate with the scope of the work:



<table>
<thead><tr><th>Scope</th><th>Required evidence</th></tr></thead>
<tbody>
<tr><td>Any change</td><td>Build, tests, and lint pass, with zero warnings on the touched target</td></tr>
<tr><td>Adds or changes a business rule or state transition</td><td>A unit test that runs without launching the app and fails when the rule is broken</td></tr>
<tr><td>Touches UI or runtime behavior</td><td>The changed states exercised and confirmed in the running app</td></tr>
<tr><td>Fixes a P1 or P2 bug</td><td>A regression test that fails before the fix, named in the finding, or an explanation of why one cannot be written</td></tr>
<tr><td>Any “done” or “ready to demo” claim</td><td>A full completeness audit saved to <code>docs/COMPLETENESS.md</code></td></tr>
</tbody>
<caption>Table 2 · The build gates in <code>uno-scaffolding</code>.</caption>
</table>



A check that cannot run, for example because a device is unavailable, must be reported with its reason. I need to know where confidence ends.




I also check where the expected results came from. If the agent assumes discounts apply before tax and writes tests around that, code and tests agree while both contradict the product. Tests need to reflect an agreed requirement.

<figure class="editorial-figure"><div class="editorial-heading"><span>FIG. 02</span><strong>Give code and tests a shared source of truth</strong></div><svg class="figure-wide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 373" role="img" aria-label="An agreed product rule independently informs the implementation and the expected test result. Agreement between code and tests alone does not establish correctness."><rect width="560" height="373" fill="white"/><text x="28" y="32" fill="#707c8c" font-size="9" font-family="monospace" text-anchor="start">WHERE SHOULD EXPECTED RESULTS COME FROM?</text><rect x="100.0" y="60" width="360" height="68" rx="3" fill="white" stroke="#4c7198"/><text x="280.0" y="87" fill="#4c7198" font-size="13" font-family="monospace" text-anchor="middle">Agreed product rule</text><text x="280.0" y="109" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="middle">The source for both paths</text><path d="M280.0 128V160M137.0 160H423.0" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M137.0 160V192" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="137.0" cy="192" r="2" fill="white" stroke="#4c7198" stroke-width="1.4"/><rect x="28" y="197" width="218" height="76" rx="3" fill="white" stroke="#cbd3dd"/><text x="137.0" y="226" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="middle">Implementation</text><text x="137.0" y="251" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="middle">Applies the rule</text><path d="M423.0 160V192" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="423.0" cy="192" r="2" fill="white" stroke="#4c7198" stroke-width="1.4"/><rect x="314" y="197" width="218" height="76" rx="3" fill="white" stroke="#cbd3dd"/><text x="423.0" y="226" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="middle">Test expectation</text><text x="423.0" y="251" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="middle">Checks the rule</text><path d="M137.0 273V300H423.0V273" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 4"/><path d="M280.0 300V324" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="280.0" y="346" fill="#5d6876" font-size="10" font-family="monospace" text-anchor="middle">Agreement alone is not correctness.</text></svg><svg class="figure-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 373" role="img" aria-label="An agreed product rule independently informs the implementation and the expected test result. Agreement between code and tests alone does not establish correctness."><rect width="360" height="373" fill="white"/><text x="24" y="32" fill="#707c8c" font-size="9" font-family="monospace" text-anchor="start">WHERE SHOULD EXPECTED RESULTS COME FROM?</text><rect x="24.0" y="60" width="312" height="68" rx="3" fill="white" stroke="#4c7198"/><text x="180.0" y="87" fill="#4c7198" font-size="13" font-family="monospace" text-anchor="middle">Agreed product rule</text><text x="180.0" y="109" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="middle">The source for both paths</text><path d="M180.0 128V160M94.0 160H266.0" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><path d="M94.0 160V192" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="94.0" cy="192" r="2" fill="white" stroke="#4c7198" stroke-width="1.4"/><rect x="24" y="197" width="140" height="76" rx="3" fill="white" stroke="#cbd3dd"/><text x="94.0" y="226" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="middle">Implementation</text><text x="94.0" y="251" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="middle">Applies the rule</text><path d="M266.0 160V192" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="266.0" cy="192" r="2" fill="white" stroke="#4c7198" stroke-width="1.4"/><rect x="196" y="197" width="140" height="76" rx="3" fill="white" stroke="#cbd3dd"/><text x="266.0" y="226" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="middle">Test expectation</text><text x="266.0" y="251" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="middle">Checks the rule</text><path d="M94.0 273V300H266.0V273" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="3 4"/><path d="M180.0 300V324" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><text x="180.0" y="346" fill="#5d6876" font-size="10" font-family="monospace" text-anchor="middle">Agreement alone is not correctness.</text></svg><figcaption>If code and tests inherit the same unverified assumption, they can agree and still be wrong. Expected results must come from the agreed requirement.</figcaption></figure>


For UI changes, <code>uno-verify</code> launches a Debug build through Uno Platform’s app automation server, invokes controls, and reads the visual tree and <code>DataContext</code> after each action. In <code>uno-completeness-audit</code>, anything graded as proven at runtime must name its evidence: an element, a <code>DataContext</code> value, a trace line, or a test.




A stop hook enforces the final reporting requirement. In an Uno Platform repository, when the agent claims the work is done or ready to demo and no completeness report is newer than the last source commit, the hook stops it. The agent then either runs <code>uno-completeness-audit</code> and saves the report, or restates the claim at the level of evidence it actually has.







### I question the complexity, including my own checks




How much structure a product needs is a judgment call. A small internal tool can stay simple. A larger app with more teams and integrations needs firmer boundaries.




When an agent proposes an abstraction, I want to know what it makes easier today. Giving a business rule a clear home or making an external dependency testable is a useful benefit. Imagined future requirements make a weaker case.




My global rules include a <strong>Do Not Overbuild</strong> section. They also require the agent to pause for my decision before adding a dependency, changing a data model, or changing a public API. The agent lays out the options, and I choose.




For a structural choice I accept, the spec records its cost:



Spec decision record
<pre><code>Decision: MVUX for the survey page
Reason:   durable async state with loading, error, and refresh
Tradeoff: {Binding} on the data surface, no compile-time x:Bind checks</code></pre>



My checks get the same scrutiny. A lint rule for <code>x:Bind</code> without a <code>Mode</code> flagged 16 places in one app, and all 16 were correct, so I kept it as a report that does not block. A check needs to earn the interruption it creates.







### I measure performance changes




A long list should stay responsive with realistic data. Memory and network use should be reasonable for the work the app performs.




I want evidence before accepting a performance change. <code>uno-hill-climb</code> gives a performance agent one metric to improve. It changes one thing per attempt, measures the result, and keeps a change only when the metric improves and screenshots of fixed app states still match within tolerance.

<figure class="editorial-figure"><div class="editorial-heading"><span>FIG. 03</span><strong>An improvement needs two kinds of evidence</strong></div><svg class="figure-wide" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 430" role="img" aria-label="For each performance attempt, change one thing, measure the chosen metric, and compare screenshots of fixed app states. Keep the change only if the metric improves and screenshots match within tolerance."><rect width="560" height="430" fill="white"/><text x="28" y="32" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">ONE PERFORMANCE ATTEMPT</text><circle cx="38" cy="81" r="4" fill="white" stroke="#4c7198" stroke-width="1.4"/><text x="61" y="77" fill="#4c7198" font-size="9" font-family="monospace" text-anchor="start">01</text><text x="89" y="78" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Change one thing</text><text x="61" y="101" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Keep the comparison attributable.</text><path d="M38 86V164" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="169" r="4" fill="white" stroke="#4c7198" stroke-width="1.4"/><text x="61" y="165" fill="#4c7198" font-size="9" font-family="monospace" text-anchor="start">02</text><text x="89" y="166" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Measure the chosen metric</text><text x="61" y="189" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Compare with the baseline.</text><path d="M38 174V252" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="38" cy="257" r="4" fill="white" stroke="#4c7198" stroke-width="1.4"/><text x="61" y="253" fill="#4c7198" font-size="9" font-family="monospace" text-anchor="start">03</text><text x="89" y="254" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Compare fixed-state screenshots</text><text x="61" y="277" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Check within the defined tolerance.</text><path d="M38 261V362H54" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><rect x="58" y="340" width="474" height="62" rx="3" fill="white" stroke="#4c7198"/><text x="74" y="365" fill="#4c7198" font-size="11" font-family="monospace" text-anchor="start">Keep only if both checks pass</text><text x="74" y="385" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">Metric improves · visuals match</text></svg><svg class="figure-mobile" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 430" role="img" aria-label="For each performance attempt, change one thing, measure the chosen metric, and compare screenshots of fixed app states. Keep the change only if the metric improves and screenshots match within tolerance."><rect width="360" height="430" fill="white"/><text x="24" y="32" fill="#707c8c" font-size="10" font-family="monospace" text-anchor="start">ONE PERFORMANCE ATTEMPT</text><circle cx="34" cy="81" r="4" fill="white" stroke="#4c7198" stroke-width="1.4"/><text x="57" y="77" fill="#4c7198" font-size="9" font-family="monospace" text-anchor="start">01</text><text x="85" y="78" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Change one thing</text><text x="57" y="101" fill="#707c8c" font-size="9" font-family="monospace" text-anchor="start">Keep the comparison attributable.</text><path d="M34 86V164" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="169" r="4" fill="white" stroke="#4c7198" stroke-width="1.4"/><text x="57" y="165" fill="#4c7198" font-size="9" font-family="monospace" text-anchor="start">02</text><text x="85" y="166" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Measure the chosen metric</text><text x="57" y="189" fill="#707c8c" font-size="9" font-family="monospace" text-anchor="start">Compare with the baseline.</text><path d="M34 174V252" fill="none" stroke="#cbd3dd" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="257" r="4" fill="white" stroke="#4c7198" stroke-width="1.4"/><text x="57" y="253" fill="#4c7198" font-size="9" font-family="monospace" text-anchor="start">03</text><text x="85" y="254" fill="#5d6876" font-size="11" font-family="monospace" text-anchor="start">Compare fixed-state screenshots</text><text x="57" y="277" fill="#707c8c" font-size="9" font-family="monospace" text-anchor="start">Check within the defined tolerance.</text><path d="M34 261V362H50" fill="none" stroke="#4c7198" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/><rect x="54" y="340" width="282" height="62" rx="3" fill="white" stroke="#4c7198"/><text x="70" y="365" fill="#4c7198" font-size="11" font-family="monospace" text-anchor="start">Keep only if both checks pass</text><text x="70" y="385" fill="#707c8c" font-size="9" font-family="monospace" text-anchor="start">Metric improves · visuals match</text></svg><figcaption>The performance workflow described here uses measurement and visual comparison together. This is the decision process, not a chart of measured results.</figcaption></figure>


Other skills cover the stress cases. <code>uno-completeness-audit</code> binds a 200-row list and a 400-character string to check for clipping and overflow, and <code>uno-break-it</code> navigates between two pages 20 times while watching memory. Those checks give me specific behavior to inspect beyond a screen that looks fine with a few sample records.







### The rules and skills I use




These are the main pieces of my workflow, grouped by the question they help answer.



<table>
<thead><tr><th>Quality question</th><th>Skill, rule, or hook</th><th>Role</th></tr></thead>
<tbody>
<tr><td>Do we know what the feature should do?</td><td><code>uno-write-spec</code></td><td>Defines requirements and records unresolved questions</td></tr>
<tr><td>Have we accounted for loading and failure?</td><td><code>uno-component-states</code></td><td>Defines loading, empty, error, and recovery states</td></tr>
<tr><td>What failures have we missed?</td><td><code>uno-break-it</code></td><td>Gives a separate QA agent failure scenarios to exercise, including a memory loop</td></tr>
<tr><td>Does the code follow project conventions?</td><td><code>xaml-semantic-lint</code> (hook script that ships with <code>uno-audit</code>)</td><td>Flags departures after edits and suggests fixes</td></tr>
<tr><td>Can someone understand and change it?</td><td><code>uno-audit</code></td><td>Reviews comments and structure, and probes change cost</td></tr>
<tr><td>What checks must pass?</td><td><code>uno-scaffolding</code></td><td>Defines build gates and requires documented workarounds</td></tr>
<tr><td>Does the workflow work in the app?</td><td><code>uno-verify</code></td><td>Exercises controls and reads back runtime state</td></tr>
<tr><td>Is there evidence behind “done”?</td><td><code>uno-completeness-audit</code></td><td>Grades each item by evidence, checks long content, and saves the report the stop hook requires</td></tr>
<tr><td>Did the performance change help?</td><td><code>uno-hill-climb</code></td><td>Measures one change at a time against a chosen metric</td></tr>
</tbody>
<caption>Table 3 · The rules and skills, by the quality question each answers.</caption>
</table>



When the next validation request arrives, I want a developer or agent to find the rule, make the change, and show how they checked it. That is the practical test behind all of this.




These checks earned their place by catching my mistakes. Yours will come from the mistakes you keep making. If you want a starting point, the rules and skills are here: <em>Link to the shared rules and skills coming soon.</em>.
