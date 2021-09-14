const { Schema, model } = require('mongoose');
const moment = require('moment');

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please enter a valid email address']
    },
    thoughts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Thought'
        }
    ],
    friends: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ]
},
{ 
    toJSON: {
        virtuals: true
    },
    id: false
}
);

const User = model('User', UserSchema);

UserSchema.virtual('friendCount').get(function() {
  return this.friends.length;
});

module.exports = User;
