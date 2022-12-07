import { useState, useRef, useEffect } from "react";


function BillUpoloader() {
    const preview = useRef();
    const [receipts, setReceipts] = useState([]);
    function previewFile(e) {
        const preview = document.querySelector('img');
        const files = document.querySelector('input[type=file]').files;
        const myfiles = [...files]
        const receiptsArray = []
        myfiles.map((file)=>{
          const reader = new FileReader();
          reader.addEventListener("load", () => {
           receiptsArray.push(this.result)
          }, false);
              reader.readAsDataURL(file);
        })
          
          setReceipts([...receipts,receiptsArray])
        }
  return (
    <div>
      <input type="file" onChange={(e)=>{previewFile(e)}} multiple/>
         {
            receipts.map((rec,index)=>{
             
                 <img key={index} height={50} src={rec}  alt="Image preview" />
            })
         }
    </div>
  )
}

export default BillUpoloader
