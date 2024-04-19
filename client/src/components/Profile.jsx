import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Button, Row, Col } from "react-bootstrap";
import GroupCard from "./GroupCard";

export default function Profile() {
  const { user } = useAuth0();
  const [dbuser, setDbuser] = useState({});
  const [editedUser, setEditedUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  function fetchUser() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/auth0/${user.sub}`)
      .then((response) => {
        setDbuser(response.data);
        setEditedUser(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  useEffect(() => {
    if (dbuser.id) {
      fetchGroups();
    }
  }, [dbuser]);

  function fetchGroups() {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/users/${dbuser.id}/groups`)
      .then((response) => {
        setGroups(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setEditedUser({ ...editedUser, [name]: value });
  }

  function handleUpdate() {
    axios
      .put(
        `${process.env.REACT_APP_API_URL}/api/users/${dbuser.id}`,
        editedUser
      )
      .then((response) => {
        setDbuser(response.data);
        setIsEditing(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <Row>
        <Col md={3}>
          <h2>User Profile</h2>
          <Form>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Name:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="fullname"
                    value={editedUser.fullname}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dbuser.fullname}
                  />
                )}
              </Form.Group>
            </Row>
            {/* Add similar Form.Group components for other properties like gender, college, cohort, and phone */}
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email:</Form.Label>
                <Form.Control plaintext readOnly defaultValue={user.email} />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Email verified:</Form.Label>
                <Form.Control
                  plaintext
                  readOnly
                  defaultValue={user.email_verified?.toString()}
                />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Gender:</Form.Label>
                <div key={`inline-radio`} className="mb-3">
                  {isEditing ? (
                    <div>
                      <Form.Check
                        inline
                        label="female"
                        name="gender"
                        type="radio"
                        id="inline-radio-female"
                        value="female"
                        checked={editedUser.gender === "female"}
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="male"
                        name="gender"
                        type="radio"
                        id="inline-radio-male"
                        value="male"
                        checked={editedUser.gender === "male"}
                        onChange={handleInputChange}
                      />
                      <Form.Check
                        inline
                        label="others"
                        name="gender"
                        type="radio"
                        id="inline-radio-female"
                        value="others"
                        checked={editedUser.gender === "others"}
                        onChange={handleInputChange}
                      />
                    </div>
                  ) : (
                    <Form.Control
                      plaintext
                      readOnly
                      defaultValue={dbuser.gender}
                    />
                  )}
                </div>
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>College:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="college"
                    value={editedUser.college}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dbuser.college}
                  />
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Cohort:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="cohort"
                    value={editedUser.cohort}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dbuser.cohort}
                  />
                )}
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Phone:</Form.Label>
                {isEditing ? (
                  <Form.Control
                    type="text"
                    name="phone"
                    value={editedUser.phone}
                    onChange={handleInputChange}
                  />
                ) : (
                  <Form.Control
                    plaintext
                    readOnly
                    defaultValue={dbuser.phone}
                  />
                )}
              </Form.Group>
            </Row>
            <Button onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "Cancel" : "Edit"}
            </Button>
            {isEditing && <Button onClick={handleUpdate}>Save</Button>}
          </Form>
        </Col>

        <Col md={9}>
          <h2>My Groups</h2>
          <Row>
            {groups.map((group) => (
              <Col key={group.id} sm={12} md={6} lg={4} xl={3}>
                <GroupCard group={group} />
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </div>
  );
}
