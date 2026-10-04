// The layer model. One definition, used to generate registries, CLAUDE.md tables and the L0 framework doc.
// Layer *ownership* is the point of the system: each layer owns one kind of decision, and a change starts
// in the layer that owns the problem — downstream layers sync to it, never the reverse.

export const LAYERS = [
  { code: 'L0', folder: 'L0-foundation', name: 'Foundation Standards', owns: 'How artifacts are written and governed', notOwn: 'Any product, tech or ops content',
    desc: 'naming, templates, writing rules, governance, engineering principles' },
  { code: 'L1', folder: 'L1-strategy', name: 'Vision & Strategy', owns: 'Why the product exists and how success is measured', notOwn: 'What must be built',
    desc: 'vision, market, positioning, ICP, strategic goals' },
  { code: 'L2', folder: 'L2-product', name: 'Product Requirements', owns: 'What must be built for users and the business', notOwn: 'How it looks, or how it is engineered',
    desc: 'personas, PRDs, feature requirements, priorities, roadmap' },
  { code: 'L2.5', folder: 'L2.5-design-ux', name: 'UX & Design', owns: 'How the product behaves and feels in the interface', notOwn: 'Which features exist, or how they are built',
    desc: 'information architecture, flows, wireframes, design system' },
  { code: 'L3', folder: 'L3-architecture', name: 'Architecture', owns: 'How the system is engineered: boundaries, API contracts, data model, security', notOwn: 'Runbooks or GTM strategy',
    desc: 'system design, ADRs, API contracts, data model, security architecture' },
  { code: 'L4', folder: 'L4-infrastructure', name: 'Infrastructure & Deployment', owns: 'How engineering work is provisioned and deployed', notOwn: 'Product intent or architecture decisions',
    desc: 'environments, CI/CD, infrastructure-as-code, deployment runbooks, cost' },
  { code: 'L5', folder: 'L5-operations', name: 'Operations & GTM', owns: 'How the product is tested, operated, launched and supported', notOwn: 'System architecture or product requirements',
    desc: 'test playbook, runbooks, incident response, launch, support, SLOs' },
  { code: 'L6', folder: 'L6-remediation', name: 'Remediation', owns: 'Audits and corrective plans for drift, defects and compliance gaps', notOwn: 'The fix itself (that is L6.1)',
    desc: 'audit + plan per remediation session', regulated: true },
  { code: 'L6.1', folder: 'L6.1-remediation-execution', name: 'Remediation Execution', owns: 'What was actually done, and the evidence it worked', notOwn: 'Why the problem existed (that is L6)',
    desc: 'tactical implementation checklist + walkthrough evidence per session', regulated: true },
  { code: 'L7', folder: 'L7-forensics', name: 'Forensics & Traceability', owns: 'The permanent chain of custody from finding to merged fix', notOwn: 'Anything it can link to instead',
    desc: 'master registry: audit → plan → execution → evidence → PR', regulated: true },
];

export const LAYER_BY_CODE = Object.fromEntries(LAYERS.map((l) => [l.code, l]));

// Template variables cannot contain a dot in a key, so "L2.5" becomes "L2_5".
export const layerKey = (code) => code.replace('.', '_');
