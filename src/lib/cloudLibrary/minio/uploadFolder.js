import { FsTree } from 'fs-tree-tool'
import upload from './upload'

export default async (props) => {
  const {
    path
    // contentType = 'image/png'
  } = props

  try {
    const tree = await FsTree.getDirectoryTree(path)

  } catch (e) {
    console.error(e)
  }
  return null
}


const uploadFolder = (props) => {
  const { path } = props

  return upload({
    ...props,
  })
}
