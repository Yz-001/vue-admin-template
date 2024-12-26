const viewGenerator = require('./src/assets/template/prompt.js')

module.exports = (plop) => {
  plop.setGenerator('index', viewGenerator)
  plop.setGenerator('list', {
     description: 'application list contioner',
     prompts: [
       {
         type: 'input',
         name: 'fileUrl',
         message: 'controller fileUrl please',
       },
       {
         type: 'input',
         name: 'fileName',
         message: 'controller fileName please',
       },
     ],
     actions: [
       {
         type: 'add',
         path: 'src/views/{{fileUrl}}/{{fileName}}.vue',
         templateFile: 'src/assets/template/list.hbs',
       },
     ],
   })
 }