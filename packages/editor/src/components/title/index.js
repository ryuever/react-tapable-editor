import React from 'react'
import { withEditor } from '../..'

const Title = ({ getEditor }) => {
  return (
    <div className="article-title">
      <input className="title-input" placeholder="Untitled"/>
    </div>
  )
}

export default withEditor(Title)