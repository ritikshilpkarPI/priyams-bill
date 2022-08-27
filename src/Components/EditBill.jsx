import { useParams } from "react-router-dom";
import { Billing } from '../Components/Billing'

function EditBill () {
  const { billingID } = useParams();

  return (
    <Billing billID={billingID}/>
  )
}

export default EditBill;
