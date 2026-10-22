# Independent review of the six connection experiments

Reviewer: `/root/education_review`. Review window: 2026-10-22, beginning 15:33 UTC.

The six connection experiments passed this independent review: 15 mathematical/data contracts, 24 bilingual desktop/mobile functional and axe states, and seven integration scenarios. The full browser run completed at 16:09:53 UTC; a later CSS-only change received the focused follow-up recorded below. Earlier evidence in `evidence/review.json` remains historical and was not overwritten. The following scope was written before execution; completed results appear afterward and in `evidence/connections-review.json`.

## Mathematical scope

| Experiment | Relation to verify independently | Cases that distinguish a correct model from a plausible picture |
| --- | --- | --- |
| Fourier → heat | On the circle of period 2π with diffusivity 1, a finite sine expansion evolves by `a_k exp(-k²t)`; energy includes the constant mode and satisfies `E' = -2 ∫ |u_x|²`. | `t=0`; all modes zero; nonzero mean preserved; different decay rates for modes 1 and 4; independent numerical integration of energy and its dissipation; invalid/nonfinite inputs. |
| Graph → homology | Actual boundary matrices over F₂ satisfy `∂₁∂₂=0`; Betti numbers are computed from ranks; homology classes are cycles modulo boundaries. | Enumerate valid K₄ subcomplexes; empty graph, a tree, unfilled triangle, filled triangle, three tetrahedron faces, and all four faces; the last is a 2-sphere with β₂=1, not a filled 3-simplex. A noncycle must not receive a homology class. |
| Complex maps → covering spaces | For `z↦zⁿ`, a specified starting point fixes the continuous lift of the closed base path; the endpoint moves by winding modulo n. | All starting sheets for n=2…8; zero and negative winding; intermediate path time; `projection(lift)=base`; closure exactly when n divides winding. Intermediate prefixes must not be called closed loops with an integer winding number. |
| Probability → transport | For finite probability measures on the real line, a monotone coupling gives `W₁ = ∫ |F-G|`, using the merged ordered support. | Identical measures, Dirac masses, negative translation, vanishing endpoint masses, coincident and reordered support, unequal/invalid mass input; CDF values at jumps are right continuous. No claim about W₂ or general dimensions. |
| Ideals → zero sets | In Fₚ[x], the computed monic gcd and Bézout coefficients establish `(f,g)=(d)`; `V(f)∩V(g)=V(d)` is checked over Fₚ. | Zero polynomials, one zero input, repeated roots, nonprime modulus rejection, division/Bézout identities, and a nonunit polynomial with no Fₚ-rational roots. A root set cannot in general recover the ideal. |
| Symmetry → representations | Every D₄ action agrees between complex multiplication/conjugation and its real matrix; matrix composition agrees with group composition. | All 64 ordered products, inverses and reflection/rotation conventions; both orders for noncommuting pairs; the zero vector has equal images under distinct elements and must not be used to infer element equality. |

Independent checks will use identities, enumeration or a separate numerical calculation, rather than merely repeat a function's implementation. Findings go to the owning agent with a concrete failing input. Changes to their implementation stay with that owner.

## Data, state and interface scope

- Check all six stable IDs, unique lab keys, bilingual fields, cited source URLs and explicit mathematical conditions against the implemented model. Verify core references against the education snapshot, without asking the ontology to adopt curriculum concepts.
- Check experiment snapshots contain actual current parameters and observations, remain JSON serializable and survive note saving/export. Verify the module's URL state, direct links, language switch and browser reload preserve the state they promise to preserve.
- Exercise all six experiments in Chinese and English at desktop and 390px mobile widths. Use actual controls and verify a mathematical result changes, then inspect the resulting page, horizontal overflow, labels, focus and runtime/network errors.
- Run axe on the resulting states with no silent rule suppression. Record automated findings and manual limitations separately; automated success is not a full WCAG certification.
- Verify the publication baseline of 7,314 core files is unchanged using the existing read-only audit. Do not modify the old sealed evaluation data or the core baseline.
- Test a production build after coordinated integration. Earlier development checks may identify bugs, but final evidence must identify the exact build and distinguish it from any later deployment artifact.

## Current status

Review complete. All six implemented models, source locators, data contracts, production interactions and automated accessibility states in the declared scope were checked. The final results below replace the initial pending status; no result was prefilled.

## Executed checks before browser integration

At 15:45 UTC, `tests/connections-independent.test.ts` passed all 10 tests. The independent oracles enumerate all 113 valid K₄ subcomplexes and compare their explicit cycle/boundary sets; all 64 ordered D₄ products are checked on independent basis vectors. The polynomial checks cover 793 pairs over F₂/F₃, verifying Bézout coefficients and divisibility as polynomial identities, not just coincident values on a finite field. The transport check compares 225 measure pairs with a brute minimum over all 24 couplings of four empirical points. Fourier energy and dissipation are compared with independent quadrature, and the covering checks retain the starting sheet and accumulated angle across positive, zero and negative winding.

