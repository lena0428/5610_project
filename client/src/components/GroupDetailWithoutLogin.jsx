import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card } from "react-bootstrap";
import axios from "axios";

const GroupDetailWithoutLogin = () => {
  const { loginWithRedirect } = useAuth0();
  const { id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const [groups, setGroups] = useState([]);
  const [dbuser, setDbuser] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");

  useEffect(() => {
    fetchGroup();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [dbuser]);

  function fetchGroup() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}`)
      .then((response) => {
        setGroup(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function fetchPosts() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/groups/${groupId}/posts`)
      .then((response) => {
        const postsWithUserName = response.data.map(async (post) => {
          const userResponse = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/users/${post.userId}`
          );
          return { ...post, userName: userResponse.data.name };
        });
        Promise.all(postsWithUserName).then((posts) => {
          setPosts(posts);
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleCreatePost = () => {
    loginWithRedirect();
  };

  

  return (
    <div
      style={{ display: "flex", flexDirection: "column", columnGap: "4rem" }}
    >
      <h1 style={{ paddingTop: "4rem", paddingBottom: "2rem" }}>
        {" "}
        {group.name}
      </h1>
      <p style={{ paddingBottom: "2rem" }}>{group.description}</p>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Type your post here"
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          aria-label="Type your post here"
          aria-describedby="button-addon2"
        />
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={handleCreatePost}
          id="button-addon2"
        >
          Post
        </button>
      </div>
      {posts.map((post) => (
        <Card key={post.id}>
          <Card.Body>
            <Card.Text>Content: {post.content}</Card.Text>
            <Card.Subtitle>Posted by: {post.userName}</Card.Subtitle>
            <Card.Subtitle>
              Post Date: {new Date(post.postDate).toLocaleString()}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default GroupDetailWithoutLogin;
