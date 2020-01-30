const targetCounter = {}
const sourceCounter = {}

export default (blockKey, type) => {
  const counter = type === 'target' ? targetCounter : sourceCounter
  const count = counter[blockKey] || 0
  counter[blockKey] = count + 1
  return `target_${blockKey}_${count}`
}