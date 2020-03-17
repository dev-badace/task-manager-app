console.log('connected')

const alert = document.querySelector('.alert')


if(alert){
  setTimeout(()=>{
    alert.style.display = 'none'
    alert.innerText = ''
  },30000)
}