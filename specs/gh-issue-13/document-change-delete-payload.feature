Feature: Align onDocumentChange deletion payload between JsonDataSource and FirebaseDatasource
  As an application consuming data-source document-change notifications
  I want a deletion reported consistently with no after payload
  So that I can detect deletions the same way against any data source

  Background:
    Given an in-memory JsonDataSource is the active data source
    And a document collection "users" with document "u1" named "Alice"

  Scenario: Notify the document listener when the observed document is deleted. Issue: #13 [REQ-1]
    Given a document listener subscribed to document "u1"
    When the document "u1" is deleted from the collection
    Then the listener is notified with exactly one change

  Scenario: Report the deletion with type delete and no after payload. Issue: #13 [REQ-2]
    Given a document listener subscribed to document "u1"
    When the document "u1" is deleted from the collection
    Then the notified change has type "delete"
    And the notified change has no after payload

  Scenario: Carry the removed document as the before payload of the deletion. Issue: #13 [REQ-3]
    Given a document listener subscribed to document "u1"
    When the document "u1" is deleted from the collection
    Then the notified change carries "u1" as its before payload

  Scenario: Ignore deletions of other documents. Issue: #13 [REQ-4]
    Given the collection also contains a document "u2" named "Bob"
    And a document listener subscribed to document "u1"
    When the document "u2" is deleted from the collection
    Then the listener is not notified

  Scenario: Detect the deletion exactly through a missing after payload. Issue: #13 [REQ-5]
    Given a document listener subscribed to document "u1"
    When the document "u1" is saved with the name "Alicia"
    And the document "u1" is deleted from the collection
    Then the listener is notified of two changes
    And every notified change with type "delete" has no after payload
    And every notified change with no after payload has type "delete"

  Scenario: Report a transaction-deleted document with the deletion payload. Issue: #13 [REQ-6]
    Given a document listener subscribed to document "u1"
    When the document "u1" is deleted by a transaction
    Then the notified change has type "delete"
    And the notified change has no after payload
    And the notified change carries "u1" as its before payload

  Scenario: Deliver the deletion as persistent instances through the model. Issue: #13 [REQ-7]
    Given a model for the document collection
    And a model document listener subscribed to document "u1"
    When the document "u1" is deleted through the model
    Then the notified change has no after payload
    And the notified change before payload is an instance of the model type
