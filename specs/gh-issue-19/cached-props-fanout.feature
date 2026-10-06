Feature: Cached props fan-out resource safety
  As a host running CachedPropsUpdater behind a document-change trigger
  I want the owner-document fan-out to bound its memory and concurrency
  So that a single source edit cannot exhaust the process

  Background:
    Given an in-memory JsonDataSource is the active data source
    And an owner collection of 40 documents referencing a watched source document
    #40 = N, large enough to expose the unfiltered read and the unbounded fan-out
    And a CachedPropsUpdater watching the source collection
    #defaults: chunkSize=25, concurrency=4

  Scenario: Leave the owner collection untouched when no cached prop changed. Issue: #19 [REQ-1]
    Given a source document event that leaves every cached prop unchanged
    When the updater processes the event
    Then no owner-collection query is executed
    And the change is reported with no updated documents

  Scenario: Keep saves in flight within chunkSize times concurrency. Issue: #19 [REQ-2]
    Given an updater configured with chunkSize 5 and concurrency 2
    #chunkSize x concurrency = 5 x 2 = 10
    When the updater processes an event that changes a cached prop
    Then the owner query is limited to chunks of 5 documents
    And at most 10 saves are in flight at any moment
    And the 40 matched owner documents are all updated

  Scenario: Resolve only after every save has settled. Issue: #19 [REQ-3]
    When the updater processes an event that changes a cached prop
    Then the returned promise resolves only after the 40 owner saves completed

  Scenario: Report updated documents only after they completed. Issue: #19 [REQ-4]
    When the updater processes an event that changes a cached prop
    Then the change is reported only once all owner saves completed
    And the report lists exactly the completed owner document ids

  Scenario: Reject the returned promise when an owner save fails. Issue: #19 [REQ-5]
    Given an owner save that fails
    When the updater processes an event that changes a cached prop
    Then the returned promise rejects with the save error
    And no save rejection is left unhandled
    And the change is not reported

  Scenario: Ignore an event for a document the updater is writing. Issue: #19 [REQ-6]
    Given a fan-out writing owner document "a"
    When an event for document "a" arrives while that write is in flight
    Then no owner-collection query is executed for that event
    And the document is processed again once the write has settled
    #The guard is in-process state. An event that arrives on a fresh instance
    #is neutralized by the zero-read early-out of [REQ-1] when it changes no
    #cached prop; a genuinely shared deduplication mechanism is not possible
    #inside this package and the remaining deployment-level limitation is
    #documented in cached-props-fanout-design.md.

  Scenario: Reject only after the failing page saves have settled. Issue: #19 [REQ-7]
    Given an owner save that fails while its page siblings settle slowly
    When the updater processes an event that changes a cached prop
    Then the returned promise rejects only after every save of the failing page settled
    And no further page is pulled

  Scenario: Stop pulling pages when an owner page read fails. Issue: #19 [REQ-8]
    Given an owner page read that fails mid-stream
    When the updater processes an event that changes a cached prop
    Then no page is read after the failure
    And the returned promise rejects with the read error
