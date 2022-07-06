import React, { useEffect, useRef, useState } from 'react'

const Modal = (props) => {

    const [modalNumber, setModalNumber] = useState(0)
    const menuRef = useRef()
    const { children,open } = props
    useEffect(() => {
        let handleMouswDown = (event) => {
            if (!menuRef.current.contains(event.target)) {
                props.handleClose()
            }
        }
        document.addEventListener('mousedown', handleMouswDown)

        return () => {
            document.removeEventListener('mousedown', handleMouswDown)
        }
    })

    return (
        <React.Fragment>
            {
                <div className={`back-drop${props.open ? " back-drop--active" : ""}`}
                >
                    <div className="modal" id="Modal" ref={menuRef}>
                        {/* {
                            React.Children.map(children, child => {
                                return React.cloneElement(child, {
                                    modalNumber: modalNumber,
                                    handleClose: props.handleClose, setModalNumber: setModalNumber
                                }, null)
                            })
                        } */}
                        {
                            children
                        }
                    </div>
                </div>
            }
        </React.Fragment>
    )
}

export default Modal