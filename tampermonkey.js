// ==UserScript==
// @name         Nacos Helper
// @namespace    http://tampermonkey.net/
// @version      2025-11-01
// @description  nacos helper chrome extension
// @author       yifan
// @match        *://*/*
// @icon         https://nacos.io/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    // 和content.js 保持一致
    // 检查URL是否包含configdetail或configeditor
  function shouldShowButtons() {
    const url = window.location.href;
    return url.includes('configdetail') || url.includes('configeditor');
  }

  // 页面加载完成后执行
  function initNacosHelper() {
    // 检查URL是否符合条件
    if (!shouldShowButtons()) {
      // 同时移除全屏时创建的工具条
      const fullscreenToolbar = document.getElementById('nacos-fullscreen-toolbar');
      if (fullscreenToolbar) {
        fullscreenToolbar.remove();
      }
      return;
    }

    if (document.getElementById('nacos-toggle-button')) {
      return;
    }

    // 查找id为container的元素
    const container = document.getElementById('container');
    console.log('nacos-helper')
    console.log(container)

    // 查找"返回"按钮作为参考点
    const returnButtons = Array.from(document.querySelectorAll('button')).filter(btn =>
      btn.textContent.trim() === '返回'
    );

    // 获取与"返回"按钮同一级的所有按钮
    const existingButtons = [];
    if (returnButtons.length > 0) {
      // 获取返回按钮的父元素
      const parentElement = returnButtons[0].parentElement;
      if (parentElement) {
        // 查找父元素下的所有按钮
        const siblingButtons = parentElement.querySelectorAll('button');
        existingButtons.push(...siblingButtons);
      }
    }

    // 设置按钮样式（与配置对比按钮样式一致）
    const buttonStyles = {
      padding: '4px 8px',
      backgroundColor: '#17C3B2', // 青绿色背景
      color: 'white',
      border: '1px solid #17C3B2',
      borderRadius: '2px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: 'normal',
      height: '28px'
    };

    // 创建全屏切换按钮
    const toggleButton = document.createElement('button');
    toggleButton.id = 'nacos-toggle-button';
    toggleButton.textContent = '全屏';

    // 应用样式到全屏按钮
    Object.assign(toggleButton.style, buttonStyles);

    // 创建始终显示的工具条
    const fullscreenToolbar = document.createElement('div');
    fullscreenToolbar.id = 'nacos-fullscreen-toolbar';
    fullscreenToolbar.style.position = 'fixed';
    fullscreenToolbar.style.bottom = '20px';
    fullscreenToolbar.style.left = '50%';
    fullscreenToolbar.style.transform = 'translateX(-50%)';
    fullscreenToolbar.style.zIndex = '11';
    fullscreenToolbar.style.display = 'flex';
    fullscreenToolbar.style.alignItems = 'center';
    fullscreenToolbar.style.gap = '10px';
    fullscreenToolbar.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
    fullscreenToolbar.style.padding = '5px 10px';
    fullscreenToolbar.style.borderRadius = '4px';
    fullscreenToolbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';

    // 将全屏按钮添加到工具条中
    fullscreenToolbar.appendChild(toggleButton);

    // 将现有按钮添加到工具条中
    existingButtons.forEach(button => {
      // 复制按钮样式以匹配"配置对比"按钮
      button.style.padding = '4px 8px';
      button.style.fontSize = '12px';
      button.style.height = '28px';
      button.style.margin = '0';

      // 将按钮添加到工具条中
      fullscreenToolbar.appendChild(button);
    });

    // 将工具条添加到document中（始终显示）
    document.body.appendChild(fullscreenToolbar);

    // 保存原始样式
    let originalStyle = {
      position: container.style.position,
      width: container.style.width,
      height: container.style.height,
      top: container.style.top,
      left: container.style.left,
      zIndex: container.style.zIndex,
      transform: container.style.transform
    };

    // 标记是否处于全屏状态
    let isFullScreen = false;

    // 全屏按钮点击事件
    toggleButton.addEventListener('click', function () {
      if (!isFullScreen) {
        // 保存当前样式
        originalStyle = {
          position: container.style.position,
          width: container.style.width,
          height: container.style.height,
          top: container.style.top,
          left: container.style.left,
          zIndex: container.style.zIndex,
          transform: container.style.transform
        };

        // 设置全屏样式
        container.style.position = 'fixed';
        container.style.width = '100vw';
        container.style.height = '100vh';
        container.style.top = '0';
        container.style.left = '0';
        container.style.zIndex = '10';
        container.style.transform = 'none';

        // 更新全屏按钮文字和样式
        toggleButton.textContent = '还原';
        toggleButton.style.backgroundColor = '#E15554'; // 红色背景表示还原状态
        toggleButton.style.borderColor = '#E15554';
        isFullScreen = true;
      } else {
        // 恢复原始样式
        container.style.position = originalStyle.position;
        container.style.width = originalStyle.width;
        container.style.height = originalStyle.height;
        container.style.top = originalStyle.top;
        container.style.left = originalStyle.left;
        container.style.zIndex = originalStyle.zIndex;
        container.style.transform = originalStyle.transform;

        // 更新全屏按钮文字和样式
        toggleButton.textContent = '全屏';
        toggleButton.style.backgroundColor = '#17C3B2'; // 青绿色背景
        toggleButton.style.borderColor = '#17C3B2';
        isFullScreen = false;
      }
    });
  }

  // 使用多种方式确保能够检测到container元素
  // 页面加载完成后执行
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNacosHelper);
  } else {
    // DOM已经加载完成
    initNacosHelper();
  }

  // 为了确保动态加载的内容也能被检测到，定期检查container元素
  let checkInterval = setInterval(() => initNacosHelper(), 1000);
})();