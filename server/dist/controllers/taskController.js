import StudyTask from '../models/StudyTask.js';
export const getTasks = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { date, status, priority } = req.query;
        const query = { userId };
        if (date)
            query.date = date;
        if (status === 'completed')
            query.completed = true;
        if (status === 'pending')
            query.completed = false;
        if (priority)
            query.priority = priority;
        const tasks = await StudyTask.find(query).populate('subjectId', 'name color').sort({ date: 1, startTime: 1 });
        res.json({ success: true, count: tasks.length, tasks });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch tasks.' });
    }
};
export const createTask = async (req, res) => {
    try {
        const { title, subjectId, date, startTime, duration, priority } = req.body;
        const userId = req.user?.userId;
        if (!title || !date) {
            res.status(400).json({ success: false, message: 'Task title and date are required.' });
            return;
        }
        const task = await StudyTask.create({
            userId,
            subjectId: subjectId || null,
            title,
            date,
            startTime: startTime || '10:00',
            duration: duration ? parseInt(duration) : 45,
            priority: priority || 'Medium',
            completed: false,
        });
        const populated = await StudyTask.findById(task._id).populate('subjectId', 'name color');
        res.status(201).json({ success: true, message: 'Task scheduled.', task: populated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create task.' });
    }
};
export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, subjectId, date, startTime, duration, priority, completed } = req.body;
        const userId = req.user?.userId;
        const task = await StudyTask.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found or unauthorized.' });
            return;
        }
        if (title)
            task.title = title;
        if (subjectId !== undefined)
            task.subjectId = subjectId || undefined;
        if (date)
            task.date = date;
        if (startTime)
            task.startTime = startTime;
        if (duration)
            task.duration = parseInt(duration);
        if (priority)
            task.priority = priority;
        if (completed !== undefined)
            task.completed = Boolean(completed);
        await task.save();
        const populated = await StudyTask.findById(task._id).populate('subjectId', 'name color');
        res.json({ success: true, message: 'Task updated.', task: populated });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update task.' });
    }
};
export const toggleTaskComplete = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const task = await StudyTask.findOne({ _id: id, userId });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found or unauthorized.' });
            return;
        }
        task.completed = !task.completed;
        await task.save();
        res.json({ success: true, message: `Task marked as ${task.completed ? 'completed' : 'pending'}.`, completed: task.completed });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to toggle task status.' });
    }
};
export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const task = await StudyTask.findOneAndDelete({ _id: id, userId });
        if (!task) {
            res.status(404).json({ success: false, message: 'Task not found or unauthorized.' });
            return;
        }
        res.json({ success: true, message: 'Task deleted.' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete task.' });
    }
};
