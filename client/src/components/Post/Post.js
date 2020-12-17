import React from 'react';

const Post = props => {
    const {post} = props;

    return(
        <div>
            <h1>{post.title}</h1>
            <p>{post.body}</p>
            <p>{post.statnum}</p>
            <p>{post.stattotalnum}</p>
        </div>
    )
}

export default Post;