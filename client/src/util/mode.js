export default {
  prodURL: '10.10.20.72',
  devURL: 'localhost:5000',
  dev: import.meta.env.DEV,
  prod: import.meta.env.PROD,
  currentMode: '',
  
  getMode () {
    if (this.dev) this.currentMode = this.devURL
    if (this.prod) this.currentMode = this.prodURL
    return this.currentMode
  }
}