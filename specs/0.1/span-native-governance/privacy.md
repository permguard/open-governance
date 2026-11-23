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

- Directly identifying data: a decision's subject, a person's name, an address, an account, an IBAN, a customer number.
- The content of evidence: documents, screenshots, payloads.
- Secrets, keys and credentials, in any form.
- The context of an authorization decision, which may carry any of the above.

A specification MUST say, for each attribute it defines, that it carries an identifier or a classification and not content.

## Pseudonymous ids are personal data

A specification names a person by a pseudonymous id, as Open Compliance Evidence names an actor, and a business by a derived transaction id.
For the organisation that can resolve them, these ids are personal data (GDPR Article 4(1), Recital 26), and records carrying them are processed as such: for a purpose that is documented, kept no longer than that purpose needs, and protected as the systems they come from.

| Rule              | Meaning                                                                                             |
| ----------------- | --------------------------------------------------------------------------------------------------- |
| Derived, keyed    | an id is a one-way derivation with a key the organisation holds, never the identifier it stands for |
| Only where needed | an id is set only where a record needs it, never by default                                         |
| Not shared        | two organisations never use the same id value for the same person or transaction                    |
| Resolved inside   | only the organisation resolves an id, under its own access rules, and logs when it does             |

## Resolving

A receiver that shows a record MAY resolve its references, under the access rules of the system that holds the content.
Where it cannot, it shows the reference itself: the id, the digest and where to look.

## Records are sensitive too

Even without content, records say things: which decisions a SOC rule found suspicious, which controls failed, which risks were accepted.
A receiver SHOULD protect its store as it would the systems it governs, and SHOULD authenticate the producers that send to it.
