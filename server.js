const express = require("express")

const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(
        `${new Date().toISOString()} ${req.method} ${req.originalUrl}`
    );

    next();
});

app.use(express.json());


const resources = [
    {
        id : 1, title: "Turn in homrwork", completed: false
    },

];

let nextID = 2;

app.get("/api/resources", (req, res) => {
    res.json(resources);
});

app.get("/api/resources/:id", (req, res) => {
    const id = Number(req.params.id);

    const resource = resources.find((item) => item.id ===id);
    if (!resource)
    {
        return res.status(404).json({
            error: "Resource not found"
        });
    }
    res.json(resource);
})

app.post("/api/resources", (req, res) => {
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
    const newResource = {
        id: nextID++,
        title: title.trim(),
        completed: completed
    };

    resources.push(newResource);

    res.status(201).json(newResource);
});

app.put("/api/resources/:id", (req,res) => {
    const id = Number(req.params.id);
    const resource = resources.find((item) => item.id === id);

    if (!resource)
    {
        return res.status(404).json(
            {
                error: "resource not found"
            }
        );
    }

    const {title, completed} = req.body ?? {};

    if (typeof title !== "string" || title.trim() === "")
    {
        return res.status(400).json(
            {
                error: "title is required"
            }
        );
    }
    if (typeof completed !== "boolean")
    {
        return res.status(400).json(
            {
                error: "completed must be true or false"
            }
        );
    }

        resource.title = title.trim();
        resource.completed = completed;

        res.json(resource);
    
})

app.delete("/api/resources/:id", (req, res) => {
    const id = Number(req.params.id);

    const index = resources.findIndex((item) => item.id === id);
    if (index === -1)
    {
        return res.status(404).json(
            {
                error: "resource not found"
            }
        );
    }

    resources.splice(index, 1);
    res.status(204).send();
})

app.listen(PORT, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});