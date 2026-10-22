#!/usr/bin/env python3
"""Attach the human-readable record of this run's agent passage review.

Running this script replays recorded metadata, not an autonomous mathematical review.
"""
import datetime,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
reviews={
1:('published_research_article','PDF pp. 2–3, 7; Theorem 0.4 and its relation to Theorem 0.5'),
2:('research_paper_preprint','PDF pp. 1–3; Theorem 1 and outline of modular-form/Fourier construction'),
3:('research_paper_preprint','PDF pp. 1–5; loopless definition, characteristic-polynomial conjecture, Chow ring, Theorem 1.4, proof architecture'),
4:('research_paper_preprint','PDF p. 3; Theorem 1.2, finite variables/events and expected resampling count'),
5:('research_paper_preprint','PDF pp. 2–4; Theorems 1.1–1.2 and transference discussion'),
6:('research_paper_preprint','PDF pp. 1, 4; Definition 0.7: compact space, existence of a suitable geodesic, weak displacement convexity'),
7:('published_research_article','PDF p. 1 rendered as image; abstract and introduction, construction families and decoding claims'),
8:('research_paper_preprint','PDF p. 1; abstract and reproduced Theorem 5.18, fixed non-k-order property'),
9:('authored_research_exposition','PDF p. 2; intuitionistic natural deduction and simply typed lambda calculus correspondence'),
10:('collaborative_mathematical_book','PDF pp. 16, 101–102; types/spaces interpretation and Axiom 2.10.3 (univalence); version hott-online-82-g578b85c'),
11:('published_research_article','PDF pp. 1–3 through web PDF extraction; braid closure, Markov moves, trace construction, Theorems 1–2'),
12:('authored_mathematical_book','Chapter 1 PDF pp. 43, 47; semilocal condition and Theorem 1.38'),
13:('collaborative_mathematical_reference','HTML theorem Tag 00FV, both clauses and proof; algebraically closed specialization explicitly stated by atlas'),
14:('institutional_student_exposition','PDF pp. 1, 12; author Robert Hale; Theorem 5.5; atlas uses compact boundaryless regular surfaces in R^3'),
15:('institutional_lecture_notes','PDF p. 7, Theorem 4; nonnegative potential, bounded data, d-dimensional Brownian generator'),
16:('research_paper_preprint','PDF pp. 3–4; Theorems 1–2, delta_3S+3delta_4S<2 and approximate sparsity tail'),
17:('published_research_article','PDF p. 2; Theorem 2.1 and random-projection/union-bound proof outline'),
18:('research_paper_preprint','PDF pp. 2–4; Theorem 0.3, failed naive balancing, Theorem 1.2 and product-polynomial construction'),
19:('published_research_article','PDF p. 2 rendered as image; strong product, theta via orthogonal representations, Theorems 1–2'),
20:('institutional_lecture_notes','PDF p. 1, Section 3: polynomial messages and distinct-point evaluation; [n,k,n-k+1] is the explicit standard root-counting consequence'),
21:('authored_technical_notes','PDF pp. 1–2; oracle/evaluation requirement, fresh uniform challenges, degree rejection, Proposition 1.1 and induction'),
}
audit_path=ROOT/'reports/bridge-source-audit.json'
audit=json.loads(audit_path.read_text())
receipts={x['bridge_id']:x for x in json.loads((ROOT/'reports/bridge-review-receipts.json').read_text())['receipts']}
for r in audit['sources']:
    i=int(r['bridge_id'].split(':')[1]);kind,scope=reviews[i]
    receipt=receipts[r['bridge_id']]
    if r.get('status')!=200 or r.get('sha256')!=receipt['sha256']:
        raise ValueError(f"Source bytes changed or unavailable for {r['bridge_id']}; a new passage review is required")
    if scope!=receipt['passage_read_scope'] or kind!=receipt['source_type']:
        raise ValueError(f"Review metadata changed for {r['bridge_id']}; do not silently inherit the old review")
    r.update(source_type=kind,passage_reviewed=True,passage_read_scope=scope,
      reviewer='agent:/root/atlas_semantics',
      mathematical_review='Selected statement, scope, mechanism and caveats reviewed; full proof not rederived.',
      formal_verification=False)
audit.update(scope='Actual HTTP source retrieval plus separately recorded selected-passage review by atlas_semantics; no kernel proof check.',
    successful_sources=sum(r.get('status')==200 for r in audit['sources']),
    reviewed_sources=len(reviews),
    review_recorded_utc=datetime.datetime.now(datetime.timezone.utc).isoformat(),
    corrections=[
       'Wiles first fetch 503; switched to Rutgers-hosted published-paper scan; retained Theorem 0.4 semistable-Q scope.',
       'Hale author corrected from mistaken Trevor to Robert after reading first page.',
       'Cornell ReedSolomon.pdf proved to be Kim Hamilton slides, not the 1960 article; replaced by MIT course notes and relabelled evidence type.',
       'Gauss–Bonnet relation changed from equivalence to invariant_identity after independent agent review.',
       'Matroid Chinese loopless disambiguated from acyclic.',
       'Moser–Tardos finite bad-event family, Lott–Villani compactness/geodesic quantifier, Feynman–Kac nonnegative potential, CRT original RIP constants made explicit.',
    ],
    reviewer_independence='Scope audit by atlas_audit; agents share model family and context, not independent human referees.')
audit_path.write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
bp=ROOT/'reports/math-bridges.json';data=json.loads(bp.read_text())
for b in data['bridges']:
    r=next(r for r in audit['sources'] if r['bridge_id']==b['id'])
    b['sources'][0].update(source_type=r['source_type'],read_scope=r['passage_read_scope'],
      fetched_sha256=r['sha256'],fetch_status=r['status'])
    b['review_status']='selected_statement_scope_reviewed_not_full_proof'
data['verification']='All 21 sources fetched; relevant statements/definitions or constructions read. Full proofs not reverified; no kernel certification.'
bp.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('Recorded 21 selected-passage reviews; no new proof-verification claim.')
