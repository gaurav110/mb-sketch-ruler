/* eslint-disable no-return-assign */
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
    document.addEventListener('click', this.closeMenu)
    document.addEventListener('mousedown', this.closeMenuMouse, true)
  }
  componentWillUnmount () {
    document.removeEventListener('mousedown', this.closeMenuMouse, true)
    document.removeEventListener('click', this.closeMenu)
    document.body.removeChild(this.el)
  }
  // click事件只响应左键，menu里的每部分的点击事件使用的是click，
  // 所以mousedown只能响应右键，否则内部点击事件失效
  closeMenu = (e) => {
    const { oncloseMenu } = this.props
    oncloseMenu()
  }
  closeMenuMouse = (e) => {
    if (e.button === 2) this.closeMenu()
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
    const { isShowRuler, isShowMenu, isShowReferLine, vertical, verLineArr, horLineArr, lang } = this.props
    const { left, top } = this.props.menuPosition
    const className = `menu-wrap ${!isShowMenu ? 'hide-menu' : ''}`
    const classNameContent = `menu-content ${!isShowMenu ? 'hide-content' : ''}`
    const isGraySpecific = (vertical ? !verLineArr.length : !horLineArr.length)
    const verticalVal = lang === 'zh-CN' ? '纵向' : ' vertical '
    const horizontalVal = lang === 'zh-CN' ? '横向' : ' horizontal '

    return (
      createPortal(
        <StyleMenu
          className={className}
          style={{ left: left, top: top }}
          showRuler={isShowRuler}
          showReferLine={isShowReferLine}
          isGraySpecific={isGraySpecific}
          lang={lang}
        >
          <a
            className={classNameContent}
            onClick={this.onhandleShowRuler}
          >{ lang === 'zh-CN' ? '显示标尺' : 'show rulers' }</a>
          <a
            className={classNameContent}
            onClick={this.onhandleShowReferLine}
          >{ lang === 'zh-CN' ? '显示参考线' : 'show all guides' }</a>
          <div className="divider" />
          <a
            className={`${classNameContent} no-icon`}
            style={{ color: isGraySpecific ? 'rgb(65,80,88, .4)' : '' }}
            onClick={this.onhandleShowSpecificRuler}
          >
            { lang === 'zh-CN' ? '删除所有' : 'remove all'}
            { vertical ? horizontalVal : verticalVal }
            { lang === 'zh-CN' ? '参考线' : 'guides' }
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
  isShowRuler: PropTypes.bool,
  handleShowRuler: PropTypes.func,
  isShowReferLine: PropTypes.bool,
  handleShowReferLine: PropTypes.func,
  horLineArr: PropTypes.array,
  verLineArr: PropTypes.array,
  handleLine: PropTypes.func,
  oncloseMenu: PropTypes.func,
  lang: PropTypes.string
}
