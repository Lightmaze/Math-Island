# 21 Cross-Field Routes through the Mathematical Archipelago

[中文版](math-bridges.md)

All connections below are established in the mathematical literature. Each retains its conditions of applicability. They are neither new theorems discovered by this project nor edges checked by a proof assistant. Ordinary links in encyclopedia articles do not automatically qualify for inclusion here. Source retrieval and reading records are available in [bridge-source-audit.json](bridge-source-audit.json).

## bridge:001 · Elliptic curves → Modular forms

Endpoints: Elliptic curve → Modular form.

**Mechanism:** Express the arithmetic information of elliptic curves in the language of modular forms and Galois representations, connecting the two through modularity lifting.

**Conditions:** This entry records the scope of Wiles's 1995 result: semistable elliptic curves defined over Q.

**Conclusion:** These elliptic curves admit the corresponding modular parametrizations; together with the Frey–Ribet route, this yields Fermat's Last Theorem.

**Limitations:** This reference alone does not establish the full modularity theorem for all elliptic curves over Q, and the statement does not concern arbitrary number fields.

**Source:** [Andrew Wiles, Modular elliptic curves and Fermat’s Last Theorem (1995)](https://annals.math.princeton.edu/1995/141-3/p01). **Locator:** Introduction, semistable modularity theorem.

## bridge:002 · Modular forms → Sphere packing in dimension eight

Endpoints: Modular form → Sphere packing.

**Mechanism:** Use modular forms to construct a Schwartz function with the required sign and Fourier-transform properties, making the Cohn–Elkies upper bound sharp for E8.

**Conditions:** Euclidean space R^8; the usual density of packings by balls of equal radius.

**Conclusion:** The E8 lattice packing attains the maximum density among all sphere packings in dimension eight.

**Limitations:** Optimality is among all packings, not merely lattice packings. This is not an optimality result in arbitrary dimensions.

**Source:** [Maryna Viazovska, The sphere packing problem in dimension 8 (2017)](https://arxiv.org/abs/1603.04246). **Locator:** Introduction and modular-form construction.

## bridge:003 · Hodge-theoretic structures → Log-concavity for matroids

Endpoints: Hodge theory → Matroid.

**Mechanism:** Construct a Chow ring for a matroid, establish Hard Lefschetz and Hodge–Riemann relations in that ring, and turn inequalities for intersection products into inequalities for combinatorial coefficients.

**Conditions:** The Chow ring of a loopless matroid on a finite, nonempty ground set, together with its ample classes.

**Conclusion:** The absolute values of the coefficients of the matroid's characteristic polynomial form a log-concave sequence.

**Limitations:** The matroid need not be representable by vectors. This does not assert that every matroid comes from a smooth projective variety.

**Source:** [Adiprasito, Huh, Katz, Hodge Theory for Combinatorial Geometries (2018)](https://arxiv.org/abs/1511.02888). **Locator:** Abstract and main theorem statements.

## bridge:004 · The local lemma → A resampling algorithm

Endpoints: Lovász local lemma → Randomized algorithm.

**Mechanism:** Define bad events in terms of independent random variables. Whenever a bad event occurs, resample only its variables, using witness trees to bound the number of resamplings.

**Conditions:** A finite independent-variable model and a finite family of bad events; Γ(A) consists of bad events sharing variables with A. There are values 0<x(A)<1 such that P(A)≤x(A)∏_{B∈Γ(A)}(1−x(B)).

**Conclusion:** The algorithm finds an assignment avoiding every bad event. The expected number of resamplings of event A is at most x(A)/(1−x(A)).

**Limitations:** Running time also depends on the costs of detecting events and resampling variables. This does not directly extend to arbitrary dependence models.

**Source:** [Moser and Tardos, A constructive proof of the general Lovasz Local Lemma (2009)](https://arxiv.org/abs/0903.0544). **Locator:** Theorem 1.2.

## bridge:005 · A dense combinatorial theorem → Arithmetic progressions of primes

Endpoints: Szemerédi’s theorem → Prime number.

**Mechanism:** Place the sparse primes under a pseudorandom majorizing measure built using sieve methods, and prove a relative Szemerédi theorem to transfer combinatorial conclusions from dense sets.

**Conditions:** Each fixed positive integer k. The transference step requires the paper's pseudorandomness conditions; infinitude of the set alone is insufficient.

**Conclusion:** The primes contain arithmetic progressions of every finite length.

**Limitations:** The progression is not required to consist of consecutive primes. A positive-density assumption in the positive integers cannot be applied directly to the zero-density set of primes.

**Source:** [Green and Tao, The primes contain arbitrarily long arithmetic progressions (2008)](https://arxiv.org/abs/math/0404188). **Locator:** Introduction and transference discussion.

## bridge:006 · Optimal transport → Synthetic Ricci curvature

Endpoints: Optimal transport → Ricci curvature.

**Mechanism:** Express lower curvature bounds through displacement convexity of entropy functionals along geodesics in the Wasserstein space of probability measures.

**Conditions:** The framework of compact measured length spaces and probability measures in the Lott–Villani paper. Nonnegative N-Ricci curvature for finite N and an infinite-dimensional lower bound K have distinct definitions. This version requires the existence of a suitable Wasserstein geodesic between each pair of endpoints; it does not require every such geodesic to satisfy the condition.

**Conclusion:** The resulting curvature conditions apply to nonsmooth spaces and are preserved under the measured Gromov–Hausdorff limits specified in the paper.

**Limitations:** This entry does not identify all versions of CD, RCD, or nonbranching conditions with one another.

**Source:** [Lott and Villani, Ricci curvature for metric-measure spaces via optimal transport (2009)](https://arxiv.org/abs/math/0412127). **Locator:** Abstract and definitions in introduction.

## bridge:007 · Expander graphs → Error-correcting codes

Endpoints: Expander graph → Error-correcting code.

**Mechanism:** Organize local checks using graphs with sufficient expansion, so that local error signals can guide iterative correction.

**Conditions:** The graph must satisfy the quantitative expansion assumptions of the construction and decoding theorems. The local codes and rate parameters must match the selected expander-code construction.

**Conclusion:** One can construct asymptotically good families of codes with efficient decoding algorithms that correct a constant fraction of errors.

**Limitations:** An arbitrary graph called an expander, combined with arbitrary local codes, does not automatically provide the same decoding guarantee.

**Source:** [Sipser and Spielman, Expander Codes (1996)](https://www.cs.yale.edu/homes/spielman/Research/expanders.html). **Locator:** Abstract and construction overview.

## bridge:008 · Model-theoretic stability → Graph regularity

Endpoints: Stability theory (model theory) → Szemerédi regularity lemma.

**Mechanism:** Recognize half-graph order patterns as combinatorial witnesses of model-theoretic instability. Excluding half-graphs of a uniform size allows a decomposition using stability theory.

**Conditions:** Finite graphs with the non-k-order property for a fixed k, and a fixed approximation parameter ε>0.

**Conclusion:** Stable graphs admit stronger regularity partitions, with none of the irregular pairs allowed in the usual version and with improved bounds on partition size.

**Limitations:** The hypothesis is not merely the exclusion of a particular induced complete graph. The result does not apply to all finite graphs.

**Source:** [Malliaris and Shelah, Regularity lemmas for stable graphs (2014)](https://arxiv.org/abs/1102.3904). **Locator:** Abstract; Theorem 5.18 locator.

## bridge:009 · Intuitionistic logic ↔ Typed lambda calculus

Endpoints: Intuitionistic logic → Lambda calculus.

**Mechanism:** Correspond propositions to types, proofs to terms, and proof reduction to program evaluation; connect introduction and elimination rules with rules for constructing and using terms.

**Conditions:** The basic initial example is the implication fragment of intuitionistic logic and the simply typed lambda calculus with function types only. Extending to conjunction, disjunction, and falsity ⊥ requires product, sum, and empty types, respectively, with matching introduction and elimination rules.

**Conclusion:** Proof objects can be expressed as type-checked programs, with a precise correspondence between logical rules and program constructions.

**Limitations:** After adding unrestricted recursion, exceptions, or uncontrolled axioms, arbitrary programs cannot still be treated unconditionally as proofs of total correctness.

**Source:** [Philip Wadler, Propositions as Types (2015)](https://www.research.ed.ac.uk/en/publications/propositions-as-types/). **Locator:** Propositions/types and proofs/programs sections.

## bridge:010 · Dependent type theory ↔ Homotopy structures

Endpoints: Type theory → Homotopy theory.

**Mechanism:** Interpret types as spaces, identity types as paths, and higher identities as homotopies. Univalence connects equality of types with equivalence.

**Conditions:** Specify the dependent type theory, its identity-type rules, and additional axioms such as univalence.

**Conclusion:** Within this foundation, one can construct and compute homotopy invariants and organize proofs in the language of homotopy.

**Limitations:** This does not mean that every traditional type system automatically satisfies univalence, and it does not claim that this atlas has been checked by a proof assistant.

**Source:** [The Univalent Foundations Program, Homotopy Type Theory (2013)](https://homotopytypetheory.org/book/). **Locator:** Chapter 2: types, identity paths, and univalence.

## bridge:011 · Operator algebras → Knot invariants

Endpoints: Von Neumann algebra → Jones polynomial.

**Mechanism:** Obtain braid-group representations from algebraic relations associated with subfactors, then normalize a trace satisfying the Markov property to remove dependence on the chosen braid representation.

**Conditions:** Tame oriented classical links, braid closures, and Markov equivalence. The trace and normalization must satisfy the relations required for invariance.

**Conclusion:** This constructs the Jones polynomial as an isotopy invariant of links.

**Limitations:** Equal invariants do not guarantee isotopic knots. An invariant is not a complete classification.

**Source:** [Vaughan Jones, A polynomial invariant for knots via von Neumann algebras (1985)](https://doi.org/10.1090/S0273-0979-1985-15304-2). **Locator:** Pages 103–105, Theorems 1–2.

## bridge:012 · Covering spaces ↔ Subgroups of the fundamental group

Endpoints: Covering space → Fundamental group.

**Mechanism:** Path lifting gives an action of the fundamental group on a covering's fiber; connected coverings are characterized by the corresponding subgroups.

**Conditions:** The base space is path-connected, locally path-connected, and semilocally simply connected. The based version uses subgroups; connected coverings without chosen basepoints use conjugacy classes of subgroups.

**Conclusion:** This gives a correspondence between the classification of covering spaces and group-theoretic objects.

**Limitations:** The local hypotheses cannot simply be removed while retaining the full classical classification theorem.

**Source:** [Allen Hatcher, Algebraic Topology (2002), Section 1.3](https://pi.math.cornell.edu/~hatcher/AT/ATpage.html). **Locator:** Section 1.3, classification of covering spaces.

## bridge:013 · Radical ideals ↔ Affine algebraic sets

Endpoints: Radical ideal → Algebraic set.

**Mechanism:** Hilbert's Nullstellensatz relates common zeros of polynomials to vanishing ideals: I(V(I))=√I.

**Conditions:** k is an algebraically closed field, and k[x1,…,xn] is a polynomial ring in finitely many variables.

**Conclusion:** Affine algebraic sets and radical ideals are in an inclusion-reversing bijection.

**Limitations:** Over a general field that is not algebraically closed, taking only k-rational points does not recover the same ideal. The absence of rational points does not imply that the ideal is the unit ideal.

**Source:** [The Stacks Project, Hilbert Nullstellensatz, Tag 00FV](https://stacks.math.columbia.edu/tag/00FV). **Locator:** Theorem 10.34.1 and its proof; algebraically closed specialization.

## bridge:014 · Integrated curvature → Euler characteristic

Endpoints: Gaussian curvature → Euler characteristic.

**Mechanism:** Gauss–Bonnet converts the integral of local curvature into a topological invariant.

**Conditions:** The scope of the cited notes: a smooth, compact, orientable regular surface in R^3 without boundary, equipped with the induced metric.

**Conclusion:** ∫M K dA=2πχ(M).

**Limitations:** A boundary requires an additional boundary-curvature term; the formula does not apply directly to the noncompact case. Equal total curvature does not determine the same metric or curvature distribution.

**Source:** [Robert Hale, The Gauss–Bonnet Theorem, University of Chicago REU (2022)](https://www.math.uchicago.edu/~may/REU2022/REUPapers/Hale.pdf). **Locator:** Global Gauss–Bonnet statement; institutional expository source.

## bridge:015 · Brownian paths → Parabolic PDEs

Endpoints: Brownian motion → Heat equation.

**Mechanism:** Take expectations involving the initial data and potential along Brownian paths, turning probabilistic evolution into a solution of the heat equation with a potential.

**Conditions:** A conservative sufficient scope: a bounded, nonnegative, smooth potential V on R^d and bounded smooth initial data f, at fixed finite t. Brownian motion has generator (1/2)Δ.

**Conclusion:** u(t,x)=E_x[exp(−∫0^t V(Bs)ds)f(Bt)] solves ∂t u=(1/2)Δu−Vu, with u(0,x)=f(x).

**Limitations:** Unbounded potentials, explosive diffusions, or stopping at a boundary require additional integrability and boundary conditions.

**Source:** [Steven Lalley, Stochastic Differential Equations, Diffusion Processes, and the Feynman–Kac Formula](https://www.stat.uchicago.edu/~lalley/Courses/391/). **Locator:** Feynman–Kac theorem; stated here in conservative smooth bounded scope.

## bridge:016 · Sparse geometry → Recovery by convex optimization

Endpoints: Restricted isometry property → Compressed sensing.

**Mechanism:** Use restricted isometry to control sparse directions, reducing recovery from underdetermined measurements to ℓ1 minimization subject to a noise constraint.

**Conditions:** The matrix's restricted isometry constants satisfy δ_(3S)+3δ_(4S)<2, as in Theorem 1 of the cited paper. The actual error obeys ||e||2≤ε, and a global minimizer of the constrained ℓ1 problem is used.

**Conclusion:** The recovery error for sufficiently sparse vectors is controlled by the measurement noise. For approximately sparse vectors, an additional tail-approximation error appears.

**Limitations:** Recovery is not guaranteed for arbitrary low-rank matrices, arbitrary feasible solutions, or an unchecked noise radius. This entry does not substitute sharper RIP constants from later literature.

**Source:** [Candès, Romberg, Tao, Stable Signal Recovery from Incomplete and Inaccurate Measurements (2006)](https://arxiv.org/abs/math/0503066). **Locator:** Abstract and main recovery statements.

## bridge:017 · Concentration of measure → Euclidean dimension reduction

Endpoints: Concentration of measure → Johnson–Lindenstrauss lemma.

**Mechanism:** A random projection concentrates the length of a single vector. A union bound over finitely many pairs then yields an embedding preserving all pairwise distances simultaneously.

**Conditions:** n≥2 Euclidean points, 0<ε<1, and a positive integer target dimension k. The cited proof applies for k≥4 log(n)/(ε²/2−ε³/3). When k is at least the original dimension, an isometric embedding can be used.

**Conclusion:** There is a map into R^k under which every squared pairwise distance lies within a factor of (1±ε) of its original value.

**Limitations:** This does not preserve every pair of points in an entire continuous space, and it cannot directly replace embedding theorems for general metric spaces.

**Source:** [Dasgupta and Gupta, An elementary proof of a theorem of Johnson and Lindenstrauss (2003)](https://doi.org/10.1002/rsa.10073). **Locator:** Theorem 2.1 and proof outline.

## bridge:018 · A topological zero principle → Polynomial partitioning

Endpoints: Borsuk–Ulam theorem → Polynomial partitioning.

**Mechanism:** Treat polynomial coefficients as a parameter space and use a topological zero argument to balance simultaneously the numbers of varieties meeting the cells.

**Conditions:** Γ is a finite collection of k-dimensional real algebraic varieties in R^n with uniformly bounded complexity. D≥1; a uniform constant requires a fixed complexity bound.

**Conclusion:** There is a nonzero polynomial P of degree at most D such that each connected component of R^n\Z(P) meets at most C D^(k−n)|Γ| members of Γ.

**Limitations:** The statement does not control the parts lying in Z(P). One variety may cross multiple cells. This is not a guarantee of an efficient construction algorithm.

**Source:** [Larry Guth, Polynomial partitioning for a set of varieties (2015)](https://arxiv.org/abs/1410.8871). **Locator:** Main theorem and topological argument.

## bridge:019 · Semidefinite optimization → An upper bound on zero-error capacity

Endpoints: Semidefinite programming → Shannon capacity.

**Mechanism:** Define Lovász θ through orthogonal representations or an equivalent semidefinite program, and use graph-product properties to control the growth of independent sets.

**Conditions:** Finite undirected simple graphs; Shannon capacity is defined by the growth rate of independence numbers under the strong graph product.

**Conclusion:** α(G)≤Θ(G)≤θ(G); for the pentagon C5, Θ(C5)=√5.

**Limitations:** Equality Θ(G)=θ(G) is not guaranteed for general graphs. High-precision numerical SDP output requires additional error control before it becomes a rigorous upper-bound certificate.

**Source:** [László Lovász, On the Shannon Capacity of a Graph (1979)](https://doi.org/10.1109/TIT.1979.1055985). **Locator:** Definition of theta and capacity upper bound.

## bridge:020 · Interpolation over finite fields → Reed–Solomon codes

Endpoints: Polynomial interpolation → Reed–Solomon code.

**Mechanism:** Encode a message as the coefficients of a low-degree polynomial and evaluate it at distinct finite-field elements. A bound on the number of roots turns polynomial differences into Hamming distance.

**Conditions:** A finite field Fq; 1≤k≤n≤q; n distinct evaluation points. The evaluated polynomials have degree strictly less than k.

**Conclusion:** This gives an [n,k,n−k+1]q code. Any k error-free symbols recover the message by interpolation.

**Limitations:** Recovery from erasures and correction of errors at unknown locations are different guarantees. Repeated evaluation points invalidate the distance argument.

**Source:** [MIT 6.885 Algebra and Computation, Lecture 16 (2005), Reed–Solomon evaluation codes; original: Reed and Solomon (1960)](https://people.csail.mit.edu/madhu/FT05/scribe/lect16.pdf). **Locator:** Section on Reed–Solomon codes; primary course notes, not a scan of the 1960 paper.

## bridge:021 · Polynomial root bounds → Interactive proofs

Endpoints: Polynomial identity testing → Sum-check protocol.

**Mechanism:** Reduce a high-dimensional finite sum, round by round, to consistency checks for univariate polynomials. Fresh random challenges bound the probability of accepting a false equality by the corresponding fraction of roots.

**Conditions:** A finite field F, degree at most d in each variable, and m rounds. The verifier checks degrees at every round and uses independent uniform challenges; it can evaluate the target polynomial reliably at the end.

**Conclusion:** The standard sum-check protocol is complete, and the probability of accepting a false sum is at most md/|F|, and always at most 1.

**Limitations:** Reusing challenges, omitting degree checks, or relying on an unverified answer for the final evaluation loses this guarantee.

**Source:** [Justin Thaler, The Sum-Check Protocol; Proofs, Arguments, and Zero-Knowledge](https://people.cs.georgetown.edu/jthaler/ProofsArgsAndZK.html). **Locator:** Protocol and soundness theorem.
