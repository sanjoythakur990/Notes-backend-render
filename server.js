const cors = require('cors');
const express= require('express');
const sequelize = require('./dbConnection');
const Note = require('./models/notes');
const app= express()
require('dotenv').config()
const PORT= process.env.PORT || 8000


// middlewares
// app.use(cors())
app.use(express.json())    // body parser
app.use(express.urlencoded({extended:true}))


// CORS configuration
const corsOptions = {
    origin: ['https://notes-frontend-vercel-eight.vercel.app', 'http://localhost:3000'], // Allow only these domains
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.get("/", (req,res)=>{
    return res.send("My Notes App")
})


// API Endpoints

// Get all notes
app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);  // return an empty array if no notes found
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve notes", error: error });
    }
});

// Create a new note
app.post('/notes', async (req, res) => {
    const { title, content } = req.body;

    // Validation
    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'Title is required and must be a string' });
    }
    if (!content || typeof content !== 'string') {
        return res.status(400).json({ error: 'Content is required and must be a string' });
    }

    try {
        const note = await Note.create({ title, content });
        res.status(201).json(note);
    } catch (error) {
        if (error.name === 'SequelizeValidationError') {
            // Validation errors that may occur despite prior checks
            res.status(400).json({ error: 'Validation error: ' + error.message });
        } else {
            // Other types of server errors
            res.status(500).json({ error: 'Failed to create note due to a server error' });
        }
    }
});

// Update an existing note
app.put('/notes/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

     // Validate ID
     if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid note ID' });
    }

    try {
        const note = await Note.findByPk(id);
        if (!note) return res.status(404).json({ error: 'Note not found with this id' })

        // Validate fields to update
        if (title !== undefined && typeof title !== 'string') {
            return res.status(400).json({ error: 'Title must be a string' });
        }
        if (content !== undefined && typeof content !== 'string') {
            return res.status(400).json({ error: 'Content must be a string' });
        }

        note.title = title !== undefined ? title : note.title;
        note.content = content !== undefined ? content : note.content;

        // Manually update the updated_at timestamp
        note.updated_at = new Date();

        await note.save();

        res.json(note);
    } catch (error) {
        res.status(500).json({ message:'Failed to update note due to a server error', error: error.message });
    }
});

// Delete a note
app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params;
    
    // Validate ID
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid note ID' });
    }
    
    try {
        const deleted = await Note.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ error: 'Note not found with this id' });

        res.json({ message: 'Note deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete note' });
    }
    
});


// Sync database and start server
sequelize.sync()
    .then(() => {
        console.log('Notes table has been successfully created.');
        app.listen(PORT, () => {
            console.log("Server is running on PORT:", PORT);
        });
    })
    .catch(err => {
        console.error('Error creating table:', err);
    });