import { useParams } from "react-router-dom";
import Billing from "./Billing";

function EditBill() {
  const { billingID } = useParams();

  return <Billing billID={billingID} />;
}

export default EditBill;
