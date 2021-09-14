const { User, Thought } = require('../models');

const thoughtController = {

    // GET all thoughts
    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
            path: 'user',
            select: '-__v'
        })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err)
        });
    },

    // GET a thought by id
    getThoughtById({ params }, res ) {
        Thought.findOne({ _id: params.thoughtId })
        .select('-__v')
        .sort({ _id: -1 })
        .then(dbThoughtData => res.json(dbThoughtData))
        .catch(err => {
            res.status(400).json();
        });
    },

    // ADD new thought
    addThought({ body }, res) {
        console.log(body);
        Thought.create(body)
        .then(({ _id }) => {
            return User.findOneAndUpdate(
                { _id: body.userId },
                { $push: { thoughts: _id }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found.' });
                return;
            }
        res.json(dbUserData);
        })
        .catch(err => res.json(err));
    },

    // UPDATE though by id
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.id }, 
            body,
            { new: true, runValidators: true }
        )
        .then(updatedThought => {
            if (!updatedThought) {
                return res.status(404).json({ message: 'No thought found.' });
            }
        res.json(updatedThought);
        })
        .catch(err => res.json(err));
    },

    // DELETE thought
    deleteThought({ params }, res) {
        Thought.findByIdAndDelete({ _id: params.thoughtId })
        .then(deletedThought => {
            if(!deletedThought) {
                res.status(404).json({ message: 'No thought found.'});
                return;
            }
            // res.json(deletedThought);
            return User.findByIdAndUpdate(
                { _id: params.userId },
                { $pull: { thoughts: params.thoughtId }},
                { new: true }
            );
        })
        .then(dbUserData => {
            if(!dbUserData) {
                res.status(404).json({ message: 'No user found.'});
                return;
            }
    
            res.json(dbUserData);
        })
    },

    // ADD reaction
    addReaction({ params, body }, res ) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body }},
            { new: true, runValidators: true }
        )
        .then(dbReactionData => {
            if(!dbReactionData) {
                res.status(404).json({ message: 'No thought found.' });
                return;
            }
            res.json(dbReactionData);
        })
        .catch(err => res.json(err));
    },

    // DELETE reaction
    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId }}},
            { new: true }
        )
        .then(dbReactionData => {
            if(!dbReactionData) {
              res.status(404).json({ message: 'No reaction found.' });
              return;
            }
            res.json(dbReactionData);
        })
        .catch(err => res.json(err));
    }
}

module.exports = thoughtController;
