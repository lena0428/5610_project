import "../style/home.css";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Button, Container, Modal, Card } from "react-bootstrap";
import Message from "./Message";
import GroupCard from "./GroupCard";
import axios from "axios";
import SearchBar from "./SearchBar";

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const { user } = useAuth0();
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [show, setShow] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [dbuser, setDbuser] = useState({});
  const [post, setPost] = useState({});

  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/groups");
      const data = await response.json();
      setGroups(data);
      setFilteredGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  useEffect(() => {
    console.log("Groups:", groups);
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    console.log("Filtered groups:", filtered);
    setFilteredGroups(filtered);
  }, [groups, searchTerm]);

  useEffect(() => {
    fetchUsers();
    fetchPost();
  }, []);

  function fetchUsers() {
    axios
      .get(`http://localhost:8000/api/users`)
      .then((response) => {
        setUsers(response.data);
        console.log(users);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    fetchPost();
  }, []);

  function fetchPost() {
    axios
      .get(`http://localhost:8000/api/post`)
      .then((response) => {
        setPost(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleJoinGroup = (userId, groupId) => {
    axios
      .post(`http://localhost:8000/api/users/${userId}/groups/${groupId}`, {
        role: "member",
      })
      .then((response) => {
        console.log("Joined group successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error joining group:", error);
      });
  };

  const handleSubmit = async () => {
    const group = { name: groupName, description: groupDescription };
    try {
      const response = await axios.post(
        `http://localhost:8000/api/groups/${dbuser.id}`,
        group
      );
      handleJoinGroup(dbuser.id, response.data.id);
      console.log(response);
      console.log(response.data.id);
      fetchGroups();
      handleClose();
    } catch (error) {
      console.error("Error adding group:", error);
    }
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

  return (
    <div>
      <main className="py-3">
        <Container>
          <Message variant="info">
            Welcome new member{" "}
            {users.length > 0 ? users[users.length - 1].name : ""} to the
            Student Interest Group Platform!
          </Message>
          {post && (
            <Card key={post.id}>
              <Card.Body>
                <Card.Text>Content: {post.content}</Card.Text>
                <Card.Subtitle>Posted by: {post.userName}</Card.Subtitle>
                <Card.Subtitle>
                  Post Date: {new Date(post.postDate).toLocaleString()}
                </Card.Subtitle>
              </Card.Body>
            </Card>
          )}

          <SearchBar onSearch={handleSearch} filteredGroups = {filteredGroups} isLogged={true}/>
          <Button variant="primary" onClick={handleShow}>
            Add New Group
          </Button>
          <Row>
            {filteredGroups.map((group) => (
              <Col key={group.id} sm={12} md={6} lg={4} xl={3}>
                <GroupCard group={group} />
              </Col>
            ))}
          </Row>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Add New Group</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Container>
                <form>
                  <div className="form-group">
                    <label htmlFor="name">Group Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </form>
              </Container>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </main>
    </div>
  );
}
