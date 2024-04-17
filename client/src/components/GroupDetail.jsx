import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Card, Modal } from "react-bootstrap";
import axios from "axios";

const GroupDetail = () => {
  const { id: groupId } = useParams();
  const [group, setGroup] = useState({});
  const [groups, setGroups] = useState([]);

  const { loginWithRedirect, user } = useAuth0();
  const [dbuser, setDbuser] = useState({});
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [isMember, setIsMember] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);



  useEffect(() => {
    fetchGroup();
    if (user) {
      fetchUser()
    }
  }, []);

  useEffect(() => {
    if (dbuser.id) {
      fetchPosts();
    }
  }, [dbuser]);

  useEffect(() => {
    if (dbuser.id) {
      fetchGroups();
    }
  }, [dbuser]);

  useEffect(() => {
    if (groups.length > 0 && group.id) {
      console.log(groups)
      const isUserMember = groups.some((g) => g.id === group.id);
      setIsMember(isUserMember);
    }
    setIsCreator(group.userId == dbuser.id)
  }, [groups, group]);

  function fetchGroups() {
    axios
      .get(`http://localhost:8000/api/users/${dbuser.id}/groups`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

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

  const handleJoinGroup = () => {
    axios
      .post(`http://localhost:8000/api/users/${dbuser.id}/groups/${groupId}`, {
        role: "member",
      })
      .then((response) => {
        console.log("Joined group successfully:", response.data);
        setIsMember(true);
      })
      .catch((error) => {
        console.error("Error joining group:", error);
      });
  };

  const handleExitGroup = () => {
    axios
      .delete(`http://localhost:8000/api/users/${dbuser.id}/groups/${groupId}`)
      .then((response) => {
        console.log("Exited group successfully:", response.data);
        setIsMember(false);
      })
      .catch((error) => {
        console.error("Error exiting group:", error);
      });
  };

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

  const handleCreatePost = () => {
    axios
      .post(`http://localhost:8000/api/groups/${groupId}/${dbuser.id}/posts`, { content: newPostContent })
      .then((response) => {
        console.log("Created post successfully:", response.data);
        setNewPostContent("");
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

  const handleDeleteGroup = () => {
    setShowDeleteModal(true);
  };

  const confirmDeleteGroup = () => {
    axios
      .delete(`http://localhost:8000/api/groups/${groupId}`)
      .then((response) => {
        console.log("Group deleted successfully");
        navigate("/app");
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
      });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", columnGap: "4rem" }}>
      <h1 style={{ paddingTop: "4rem", paddingBottom: "2rem" }}> {group.name}</h1>
      <p style={{ paddingBottom: "2rem" }}>{group.description}</p>
      {isMember ? (
        <Button variant="danger" onClick={handleExitGroup} style={{ width: "fit-content" }}>
          Exit Group
        </Button>
      ) : (
        <Button onClick={handleJoinGroup} style={{ width: "fit-content" }}>
          Join Group
        </Button>
      )}
      {isCreator && (
        <Button variant="danger" onClick={handleDeleteGroup} style={{ width: "fit-content" }}>
          Delete Group
        </Button>
      )}
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
        <button className="btn btn-outline-secondary" type="button" onClick={handleCreatePost} id="button-addon2">
          Post
        </button>
      </div>

      {posts
        .map((post) => (
          <Card key={post.id}>
            <Card.Body>
              <Card.Text>Content: {post.content}</Card.Text>
              <Card.Subtitle>Posted by: {post.userName}</Card.Subtitle>
              <Card.Subtitle>Post Date: {new Date(post.postDate).toLocaleString()}</Card.Subtitle>
              {post.userId === dbuser.id && (
                <Button variant="danger" onClick={() => handleDeletePost(post.id)}>
                  Delete Post
                </Button>
              )}
            </Card.Body>
          </Card>
        ))}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this group?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteGroup}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div >
  );
};

export default GroupDetail;
