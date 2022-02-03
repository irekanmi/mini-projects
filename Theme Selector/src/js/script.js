

function initThemeselector(){
  const themeSelector = document.querySelector('#themeSelector');
  const themeSelectorLink = document.querySelector('#themeSelectorLink');
  const customTheme = localStorage.getItem('theme') || 'default'
  
  
  function activateTheme(theme){
    themeSelectorLink.setAttribute('href',`src/themes/${theme}.css`)
  }
  
  themeSelector.addEventListener('change',()=>{
    activateTheme(themeSelector.value)
    localStorage.setItem('theme',themeSelector.value)
  })
  
  themeSelector.value = customTheme
  activateTheme(customTheme)
}
  

initThemeselector()