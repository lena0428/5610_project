import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
// import MembersCard from "./MembersCard";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

import logo from "../assets/logo.jpg";

const GroupCard = ({ group }) => {
  //   const [members, setMembers] = useState([]);

  //   useEffect(() => {
  //     fetchMembers();
  //   }, []);

  //   function fetchMembers() {
  //     // Fetch list of members in the group
  //     axios
  //       .get(`http://localhost:8000/api/groups/${group.id}/users`)
  //       .then((response) => {
  //         setMembers(response.data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Body>
        <Link to={`/app/groups/${group.id}`}>
          <Card.Img src={logo} variant="top" />
        </Link>
        <Link to={`/app/groups/${group.id}`}>
          <Card.Title
            as="div"
            className="group-title"
            style={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <strong>{group.name}</strong>
          </Card.Title>
        </Link>

        {/* <Card.Text as='div'>
          <Rating
            value={product.rating}
            text={`${product.numReviews} reviews`}
          />
        </Card.Text> */}

        <Card.Text
          as="p"
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 5,
            WebkitBoxOrient: "vertical",
          }}
        >
          {group.description}
          {/* {group.description.length > 200
            ? group.description.slice(0, 200) + "..."
            : group.description} */}
        </Card.Text>
        {/* <Card.Text as="p">{members ? members.length : 0} Members</Card.Text> */}
      </Card.Body>
    </Card>
  );
};

export default GroupCard;
