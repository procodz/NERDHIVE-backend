const express = require('express');
const router = express.Router();
const { userAuth } = require('../middleweres/auth');
const Project = require('../models/projectsModel');

// Create a new project
router.post('/projects', userAuth, async (req, res) => {
    try {
        const project = new Project({
            ...req.body,
            owner: req.user._id
        });
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all public projects
router.get('/projects', userAuth, async (req, res) => {
    try {
        const match = { visibility: 'public' };
        const sort = {};

        if (req.query.sortBy) {
            const parts = req.query.sortBy.split(':');
            sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
        }

        const projects = await Project.find(match)
            .populate('owner', 'firstName lastName photoUrl')
            .populate('collaborators.user', 'firstName lastName photoUrl')
            .sort(sort)
            .limit(parseInt(req.query.limit))
            .skip(parseInt(req.query.skip));

        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get my projects (owned and collaborated)
router.get('/projects/me', userAuth, async (req, res) => {
    try {
        const projects = await Project.find({
            $or: [
                { owner: req.user._id },
                { 'collaborators.user': req.user._id }
            ]
        }).populate('owner', 'firstName lastName photoUrl')
          .populate('collaborators.user', 'firstName lastName photoUrl');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific project
router.get('/projects/:id', userAuth, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [
                { visibility: 'public' },
                { owner: req.user._id },
                { 'collaborators.user': req.user._id }
            ]
        }).populate('owner', 'firstName lastName photoUrl')
          .populate('collaborators.user', 'firstName lastName photoUrl');

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

//Gets all public visible project of a user
router.get('/projects/public/:userId', userAuth, async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.params.userId,
            visibility: 'public'
        })
        .populate('owner', 'firstName lastName photoUrl')
        .populate('collaborators.user', 'firstName lastName photoUrl');
        
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Update project
router.patch('/projects/:id', userAuth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'description', 'status', 'visibility', 'techStack', 'githubLink', 'endDate'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        updates.forEach((update) => project[update] = req.body[update]);
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add collaborator
router.post('/projects/:id/collaborators', userAuth, async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.user._id });
        
        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const { userId, role } = req.body;
        
        // Check if user is already a collaborator
        if (project.collaborators.some(c => c.user.toString() === userId)) {
            return res.status(400).json({ error: 'User is already a collaborator' });
        }

        project.collaborators.push({ user: userId, role });
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Add task
router.post('/projects/:id/tasks', userAuth, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.user._id }, { 'collaborators.user': req.user._id }]
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        project.tasks.push(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update task status
router.patch('/projects/:id/tasks/:taskId', userAuth, async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.id,
            $or: [{ owner: req.user._id }, { 'collaborators.user': req.user._id }]
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        const task = project.tasks.id(req.params.taskId);
        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        task.status = req.body.status;
        await project.save();
        res.json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get public projects for a specific user
router.get('/projects/public/:userId', userAuth, async (req, res) => {
    try {
        const projects = await Project.find({
            owner: req.params.userId,
            visibility: 'public'
        })
        .populate('owner', 'firstName lastName photoUrl')
        .populate('collaborators.user', 'firstName lastName photoUrl');
        
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;