import React from 'react';
import './App.css';
import axios from 'axios';
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import PostList from './components/PostList/PostList';
import Post from './components/Post/Post';
import CreatePost from './components/Post/CreatePost';
import EditPost from './components/Post/EditPost';
import Analyze from './components/Analysis/Analyze';


class App extends React.Component{
state = {
  data:null,
  posts:[],
  post:null,
  token: null,
  User: null,
  AnalyzeMean: null,
  AnalyzeDeviation: null
};

componentDidMount() { 
axios.get('http://localhost:5000')
  .then((response) => {
    this.setState({
      data: response.data
  })
})
.catch((error) => {
    console.error('Error fetching data: $(error)');
  })
  this.authenticateUser();
}

authenticateUser = () =>{
  const token = localStorage.getItem('token');

  if(!token){
    localStorage.removeItem('user')
    this.setState({User:null});
  }

  if(token) {
    const config = {
      headers:{
        'x-auth-token':token
      }
    }
    axios.get('https://localhost:5000/api/auth', config)
    .then((response) => {
        localStorage.setItem('user', response.data.name)
        this.setState({ User: response.data.name})
    })
    .catch((error) => {
      localStorage.removeItem('user');
      this.setState({User: null});
      console.error('Error logging in: $(error)');
    })
  }
}

loadData = () =>{
  const {token} = this.state;

  if(token){
    const config = {
      headers:{
        'x-auth-token':token
      }
    };
    axios
    .get('http://localhost:5000/api/posts', config)
    .then(response => {
      this.setState({
        posts: response.data
      });
    })
    .catch(error => {
      console.error('Error fetching data: $(error)');
    });
  }
}

logOut = () =>{
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  this.setState({User:null, token: null});
}

viewPost = post =>{
  console.log('view $(post.title');
  this.setState({
    post:post
  });
}

deletePost = post => {
  const {token} =this.state;

  if(token){
    const config = {
      headers: {
        'x-auth-token': token
      }
    };
    axios
    .delete('http://localhost:5000/api/posts/$(post._id)', config)
    .then(response => {
      const newPosts = this.state.posts.filter(p => p._id !== post._id);
      this.setState({
        posts: [...newPosts]
      });
    }) 
    .catch(error => {
      console.error('Error deleting post: $(error)');
    });

  }
  
};

editPost = post =>{
  this.setState({
    post:post
  });

};

analyzeMean = Analyze => {
  this.setState({
    AnalyzeMean : Analyze.AnalyzeMean
  });
}

analyzeDeviation = Analyze => {
  this.setState({
    AnalyzeDeviation : Analyze.AnalyzeDeviation
  });
}

onPostCreated = post => {
  const newPosts = [...this.state.posts, post];

  this.setState({
    post: newPosts
  });
};

onPostUpdated = post => {
  console.log('Updated post:', post);
  const newPosts = [...this.state.posts];
  const index = newPosts.findIndex(p => p._id === post._id);

  newPosts[index] = post;

  this.setState({
    posts: newPosts
  });
};


 render() {
    let{User, posts, post, token} =this.state;
    const authProps = {
      authenticateUser: this.authenticateUser
    };

    return(
      <Router>
      <div className="App">
      <header className="App-header">
        <h1>Business Analytics</h1>
          <ul>
            <li>
              <Link to ="/">Home</Link>
            </li>
            <li>
              {User ? (
              <Link to = "/new-post">New Post </Link>
              ):(
              <Link to = "/register">Register</Link>
            )}
            </li>
            <li>
              {User ? (
                <Link to= "" onClick = {this.logOut}>
                  Log Out
                </Link> 
              ):(
                <Link to= "/login"> 
                  Log in
                </Link>  
              )}
            </li>
          </ul>
        </header>
        {this.state.data}
        <main>
          <Switch>
          <Route exact path="/">
            {User ?(
              <React.Fragment>
                <div>Hello {User}!</div>
                <PostList posts = {posts} 
                          clickPost = {this.viewPost}
                          analyzeMean = {this.analyzeMean}
                          analyzeDeviation = {this.analyzeDeviation}
                          deletePost = {this.deletePost}
                          editPost = {this.editPost}

                />
                
                </React.Fragment>
                ):(
                 <React.Fragment>Please Register or Login</React.Fragment>
                )} 
          </Route>
          <Route path = "/posts/:postId">
            <Post post = {post} />
          </Route>
         <Route path = "/new-post">
            <CreatePost token = {token} onPostCreated={this.onPostCreated} />
          </Route>
          <Route path = "/edit-post/:postId">
            <EditPost 
              token = {token}
              post = {post} 
              onPostUpdated = {this.onPostUpdated}
            />
          </Route> 
          <Route
            exact path ="/Register"
            render = {() => <Register{...authProps}/>}
          />
          <Route
            exact path = "/Login"
            render = {() => <Login{...authProps} />}
          />
          </Switch>
          </main>
      </div>
      </Router>
    );
  }
}

export default App;
