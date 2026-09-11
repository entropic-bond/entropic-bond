Feature: Align JsonDataSource collection-change removal semantics with FirebaseDatasource
  As an application using entropic-bond
  I want collection changes to signal removals explicitly and to expose the full result set
  So that I can write data-source-agnostic live listeners

  Background:
    Given an in-memory JsonDataSource is the active data source
    And a document collection "items" with documents "d1", "d2" and "d3"
    And each document has a numeric "score": "d1" is 20, "d2" is 30 and "d3" is 5

  Scenario: Report a document that stops matching the query as a delete [REQ-1]
    Given a collection listener subscribed to the query "score > 10"
    When the document "d1" is updated so that its "score" is 5
    Then the listener is notified with exactly one change
    And that change has type "delete"
    And that change carries the last matching version of "d1"

  Scenario: Report a deleted matching document as a delete to the collection listener [REQ-2]
    Given a collection listener subscribed to the query "score > 10"
    When the document "d1" is deleted from the collection
    Then the listener is notified with exactly one change
    And that change has type "delete"
    And that change carries "d1"

  Scenario: Do not notify the collection listener when a non-matching document is deleted [REQ-3]
    Given a collection listener subscribed to the query "score > 10"
    When the document "d3" is deleted from the collection
    Then the listener is not notified

  Scenario: Report a deleted document as a delete to the document listener [REQ-4]
    Given a document listener subscribed to "d1"
    When the document "d1" is deleted from the collection
    Then the listener is notified with exactly one change
    And that change has type "delete"
    And that change carries "d1"

  Scenario: Provide the full current query result as a snapshot to collection listeners [REQ-5]
    Given a collection listener subscribed to the query "score > 10"
    When the document "d1" is updated so that its "score" is 5
    Then the listener receives a snapshot containing only "d2"

  Scenario: Provide the snapshot as persistent instances through the model [REQ-6]
    Given a model for the document collection
    And a model collection listener subscribed to the query "score > 25"
    When the document "d2" is updated so that its "score" is 40
    Then the listener receives a snapshot containing only "d2"
    And every entry in the snapshot is an instance of the model type
