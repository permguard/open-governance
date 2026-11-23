// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import type { Diagram } from './theme/diagrams/types'

/**
 * The diagram at the top of each page, by `<spec>/<name>`. A page draws one before its first word,
 * so that a reader has the picture before the rules.
 */
export const diagrams: Record<string, Diagram> = {
  'oal/overview': {
    type: 'flow',
    stages: [
      { title: 'Goal', items: [{ label: 'Given to an agent', sub: 'by a person or a system', tone: 'brand' }] },
      {
        title: 'The loop',
        items: [
          { label: 'Plan', sub: 'the next step' },
          { label: 'Ask', sub: 'may I? an authorization decision', tone: 'brand' },
          { label: 'Act', sub: 'a tool call, on whose authority' },
          { label: 'Observe', sub: 'and go round again' }
        ]
      },
      {
        title: 'Views',
        items: [
          { label: 'What the agent did', sub: 'step by step, with its authority' },
          { label: 'Loops that run away', sub: 'stuck, repeating, over budget', tone: 'warn' }
        ]
      }
    ],
    arrows: ['starts', 'derive'],
    caption:
      'An agent’s loop as governance records: every step it took, the decision that allowed it, and the authority it rested on.'
  },

  'ocl/overview': {
    type: 'flow',
    stages: [
      {
        title: 'Event',
        items: [
          { label: 'Serious incident', sub: 'of an AI system', tone: 'brand' },
          { label: 'Contested decision', sub: 'or a data breach, a match' }
        ]
      },
      {
        title: 'Obligations',
        items: [
          { label: 'AI Act 73(2)', sub: 'notify · due in 15 days' },
          { label: 'AI Act 14(5)', sub: 'review · two persons' },
          { label: 'GDPR 33(1)', sub: 'notify · due in 72 hours' }
        ]
      },
      {
        title: 'Actions',
        items: [
          { label: 'notify · inform', sub: 'authorities and persons' },
          { label: 'review · remediate', sub: 'by whom, with what evidence' }
        ]
      },
      {
        title: 'Views',
        items: [
          { label: 'met', tone: 'ok' },
          { label: 'late', tone: 'warn' },
          { label: 'overdue', tone: 'error' },
          { label: 'unassessed', tone: 'muted' }
        ]
      }
    ],
    arrows: ['engages', 'met by', 'derive'],
    caption:
      'A compliance process as spans: an event engages obligations, article by article; actions meet them; whether each was performed by its due is derived, never reported.'
  },

  'ocl/cases': {
    type: 'lanes',
    lanes: [
      { label: 'trigger', bars: [{ from: 0, to: 2, tone: 'brand' }] },
      { label: 'obligations', depth: 1, bars: [{ from: 2, to: 3 }] },
      { label: 'inform · 26(5)', bars: [{ from: 4, to: 6, tone: 'ok' }] },
      { label: 'notify · 73(2)', bars: [{ from: 44, to: 48, tone: 'ok' }] },
      { label: 'remediate · 73(6)', bars: [{ from: 50, to: 80, label: 'corrected', tone: 'ok' }] },
      { label: 'due · 73(2)', bars: [{ from: 97.5, to: 99, tone: 'warn' }] },
      { label: 'close', bars: [{ from: 92, to: 94, tone: 'muted' }] }
    ],
    axis: ['aware', 'day 15'],
    caption:
      'One case in time. Each obligation counts from its anchor, here awareness; the obligations are assessed at once; each action meets one; the case closes when nothing is left to do.'
  },

  'ocl/data-model': {
    type: 'nest',
    root: {
      title: 'Organisation',
      tag: 'resource',
      tone: 'brand',
      chips: ['ocl.organization.id', 'ocl.organization.name'],
      children: [
        {
          title: 'Case',
          tag: 'ocl.case.id on every span',
          many: true,
          children: [
            { title: 'Trigger', tag: 'a span, one per case', chips: ['ocl.trigger.type', 'ocl.subject.id'] },
            {
              title: 'Obligation',
              tag: 'a span',
              many: true,
              chips: ['ocl.law.id', 'ocl.law.article', 'ocl.obligation.due'],
              children: [
                { title: 'Action', tag: 'a span, naming its obligation', many: true, chips: ['ocl.action.kind', 'ocl.actor.id'] }
              ]
            },
            { title: 'Close', tag: 'a span, sent once', chips: ['ocl.case.state'] }
          ]
        }
      ]
    },
    caption:
      'What holds what. An organisation is the resource; a case is the id every span carries; obligations belong to the case, and actions name the obligation they meet.'
  },

  'ocl/span-kinds': {
    type: 'flow',
    stages: [
      { title: 'trigger', items: [{ label: 'the event', sub: 'ends at awareness', tone: 'brand' }] },
      { title: 'obligation', items: [{ label: 'the law asks', sub: 'law · article · action · due' }] },
      {
        title: 'action',
        items: [
          { label: 'assess · review · determine', sub: 'with a result or a finding' },
          { label: 'notify · inform · escalate', sub: 'with a recipient' },
          { label: 'remediate · record · attest', sub: 'with evidence or a sign-off' }
        ]
      },
      { title: 'close', items: [{ label: 'closed', tone: 'ok' }, { label: 'withdrawn', tone: 'muted' }] }
    ],
    arrows: ['opens', 'met by', 'until'],
    caption: 'The four kinds of OCL span, in the order a case meets them.'
  },

  'ocl/attributes': {
    type: 'nest',
    root: {
      title: 'Resource',
      tag: 'once per producer',
      tone: 'brand',
      chips: ['ocl.version', 'ocl.organization.id', 'ocl.organization.name', 'service.name'],
      children: [
        {
          title: 'Every span',
          chips: ['ocl.span.kind', 'ocl.case.id'],
          row: true,
          children: [
            { title: 'trigger', chips: ['ocl.trigger.type', 'ocl.subject.*'] },
            { title: 'obligation', chips: ['ocl.obligation.*', 'ocl.law.*', 'ocl.party.role'] },
            { title: 'action', chips: ['ocl.action.*', 'ocl.obligation.id', 'ocl.actor.*', 'ocl.evidence.*', 'ocl.assessment.*'] },
            { title: 'close', chips: ['ocl.case.state'] }
          ]
        }
      ]
    },
    caption:
      'Where each attribute lives: the organisation on the resource, the case on every span, the rest on the kind of span it describes.'
  },

  'ocl/laws': {
    type: 'flow',
    stages: [
      {
        title: 'As the text reads',
        items: [
          { label: 'AI Act, Article 73(2)', tone: 'brand' },
          { label: 'NIS2, Article 23(4)(a)', tone: 'brand' },
          { label: 'NIST CSF 2.0, DE.AE-08', tone: 'brand' }
        ]
      },
      {
        title: 'As OCL records it',
        items: [
          { label: 'eu-ai-act · 73 · 2', sub: 'ocl.law.id · article · paragraph' },
          { label: 'eu-nis2 · 23 · 4 · a', sub: 'with the point' },
          { label: 'std:nist-csf-2.0 · DE.AE · 08', sub: 'a standard, counted apart' }
        ]
      },
      {
        title: 'Added up',
        items: [{ label: 'by law' }, { label: 'by article' }, { label: 'by paragraph' }]
      }
    ],
    arrows: ['in parts', 'group by'],
    caption:
      'A legal reference in parts, so that obligations from every case add up by law, by article, or by a single paragraph.'
  },

  'ocl/schema': {
    type: 'flow',
    stages: [
      { title: 'Producer', items: [{ label: 'An OCL span', sub: 'in its logical JSON form', tone: 'brand' }] },
      {
        title: 'schema.json',
        items: [
          { label: 'Resource', sub: 'version, organisation' },
          { label: 'Attributes', sub: 'kinds, results, references' },
          { label: 'By kind', sub: 'what each kind must carry' }
        ]
      },
      {
        title: 'Result',
        items: [
          { label: 'valid', tone: 'ok' },
          { label: 'invalid', sub: 'with the path and the reason', tone: 'error' }
        ]
      }
    ],
    arrows: ['checked by', 'gives'],
    caption:
      'The schema holds what one span can be checked for on its own; whether an obligation was met takes the whole case.'
  },

  'ocl/state': {
    type: 'flow',
    stages: [
      {
        title: 'Records of a case',
        items: [
          { label: 'obligation', sub: 'action · quorum · due', tone: 'brand' },
          { label: 'actions that count', sub: 'same kind, not failed, before the close' },
          { label: 'the present time' },
          { label: 'the authority', sub: 'whose records count' }
        ]
      },
      {
        title: 'State of an obligation',
        items: [
          { label: 'conflict', tone: 'error' },
          { label: 'not applicable', tone: 'muted' },
          { label: 'met', tone: 'ok' },
          { label: 'late', tone: 'warn' },
          { label: 'performed', sub: 'no due', tone: 'ok' },
          { label: 'unmet', tone: 'error' },
          { label: 'overdue', tone: 'error' },
          { label: 'pending', sub: 'its anchor' },
          { label: 'open' }
        ]
      },
      {
        title: 'Added up',
        items: [{ label: 'case' }, { label: 'subject' }, { label: 'obligation register', tone: 'brand' }]
      }
    ],
    arrows: ['derive', 'add up'],
    caption:
      'Nobody reports a state: it is derived from the obligation, the actions that count towards it, the present time and the authority, checked in this order, then added up by case, by system and by article.'
  },

  'ocl/catalog': {
    type: 'flow',
    stages: [
      {
        title: 'Record',
        items: [
          { label: 'ocl.law.id · article', sub: 'what it cites', tone: 'brand' },
          { label: 'ocl.law.name · citation', sub: 'when it says them, they win' }
        ]
      },
      {
        title: 'Catalog',
        items: [
          { label: 'ocl.catalog.url', sub: 'on the resource, once' },
          { label: 'ocl.catalog.digest', sub: 'sha256: this edition only', tone: 'ok' },
          { label: 'names · citations · dates', sub: 'in every language it carries' }
        ]
      },
      {
        title: 'Shown',
        items: [
          { label: 'GDPR 33(1)', sub: 'from the record or the catalog', tone: 'brand' },
          { label: 'eu-gdpr 33 1', sub: 'when neither names it', tone: 'muted' }
        ]
      }
    ],
    arrows: ['points to', 'fills in'],
    caption:
      'A record cites a law by its id and its parts; what a person reads of it comes from the record, then from the catalog the producer published, read by its digest and kept, then from the id as sent.'
  },

  'ocl/receivers': {
    type: 'flow',
    stages: [
      { title: 'Accept', items: [{ label: 'OTLP/gRPC' }, { label: 'OTLP/HTTP', sub: 'protobuf or JSON' }] },
      {
        title: 'Recognise',
        items: [
          { label: 'ocl.version', sub: 'on the resource', tone: 'brand' },
          { label: 'accepted', sub: 'the span is valid OCL', tone: 'ok' },
          { label: 'refused', sub: 'alone, and counted in the answer', tone: 'error' }
        ]
      },
      { title: 'Keep', items: [{ label: 'stored, then answered', sub: 'once, in any order' }] },
      {
        title: 'Derive',
        items: [{ label: 'cases · obligations', tone: 'brand' }, { label: 'subjects · register', tone: 'brand' }]
      }
    ],
    caption:
      'What a receiver does with an export, span by span: one invalid span is refused alone, and a late or early span is never refused for its order.'
  },

  'ocl/examples': {
    type: 'lanes',
    lanes: [
      { label: 'Northwind · trigger', bars: [{ from: 0, to: 1.5, tone: 'brand' }] },
      { label: 'inform · 26(5)', depth: 1, bars: [{ from: 1.5, to: 3, tone: 'ok' }] },
      { label: 'Lumen AI · trigger', bars: [{ from: 3, to: 4.5, tone: 'brand' }] },
      { label: 'notify · 73(2)', depth: 1, bars: [{ from: 4.5, to: 6.5, tone: 'ok' }, { from: 23, to: 26, tone: 'ok' }] },
      { label: 'due · 73(2)', depth: 1, bars: [{ from: 49, to: 50, tone: 'warn' }] },
      { label: 'inform · 73(6)', depth: 1, bars: [{ from: 27, to: 29, tone: 'ok' }] },
      { label: 'remediate · 73(6)', depth: 1, bars: [{ from: 40, to: 77, label: 'retrained', tone: 'ok' }] },
      { label: 'close', depth: 1, bars: [{ from: 96, to: 98, tone: 'muted' }] }
    ],
    axis: ['10 March', '9 April'],
    caption:
      'The first example in time: the deployer informs the provider within the hour; the provider reports the day after the causal link, completes the report on day 7, tells the authority before correcting, and closes. Two organisations, two cases, one link.'
  },

  'ocl/field-guide': {
    type: 'lanes',
    lanes: [
      { label: 'trigger', bars: [{ from: 0, to: 40, label: 'match', tone: 'brand' }] },
      { label: 'obligation · 14(5)', depth: 1, bars: [{ from: 30, to: 40 }] },
      { label: 'review · first', bars: [{ from: 44, to: 70, label: 'confirmed', tone: 'ok' }] },
      { label: 'review · second', bars: [{ from: 74, to: 100, label: 'confirmed', tone: 'ok' }] }
    ],
    axis: ['09:12', '09:31'],
    caption:
      'The case the producers below emit: a trigger with its obligation in one trace, then each review in a trace of its own, joined by the case id.'
  },

  'oho/overview': {
    type: 'flow',
    stages: [
      {
        title: 'Asked',
        items: [
          { label: 'An agent or a system', sub: 'needs a human decision', tone: 'brand' },
          { label: 'Or acted', sub: 'and a human may reverse it' }
        ]
      },
      {
        title: 'A human',
        items: [
          { label: 'approves', tone: 'ok' },
          { label: 'rejects', tone: 'error' },
          { label: 'escalates', sub: 'to a higher authority', tone: 'warn' },
          { label: 'overrides', sub: 'an automated decision' }
        ]
      },
      {
        title: 'Views',
        items: [
          { label: 'Waiting for a human' },
          { label: 'Oversight history', sub: 'who decided, on whose authority', tone: 'brand' }
        ]
      }
    ],
    arrows: ['request', 'derive'],
    caption:
      'Every point where a person is in the loop, recorded as spans that link to what they approved, rejected or overrode.'
  },

  'sng/schema': {
    type: 'flow',
    stages: [
      { title: 'A record', items: [{ label: 'One span', sub: 'resource, attributes, links', tone: 'brand' }] },
      {
        title: 'Schemas',
        items: [
          { label: 'The envelope', sub: 'span-native-governance/v0' },
          { label: 'Its specification', sub: 'for example open-decision-lineage/v1', tone: 'brand' }
        ]
      },
      {
        title: 'Result',
        items: [
          { label: 'valid', tone: 'ok' },
          { label: 'invalid', sub: 'with the path and the reason', tone: 'error' }
        ]
      }
    ],
    arrows: ['checked by', 'gives'],
    caption:
      'Every record passes two schemas: the envelope every governance record shares, and the schema of its own specification.'
  },

  'odl/schema': {
    type: 'flow',
    stages: [
      { title: 'Producer', items: [{ label: 'An ODL span', sub: 'in its logical JSON form', tone: 'brand' }] },
      {
        title: 'schema.json',
        items: [
          { label: 'Resource', sub: 'version, pipeline, shape' },
          { label: 'Attributes', sub: 'types, values, bounds' },
          { label: 'By kind', sub: 'what each kind must carry' }
        ]
      },
      {
        title: 'Result',
        items: [
          { label: 'valid', tone: 'ok' },
          { label: 'invalid', sub: 'with the path and the reason', tone: 'error' }
        ]
      }
    ],
    arrows: ['checked by', 'gives'],
    caption:
      'The schema holds what one span can be checked for on its own; what takes several spans to judge is the receiver’s.'
  },

  'sng/model': {
    type: 'flow',
    stages: [
      {
        title: 'Sources',
        items: [
          { label: 'AI agents' },
          { label: 'Policies and decision points' },
          { label: 'Pipelines' },
          { label: 'Controls and people' }
        ]
      },
      {
        title: 'Records',
        items: [
          { label: 'OTLP spans', sub: 'the only way in', tone: 'brand' },
          { label: 'Never sampled', sub: 'acknowledged once stored' }
        ]
      },
      {
        title: 'Span store',
        items: [
          { label: 'Append-only', sub: 'the source of truth', tone: 'brand' },
          { label: 'Replayable', sub: 'duplicates stored once' }
        ]
      },
      {
        title: 'Materialization',
        items: [
          { label: 'Event time', sub: 'not arrival order' },
          { label: 'Validity, authority', sub: 'unknown when unproven' }
        ]
      },
      {
        title: 'Views',
        items: [
          { label: 'Decision history', tone: 'brand' },
          { label: 'Risk posture', tone: 'warn' },
          { label: 'Compliance state', tone: 'ok' }
        ]
      }
    ],
    arrows: ['emit', 'store', 'replay', 'derive'],
    caption:
      'Span-Native Governance: whatever the source, a governance record arrives as an OpenTelemetry span, is kept as it came, and every view of governance is derived from the records, never written beside them.'
  },

  'sng/records': {
    type: 'nest',
    root: {
      title: 'Resource',
      tag: 'who emits',
      tone: 'brand',
      chips: ['<spec>.version', 'service.name'],
      children: [
        {
          title: 'Record',
          tag: 'one span',
          many: true,
          chips: ['trace id + span id', 'start · end', 'status', '<spec>.* attributes'],
          children: [
            {
              title: 'Subject',
              tag: 'what the record is about',
              chips: ['the specification’s own keys: a decision, a control, an asset']
            },
            {
              title: 'Links',
              tag: 'to other records',
              many: true,
              chips: ['ogs.link.relation', 'supersedes · evidence · approves · caused_by']
            }
          ]
        }
      ]
    },
    caption:
      'A governance record is one span. Its resource names the specification it follows; its own attributes name what it is about; its links tie it to the records it replaces, proves or answers.'
  },

  'sng/delivery': {
    type: 'flow',
    stages: [
      {
        title: 'Producer',
        items: [
          { label: 'Always sampled', sub: 'a governance tracer never drops', tone: 'brand' },
          { label: 'Retries', sub: 'the same trace and span ids' }
        ]
      },
      { title: 'Transport', items: [{ label: 'OTLP', sub: 'gRPC or HTTP, through collectors with persistent queues' }] },
      {
        title: 'Receiver',
        items: [
          { label: 'Stores, then answers', sub: 'success means kept', tone: 'ok' },
          { label: 'Stores once', sub: 'a resent span is a duplicate' }
        ]
      },
      { title: 'Store', items: [{ label: 'Append-only', sub: 'nothing edited, nothing lost', tone: 'brand' }] }
    ],
    arrows: ['export', 'deliver', 'keep'],
    caption:
      'Delivery is at least once and storage exactly once: a producer may send a record twice, a receiver keeps it once, and nothing is acknowledged before it is kept.'
  },

  'sng/materialization': {
    type: 'lanes',
    lanes: [
      {
        label: 'control evaluated',
        bars: [
          { from: 2, to: 3.5, tone: 'error' },
          { from: 46, to: 47.5, tone: 'ok' }
        ]
      },
      { label: 'exception approved', bars: [{ from: 22, to: 23.5, tone: 'warn' }] },
      {
        label: 'state of CTRL-002',
        bars: [
          { from: 2, to: 22, label: 'failed', tone: 'error' },
          { from: 22, to: 46, label: 'excepted', tone: 'warn' },
          { from: 46, to: 76, label: 'passed', tone: 'ok' },
          { from: 76, to: 100, label: 'unknown', tone: 'muted' }
        ]
      }
    ],
    axis: ['first evaluation', 'validity of the last one ends'],
    caption:
      'The state of a control, materialised from its records. It follows event time, so a record arriving late lands where it belongs; and once the last evaluation is no longer valid, the state is unknown, never passed.'
  },

  'sng/privacy': {
    type: 'flow',
    stages: [
      {
        title: 'At the source',
        items: [{ label: 'The content', sub: 'a decision’s subject, a document, evidence', tone: 'brand' }]
      },
      {
        title: 'In the span',
        items: [
          { label: 'An id', sub: 'what to look up' },
          { label: 'A digest', sub: 'that it was not changed' },
          { label: 'A reference', sub: 'where it lives' }
        ]
      },
      {
        title: 'At the receiver',
        items: [{ label: 'Resolved on demand', sub: 'under the source’s own access rules', tone: 'ok' }]
      }
    ],
    arrows: ['named', 'resolved'],
    caption:
      'Spans travel to systems that do not apply the source’s access rules, so they carry references, never content.'
  },

  'sng/writing': {
    type: 'nest',
    root: {
      title: 'A specification',
      tag: '<spec>.* · its own prefix',
      tone: 'brand',
      children: [
        {
          title: 'Concepts',
          row: true,
          children: [
            { title: 'Purpose and scope', chips: ['what it standardises', 'what it leaves out'] },
            { title: 'Data model', chips: ['subjects and their keys', 'how they map onto spans'] }
          ]
        },
        {
          title: 'Reference',
          row: true,
          children: [
            { title: 'Records', chips: ['span kinds', 'attributes and levels'] },
            { title: 'Interoperability', chips: ['links to other specifications'] }
          ]
        },
        {
          title: 'Interpretation',
          row: true,
          children: [
            { title: 'Materialization', chips: ['the views', 'how each is derived'] },
            { title: 'Receivers', chips: ['accept, refuse, normalise'] },
            { title: 'Security and privacy', chips: ['what never goes in a span'] }
          ]
        },
        { title: 'In practice', chips: ['examples', 'producers in every language', 'conformance', 'versioning'] }
      ]
    },
    caption:
      'Every specification has the same parts, in the same order, so that a reader who knows one knows where to look in the next.'
  },

  'odl/architecture': {
    type: 'flow',
    stages: [
      {
        title: 'Authorization',
        items: [
          { label: 'Decision point', sub: 'allows or denies each request' },
          { label: 'Decision log', sub: 'one stream of decisions per ledger', tone: 'brand' }
        ]
      },
      {
        title: 'Pipelines',
        items: [
          { label: 'privilege-escalation · v3', sub: 'read → enrich → detect' },
          { label: 'cti-sightings · v1', sub: 'read → match → write STIX' },
          { label: 'anomaly-score · v2', sub: 'read ⇉ score ⇉ aggregate' }
        ]
      },
      {
        title: 'OpenTelemetry',
        items: [
          { label: 'Spans with odl.*', sub: 'a batch, its steps, heartbeats, the run’s end', tone: 'brand' },
          { label: 'Any OTLP exporter', sub: 'gRPC or HTTP' }
        ]
      },
      {
        title: 'Receiver',
        items: [
          { label: 'Pipeline graphs', sub: 'one per pipeline version' },
          { label: 'Runs and health', sub: 'running, stalled, ended' },
          { label: 'Lineage', sub: 'decision ⇄ result', tone: 'brand' }
        ]
      }
    ],
    arrows: ['read', 'emit', 'compose'],
    caption:
      'Decisions are logged; pipelines consume the log, each in its own way; every pipeline reports what it did as OpenTelemetry spans, and a receiver composes them back into pipelines, runs and lineage.'
  },

  'odl/shapes': {
    type: 'shapes',
    shapes: [
      {
        title: 'One step',
        line: 'The whole analysis in one step: it reads, detects and writes.',
        nodes: [{ id: 'a', label: 'detect', col: 0, row: 0, tone: 'brand' }],
        edges: []
      },
      {
        title: 'Serial',
        line: 'Each step takes the records of the one before.',
        nodes: [
          { id: 'a', label: 'read', col: 0, row: 0 },
          { id: 'b', label: 'enrich', col: 1, row: 0 },
          { id: 'c', label: 'detect', col: 2, row: 0, tone: 'brand' }
        ],
        edges: [['a', 'b'], ['b', 'c']]
      },
      {
        title: 'Parallel',
        line: 'Two steps work on the same records at once; the next joins them.',
        nodes: [
          { id: 'a', label: 'read', col: 0, row: 0.5 },
          { id: 'b', label: 'identity', col: 1, row: 0 },
          { id: 'c', label: 'geo', col: 1, row: 1 },
          { id: 'd', label: 'detect', col: 2, row: 0.5, tone: 'brand' }
        ],
        edges: [['a', 'b'], ['a', 'c'], ['b', 'd'], ['c', 'd']]
      },
      {
        title: 'Fan-out',
        line: 'One finding written to several streams.',
        nodes: [
          { id: 'a', label: 'read', col: 0, row: 0.5 },
          { id: 'b', label: 'detect', col: 1, row: 0.5, tone: 'brand' },
          { id: 'c', label: 'alerts', col: 2, row: 0, tone: 'muted' },
          { id: 'd', label: 'stix', col: 2, row: 1, tone: 'muted' }
        ],
        edges: [['a', 'b'], ['b', 'c'], ['b', 'd']]
      },
      {
        title: 'One decision a batch',
        line: '1 : 1. Each decision goes through the pipeline alone.',
        nodes: [
          { id: 'd1', label: 'decision', col: 0, row: 0, tone: 'muted' },
          { id: 'd2', label: 'decision', col: 0, row: 1, tone: 'muted' },
          { id: 'b1', label: 'batch', col: 1, row: 0 },
          { id: 'b2', label: 'batch', col: 1, row: 1 }
        ],
        edges: [['d1', 'b1'], ['d2', 'b2']]
      },
      {
        title: 'Many decisions a batch',
        line: '1 : n. A batch takes what arrived since the last one.',
        nodes: [
          { id: 'd1', label: 'decision', col: 0, row: 0, tone: 'muted' },
          { id: 'd2', label: 'decision', col: 0, row: 1, tone: 'muted' },
          { id: 'd3', label: 'decision', col: 0, row: 2, tone: 'muted' },
          { id: 'b', label: 'batch', col: 1, row: 1 }
        ],
        edges: [['d1', 'b'], ['d2', 'b'], ['d3', 'b']]
      },
      {
        title: 'Many workers',
        line: 'A run split into jobs, one per worker or partition.',
        nodes: [
          { id: 'r', label: 'run', col: 0, row: 0.5, tone: 'brand' },
          { id: 'j1', label: 'job-1', col: 1, row: 0 },
          { id: 'j2', label: 'job-2', col: 1, row: 1 },
          { id: 'b1', label: 'batches', col: 2, row: 0, tone: 'muted' },
          { id: 'b2', label: 'batches', col: 2, row: 1, tone: 'muted' }
        ],
        edges: [['r', 'j1'], ['r', 'j2'], ['j1', 'b1'], ['j2', 'b2']]
      }
    ],
    caption:
      'Shapes a pipeline is free to take. ODL prescribes none of them: it describes whichever the pipeline has, from the spans it emits.'
  },

  'odl/data-model': {
    type: 'nest',
    root: {
      title: 'Pipeline',
      tag: 'resource',
      tone: 'brand',
      chips: ['odl.pipeline.id', 'odl.pipeline.version', 'odl.pipeline.name'],
      children: [
        {
          title: 'Run',
          tag: 'odl.run.id on every span',
          many: true,
          children: [
            {
              title: 'Job',
              tag: 'odl.job.id on every span',
              many: true,
              children: [
                {
                  title: 'Batch',
                  tag: 'one trace, its root span',
                  many: true,
                  chips: ['odl.input.stream', 'odl.input.ids'],
                  children: [
                    {
                      title: 'Step',
                      tag: 'a child span',
                      many: true,
                      chips: ['odl.step.id', 'odl.step.upstream', 'odl.output.stream']
                    }
                  ]
                },
                { title: 'Heartbeat', tag: 'a trace of one span', many: true, chips: ['odl.run.state = running'] }
              ]
            },
            { title: 'Run end', tag: 'a trace of one span', chips: ['odl.run.state = succeeded · failed · cancelled'] }
          ]
        }
      ]
    },
    caption:
      'What holds what. A pipeline is the resource its spans share; a run and a job are attributes every span carries; a batch is a trace, and its steps are the spans inside it.'
  },

  'odl/span-kinds': {
    type: 'lanes',
    lanes: [
      { label: 'batch', bars: [{ from: 2, to: 24, label: 'batch 1' }, { from: 30, to: 54, label: 'batch 2' }] },
      { label: 'step · read', depth: 1, bars: [{ from: 2, to: 8 }, { from: 30, to: 36 }] },
      { label: 'step · enrich', depth: 1, bars: [{ from: 8, to: 15 }, { from: 36, to: 42 }] },
      { label: 'step · detect', depth: 1, bars: [{ from: 15, to: 24 }, { from: 42, to: 54, tone: 'error' }] },
      {
        label: 'heartbeat',
        bars: [
          { from: 62, to: 63.5, tone: 'muted' },
          { from: 74, to: 75.5, tone: 'muted' },
          { from: 86, to: 87.5, tone: 'muted' }
        ]
      },
      { label: 'run', bars: [{ from: 95, to: 98, tone: 'ok' }] }
    ],
    axis: ['run starts', 'run ends'],
    caption:
      'One run in time. Each batch is a trace, its steps nested inside; while nothing arrives the run sends heartbeats, and it ends with one run span. Batch 2 failed in its detect step.'
  },

  'odl/attributes': {
    type: 'nest',
    root: {
      title: 'Resource',
      tag: 'once per producer',
      tone: 'brand',
      chips: ['odl.version', 'odl.pipeline.id', 'odl.pipeline.version', 'odl.pipeline.name', 'service.name'],
      children: [
        {
          title: 'Every span',
          chips: ['odl.span.kind', 'odl.run.id', 'odl.job.id'],
          row: true,
          children: [
            { title: 'batch', chips: ['odl.input.*', 'odl.output.count', 'odl.failed.count'] },
            {
              title: 'step',
              chips: ['odl.step.id', 'odl.step.kind', 'odl.step.upstream', 'odl.input.*', 'odl.output.*', 'odl.failed.count']
            },
            { title: 'heartbeat', chips: ['odl.run.state', 'odl.processed.total', 'odl.failed.total'] },
            { title: 'run', chips: ['odl.run.state', 'odl.processed.total', 'odl.failed.total'] }
          ]
        }
      ]
    },
    caption:
      'Where each attribute lives: the pipeline on the resource, the run and job on every span, the rest on the kind of span it describes.'
  },

  'odl/lineage': {
    type: 'flow',
    stages: [
      {
        title: 'Decision log',
        items: [
          { label: 'decisions/commerce/orders', sub: 'odl.input.stream', tone: 'brand' },
          { label: '01a1f060-…992a', sub: 'a decision’s id' }
        ]
      },
      {
        title: 'Batch',
        items: [
          { label: 'odl.input.ids', sub: 'the decisions read, at most 1\u00a0000' },
          { label: 'odl.input.group_id', sub: 'or one id standing for them' }
        ]
      },
      {
        title: 'Steps',
        items: [
          { label: 'read → enrich', sub: 'odl.step.upstream' },
          { label: 'detect', sub: 'writes what it found', tone: 'brand' }
        ]
      },
      {
        title: 'Results',
        items: [
          { label: 'stix/sightings', sub: 'odl.output.stream', tone: 'brand' },
          { label: 'sighting--7f3e…', sub: 'odl.output.ids' }
        ]
      }
    ],
    arrows: ['by id', 'through', 'into'],
    caption:
      'Lineage runs both ways: forward from a decision to every result made from it, backward from a result to the decisions it came from.'
  },

  'odl/runs': {
    type: 'flow',
    stages: [
      {
        title: 'Spans arrive',
        items: [
          { label: 'running', sub: 'a span of the run in the last 2 minutes', tone: 'ok' },
          { label: 'stalled', sub: 'no span for 2 minutes, no run span', tone: 'warn' }
        ]
      },
      {
        title: 'The run span arrives',
        items: [
          { label: 'succeeded', tone: 'ok' },
          { label: 'failed', tone: 'error' },
          { label: 'cancelled', tone: 'muted' }
        ]
      }
    ],
    arrows: ['final'],
    caption:
      'A run’s state is derived, never reported: open while its spans arrive, stalled when they stop, and final once its run span arrives.'
  },

  'odl/receivers': {
    type: 'flow',
    stages: [
      { title: 'Accept', items: [{ label: 'OTLP/gRPC' }, { label: 'OTLP/HTTP', sub: 'protobuf or JSON' }] },
      {
        title: 'Recognise',
        items: [
          { label: 'odl.version = "0.1"', sub: 'on the resource', tone: 'brand' },
          { label: 'accepted', sub: 'the span is valid ODL', tone: 'ok' },
          { label: 'refused', sub: 'alone, and counted in the answer', tone: 'error' }
        ]
      },
      { title: 'Normalise', items: [{ label: 'ids, lists, times', sub: 'one form for every sender' }] },
      {
        title: 'Interpret',
        items: [{ label: 'graph · runs', tone: 'brand' }, { label: 'health · lineage', tone: 'brand' }]
      }
    ],
    caption:
      'What a receiver does with an export, span by span: one invalid span is refused alone, never with its neighbours.'
  },

  'odl/field-guide': {
    type: 'lanes',
    lanes: [
      { label: 'batch', bars: [{ from: 0, to: 100, label: 'privilege-escalation batch' }] },
      { label: 'read-decisions', depth: 1, bars: [{ from: 0, to: 18, label: 'source' }] },
      { label: 'enrich-identity', depth: 1, bars: [{ from: 18, to: 62, label: 'enrich' }] },
      { label: 'detect-escalation', depth: 1, bars: [{ from: 62, to: 100, label: 'detect', tone: 'brand' }] }
    ],
    axis: ['0 ms', '84 ms'],
    caption:
      'The trace of the first example below, as a trace viewer draws it: one batch, three steps, each starting where its upstream ends.'
  }
}
