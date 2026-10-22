# Mathematical Archipelago · Object Ecology Education

[中文](README.zh-CN.md) · [Repository and core atlas](../README.en.md)

[Open the archipelago](https://mathcups-mathematical-islands.ljie5996.chatgpt.site) (currently owner-private) · [Download the public static site](https://github.com/Lightmaze/Math-Island/archive/refs/tags/education-static-v0.2.0.zip). Extract the archive, run `python -m http.server 8000` inside its directory, and open `http://localhost:8000`; no Node installation or build is needed. GitHub Pages is not enabled; see the [deployment record](docs/deployment.md).

This is an independent education module for the MathCups Mathematical Archipelago. Habitats are organized around mathematical structure: ideals form divisibility layers, sheaves express compatible local data, and heat flow reveals frequency-dependent decay. Terrain is a teaching metaphor. Laboratory diagrams and numerical outputs are computed from specified mathematical models.

Current delivery version: **0.2.0**. This iteration adds six connection workbenches and exportable experiment records. The [one-hour sprint record](docs/one-hour-sprint.md) separates implementation, verification and deployment status.

## What you can explore

- **24 bilingual object explorations across 12 areas.** Each has an object definition, ecological interpretation, working model, three exploration steps, reflection question, counterexample or boundary, sources, and further reading.
- **Six bilingual connection experiments.** Inspect two structures computed from shared mathematical state, with explicit identities, constructions or representations and their conditions.
- **The complete 21,741-entry atlas.** Original coordinates and stable IDs are retained. Search, pan, zoom, filter by domain, inspect actual neighboring relations and evidence, and export a view.
- **21 established literature bridges.** Read mechanisms, assumptions, conclusions and limitations, and locate both endpoints.
- **Four editorial learning journeys.** Frequencies and heat flow; local and global structure; independence and structure; randomness and motion. Dashed routes indicate lesson order, not new proof dependencies or historical causation.
- **Structured experiment records.** Save current parameters, computed results and personal observations; export JSON or Markdown, import JSON, and keep up to 500 records.
- **Learner-owned field notes.** Local storage, Markdown export, JSON backup and import. The application has no account system or telemetry; notes are not uploaded. The current private Sites host separately requires ChatGPT sign-in; local or self-hosted copies do not.

Twenty-four is the number of authored lessons. The six connection workbenches are additional educational activities; they do not increase the core entry count or the 21 existing literature bridges. The 21,741 source entries include concepts, definitions, methods, problems and mathematical statements. They are not 21,741 independent theories, nor individually authored educational habitats. About 68% of the current source snapshot comes from Stacks, so coverage is uneven.

## Objects and models

| Area | Two explorations | Implemented models |
| --- | --- | --- |
| Number theory | Prime Reef; Elliptic Garden | Eratosthenes sieve; secants, tangents and identity on a real cubic |
| Algebra | Symmetry Grove; Finite-field Atoll | Square symmetries D₄; prime-field polynomial interpolation and erasure recovery |
| Commutative algebra | Ideal Basin; Spectrum Marsh | Principal ideals in ℤ; prime points and basic opens in Spec(ℤ/nℤ) |
| Algebraic geometry | Zero-set Peaks; Sheaf Canopy | Circle, hyperbola and cubic loci; gluing local continuous functions on intervals |
| Categories and homology | Homology Cavern; Functor Harbor | Chains and boundaries in finite triangular complexes; structure preservation in finite categories |
| Geometry and topology | Covering Terraces; Curvature Ridge | Circle n-fold covers and path lifting; angle defects and discrete Gauss–Bonnet |
| Analysis | Fourier Tide; Complex Current | Finite Fourier expansions; rotation and dilation by complex multiplication |
| Probability | Brownian Delta; Mean Tide | Gaussian-increment paths on a finite grid; Bernoulli sample means |
| Discrete mathematics | Graph Bridges; Matroid Forest | Nonnegative weighted shortest paths; graphic-matroid rank, forests and bases on K₄ |
| Logic and foundations | Type Observatory; Cantor Coast | Simple typing rules for function application and composition; finite stages of the Cantor set |
| Numerics and optimization | Gradient Basin; Transport Sandbar | Gradient iteration for a specified quadratic; one-dimensional discrete equal-mass optimal transport |
| Mathematical physics | Heat Shore; Spectral Lighthouse | Periodic heat-equation Fourier modes; finite Dirichlet Laplacian eigenmodes |

See the [curriculum contract](docs/curriculum.md), [laboratories](docs/laboratories.md), and [advanced laboratories](docs/advanced-laboratories.md) for precise conditions and limitations. The [teacher guide](docs/teacher-guide.en.md) develops concrete activities and discussion questions. Teaching regions can differ from the source atlas's coarse classifications; the crosswalk records these differences.

## The six 0.2 connection experiments

| Workbench | Mathematical connection you can inspect | Important boundary |
| --- | --- | --- |
| Fourier and heat | Shared finite Fourier coefficients, a periodic heat solution and energy dissipation | Period 2π, diffusivity 1; the constant mode is preserved |
| Graphs and homology | Boundary matrices, cycles, boundaries and F₂ homology of K₄ subcomplexes | Filling all four triangular faces gives a sphere boundary, not a filled 3-simplex |
| Complex maps and coverings | The circle map z↦zⁿ, continuous path lifts and endpoint permutations | The starting point and accumulated angle matter; a path prefix is not a closed loop |
| Transport and CDFs | One-dimensional discrete probability W₁ equals the integral of the absolute CDF difference | This is neither W₂ nor a direct higher-dimensional formula |
| Ideals and zero sets | Gcd, Bézout identities, generated ideals and common zeros in Fₚ[x] | No Fₚ-rational roots does not imply a unit ideal |
| Symmetry and representations | D₄ actions by complex multiplication/conjugation and real 2×2 matrices | Reflection is real-linear; agreement at the zero vector does not identify group elements |

Each workbench combines computation, reachable counterexamples, located sources and assumptions. See the [connection curriculum and source record](docs/connection-curriculum.md), [independent review](docs/connections-review.md), and [teacher guide's connection activities](docs/teacher-guide.en.md). These connections remain educational records; they do not automatically become core relations or formal proofs.

## Using the explorer

Drag or pinch the map, or use zoom buttons and keyboard controls. With the map focused, arrow keys pan, `+` / `−` zoom, and `Home` fits the view. The island index, search and region filters provide textual alternatives. Mobile users can enter the selected island directly from its map shortcut.

Laboratory controls change real model parameters or discrete constructions. Diagram magnification, textual outputs and tables support small-screen reading. Exploration marks record activity, not proof or assessment certification. Read “Where this picture stops” to distinguish an observation from a conclusion and its assumptions.

Field notes use this browser's localStorage. To move them between devices, export and import JSON. A newer timestamp wins a same-island conflict; ties keep the local version. Other records are retained. Notes for lessons missing from this edition remain exportable. Clearing site storage removes local notes, but does not affect downloaded backups.

Connection experiments have a separate local notebook. Saving captures the current parameters, computed results, observation text, model version and time. Export JSON for backup or Markdown for reading. JSON import merges by record ID and keeps the local version of an existing ID. The limit is **500 records**. A backup or merged result exceeding 5 MiB, malformed data, or a merge exceeding the record limit rejects the whole import and retains existing records. At the limit, export a backup before deleting unwanted local records. Browser storage has its own capacity limits; the interface reports when persistence is unavailable.

**Sharing shares only the experiment entry.** Its URL identifies the workbench and language; it does not contain current parameters, results or private notes. Opening an entry from a saved record does not restore its parameters automatically; use the record to reproduce them manually. Field-note backups and experiment backups use different JSON formats: import each through its corresponding notebook. Neither notebook writes to the core or uploads records to an application server.

## Running and building

Requires Node.js 20.19+ or 22.12+; this release was built with Node 24. Browser-ready data is committed, so normal frontend use does not require rebuilding the Python atlas.

```bash
cd education
npm ci
npm run dev                 # http://localhost:4173
npm run build
npm run preview
npm test
```

The output is `education/dist/`, suitable for ordinary static hosting and deployment under a subpath. Serve it over HTTP rather than opening `index.html` directly. After installing dependencies and building, the map, lessons and laboratories work from a local server offline; external literature links require a network connection.

The [connection review](docs/connections-review.md) records 0.2 mathematical and interaction verification. The [historical 0.1 review](docs/review.md) retains evidence for the existing object lessons. Checks cover mathematical invariants, bilingual curriculum completeness, ID resolution, projection of every node and edge, backup merging, and browser interaction. Passing tests is not a proof certificate.

## Growing independently of the core

```text
Core nodes / edges / bridges / layout / bilingual bridge reports
                            │ read-only versioned projection
                            ▼
                   education/public/data
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
       Full-atlas browser             Stable coreId references
                                          │
                              Lessons + models + ecological art
```

Lessons and scenic positions are educational records. They do not overwrite core nodes. The full-atlas browser copies source coordinates and relations faithfully. Illustrative terrain and editorial route strokes do not become graph relations. Unresolved MathCups gradual type annotations remain unresolved; naming a lesson does not complete formal typing.

When the core advances, run `npm run data:build` to produce a new educational projection, review unresolved references, node-order hashes and changed bridge conditions, then update affected lessons. The exporter writes only to `education/public/data`. The education module may also continue to use its explicitly identified earlier snapshot while the core grows independently.

`npm run verify:publication` compares the 7,314 pre-existing files against upstream commit `0b56806`. During development, upstream independently corrected Mafh to Math in the root README; publication preserves that change. The original `66751e9` task baseline and its pre-integration audit remain recorded. The two README versions are not claimed to be byte-identical. Both baselines are version-specific delivery audits, not permanent CI gates preventing core development. See the [review record](docs/review.md) and [data contract](docs/data-contract.md).

## Contributing and licenses

Start a new island with a source-backed stable ID. Specify its object, operations, invariants, assumptions and counterexamples before choosing its habitat and implementing a model. Verify both languages, actual outcomes, mobile reading, keyboard paths and sources. Do not generate invented references, proof relations or mastery certificates to increase the lesson count.

Original software is MIT licensed. Original educational prose and design are shared under CC BY-SA 4.0. Derived source data retains its original licenses. Generated scenic artwork is disclosed as AI-generated. See the [license scope](LICENSE.md) and [core third-party notices](../THIRD_PARTY_NOTICES.md).

[0.2 one-hour sprint](docs/one-hour-sprint.md) · [0.2 connection review](docs/connections-review.md) · [Historical 0.1 delivery and verification](docs/delivery.md)
