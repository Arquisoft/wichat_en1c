Feature: Game interaction functionality

  Scenario: Request a hint and display it
    Given I am logged in at game
    And I have entered a question in the input field
    And I have remaining hints
    When I click the hint button
    Then the hint counter should increase by 1
    And the hint input should be temporally disabled

  Scenario: Next round answering
    Given I am logged in at game
    When I answer the question
    Then the round should increase
    And the hints requests reset
    And the time reset

  Scenario: Next round time
    Given I am logged in at game
    When question time runs out
    Then the round should increase
    And the hints requests reset
    And the time reset

  Scenario: Finish game
    Given I am logged in at game
    When I answer all the rounds
    Then the game should end
    And I am redirected to the end game page
