Feature: Per-query pagination cursors
  As an application using entropic-bond
  I want each query to own its pagination cursor
  So that interleaved find/next calls on a single data source do not mix result sets

  Background:
    Given an in-memory JsonDataSource is the active data source
    And a document collection containing ordered documents "d1" to "d6"

  Scenario: Continue a model's own query with next. Issue: #15 [REQ-1]
    Given a model for the document collection
    When the model finds the first 2 documents
    And the model requests the next page
    Then the model receives documents "d3" and "d4"

  Scenario: Interleaved pagination on two models of one collection keeps each result set. Issue: #15 [REQ-2]
    Given two models for the document collection
    When the first model finds the first 2 documents
    And the second model finds the first 3 documents
    And the first model requests the next page
    And the second model requests the next page
    Then the first model receives documents "d3" and "d4"
    And the second model receives documents "d4", "d5" and "d6"

  Scenario: Interleaved pagination across collections does not mix result sets. Issue: #15 [REQ-3]
    Given a model for the document collection
    And a model for a different document collection
    When the first model finds the first 2 documents
    And the second model finds the first document
    And the first model requests the next page
    Then the first model receives documents "d3" and "d4"

  Scenario: Re-running a query resets pagination for that model only. Issue: #15 [REQ-4]
    Given two models for the document collection
    When the first model finds the first 2 documents
    And the second model finds the first 2 documents
    And the first model finds all documents
    And the second model requests the next page
    Then the second model receives documents "d3" and "d4"
