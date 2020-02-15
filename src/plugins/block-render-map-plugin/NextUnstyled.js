import React from 'react'
import classes from 'classnames'

import Selectable from '../../components/button/Selectable'
import Plus from '../../components/button/Plus'

import useDrop from '../../hooks/useDrop'
import useDrag from '../../hooks/useDrag'

import './nextUnstyled.css'

const AddOn = () => {
  const cls = classes(['addon'])
  return (
    <div className={cls}>
      <Plus />
      <Selectable />
    </div>
  )
}

const NextUnstyled = props => {
  const { children } = props
  const cls = classes(['next-unstyled'])

  return (
    <>
      {children}
    </>
  )

  return (
    <div className={cls}>
      {/* <AddOn /> */}
      {children}
    </div>
  )
}

export default NextUnstyled