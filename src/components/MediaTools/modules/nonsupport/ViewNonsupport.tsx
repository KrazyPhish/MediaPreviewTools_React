import React, { useEffect, useState } from "react"
import { Empty } from "antd"
import './ViewNonsupport.css'

type NonsupportProps = {
  extension: string
}

const ViewNonsupport: React.FC<NonsupportProps> = (props) => {
  const [description, setDescription] = useState('')

  useEffect(() => {
    setDescription(`不支持的媒体格式: ${props.extension}`)
  }, [props])

  return (
    <div className="container">
      <Empty description={description} />
    </div>
  )
}

export default ViewNonsupport