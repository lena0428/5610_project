import React from "react";
// import MembersCard from "./MembersCard";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import logo from "../assets/logo.jpg";

const GroupCard = ({ group }) => {
  //   const [members, setMembers] = useState([]);

  //   useEffect(() => {
  //     fetchMembers();
  //   }, []);

  //   function fetchMembers() {
  //     // Fetch list of members in the group
  //     axios
  //       .get(`${process.env.REACT_APP_API_URL}/api/groups/${group.id}/users`)
  //       .then((response) => {
  //         setMembers(response.data);
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   }
  const { isAuthenticated } = useAuth0();

  return (
    <Card className="my-3 p-3 rounded">
      <Card.Body>
        <Link
          to={
            !isAuthenticated ? `/groups/${group.id}` : `/app/groups/${group.id}`
          }
        >
          <Card.Img alt="logo" src={logo} variant="top" />
        </Link>
        <Link
          to={
            !isAuthenticated ? `/groups/${group.id}` : `/app/groups/${group.id}`
          }
        >
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
