import React from 'react'

const Button = (props) => {
  return (
    <>
      <button type='submit' className={props.className}>{props.name}</button>
    </>
  )
}

export default Button