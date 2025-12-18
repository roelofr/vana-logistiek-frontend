# Domain Model

Hieronder is het domeinmodel. Klassenamen zijn in het Engels.

## User

Gebruikers van de applicatie.

id: int
provider_id: int
name: string
email: string

## Team

Vangt gebruikers samen onder één team. Dit zijn wijken, maar soms ook teams als CP en Gator.

id: int
name: string
color: string
icon: string


## UserTeams

Gebruikers kunnen lid zijn van een of meer teams, dus many-to-many.

id: int
user_id: int
team_id: int

## Thread

Een thread, wat voorheen een Ticket was.

* id: int
* vendor_id: int
* user_id: int
* team_id: int
* assigned_team_id: nullable int
* assigned_user_id: nullable int
* subject: string
* read: boolean
* created_at: datetime
* updated_at: datetime
* resolved_at: datetime

## ThreadUpdate

Een update, dit kan een bericht zijn of een wijziging (assignment naar een team of gebruiker, en status verandering)

* id: int
* thread_id: int
* user_id: int
* team_id: int
* type: varchar(30)
* data: json
* created_at: datetime

## ThreadTeam

We houden bij welk team interactie heeft gehad met Threads, zodat we dit niet hoeven te querien uit de ThreadUpdate
tabel. Many-to-many, maar unique-constraint op team_id-thread_id

* id: int
* thread_id: int
* team_id: int
