import { execa } from 'execa'
import fs from 'fs'
import translate from './translate.js'
import htmlToHast from '../../../../lib/remark/htmlToHast.js'

export default async (props) => {

  const { entry } = props
  const { path,
    buildPaths,
    code,
    language } = entry

  const { stdout } = await execa`npx react-email@2.1.4 export --pretty --plainText --dir ${path} --outDir ${path}/.build/temp/email/${code}/text`;
  const { stdoutB } = await execa`npx react-email@2.1.4 export --pretty --dir ${path} --outDir ${path}/.build/temp/email/${code}/html`;

  await fs.promises.cp(
    `${path}/.build/temp/email/${code}/html/email.html`,
    buildPaths.email.body
  )

  let body = await fs.promises.readFile(buildPaths.email.body, 'utf8')
  body = translate({ text: body, strings: language.data })
  body = body
    .replaceAll('|%', '{{')
    .replaceAll('%|', '}}')
    .replaceAll(']]', '')
    .replaceAll('[[', '')

  await fs.promises.writeFile(
    buildPaths.email.body,
    body
  )

  await fs.promises.cp(
    `${path}/.build/temp/email/${code}/text/email.txt`,
    buildPaths.email.text
  )

  let text = await fs.promises.readFile(buildPaths.email.text, 'utf8')
  text = translate({ text: text, strings: language.data })
  text = text
    .replaceAll('|%', '{{')
    .replaceAll('%|', '}}')
    .replaceAll(']]', '')
    .replaceAll('[[', '')

  await fs.promises.writeFile(
    buildPaths.email.text,
    text
  )

  await fs.promises.cp(
    `${path}/email.subject.txt`,
    buildPaths.email.subject
  )

  let subject = await fs.promises.readFile(buildPaths.email.subject, 'utf8')
  subject = translate({ text: subject, strings: language.data })
  subject = subject
    .trim()
    .replaceAll('|%', '{{')
    .replaceAll('%|', '}}')
    .replaceAll(']]', '')
    .replaceAll('[[', '')

  await fs.promises.writeFile(
    buildPaths.email.subject,
    subject,
    'utf-8'
  )

  await fs.promises.cp(
    `${path}/manifest.json`,
    buildPaths.manifestFileNameBuilt
  )

  const child = htmlToHast({ data: body })
  const hast = await perform({
    child,
    path
  })

  return {
    entry: {
      ...entry,
      email: {
        text,
        body,
        subject,
        hast,
      }
    },
  }
}

const perform = async (props) => {
  const { child, path } = props
  return child
}