At 15:53 UTC, four additional curriculum contracts passed: six unique experiment IDs, complete bilingual fields, actual existing course/core references, bounded literature locators, and counterexamples reachable through the implemented controls. The same-mean transport example evaluates to W₁=0.75, and the F₃ no-root example generates a proper ideal.

The reviewer independently read the relevant passages from the curriculum agent’s downloaded files: Hatcher pp. 56–60, 105–106 and 153; Peyré–Cuturi equation (2.37); Conrad’s principal-ideal proof and real dihedral matrices; and Ivrii’s periodic eigenfunctions, modal ODE and constant mode. File sizes and SHA-256 values are recorded in the new evidence. The curriculum agent performed HTTP retrieval. Neither this source check nor the finite-model tests claim to re-prove all referenced books or general theorems.

The publication audit again found all 7,314 pinned core files unchanged relative to `0b56806abb61fe06f7f63481c2008adad646a3af`. Browser integration and automated accessibility results are still pending at this stage.


## Final production result

The independent reviewer ran `node scripts/connections-audit.mjs` from 16:08:30 to 16:09:53 UTC. The script copies `dist` into a temporary directory, serves that immutable copy locally, and uses fresh Chromium contexts. The tested index SHA-256 is `9090c31b46c407175459d8fb1ee07535f813d1e2265e11d9e606853d880b1330`; the audit script SHA-256 is `37754cdaeb497ccdcfeb2d3db8a9d6c1862bf4a09d9b1fa31ac327aef6dcb181`. Temporary serving and copied build files were cleaned up. No personal browser profile was used.

All 24 configurations passed: six experiments × Chinese/English × 1440/390px. Actual controls were changed to mathematically distinguishing states, then saved parameters and observations were compared with independent expected values. The test covered noncycle rejection, the tetrahedron boundary with β₂=1, a nonclosing cover with a changed starting sheet, Dirac transport, a no-root proper ideal, and equal images at zero under different D₄ operations. Default save availability, route reload, inert note text and horizontal layout were also checked. There were zero page/console errors and zero HTTP responses of 400 or above.

Seven integration scenarios passed: (1) language changes, JSON/Markdown exports and exact import roundtrip; (2) unknown experiments, duplicate-ID preservation and atomic invalid-file rejection; (3) the 501-record merge boundary; (4) keyboard skip-link focus; (5) connected classroom/core links and all four mobile navigation routes; (6) two-tab storage propagation; and (7) export and reimport of a near-limit UTF-8 notebook: **90 records, 5,241,855 bytes**, below the 5,242,880-byte limit, with identical roundtrip hash. This fixture exceeds the limit if pretty-printed, so it distinguishes the compact-export fix. Two-tab save/delete actions produced local write counts `[2,1]` and **zero** storage-event writebacks; this verifies last-writer-wins synchronization, not collaborative merging.

Axe reported zero violations in all 24 altered states using WCAG 2 A/AA and 2.1 A/AA tags, with no disabled rules. Its remaining incomplete category was `color-contrast`; this is not a full accessibility certification. The smallest measured SVG text among the 390px states was 14.914 CSS pixels. The reviewer also opened final screenshots of the Chinese mobile covering experiment, English mobile ideal experiment and English desktop D₄ experiment. Earlier missing mapping glyphs and undersized structure labels were corrected before the final complete run.

The independent mathematical/data rerun passed **15/15** tests, including a merge of separately valid Chinese-text backups whose combined UTF-8 size exceeds 5 MiB. Root, as a separate executor, reported **147/147** integrated tests passing with `--maxWorkers=2`; the reviewer does not claim to have executed that full run. The reviewer independently ran the 7,314-file publication-baseline audit successfully, and root repeated it for delivery.

Scope limits: saved entry URLs intentionally do not restore old parameters, as the interface states; snapshots preserve the values for comparison and export. Finite-model tests do not establish general mathematical theorems. The evidence verifies a local production artifact, not subsequent public hosting availability. Source checks cover the named passages rather than entire books or every proof.


## CSS-only follow-up after the full run

The visual reviewer subsequently measured D₄ controls below the intended 44px touch height. Root changed three CSS height rules only. The independent reviewer ran `node scripts/connections-controls-audit.mjs` against the subsequent build with index SHA-256 `953216d4164fa281000de240df983c97c77523c2107907ff7ddc68bf3e37ed20`. All **four** Chinese/English × 1440/390px states passed: every one of the six D₄ buttons/selects/ranges measured **44 CSS pixels** high; the zero-vector counterexample still worked; no horizontal overflow, page errors or HTTP failures appeared; axe reported zero violations. Color-contrast incompletes remain explicitly recorded. Temporary files and server were cleaned up.

The complete 24-state/seven-integration result remains tied to `9090c31…`; the four-state CSS follow-up is tied to `953216d…`. The mathematical/state code was unchanged by this final CSS edit, and no complete-suite rerun on the later artifact is claimed. Full review files are now frozen for delivery.
