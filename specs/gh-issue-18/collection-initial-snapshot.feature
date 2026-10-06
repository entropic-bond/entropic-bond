Feature: Emit the current collection snapshot when subscribing
  As an application using entropic-bond
  I want onCollectionChange to emit the current matching result on subscribe
  So that a live view can subscribe once and behave identically on every data source

  Background:
    Given an in-memory JsonDataSource is the active data source
    And a document collection "items" with documents "d1", "d2" and "d3"
    And each document has a numeric "score": "d1" is 20, "d2" is 30 and "d3" is 5

  Scenario: Emit the current matching result on subscribe. Issue: #18 [REQ-1]
    Given a collection listener subscribed to the query "score > 10"
    Then the listener has been notified exactly once before subscribing returns

  Scenario: Report each initial document as a create change. Issue: #18 [REQ-2]
    Given a collection listener subscribed to the query "score > 10"
    Then the initial changes are "create" changes for "d1" and "d2"
    And each initial change carries its document in "after"
    And no initial change carries a "before" document

  Scenario: Provide the matching result as the initial snapshot. Issue: #18 [REQ-3]
    Given a collection listener subscribed to the query "score > 10"
    Then the initial snapshot contains exactly "d1" and "d2"

  Scenario: Emit an empty initial result when nothing matches. Issue: #18 [REQ-4]
    Given a collection listener subscribed to the query "score > 100"
    Then the listener has been notified exactly once
    And the initial changes are empty
    And the initial snapshot is empty

  Scenario: Apply query operations, sort and limit to the initial result. Issue: #18 [REQ-5]
    Given a collection listener subscribed to the query "score > 10" sorted by "score" descending with limit 1
    Then the initial snapshot contains exactly "d2"

  Scenario: Do not replay the initial result on later changes. Issue: #18 [REQ-6]
    Given a collection listener subscribed to the query "score > 10"
    When the document "d4" with score 40 is saved
    Then the listener is notified exactly once more
    And that notification reports a single "create" change for "d4"
    And that notification's snapshot contains "d1", "d2" and "d4"

  Scenario: Stop notifying after unsubscribe. Issue: #18 [REQ-7]
    Given a collection listener subscribed to the query "score > 10"
    When the listener is unsubscribed
    And the document "d4" with score 40 is saved
    Then the listener is not notified again

  Scenario: Deliver the initial result through a model as persistent instances. Issue: #18 [REQ-8]
    Given a model for the document collection
    And a model collection listener subscribed to the query "score > 10"
    Then the initial changes carry persistent instances
    And the initial snapshot contains persistent instances "d1" and "d2"

  Scenario: Pin the subscribe contract for any data source implementation. Issue: #18 [REQ-9]
    Given the shared data-source conformance suite
    When the suite runs against a DataSource implementation
    Then a data source that never emits the current matching result on subscribe fails the suite
