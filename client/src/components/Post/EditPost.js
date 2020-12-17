import React, {useState} from 'react';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import './styles.css';
import Analyze from '../Analysis/Analyze';
import Ngraph from 'ngraph.graph';

const EditPost = ({post, onPostUpdated}) => {
    let history = useHistory();
    const [postData, setPostData] = useState({
        title:post.title,
        body: post.body,
        statnum: post.statnum,
        stattotalnum: post.stattotalnum
    });
    const {title, body, statnum, stattotalnum } = postData;
    const {token} = token;

    const onChange = e =>{
        const {name, value} = e.target;

        setPostData({
            ...postData,
            [name]:value
        });
    };

    const graph = async() =>{
        var graph = Ngraph.creategraph();
        graph.addNode('for(i ; i[n]{statnum[i]})', stattotalnum);
        var visual = graph.addLink('for(i; i[n]{statnum[i]})');
        console.log(visual);
    }

    const update = async () =>{
        if(!title || !body||!statnum ||!stattotalnum){
            console.log('Title, body, Input numbers & total number of number are required');
        }
        else{
            const newPost = {
                title:title,
                body:body,
                statnum: statnum,
                stattotalnum : stattotalnum
            };

            try{
                const config = {
                    headers:{
                        'Content-Type': 'application/json',
                        'x-auth-token': token

                    }
                };

                //create the post
                const body = JSON.stringify(newPost);
                const statnum = JSON.parse.toString(newPost);
                const stattotalnum = JSON.parse.toString(newPost);
                const res = await axios.put(
                    'http://localhost:5000/api/posts/$(post_id)',
                    body,
                    statnum,
                    stattotalnum,
                    config
                );

                //call the handler and redirect
                onPostUpdated(res.data);
                history.push('/');
                }
                catch(error){
                    console.error('Error creating post: $(error.response.data)');
                }
            }
        };  

        return(

            <div className = "form-container">
                <h2>Edit Post</h2>
                <input
                    name = "title"
                    type = "text"
                    placeholder = "Title"
                    value = {title}
                    onChange = {e => onChange(e)}
                />
                <textarea
                    name = "body"
                    cols="30"
                    rows = "10"
                    value = {body}
                    onChange = {e => onChange(e)}
                ></textarea>
                <table>
                name = "Stats"
                cols = "3"
                rows = 3
                value = {statnum}
                onChange = {e => onChange(e)}
            </table>
            <p>total = {stattotalnum} </p>
            <p>graph</p>
            <button onClick = {()=> Analyze.AnalyzeMean}>Mean</button>
            <button onClick = {()=> Analyze.AnalyzeDeviation}>Deviation</button>
            <br/>
            <button onClick = {() => update()}>Submit</button>
            </div>
        );
};

export default EditPost;