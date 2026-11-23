// Copyright (c) 2022 Nitro Agility S.r.l.
// SPDX-License-Identifier: Apache-2.0

import type { Diagram } from './theme/diagrams/types'

/**
 * The diagram at the top of each page, by `<spec>/<name>`. A page draws one before its first word,
 * so that a reader has the picture before the rules.
 */
export const diagrams: Record<string, Diagram> = {
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
      { label: 'batch', bars: [{ from: 2, to: 24, label: 'batch 1' }, { from: 30, to: 50, label: 'batch 2' }] },
      { label: 'step · read', depth: 1, bars: [{ from: 2, to: 8 }, { from: 30, to: 36 }] },
      { label: 'step · enrich', depth: 1, bars: [{ from: 8, to: 15 }, { from: 36, to: 42 }] },
      { label: 'step · detect', depth: 1, bars: [{ from: 15, to: 24 }, { from: 42, to: 50, tone: 'error' }] },
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
          { label: 'odl.version = "1"', sub: 'on the resource', tone: 'brand' },
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
