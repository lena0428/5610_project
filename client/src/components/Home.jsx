import "../style/home.css";

import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import HeaderWithoutLogin from "./HeaderWithoutLogin";
import Footer from "./Footer";
import Message from "./Message";
import GroupCard from "./GroupCard";
import axios from "axios";
import SearchBar from "./SearchBar";

export default function Home() {
  const [groups, setGroups] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");


  const navigate = useNavigate();
  const { loginWithRedirect } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const handleSearch = (searchTerm) => {
    setSearchTerm(searchTerm);
  };

  // get group
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

  // filter group
  useEffect(() => {
    const filtered = groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredGroups(filtered);
  }, [groups, searchTerm]);

  useEffect(() => {
    fetchUsers();
  }, []);
  
  function fetchUsers() {
    axios
      .get(`http://localhost:8000/api/users`)
      .then((response) => {
        setUsers(response.data);
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
          <SearchBar onSearch={handleSearch} />
          <Row>
            {filteredGroups.map((group) => (
              <Col key={group.id} sm={12} md={6} lg={4} xl={3}>
                <GroupCard group={group} />
              </Col>
            ))}
          </Row>
        </Container>
      </main>
    </div>
  );
}
