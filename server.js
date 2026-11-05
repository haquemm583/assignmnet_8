const express = require("express")
const db = require("./db");
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );

    next();
});

app.use(express.json());

app.param("id", (req, res, next, value) => {
    const id = Number(value);
    if (!Number.isInteger(id) || id < 1 || id > 2147483647)
    {
        return res.status(404).json({error: "Resource not found"});
    }

    req.itemID = id;
    next();
});

app.get("/api/items", async (req, res) => {
    const result = await db.query(
        "SELECT id, title, completed FROM items ORDER BY id"
    );

    res.json(result.rows);
});

app.get("/api/items/:id", async (req, res) => {
    const result = await db.query(
        "SELECT id, title, completed FROM items WHERE id = $1",
        [req.itemID]
    );
    const resource = result.rows[0];
    if (!resource)
    {
        return res.status(404).json({
            error: "Resource not found"
        });
    }
    res.json(resource);
})

app.post("/api/items", async (req, res) => {
    const {title, completed = false} = req.body ?? {};
    if (typeof title !== "string" || title.trim() === "")
    {
        return res.status(400).json(
            {
                error: "A non empty title is required"
            }
        );
    }
    if (typeof completed !== "boolean")
    {
        return res.status(400).json(
            {
                error: "completed must be either true of false"
            }
        );
    }

    const result = await db.query(
        "INSERT INTO items (title, completed) VALUES ($1, $2) RETURNING id, title, completed",
        [title.trim(), completed]
    );

    res.status(201).json(result.rows[0]);
});

app.put("/api/items/:id", async (req,res) => {
    const {title, completed} = req.body ?? {};
    if (title === undefined && completed === undefined)
    {
        return res.status(400).json({error: "title or completed is required"});
    }
    if (title !== undefined && (typeof title !== "string" || title.trim() === ""))
    {
        return res.status(400).json(
            {
                error: "title is required"
            }
        );
    }
    if (completed !== undefined && typeof completed !== "boolean")
    {
        return res.status(400).json(
            {
                error: "completed must be true or false"
            }
        );
    }

    const result = await db.query(
        "UPDATE items SET title = COALESCE($1, title), completed = COALESCE($2, completed) WHERE id = $3 RETURNING id, title, completed",
        [title?.trim() ?? null, completed ?? null, req.itemID]
    );
    const resource = result.rows[0];
    if (!resource)
    {
        return res.status(404).json({error: "resource not found"});
    }

    res.json(resource);
})

app.delete("/api/items/:id", async (req, res) => {
    const result = await db.query("DELETE FROM items WHERE id = $1", [req.itemID]);
    if (result.rowCount === 0)
    {
        return res.status(404).json(
            {
                error: "resource not found"
            }
        );
    }

    res.status(204).send();
})

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
