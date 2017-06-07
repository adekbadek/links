const fs = require('fs')
const indentString = require('indent-string')
const R = require('ramda')
const inquirer = require('inquirer')
const YAML = require('yamljs')
const validUrl = require('valid-url')

const categories = YAML.load('./data/categories.yml')
const links = YAML.load('./data/links.yml')

const categoryIds = Object.keys(categories)
const categoryChoices = R.values(categories).map((o, i) => ({
  // inquirer needs 'value' key
  value: categoryIds[i], name: o.name
}))

const validateLink = link => {
  if (!validUrl.isUri(link)) {
    return 'valid URL please'
  }
  if (R.find(v => v.link === link, links)) {
    return 'this link is already there'
  }
  return true
}

inquirer.prompt([
  {
    type: 'input',
    name: 'link',
    message: 'link',
    validate: validateLink
  },
  {
    type: 'input',
    name: 'title',
    message: 'title',
    validate: str => !!str || 'provide a title'
  },
  {
    type: 'input',
    name: 'text',
    message: 'text',
    validate: str => !!str || 'provide a text'
  },
  {
    type: 'list',
    name: 'category',
    message: 'category',
    choices: categoryChoices
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'looks legit?'
  }
]).then(function (answers) {
  if (!answers.confirm) {
    console.log('¯\\_(ツ)_/¯')
    return
  }
  const link = R.dissoc('confirm', answers)
  const yamlString = `${indentString('-\n', 2)}${indentString(YAML.stringify(link, 4, 2), 4)}`
  fs.appendFile('./data/links.yml', yamlString, function (err) {
    if (err) throw err
    console.log('file saved 👏')
  })
})
