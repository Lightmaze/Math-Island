# Teaching with mathematical islands

[中文版](teacher-guide.zh-CN.md) · [Curriculum contract](curriculum.md) · [Sixteen laboratories](laboratories.md) · [Eight additional laboratories](advanced-laboratories.md)

This guide supports classroom investigation and research reading with the **24 authored island lessons**. It uses the application's **four editorial journeys** and the atlas's **21 recorded literature bridges**. The suggested times are planning estimates, not measured completion times or evidence of learning. The advanced mathematics remains part of the programme: a finite experiment gives a particular question a visible form, while the corresponding theorem, proof and research tools retain their own scope.

The full atlas contains 21,741 source-indexed entries. Twenty-four of them have these curated educational windows; a source entry elsewhere in the atlas should not be presented as an authored lesson. A journal mark records an interaction or a learner's note, not understanding, correctness or formal proof.

## Prepare the session

Open the education application, choose the teaching language, and try the controls for the selected islands. Lesson links use the deployed Sites entry `https://mathcups-mathematical-islands.ljie5996.chatgpt.site/`, preserving each island, laboratory and language hash route. This hosted entry is currently accessible only to its creator and cannot be distributed as a public classroom link. GitHub Pages has not been published. For public teaching, self-host the built [`education-pages` branch](https://github.com/Lightmaze/Math-Island/tree/education-pages) of [Lightmaze/Math-Island](https://github.com/Lightmaze/Math-Island), then replace this guide's site-root URL with your public address while retaining the `#view=…` routes. Changing `lang=en` to `lang=zh` selects Chinese.

Use the diagrams together with their numerical outputs and written conditions. Do not make color discrimination the only way to complete a task: refer to point labels, edge labels, coefficients and numerical signs. A learner using the keyboard can operate native controls; a printed lesson can use the same equations and tables, although it will not reproduce the interaction. Record parameter values before moving between laboratories, because local experiment state can reset.

Ask each group to keep a short evidence sheet:

| Field | What to record |
|---|---|
| Object and assumptions | The actual set, space, field, distribution, operator or context; coefficients and boundary conditions. |
| Action and observation | The control changed, its before/after values, and the output observed. |
| Claim and evidence | The claim being tested; distinguish a screenshot, a finite exact computation, an algebraic derivation and a cited theorem. |
| Failure and continuation | A counterexample or missing hypothesis, and the next source or argument needed. |

“Observed,” “calculated,” “proved in this argument,” and “stated in the cited literature” answer different questions. A numerical residual near zero is evidence about a computation. A short proof using an explicit identity can establish a mathematical statement under its hypotheses. Neither should be relabelled as proof-assistant certification.

## Let the mathematical object determine the ecology

The island vocabulary is useful when it preserves a mathematical distinction. A reef cell can stand for an integer; a gluing canopy can stand for two overlapping open sets. The teacher should be able to identify the object, the permitted operation, and the constraint before explaining the metaphor.

| Ecology | Operation it encodes | Quantity or constraint to track |
|---|---|---|
| Prime cells receding under a tide | Remove multiples of the current prime, starting at its square | The prime itself survives; the stopping argument uses a factor at most √N. |
| Elliptic branches and a reflected intersection | Secant or tangent addition on the stated smooth cubic | The points satisfy the same equation; the identity is the point at infinity. |
| Ideal layers and spectrum roots | Take sums/intersections of ideals; select a basic open D(f) | gcd/lcm in ℤ; prime ideals are different from ring elements. |
| Overlapping canopies | Restrict and glue compatible local sections | Agreement on the entire overlap and uniqueness of the glued section. |
| Cavern edges and triangular faces | Apply boundary maps and quotient cycles by boundaries | ∂₁∂₂=0; Betti numbers use ranks over the specified field. |
| Covering terraces | Lift a path from a fixed starting point | Accumulated angle; a closed base path need not have a closed lift. |
| Harmonic tides and heat textures | Add frequency components or damp them at stated rates | Fourier coefficients, diffusivity, periodicity and eigenvalue scaling. |
| Forest branches | Select graphic-matroid elements | Forest independence, rank and minimal dependent cycles. |
| Transport channels | Split and move mass under the stated cost | Both marginals and the total cost; channel thickness is transported mass. |
| Type observatory | Apply an inference rule under a context | Input/output types match; a contextual assumption is not a closed proof. |

Decorative geography is not additional mathematical data. Pixel distances do not define graph costs or finite-field distances. Nearby islands do not assert a theorem connecting their objects. A path through the curriculum is an editorial sequence; only an identified source supports a literature bridge.

## Four existing journeys: concrete lesson plans

### 1. Frequencies and heat — `waves-and-heat`

**Suggested setting:** 90 minutes; students familiar with trigonometric functions, derivatives and matrix multiplication. The research continuation assumes Fourier analysis and operator theory. Use [Complex Current](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=complex-current&lab=1&lang=en), [Fourier Tide](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=fourier-tide&lab=1&lang=en), [Heat Shore](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=heat-shore&lab=1&lang=en), and [Spectral Lighthouse](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=spectral-lighthouse&lab=1&lang=en).

1. **0–15 min — Rotation is an operation.** Set a nonzero complex multiplier's modulus to 1 and vary its angle. Record the image of the marked point. On paper, calculate multiplication by i twice and four times. Then inspect the collapse at modulus 0. Ask which assertions about angles require a nonzero derivative or multiplier.
2. **15–35 min — A basis can represent a shape.** Increase the number of odd harmonics from 1 to 25. Record a smooth-region approximation and a neighborhood of a jump. Separate the sampled peak from the exact supremum. Ask why a continuous finite sum cannot converge uniformly to a discontinuous square wave.
3. **35–60 min — An operator acts differently on modes.** In Heat Shore choose a positive third-mode amplitude. Compare time 0 with a later time. Differentiate the displayed formula to verify `u_t=u_xx`. Explain why `sin(3x)` decays with exponent 9 rather than 3 and why its mean stays zero.
4. **60–80 min — Boundaries and scale change the eigenproblem.** Select several modes of the finite Dirichlet matrix. Use `sin((j−1)θ)+sin((j+1)θ)=2cosθ sin(jθ)` to derive the displayed eigenvalue. Discuss the missing `h⁻²` factor before comparing different matrix sizes.
5. **80–90 min — Compare the models.** Submit a table listing each object, operation, boundary condition and a statement that cannot transfer unchanged to the next laboratory.

**Open question:** Which part of the modal argument survives if the boundary conditions change? Learners may formulate a conjecture and identify a missing eigenbasis argument; they need not solve an unspecified PDE.

**Keep the distinction:** This journey does not turn a solution of the wave equation into heat. The heat model is periodic, whereas the displayed matrix has Dirichlet endpoints. The common idea is spectral decomposition, not an identification of these two operators. Literature bridge 015 offers a different probabilistic representation of a heat equation, with an explicit diffusivity convention.

### 2. Local and global — `local-to-global`

**Suggested setting:** 90 minutes; elementary ring operations, functions and finite linear algebra. Scheme theory, sheaf cohomology and derived constructions are research continuations. Use [Ideal Basin](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=ideal-basin&lab=1&lang=en), [Spectrum Marsh](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=spectrum-marsh&lab=1&lang=en), [Sheaf Canopy](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=sheaf-canopy&lab=1&lang=en), and [Homology Caverns](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=homology-cavern&lab=1&lang=en).

1. **0–20 min — Arithmetic becomes structure.** Set ideal generators to 4 and 6. List a few members of the sum and intersection. Explain `2=6−4`, then prove the gcd/lcm identities using divisibility and Bézout. Identify why the union is not the ideal sum.
2. **20–35 min — Points do not determine the ring.** Compare the spectra for n=6 and n=12. Select f=0 and f=1 and explain D(0) and D(1). Both spectra have two points. On paper, compare their nilpotents: 6 is nonzero and square-zero modulo 12, while ℤ/6ℤ is reduced.
3. **35–55 min — Compatibility is an equality on an open set.** Adjust the second affine local section so the two lines meet at only one point. Explain the obstruction to gluing. Match the coefficients, and prove uniqueness of the global continuous function on the union. Two-point checking is sufficient for these affine sections; it is not a general criterion for continuous sections.
4. **55–75 min — A cycle can be a boundary.** Compare filled, holed, cut and separated complexes. Choose a single triangular 2-chain and the sum of all available triangles. Record β₀, β₁ and ∂₁∂₂; explain cancellation over F₂. Give a visible closed cycle whose class is zero.
5. **75–90 min — Name the change of object.** Produce four separate object cards. Identify the finite ring, the real intervals and the simplicial complex as different models. State the additional constructions needed before invoking a theorem relating sheaves and cohomology.

**Open question:** What information is lost when one keeps only the topological points of a scheme? Distinguish a ringed-space structure from an unlabelled finite set rather than treating equal point counts as an isomorphism.

**Reading:** Bridge 013 is the algebraically closed-field correspondence between radical ideals and affine algebraic sets. It does not assert that the real plot, the finite quotient spectrum and the continuous-function sheaf in these laboratories are the same object.

### 3. Independence and preservation — `independence`

**Suggested setting:** 80 minutes; graph terminology and functions. The advanced reading requires matroids and graded algebras. Use [Graph Bridges](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=graph-bridges&lab=1&lang=en), [Matroid Forest](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=matroid-forest&lab=1&lang=en), [Symmetry Grove](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=symmetry-grove&lab=1&lang=en), and [Functor Harbor](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=functor-harbor&lab=1&lang=en).

1. **0–20 min — Specify the objective.** Keep the same destination and compare BFS with Dijkstra. Change the E–H edge cost and repeat. Record edge count and total weight separately. Explain why equal nonnegative weights give a guarantee of agreement, while unequal weights do not guarantee disagreement in every instance.
2. **20–40 min — Independence is not edge count.** In K₄ select a triangle and leave the fourth vertex isolated. Compute `r(A)=4−c(A)=2`. Compare a three-edge spanning tree. Find a valid exchange between two bases and identify an invalid exchange that creates a cycle.
3. **40–55 min — Preserve the square's structure.** Compare a quarter-turn and a reflection in both orders. Use labelled vertices to establish a counterexample to commutativity. Distinguish the eight square symmetries from all 24 permutations of four labels.
4. **55–70 min — State what preservation means.** In the finite-poset mode compare monotone and order-reversing choices. In the finite-set square check the composites on every source element. Exhibit a specific input when they disagree.
5. **70–80 min — Separate three meanings of independence.** Write definitions for a matroid-independent edge set, probabilistically independent variables and linearly independent vectors. Only the first is implemented here; propose a source for a mathematically valid connection instead of relying on a shared word.

**Open question:** What must a map between two of these structures preserve? Propose a definition, then test it against a small counterexample. The route does not claim that the four interfaces already implement a functor between their objects.

**Reading:** Bridge 003 constructs a Chow ring and Hodge-theoretic relations for loopless matroids. A K₄ picture does not prove the general theorem, and general matroids need not be graphic or representable. Ask which new object the proof constructs and which inequality it exports back to combinatorics.

### 4. Chance, averaging and transport — `chance-and-motion`

**Suggested setting:** 90 minutes; expectation, variance and elementary calculus. Feynman–Kac and synthetic curvature need a subsequent reading seminar. Use [Brownian Delta](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=brownian-delta&lab=1&lang=en), [Mean Tide](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=mean-tide&lab=1&lang=en), [Heat Shore](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=heat-shore&lab=1&lang=en), and [Transport Sandbar](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=transport-sandbar&lab=1&lang=en).

1. **0–20 min — A random object and an ensemble statistic differ.** Compare one and several Brownian paths. Refine the time grid and inspect the endpoint statistics. Explain `Var(B_t)=t`. Describe what the pointwise ±2√t band does and does not constrain.
2. **20–40 min — Change the sample space explicitly.** Mean Tide uses Bernoulli trials, not successive Brownian positions. Extend a fixed prefix and find an update that moves the mean away from p. If the Hoeffding band is shown, state that its guarantee is for a fixed n, not simultaneous coverage of the entire path.
3. **40–60 min — Derive a carefully matched bridge.** The heat lab has diffusivity 1; standard Brownian motion has generator ½Δ. With V=0 and the displayed smooth periodic initial function, the compatible expression is `u(t,x)=E[f(x+√2 B_t)]`, with the argument taken modulo 2π if viewed on the circle. Use the Gaussian characteristic function to obtain the decay `e^(−n²t)` for a sine mode. This is a written derivation linking two stated models, not a claim that the interfaces share a simulation.
4. **60–80 min — Conservation is a constraint, not a visual impression.** Move the target measure and alter its masses. Check both marginals of the transport plan and add the displayed cost contributions. Seek an example where one source's mass must split between destinations.
5. **80–90 min — Audit the analogy.** Submit three statements: one verified finite computation, one exact calculation under a probabilistic model, and one further theorem needed to connect transport and curvature.

**Open question:** When might two different transport plans have the same cost? Explore a finite example and distinguish existence of a monotone optimum from uniqueness.

**Keep the distinction:** The heat function can be negative because it is a temperature deviation, not a probability density. The transport lab uses one-dimensional absolute-distance cost, a W₁ setting. The Lott–Villani bridge uses a W₂ displacement-convexity framework. The displayed W₁ plan does not establish a curvature bound or a general heat-flow gradient-flow theorem.

## Three further workshops cover the other islands

These are additional teacher plans, not extra routes silently inserted into the application's four-route list.

### A. Why a rule is allowed — 60 minutes

Use [Prime Reef](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=prime-reef&lab=1&lang=en), [Finite-field Atoll](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=finite-field-atoll&lab=1&lang=en), and [Type Observatory](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=type-observatory&lab=1&lang=en). Suitable for a first proof workshop, with the finite-field notation introduced explicitly.

- **20 min: sieve.** Stop after primes 2, 3 and 5 and examine 49. Prove that a composite at most N has a prime factor at most √N. State why p itself is retained and why marking can start at p².
- **20 min: interpolation.** Retain two, then three distinct evaluation points over one supported prime field. On paper, prove uniqueness for degree below 3: the difference of two candidates has three distinct roots. Explain why repeated locations or arbitrary corrupted values change the problem. Modulo 6 is a written counterexample to “every modulus gives a field”; the UI does not offer it as a field.
- **20 min: types.** Change the argument type and enable composition. Write the exact application rule and the context containing f, g and x. Explain why a derivation under assumptions does not supply a closed inhabitant of every type.

**Collect:** three short arguments, each with its indispensable premise. **Research extensions:** bridges 005, 009, 020 and 021. The sieve model is not the Green–Tao transference argument; the type checker is not a complete proof assistant.

### B. Geometry changes; some information survives — 100 minutes

Use [Zero-set Peaks](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=zero-set-peaks&lab=1&lang=en), [Elliptic Garden](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=elliptic-garden&lab=1&lang=en), [Covering Terraces](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=covering-terraces&lab=1&lang=en), and [Curvature Ridge](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=curvature-ridge&lab=1&lang=en). Split into two meetings if the prerequisites differ across the group.

- **25 min: equations and singularities.** Compare `xy=c` with `c=0`. Solve `F=F_x=F_y=0` for the crossing. Contrast the real circle at radius zero with a nonzero radius. Ask what a real plot omits about complex points and projective completion.
- **25 min: a law with conditions.** Use the elliptic secant, tangent, inverse and singular presets. Verify the supplied point coordinates by substitution. Calculate the secant sum on `y²=x³−x+1` and distinguish O from (0,0). Do not ask learners to drag arbitrary points: this interface deliberately uses valid presets.
- **25 min: lift the entire path.** Set n=3, move the base path through one and three turns, and record the lifted endpoint. Derive `e^(it/3)` from the chosen starting point. Explain why resetting the angle after each turn loses essential information.
- **25 min: local and total curvature.** Compare tetrahedral, octahedral and toroidal meshes. Count V, E and F; distinguish total defect from vertexwise defect. Derive the closed triangular-mesh formula from `3F=2E` and a total face-angle sum of πF. The smooth theorem requires separate hypotheses and a separate argument.

**Collect:** an equation check, an addition calculation, a lift formula and a discrete invariant derivation. **Reading:** bridges 001, 012, 013, 014 and 018. These links support different mathematical constructions, not a single unnamed equivalence between all four scenes.

### C. Three meanings of “eventually” — 60 minutes

Use [Cantor Coast](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=cantor-coast&lab=1&lang=en), [Gradient Basin](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=gradient-basin&lab=1&lang=en), and [Mean Tide](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=islands&island=mean-tide&lab=1&lang=en). Suitable for an introduction to limits, with probability added only where its assumptions are available.

- **20 min: shrinking measure.** Derive the number and length of finite Cantor intervals. Compare “total length tends to zero” with “the limiting set is finite.” Use infinite 0/2 ternary choices to discuss cardinality; acknowledge that every displayed finite stage still contains intervals.
- **20 min: contraction.** Derive the two gradient-update multipliers. For λ=4 compare stable and unstable step sizes. State the strict all-initial-point convergence condition `0<η<2/λ`; at an endpoint the relevant multiplier can have modulus 1. A special initial point may suppress an unstable coordinate, so state the quantifier.
- **20 min: almost-sure convergence.** Contrast Bernoulli sample means with the deterministic multiplier test. Translate a proposed statement into explicit quantifiers and locate why a finite observed prefix cannot decide almost-sure convergence.

**Collect:** one definition of a limiting object, one exact stability argument and one corrected probabilistic claim. Avoid treating the three different limits as interchangeable merely because their pictures appear to settle.

## The 21 literature bridges as a research-reading menu

The references below are already recorded in the core atlas. The teaching entry indicates a place to begin a question; it does not claim that the relevant research construction is implemented in that lab. “External reading” is intentional when the current 24 lessons do not cover the required object. For complete statements, locators and recorded review scope, consult [the bridge report](../../reports/math-bridges.en.md) and [the final scope review](../../reports/math-bridge-final-review.json). Existing reviews cover selected statements and constructions, not full proof re-verification or kernel certification.

| Bridge and source | Entry or gap | Reading task and scope to retain |
|---|---|---|
| 001 · [Wiles: elliptic curves and modular forms](https://annals.math.princeton.edu/1995/141-3/p01) | Elliptic Garden; modular forms require further study | Identify the arithmetic information moved between representations. This citation concerns semistable elliptic curves over ℚ, not all number fields or, by itself, the later full modularity theorem. |
| 002 · [Viazovska: sphere packing in dimension 8](https://arxiv.org/abs/1603.04246) | Fourier Tide as harmonic-analysis orientation; the construction is external | List the sign and Fourier-transform constraints on the auxiliary Schwartz function. The conclusion covers all packings in ℝ⁸, not all dimensions and not merely lattice competitors. |
| 003 · [Adiprasito–Huh–Katz: Hodge theory for matroids](https://arxiv.org/abs/1511.02888) | Matroid Forest | Identify the constructed Chow ring, ample classes and Hodge relations. Keep the finite nonempty loopless-matroid scope; representability is not required. |
| 004 · [Moser–Tardos: constructive local lemma](https://arxiv.org/abs/0903.0544) | Graph/probability vocabulary; resampling is not implemented | Draw a variable-dependency graph and explain witness trees. Retain finite independent variables, finite bad events and the stated local-lemma inequality; expected resampling counts are not the whole running-time analysis. |
| 005 · [Green–Tao: prime arithmetic progressions](https://arxiv.org/abs/math/0404188) | Prime Reef | Locate the pseudorandom majorant and transference step. The primes have zero density in the integers; an infinite set alone is insufficient, and the progression need not consist of consecutive primes. |
| 006 · [Lott–Villani: transport and Ricci curvature](https://arxiv.org/abs/math/0412127) | Transport Sandbar and Curvature Ridge | Compare the current W₁ window with the paper's Wasserstein displacement-convexity framework. Retain its compact measured length-space setting and existence of appropriate geodesics; do not merge all CD/RCD versions. |
| 007 · [Sipser–Spielman: expander codes](https://www.cs.yale.edu/homes/spielman/Research/expanders.html) | Graph Bridges and Finite-field Atoll; expander decoding is external | Record the quantitative expansion and local-code parameters used by the chosen construction. An arbitrary expander combined with an arbitrary local code has no automatic decoding guarantee. |
| 008 · [Malliaris–Shelah: stable regularity](https://arxiv.org/abs/1102.3904) | Graph Bridges; model theory is a separate prerequisite | Find the half-graph/order-pattern obstruction and fixed non-k-order hypothesis. “Stable” here is model-theoretic, not numerical stability or low graph variance. |
| 009 · [Wadler: propositions as types](https://www.research.ed.ac.uk/en/publications/propositions-as-types/) | Type Observatory | Match implication rules with function-type rules. Products, sums and empty types require their corresponding logical connectives and rules; unrestricted recursion does not automatically provide a total proof. |
| 010 · [Homotopy Type Theory, Chapter 2](https://homotopytypetheory.org/book/) | Type Observatory and Covering Terraces; dependent types are external | State identity-type rules and where univalence enters. Do not attribute univalence to the simple application checker or call the atlas formally verified. |
| 011 · [Jones: operator algebras and link invariants](https://doi.org/10.1090/S0273-0979-1985-15304-2) | External reading: no subfactor or link lab in this batch | Trace the braid representation, Markov-compatible trace and normalization. The result is an invariant of tame oriented links, not a complete classifier. |
| 012 · [Hatcher: covering spaces](https://pi.math.cornell.edu/~hatcher/AT/ATpage.html) | Covering Terraces | Explain how path lifting produces a group action on a fiber. Keep path connectedness, local path connectedness and semilocal simple connectedness; distinguish subgroups from conjugacy classes. |
| 013 · [Stacks Project: Nullstellensatz, Tag 00FV](https://stacks.math.columbia.edu/tag/00FV) | Ideal Basin and Zero-set Peaks | Derive the reversal of inclusion and locate the radical. The stated correspondence assumes an algebraically closed field and finitely many polynomial variables; real points alone do not recover the same ideal. |
| 014 · [Hale: Gauss–Bonnet exposition](https://www.math.uchicago.edu/~may/REU2022/REUPapers/Hale.pdf) | Curvature Ridge | Compare the discrete angle-defect derivation with the smooth proof. The recorded source treats compact oriented boundaryless regular surfaces in ℝ³; the identity is not an equivalence of geometric objects. |
| 015 · [Lalley: Feynman–Kac](https://www.stat.uchicago.edu/~lalley/Courses/391/) | Brownian Delta and Heat Shore | Match generator ½Δ, potential V and initial data. The recorded sufficient scope uses bounded smooth initial data and a bounded smooth nonnegative potential; handle time/variance scaling before using the diffusivity-1 lab. |
| 016 · [Candès–Romberg–Tao: stable signal recovery](https://arxiv.org/abs/math/0503066) | Gradient Basin as optimization orientation; ℓ₁ recovery is external | Identify restricted isometry, noise radius and a global constrained ℓ₁ minimizer. Preserve this source's condition δ₃S+3δ₄S<2; a generic quadratic-gradient trajectory is not a compressed-sensing certificate. |
| 017 · [Dasgupta–Gupta: Johnson–Lindenstrauss](https://doi.org/10.1002/rsa.10073) | Mean Tide as concentration orientation; projection is external | Separate one-vector concentration from the union bound over finitely many pairs. Retain n≥2, 0<ε<1 and the stated positive target-dimension bound; the conclusion does not preserve an entire continuous space. |
| 018 · [Guth: polynomial partitioning](https://arxiv.org/abs/1410.8871) | Zero-set Peaks; parameter-space topology is external | Locate the topological balancing argument. Keep a finite family of bounded-complexity varieties and degree bound D≥1; the estimate concerns complementary cells, not the part on Z(P). |
| 019 · [Lovász: Shannon capacity](https://doi.org/10.1109/TIT.1979.1055985) | Graph Bridges; the semidefinite programme is external | Distinguish independence number, Shannon capacity and θ. Use finite simple graphs and strong products; equality with θ is not general, and numerical SDP output needs error control for a rigorous certificate. |
| 020 · [MIT notes: Reed–Solomon evaluation codes](https://people.csail.mit.edu/madhu/FT05/scribe/lect16.pdf) | Finite-field Atoll | Use the root bound to derive distance n−k+1. Keep distinct evaluation points, degree<k and 1≤k≤n≤q; erasure recovery differs from correction of unknown errors. These are course notes, not a scan of the 1960 paper. |
| 021 · [Thaler: sum-check](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html) | Finite-field Atoll and Type Observatory; the protocol is external | Identify each degree check, fresh uniform challenge and trusted final evaluation. Soundness is at most min(1,md/∣F∣); removing one of those checks changes the guarantee. |

### A four-meeting research seminar

Allow approximately 90 minutes per meeting plus source reading. Assign different bridges to groups; nobody is expected to reproduce 21 proofs in four meetings.

1. **Objects created by a proof.** Compare bridges 001, 002 and 003. Each group presents the newly constructed representation, auxiliary function or algebra, the properties demanded of it, and the theorem that consumes those properties.
2. **Transfer requires hypotheses.** Compare 005, 006, 007 and 016. Each group draws an assumption ledger and marks the exact point where a false generalization would enter. The drawing is a reading aid, not a new core graph edge.
3. **From existence to procedure or verification.** Compare 004, 009, 020 and 021. Separate existence, computational cost, error model, soundness and correctness. Request one failure example when a specified premise is removed.
4. **Classification, invariants and information loss.** Compare 010–015, 017–019 and 008 as appropriate to group expertise. Ask whether each bridge is a correspondence, an invariant identity, a bound, a representation or a transfer theorem. Explain why its reverse implication may fail.

The deliverable is a source-grounded reading note: exact claim, assumptions, construction, proof locator, unresolved step and scope of the student's own check. It may record a failed attempt or a missing prerequisite. Do not replace an incomplete proof with a successful elementary demonstration and report the research theorem as completed.

## Six connection experiments: make a relationship operable

Use the version with the “Connections” entry; the earlier single-island version does not include these scenes. Links below retain the current Sites entry and its creator-only access restriction. For a public deployment, replace only the site-root URL and retain the hash. Models, source locators and actual reading scope are recorded in the [connection curriculum](connection-curriculum.md).

Allow roughly 20–30 minutes per activity, grouping them according to prerequisites. Each shares parameters across representations of one object, or exposes a precise construction's input and output. These teaching relations do not automatically become core edges or formal types.

| Activity | Operation and checkable artifact | Counterexample or boundary |
|---|---|---|
| [One spectrum, evolving heat](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&connection=fourier-heat&lang=en) | Change the mean and four sine coefficients, evolve time, verify the PDE term by term, then derive the energy by orthogonality. | With mean 0.2 the limiting energy is 0.08π, not zero; this periodic heat model is not the wave equation. |
| [From graph cycles to homology](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&connection=graph-homology&lang=en) | Choose K₄ edges, faces and a 1-chain; check ∂₁z, ∂₁∂₂ and the two matrix ranks. | The four face boundaries are dependent; all faces leave β₂=1 because no 3-simplex is added. |
| [Complex powers and lifted paths](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&connection=complex-covering&lang=en) | Set n, starting index k, winding and progress; project the lift by its nth power and record the final fiber label. | A one-turn base loop need not lift to a loop; resetting a principal angle can destroy continuity. |
| [Transport cost and CDF area](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&connection=transport-cdf&lang=en) | Sum CDF-gap rectangle areas and compare with the monotone transport cost of the same pair of measures. | At p=0.5, b=0.5, δ=0.5 the means agree but W₁=0.75; this is not a high-dimensional CDF formula. |
| [Bézout coefficients and common zeros](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&connection=ideal-zeros&lang=en) | Enter polynomials over a selected prime field; check uf+vg=d, divisibility by d, and every field-valued root. | x²+1 over F₃ has no root but is not a unit; the all-zero pair has d=0, which is not monic. |
| [One symmetry, three representations](https://mathcups-mathematical-islands.ljie5996.chatgpt.site/#view=connections&connection=symmetry-representation&lang=en) | Select two D₄ elements and a test vector; compare complex action, real matrix composition and vector output. | Both orders fix zero without commuting; at 1 they give i and −i. |

Ask for four artifacts: a parameter configuration, corresponding values or algebraic objects on both sides, a false claim with a counterexample, and an argument with explicit assumptions. Separate agreement of two computations from justification that a cited theorem applies. Neither is kernel certification. Further reading can ask which new tools are needed when the coefficient field, dimension, boundary conditions or base space changes.

## Propose a new themed island without changing the core

Start from a mathematical object and a genuine question. Examples of worthwhile gaps include an explicit resampling process, a polynomial-partitioning parameter space, a Chow-ring calculation with a fully specified matroid, or a finite instance of a sum-check transcript. A decorative graph with the new topic's name is insufficient.

Prepare an education-only proposal containing:

1. A stable proposed educational ID and real existing core references, or an explicitly external source if no core record exists. Do not fabricate a core ID to make the proposal appear integrated. The current published-lesson contract requires an existing primary core reference; without one, keep the externally sourced proposal as a draft until an explicit education-side adapter or a separate corpus addition is reviewed.
2. A precise object, state variables, operations, admissible parameter range, invariant and failure case. State which quantities will be calculated exactly and which numerically.
3. A visual dictionary: each mark corresponds to a mathematical entity; each control corresponds to an operation; each output has a quantity and scale. Identify what the picture necessarily omits.
4. Bilingual instructions, three substantive steps, an open-ended question, a falsifiable claim with an answer, and a research continuation with sources.
5. A meaningful check such as a preserved marginal, a chain identity, a degree bound or a deliberately rejected invalid premise, plus a separate usability review.
6. A statement that teaching coordinates, progress and state remain in `education/`. Existing core nodes, links, classifications and verification labels remain untouched. Propose any corpus correction separately with evidence and a precise location.

Review the proposal against the [curriculum contract](curriculum.md). A new island can grow in mathematical depth before the map gains another icon. Evaluation should inspect the reasoning artifacts produced in the activity and the correctness of the model; attendance, clicks and journal flags alone cannot establish learning.

## Journey audit notes

The four route arrays in [`../src/data/journeys.ts`](../src/data/journeys.ts) are editorial sequences, not proof dependencies. In the initial wording reviewed for this guide, three clarifications were reported to the application owner: a wave-shaped function is not physically converted from a wave-equation solution into heat; the local-to-global route changes between distinct mathematical objects; and the mean laboratory uses Bernoulli samples rather than the preceding Brownian path. The independence route did not assert an unsupported theorem, but its sequence does not itself construct a functor between all four models. A follow-up reading of the current route file confirmed that these three descriptions were clarified. The lesson plans above retain the model distinctions explicitly.

Guide review scope: existing curriculum, actual laboratory controls, route descriptions and the recorded scope of the 21 literature bridges. This guide adds teaching plans and reading questions; it does not report a learner study, a new mathematical result or verification of all cited proofs.
