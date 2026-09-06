Feature: Compare-and-set (transactional) writes
  As an application using entropic-bond
  I want to persist a document only if it still matches an expected prior state
  So that read-then-write operations such as accepting a ride are race-free

  Scenario: Persist a document when the transaction precondition is satisfied REQ-1
    Given a ride stored with status "requested" and no driver
    When a transaction reads the ride, confirms status is "requested" and no driver is set,
      then saves the ride with status "accepted" and a driver
    Then the transaction resolves with the updated ride
    And the stored ride has status "accepted" and the given driver

  Scenario: Reject with conflict when the precondition fails REQ-2
    Given a ride stored with status "requested" and a driver already set
    When a transaction reads the ride and the precondition "no driver set" fails
    Then the transaction rejects with a conflict reason carrying the stored ride
    And the stored ride is not modified

  Scenario: Exactly one winner on concurrent compare-and-set on the same document REQ-3
    Given a ride stored with status "requested" and no driver
    When two transactions concurrently try to accept the ride with different drivers
    Then exactly one of them resolves
    And the other rejects with a conflict reason
    And the stored ride has the winning driver

  Scenario: Model proxies the transaction with persistent instances REQ-4
    Given a Model for the rides collection
    When a transaction reads a ride as a persistent instance, modifies it and saves it back
    Then the transaction resolves with the ride instance
    And the stored ride reflects the modification

  Scenario: Model transaction save cascades referenced documents REQ-5
    Given a Model for the rides collection
    When a transaction saves a ride that references a driver document
    Then the transaction resolves
    And the driver document is stored in its collection

  Scenario: Transaction deletes a document REQ-6
    Given a ride stored in the collection
    When a transaction deletes the ride
    Then the transaction resolves
    And the stored ride is gone