import generateRandomKey from 'draft-js/lib/generateRandomKey'
import { ContentBlock } from 'draft-js'

export default () => {
  const blockKey = generateRandomKey()
  return new ContentBlock({
    key: blockKey,
    text: '',
    data: Map(),
    children: List(),
    type: 'unstyled',
  })
}