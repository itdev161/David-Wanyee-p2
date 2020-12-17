import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema ({
    User: {
        type:'ObjectId',
        ref:'User'
    },
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    },
    statnum:{
        type: Number,
        required: true
    },
    stattotalnum:{
        type: Number,
        required:true
    },
    statmean:{
        type: Number,
        required:true
    },
    statdeviation:{
        type:Number,
        required: true
    }
});

const Post = mongoose.model('Post', PostSchema);

export default Post;