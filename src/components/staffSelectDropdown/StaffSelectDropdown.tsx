import { Select } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectstaffs } from "../../redux/staffList/StaffSelector";
import { AppDispatch } from "src/redux/store";
import { getAllStaffsAPI } from "src/utils/apiUtils";
import { setLoading, setStaff } from "src/redux/staffList/StaffSlice";
import { toast } from "react-toastify";

const StaffSelectDropdown: React.FC<StaffSelectDropdownInterface> = ({
  error,
  onChange,
  label,
  selectedStaffId, 
  disabled
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { staffs, loading } = useSelector(selectstaffs);

  const fetchStaffs = async () => {
    dispatch(setLoading(true));
    try {
      const response = await getAllStaffsAPI();
      if (response.success) {
        dispatch(setStaff(response.data));
      }
    } catch (error) {
      toast.error("Failed to fetch staff");
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    fetchStaffs();
  }, []);

  const handleChange = (value: string) => {
    if (value) {
        onChange(value); 
    }
  };

 
  return (
    <Select
      label={label ?? ""}
      error={error ?? ""}
      placeholder="Select staff"
      data={staffs.map((staff) => ({ value: staff._id, label: staff.name }))}
      value={selectedStaffId || ""}
      onChange={handleChange} 
      sx={{ width: "100%" }}
      disabled={disabled && !loading}
    />
  );
};

export default StaffSelectDropdown;