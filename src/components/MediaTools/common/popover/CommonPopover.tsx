/* eslint-disable react-hooks/exhaustive-deps */
import React, { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import './CommonPopover.css'
import { Instance, Placement, createPopper } from './modules'
import { setEventListener } from '../utils'

type PopoverProps = {
  ref?: ForwardedRef<{ show: () => void, hide: () => void, toggle: () => void }>
  width?: string | number
  popperClass?: string
  placement?: Placement
  children: React.ReactNode
  reference: React.ReactNode
}

const CommonPopover: React.ForwardRefExoticComponent<PopoverProps> = forwardRef((props, ref) => {
  const popperRef = useRef<HTMLDivElement>(null)
  const referenceRef = useRef<HTMLDivElement>(null)

  const [visible, setVisible] = useState(false)

  const [reference, setReference] = useState<HTMLElement | null>(null)
  const [popperEl, setPopperEl] = useState<Instance | null>(null)
  const [popper, setPopper] = useState<HTMLDivElement | null>(null)

  const listeners: {
    stopReference: Function | null
    stopDocument: Function | null
  } = {
    stopReference: null,
    stopDocument: null
  }

  const show = () => {
    setVisible(true)
  }

  const hide = () => {
    setVisible(false)
  }

  const toggle = () => {
    setVisible(value => !value)
  }

  useImperativeHandle(ref, () => ({ show, hide, toggle }))

  const onReferenceClick = () => {
    if (visible) {
      hide()
      return
    }
    show()
    if (!popperEl) {
      setPopperEl(createPopper(reference!, popper!, {
        placement: props.placement ? props.placement : 'top',
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 6]
            }
          }
        ]
      }))
    } else popperEl.update()
  }

  const onDocumentClick = (e: MouseEvent) => {
    const root: HTMLDivElement | null = popperRef.current
    const target = e.target as Node
    if (!root || !reference || !popper || reference.contains(target) || root.contains(target) || popper.contains(target)) return
    hide() 
  }

  const initPopper = () => {
    if (!props.reference) return
    listeners.stopReference = setEventListener(reference, 'click', onReferenceClick)
    listeners.stopDocument = setEventListener(document, 'click', onDocumentClick)
  }

  const updatePopper = () => {
    if (popperEl) popperEl.update()
    else initPopper()
  }

  const destroyPopper = () => {
    popperEl && popperEl.destroy()
    setPopperEl(null)
  }

  useEffect(() => {
    if (!reference) return
    initPopper()

    return () => {
      destroyPopper()
      listeners.stopReference?.()
      listeners.stopDocument?.()
    }
  }, [])

  useEffect(() => {
    visible ? updatePopper() : destroyPopper()
  }, [visible])

  useEffect(() => {
    setPopper(popperRef.current)
    setReference(referenceRef.current)
  }, [popperRef.current, referenceRef.current])

  return (
    <React.Fragment>
      <span className='popover-container' style={{ zIndex: 5 }}>
        <div
          ref={popperRef}
          className={'common-popover common-popper ' + props.popperClass + (visible ? '' : ' popper-hide')}
          style={{ width: props.width ? (typeof props.width === 'string' ? props.width : props.width + 'px') : 'auto' }}
        >
          {props.children}
          <div className='popper__arrow' data-popper-arrow></div>
        </div>
        <div ref={referenceRef}>{props.reference}</div>
      </span>
    </React.Fragment>
  )
})

export default CommonPopover