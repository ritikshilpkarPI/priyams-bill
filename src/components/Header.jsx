import React from "react";
import { SegmentedControl, Badge, Avatar, Text } from "@mantine/core";
import { PAGES } from "../constants/HeaderTypes";

const Header = ({
  staffName,
  staffUserName,
  showBill,
  value,
  logoutUser,
  setValue,
}) => {
  return (
    <div>
      {staffName && staffUserName && !showBill && (
        <div className="nav-btn">
          <SegmentedControl
            value={value}
            onChange={setValue}
            color="blue"
            radius="md"
            size="md"
            data={Object.keys(PAGES).map((page) => ({
              label: PAGES[page],
              value: page,
            }))}
          />
          <Badge
            sx={{ paddingLeft: 0 }}
            size="xl"
            radius="lg"
            color="dark"
            className="logout-btn"
            leftSection={
              <Avatar
                alt="Avatar for badge"
                size={34}
                mr={5}
                src="image-link"
              />
            }
          >
            <Text fz="xl" style={{ margin: "10px 0px -10px 0px" }}>
              {staffUserName}
            </Text>
            <Text fz="sm" style={{ marginBottom: "10px" }} onClick={logoutUser}>
              Logout
            </Text>
          </Badge>
        </div>
      )}
    </div>
  );
};

export default Header;
