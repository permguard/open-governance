# Privacy

Spans travel through collectors, queues and backends that do not apply the access rules of the system the content came from.
A governance record is therefore built to be safe wherever it goes: it names what it is about, and carries nothing that would be harmful to read.

<Diagram of="sng/privacy" />

## What goes in a span

| A record carries | For                                                           | Example                                    |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------ |
| An id            | finding the content again, in the system that holds it        | a decision's id in its decision log        |
| A digest         | proving the content was not changed since the record was made | `sha256:9f2c…` of a piece of evidence      |
| A reference      | where the content lives, when the id alone does not say       | a URI of the document store                |
| A classification | what may be shown to whom, without showing it                 | the sensitivity of the data a record names |

## What never goes in a span

- Personal data: a decision's subject, a user's name, an address.
- The content of evidence: documents, screenshots, payloads.
- Secrets, keys and credentials, in any form.
- The context of an authorization decision, which may carry any of the above.

A specification MUST say, for each attribute it defines, that it carries an identifier or a classification and not content.

## Resolving

A receiver that shows a record MAY resolve its references, under the access rules of the system that holds the content.
Where it cannot, it shows the reference itself: the id, the digest and where to look.

## Records are sensitive too

Even without content, records say things: which decisions a SOC rule found suspicious, which controls failed, which risks were accepted.
A receiver SHOULD protect its store as it would the systems it governs, and SHOULD authenticate the producers that send to it.
