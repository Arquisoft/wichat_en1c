Feature: Login into the app

  Scenario: Successful login with valid credentials
    Given A registered user with valid credentials
    When I log in using the correct credentials
    Then I should see a success message

  Scenario: Login with empty username
    Given A user with no username
    When I try to log in
    Then I should see an unauthorized error message

  Scenario: Login with empty password
    Given A user with no password
    When I try to log in
    Then I should see an unauthorized error message

  Scenario: Login with incorrect password
    Given A registered user with an incorrect password
    When I try to log in
    Then I should see an unauthorized error message

  Scenario: Login with non-existing user
    Given A non-existing username
    When I try to log in
    Then I should see an unauthorized error message