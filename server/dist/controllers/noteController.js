import Note from '../models/Note.js';
export const getNotes = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { search, subjectId, favorite } = req.query;
        const query = { userId };
        if (subjectId) {
            query.subjectId = subjectId;
        }
        if (favorite === 'true') {
            query.favorite = true;
        }
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } },
                { tags: { $regex: search, $options: 'i' } },
            ];
        }
        const notes = await Note.find(query).populate('subjectId', 'name color').sort({ updatedAt: -1 });
        res.json({ success: true, count: notes.length, notes });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notes.' });
    }
};
export const createNote = async (req, res) => {
    try {
        const { title, content, subjectId, tags, favorite } = req.body;
        const userId = req.user?.userId;
        if (!title || !content) {
            res.status(400).json({ success: false, message: 'Title and content are required.' });
            return;
        }
        const note = await Note.create({
            userId,
            title,
            content,
            subjectId: subjectId || null,
            tags: Array.isArray(tags) ? tags : tags ? tags.split(',').map((t) => t.trim()) : [],
            favorite: Boolean(favorite),
        });
        const populatedNote = await Note.findById(note._id).populate('subjectId', 'name color');
        res.status(201).json({ success: true, message: 'Note created successfully.', note: populatedNote });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create note.' });
    }
};
export const updateNote = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, subjectId, tags, favorite } = req.body;
        const userId = req.user?.userId;
        const note = await Note.findOne({ _id: id, userId });
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found or unauthorized.' });
            return;
        }
        if (title)
            note.title = title;
        if (content)
            note.content = content;
        if (subjectId !== undefined)
            note.subjectId = subjectId || undefined;
        if (tags !== undefined) {
            note.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
        }
        if (favorite !== undefined)
            note.favorite = Boolean(favorite);
        await note.save();
        const updatedNote = await Note.findById(note._id).populate('subjectId', 'name color');
        res.json({ success: true, message: 'Note updated.', note: updatedNote });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update note.' });
    }
};
export const toggleFavoriteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const note = await Note.findOne({ _id: id, userId });
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found or unauthorized.' });
            return;
        }
        note.favorite = !note.favorite;
        await note.save();
        res.json({ success: true, message: `Note ${note.favorite ? 'favorited' : 'unfavorited'}.`, favorite: note.favorite });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to toggle favorite status.' });
    }
};
export const deleteNote = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const note = await Note.findOneAndDelete({ _id: id, userId });
        if (!note) {
            res.status(404).json({ success: false, message: 'Note not found or unauthorized.' });
            return;
        }
        res.json({ success: true, message: 'Note deleted.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete note.' });
    }
};
