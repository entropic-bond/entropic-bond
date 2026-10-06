Feature: Single-delay cursor reads
  As an application using entropic-bond
  I want a query read to cost exactly one simulated data source delay
  So that reads keep the latency and the read/change ordering they had before per-query cursors

  Background:
    Given an in-memory JsonDataSource is the active data source
    And a document collection containing ordered documents "d1" to "d6"

  Scenario: A query read resolves after a single simulated delay, not two. Issue: #17 [REQ-1]
    Given the data source simulates a delay of 100 ms
    And a model for the document collection
    When the model reads the query
    Then the read resolves after one simulated delay
    # one simulated delay: 100 ms <= elapsed < 200 ms

  Scenario: Reading the following page resolves after a single simulated delay. Issue: #17 [REQ-2]
    Given the data source simulates a delay of 100 ms
    And a model for the document collection
    When the model finds the first 2 documents
    And the model requests the next page
    Then the page read resolves after one simulated delay
    # one simulated delay: 100 ms <= elapsed < 200 ms

  Scenario: Receiving the cursor does not consume a simulated delay. Issue: #17 [REQ-3]
    Given the data source simulates a delay of 100 ms
    When a direct caller retrieves the query cursor from find
    Then the cursor is received without consuming a simulated delay
    # no simulated delay: elapsed < 50 ms

  Scenario: Reading a page from a directly retrieved cursor costs one simulated delay. Issue: #17 [REQ-4]
    Given the data source simulates a delay of 100 ms
    When a direct caller retrieves the query cursor from find
    And the caller reads the first page from the cursor
    Then the page read resolves after one simulated delay
    # one simulated delay: 100 ms <= elapsed < 200 ms

  Scenario: A read started before a change notification resolves before it. Issue: #17 [REQ-5]
    Given the data source simulates a delay of 100 ms
    And a model for the document collection
    And a collection change listener installed on the model
    When the model reads the query
    And 150 ms later a document is saved
    Then the listener observes the read already resolved

  Scenario: Interleaved cursors keep their own result sets while delayed. Issue: #17 [REQ-6]
    Given the data source simulates a delay of 10 ms
    And two models for the document collection
    When the first model finds the first 2 documents
    And the second model finds the first 3 documents
    And the first model requests the next page
    And the second model requests the next page
    Then the first model receives documents "d3" and "d4"
    And the second model receives documents "d4", "d5" and "d6"
