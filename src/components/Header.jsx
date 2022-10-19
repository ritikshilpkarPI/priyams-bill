import React from 'react';
import { SegmentedControl, Button } from "@mantine/core";
import { PAGES } from '../constants/HeaderTypes'

const Header = ({ staffName, staffUserName, showBill, value, logoutUser, setValue }) => {
    return (
        <div>{
            staffName && staffUserName && !showBill && (
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
                    <Button className="logout-btn" onClick={logoutUser}>
                        Logout
                    </Button>
                </div>
            )
        }
            {staffName && <h3 className="staffname">{staffName}</h3>}
            {staffUserName && <p className="staffname">{staffUserName}</p>}
        </div>
    )
}

export default Header;