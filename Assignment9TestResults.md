# Assignment 9 Postman Results


## T01 — List items

`GET /api/items` returned **200 OK**. The collection was empty and returned `[]`.

![T01 — List items — 200 OK](images/assignment-9/t01-list-items.png)

## T02 — Create item

`POST /api/items` returned **201 Created**. Created `Study for exam` with ID `2` and `completed: false`.

![T02 — Create item — 201 Created](images/assignment-9/t02-create-item.png)

## T03 — Read saved item

`GET /api/items/2` returned **200 OK**. Retrieved the item created in T02.

![T03 — Read saved item — 200 OK](images/assignment-9/t03-read-item.png)

## T04 — Update completion

`PUT /api/items/2` returned **200 OK**. Changed `completed` to `true` and preserved the title and ID.

![T04 — Update completion — 200 OK](images/assignment-9/t04-update-item.png)

## T05 — Delete item

`DELETE /api/items/2` returned **204 No Content**. Deleted item `2`. The response body was empty.

![T05 — Delete item — 204 No Content](images/assignment-9/t05-delete-item.png)

## T06 — Verify deletion

`GET /api/items/2` returned **404 Not Found**. The API returned `Resource not found` for the deleted item.

![T06 — Verify deletion — 404 Not Found](images/assignment-9/t06-verify-deletion.png)
