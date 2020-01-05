import React from 'react'
import withFillColor from './utils/withFillColor'
import withAction from './utils/withAction'

const BulletedList = ({ fill }) => {
  return (
    <svg width="25" height="25" fill={fill}>
      <path d="M19.7 17.5c.17 0 .3.13.3.3v.9a.3.3 0 0 1-.3.3H9.3a.3.3 0 0 1-.3-.3v-.9c0-.17.13-.3.3-.3h10.4zm-14-.5c.17 0 .3.13.3.3v1.4a.3.3 0 0 1-.3.3H4.3a.3.3 0 0 1-.3-.3v-1.4c0-.17.13-.3.3-.3h1.4zm0-6c.17 0 .3.13.3.3v1.4a.3.3 0 0 1-.3.3H4.3a.3.3 0 0 1-.3-.3v-1.4c0-.17.13-.3.3-.3h1.4zm14 0c.17 0 .3.13.3.3v.9a.3.3 0 0 1-.3.3H9.3a.3.3 0 0 1-.3-.3v-.9c0-.17.13-.3.3-.3h10.4zm-14-6c.17 0 .3.13.3.3v1.4a.3.3 0 0 1-.3.3H4.3a.3.3 0 0 1-.3-.3V5.3c0-.17.13-.3.3-.3h1.4zm14 0c.17 0 .3.13.3.3v.9a.3.3 0 0 1-.3.3H9.3a.3.3 0 0 1-.3-.3v-.9c0-.17.13-.3.3-.3h10.4z" fill-rule="evenodd"></path>
    </svg>
  )
}

export default withFillColor(withAction(BulletedList))