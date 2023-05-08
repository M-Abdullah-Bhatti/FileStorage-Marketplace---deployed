import { Menu, Button, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { Link } from "react-router-dom";

export default function NavLinkDropdown() {
  return (
    <Menu>
      <MenuButton
        bg="transparent"
        fontSize={{ base: "md", md: "xl" }}
        fontWeight="100"
        as={Button}
        rightIcon={<ChevronDownIcon />}
        _hover={{ bg: "transparent" }}
      >
        Dashboard
      </MenuButton>
      <MenuList>
        <MenuItem>
          {" "}
          <Link padding="15px" to="/myalluploadedfiles">
            My All Uploaded Files
          </Link>{" "}
        </MenuItem>
        <MenuItem>
          {" "}
          <Link padding="15px" to="/myallsharedfiles">
            My All Shared Files
          </Link>{" "}
        </MenuItem>
        <MenuItem>
          {" "}
          <Link padding="15px" to="/myallunsharedfiles">
            My All UnShared Files
          </Link>{" "}
        </MenuItem>
        <MenuItem>
          {" "}
          <Link padding="15px" to="/myallreceivedfiles">
            My All Received Files
          </Link>{" "}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
