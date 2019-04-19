import PropTypes from 'prop-types'
import React, { PureComponent } from 'react'
import { createPortal } from 'react-dom'
import { StyleMenu } from './styles'

export default class RulerContextMenu extends PureComponent {
  constructor(props) {
    super(props)
    this.el = document.createElement('div')
  }
  componentDidMount () {
    document.body.appendChild(this.el)
    window.addEventListener('click', this.closeMenu)
  }
  componentWillUnmount () {
    document.body.removeChild(this.el)
    window.removeEventListener('click', this.closeMenu)
  }
  closeMenu = () => {
    this.props.oncloseMenu(false)
  }
  // 显示/影藏 ruler
  onhandleShowRuler = () => {
    const { handleShowRuler } = this.props
    handleShowRuler()
  }
  // 显示/影藏 参考线
  onhandleShowReferLine = () => {
    const { handleShowReferLine } = this.props
    handleShowReferLine()
  }
  // 删除横向/纵向参考线
  onhandleShowSpecificRuler = () => {
    const { horLineArr, verLineArr, handleLine, vertical } = this.props
    const newLines = vertical
      ? { h: horLineArr, v: [] }
      : { h: [], v: verLineArr }
    handleLine(newLines)
  }

  render () {
    const { isShowRuler, isShowMenu, isShowReferLine, vertical, verLineArr, horLineArr } = this.props
    const { left, top } = this.props.menuPosition
    const className = `menu-wrap ${!isShowMenu ? 'hide-menu' : ''}`
    const classNameContent = `menu-content ${!isShowMenu ? 'hide-content' : ''}`
    const isGraySpecific = (vertical ? !verLineArr.length : !horLineArr.length) || !isShowReferLine

    return (
      createPortal(
        <StyleMenu
          className={className}
          style={{ left: left, top: top }}
          showRuler={isShowRuler}
          showReferLine={isShowReferLine}
          isGraySpecific={isGraySpecific}
        >
          <a
            className={classNameContent}
            onClick={this.onhandleShowRuler}
          >
            显示标尺
          </a>
          <a
            className={classNameContent}
            onClick={this.onhandleShowReferLine}
          >
            显示参考线
          </a>
          <div className="divider" />
          <a
            className={`${classNameContent} no-icon`}
            style={{ color: isGraySpecific ? 'rgb(65,80,88, .4)' : '' }}
            onClick={!isGraySpecific ? this.onhandleShowSpecificRuler : null}
          >
            删除所有
            {vertical ? '横向' : '纵向'}
            参考线
          </a>
        </StyleMenu>
        , this.el
      )
    )
  }
}

RulerContextMenu.propTypes = {
  vertical: PropTypes.bool,
  menuPosition: PropTypes.object,
  isShowMenu: PropTypes.bool,
  oncloseMenu: PropTypes.func,
  isShowRuler: PropTypes.bool,
  handleShowRuler: PropTypes.func,
  isShowReferLine: PropTypes.bool,
  handleShowReferLine: PropTypes.func,
  horLineArr: PropTypes.array,
  verLineArr: PropTypes.array,
  handleLine: PropTypes.func
}
