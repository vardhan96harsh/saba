window.addEventListener('DOMContentLoaded', function (e) {
  //content variables
  const parent = window.parent.parent;
  const header = parent.document.querySelector('sc-header');
  const navigation = parent.document.querySelector('sc-page-navigation');
  // const contentPaddings = parent.document.querySelector('main');

  //old variables
  const leftBar = window.parent.document.querySelector('.region-column1');
  const rightBar = window.parent.document.querySelector('.region-column2');
  const topBar = window.parent.document.querySelectorAll('.region-header')[1];
  const contentWrapper = window.parent.document.querySelector(
    '.region-main-content'
  );
  const pages = window.parent.document.querySelector('#pages');
  const contentPaddingsOld = window.parent.document.querySelector(
    '.spf-page-detail-container'
  );

  // old style
  if (leftBar) {
    leftBar.style.cssText = 'display: none;';
  }

  if (rightBar) {
    rightBar.style.cssText = 'position: relative; left: 0; width: 100%;';
  }

  if (topBar) {
    topBar.style.cssText = 'display: none';
  }

  if (pages) {
    pages.style.padding = '0';
  }

  if (contentWrapper) {
    contentWrapper.style.cssText = 'padding: 10px 0px !important';
  }

  if (contentPaddingsOld) {
    contentPaddingsOld.style.cssText = 'padding: 0px 0px 10px 0px!important';
  }

  //set style
  if (header) {
    header.style.cssText = 'display: none;';
  }

  if (navigation) {
    navigation.style.cssText = 'display: none';
  }

  // if (contentPaddings) {
  //   contentPaddings.style.paddingRight = '10px';
  //   contentPaddings.style.paddingLeft = '10px';
  // }

  let showHeader = false;
  window.addEventListener(
    'keydown',
    function (e) {
      if (e.ctrlKey && e.key === '.') {
        showHeader = !showHeader;

        if (header) {
          showHeader
            ? (header.style.display = 'block')
            : (header.style.display = 'none');
        }
        if (topBar) {
          showHeader
            ? (topBar.style.display = 'block')
            : (topBar.style.display = 'none');
        }
      }
    },
    false
  );
});
