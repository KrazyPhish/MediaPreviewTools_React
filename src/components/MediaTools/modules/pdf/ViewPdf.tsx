import React from "react"
import './ViewPdf.css'
import { CommonIframe } from "../../common"

type PdfProps = {
  url: string
}

const ViewPdf: React.FC<PdfProps> = (props) => {
  return (
    <div className="pdf-container">
      <CommonIframe url={props.url} />
    </div>
  )
}

export default ViewPdf