import { Link } from "react-router-dom";

const NavLink = ({ data }) => (
  <Link
    px={4}
    py={1}
    fontSize="xl"
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      textColor: "black",
    }}
    to={data.linkUrl}
  >
    {data.linkText}
  </Link>
);

export default NavLink;
