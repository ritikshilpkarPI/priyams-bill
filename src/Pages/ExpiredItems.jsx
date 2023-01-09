import React, {useState, useEffect} from 'react'
import { Axios } from 'src/utils/axios';

const ExpiredItems = () =>  {
    const [expiredItems,setExpiredItems] = useState();

    const getExpiredData = async () => {
        const response = await Axios.request({
            url: "/api/inventory/filterExpiryDates",
            method: "post",
            data: { 
                startDate:"1/6/202",
                endDate: "1/7/2023"
             },
            headers: {
              Cookie: "",
            },
          });
          console.log({response});
    }
    useEffect(() => {
        getExpiredData()
    },[]) 
  return (
    <div>ExpiredItems</div>
  )
}

export default ExpiredItems