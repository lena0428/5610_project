import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Form, Button, Card } from "react-bootstrap";
import axios from "axios";

const GroupDetail = () => {
  const { id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const { user } = useAuth0();
  const [dbuser, setDbuser] = useState({});
  const [isMember, setIsMember] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroup();
    fetchUser();
  }, []);

  useEffect(() => {
    if (dbuser.id) {
      fetchPosts();
    }
  }, [dbuser]);

  function fetchGroup() {
    axios
      .get(`http://localhost:8000/api/groups/${groupId}`)
      .then((response) => {
        setGroup(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function fetchUser() {
    axios
      .get(`http://localhost:8000/api/users/auth0/${user.sub}`)
      .then((response) => {
        setDbuser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function fetchPosts() {
    axios
      .get(`http://localhost:8000/api/groups/${groupId}/posts`)
      .then((response) => {
        const postsWithUserName = response.data.map(async (post) => {
          const userResponse = await axios.get(`http://localhost:8000/api/users/${post.userId}`);
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

  const handleCreatePost = (content) => {
    axios
      .post(`http://localhost:8000/api/groups/${groupId}/${dbuser.id}/posts`, { content })
      .then((response) => {
        console.log("Created post successfully:", response.data);
        fetchPosts();
      })
      .catch((error) => {
        console.error("Error creating post:", error);
      });
  };

  const handleDeletePost = (postId) => {
    axios
      .delete(`http://localhost:8000/api/posts/${postId}`)
      .then((response) => {
        console.log("Deleted post successfully:", response.data);
        fetchPosts();
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  const [posts, setPosts] = useState([]);

  return (
    <div>
      <h1>Group Name: {group.name}</h1>
      <p>Description: {group.description}</p>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreatePost(e.target.content.value);
          e.target.reset();
        }}
      >
        <Form.Group controlId="content">
          <Form.Label>Post Content</Form.Label>
          <Form.Control as="textarea" rows={3} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Create Post
        </Button>
      </Form>

      {posts.map((post) => (
        <Card key={post.id} >
          <Card.Body>
            <Card.Text>Content: {post.content}</Card.Text>
            <Card.Subtitle >Posted by: {post.userName}</Card.Subtitle>
            <Card.Subtitle >Post Date: {new Date(post.postDate).toLocaleString()}</Card.Subtitle>
            {post.userId === dbuser.id && (
              <Button variant="danger" onClick={() => handleDeletePost(post.id)}>
                Delete Post
              </Button>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default GroupDetail;
