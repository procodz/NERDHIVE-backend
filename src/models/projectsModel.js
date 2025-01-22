const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    description: {
        type: String,
        required: true,
        trim: true,
        maxLength: 1000
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    collaborators: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['developer', 'designer', 'tester', 'manager'],
            default: 'developer'
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected'],
            default: 'pending'
        }
    }],
    techStack: [{
        type: String,
        required: true
    }],
    githubLink: {
        type: String,
        trim: true,
        validate: {
            validator: function(v) {
                return /^https?:\/\/github\.com\/.*/.test(v);
            },
            message: 'Must be a valid GitHub URL'
        }
    },
    status: {
        type: String,
        enum: ['planning', 'in-progress', 'completed', 'on-hold'],
        default: 'planning'
    },
    visibility: {
        type: String,
        enum: ['public', 'private'],
        default: 'public'
    },
    tasks: [{
        title: {
            type: String,
            required: true
        },
        description: String,
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['todo', 'in-progress', 'review', 'completed'],
            default: 'todo'
        },
        dueDate: Date
    }],
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: Date
}, {
    timestamps: true
});

// Index for better search performance
projectSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Project', projectSchema);