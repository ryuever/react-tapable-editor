import React from 'react'
import "./styles.css"

export default props => {
  return (
    <a className="link_span" target="blank">
      {props.children}
    </a>
  )
}